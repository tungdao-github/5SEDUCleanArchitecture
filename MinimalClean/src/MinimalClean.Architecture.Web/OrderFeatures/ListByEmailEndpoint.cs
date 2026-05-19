using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using MinimalClean.Architecture.Web.Infrastructure.Data;

namespace MinimalClean.Architecture.Web.OrderFeatures;

public sealed class ListOrdersByEmailRequest
{
  [BindFrom("email")]
  public string Email { get; init; } = string.Empty;
}

public record OrderItemRecord(int ProductId, string Title, decimal Price, int Quantity);

public record OrderRecord(
  Guid Id,
  DateTimeOffset Date,
  string Status,
  decimal Total,
  IReadOnlyList<OrderItemRecord> Items,
  string PaymentMethod);

public class ListByEmailEndpoint(AppDbContext db) : Endpoint<ListOrdersByEmailRequest, IReadOnlyList<OrderRecord>>
{
  public override void Configure()
  {
    Get("/Orders");
    AllowAnonymous();
    Tags("Orders");

    Summary(s =>
    {
      s.Summary = "List orders by guest email";
      s.Description = "Returns orders for a guest user email.";
      s.Params["email"] = "Guest user email";
      s.Responses[200] = "Orders returned successfully";
    });
  }

  public override async Task HandleAsync(ListOrdersByEmailRequest request, CancellationToken ct)
  {
    if (string.IsNullOrWhiteSpace(request.Email))
    {
      await Send.OkAsync(Array.Empty<OrderRecord>(), ct);
      return;
    }

    var guestUser = await db.GuestUsers
      .AsNoTracking()
      .FirstOrDefaultAsync(user => user.Email == request.Email, ct);

    if (guestUser is null)
    {
      await Send.OkAsync(Array.Empty<OrderRecord>(), ct);
      return;
    }

    var productLookup = await db.Products
      .AsNoTracking()
      .ToDictionaryAsync(product => product.Id.Value, product => product.Name, ct);

    var orders = await db.Orders
      .Include(order => order.Items)
      .AsNoTracking()
      .Where(order => order.GuestUserId == guestUser.Id.Value)
      .OrderByDescending(order => order.CreatedOn)
      .ToListAsync(ct);

    var response = orders
      .Select(order => new OrderRecord(
        order.Id.Value,
        order.CreatedOn,
        order.DatePaid.HasValue ? "delivered" : "processing",
        order.Total,
        order.Items
          .Select(item => new OrderItemRecord(
            item.ProductId.Value,
            productLookup.GetValueOrDefault(item.ProductId.Value, $"Product {item.ProductId.Value}"),
            item.UnitPrice.Value,
            item.Quantity.Value))
          .ToList(),
        string.IsNullOrWhiteSpace(order.PaymentReference) ? "COD" : order.PaymentReference))
      .ToList();

    await Send.OkAsync(response, ct);
  }
}
