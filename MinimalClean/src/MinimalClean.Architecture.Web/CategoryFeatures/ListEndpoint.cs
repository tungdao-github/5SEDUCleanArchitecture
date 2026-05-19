using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using MinimalClean.Architecture.Web.Infrastructure.Data;

namespace MinimalClean.Architecture.Web.CategoryFeatures;

public record CategoryRecord(int Id, string Name, string Slug, int Count, string Color);

public class ListEndpoint(AppDbContext db) : EndpointWithoutRequest<IReadOnlyList<CategoryRecord>>
{
  public override void Configure()
  {
    Get("/Categories");
    AllowAnonymous();
    Tags("Categories");

    Summary(s =>
    {
      s.Summary = "List course categories";
      s.Description = "Returns categories derived from products/courses.";
      s.Responses[200] = "Categories returned successfully";
    });
  }

  public override async Task HandleAsync(CancellationToken ct)
  {
    var colors = new[] { "#1890ff", "#722ed1", "#13c2c2", "#fa8c16", "#52c41a", "#eb2f96" };

    var grouped = await db.Products
      .AsNoTracking()
      .GroupBy(p => new { p.Category, p.CategorySlug })
      .Select(g => new { g.Key.Category, g.Key.CategorySlug, Count = g.Count() })
      .OrderBy(g => g.Category)
      .ToListAsync(ct);

    var categories = grouped
      .Select((g, index) => new CategoryRecord(index + 1, g.Category, g.CategorySlug, g.Count, colors[index % colors.Length]))
      .ToList();

    await Send.OkAsync(categories, ct);
  }
}
