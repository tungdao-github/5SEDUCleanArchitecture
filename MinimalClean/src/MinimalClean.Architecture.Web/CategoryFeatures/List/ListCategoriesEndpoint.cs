using FastEndpoints;
using FluentValidation;
using MinimalClean.Architecture.Web.CategoryFeatures;

namespace MinimalClean.Architecture.Web.CategoryFeatures.List;

public record CategoryRecord(int Id, string Name, string Slug, string Icon);

public record CategoryListResponse(IReadOnlyList<CategoryRecord> Items);

public class ListCategoriesEndpoint : Endpoint<EmptyRequest, CategoryListResponse>
{
  public override void Configure()
  {
    Get("/Categories");
    AllowAnonymous();

    Summary(s =>
    {
      s.Summary = "List all categories";
      s.Description = "Retrieves all available categories.";
      s.Responses[200] = "List of categories returned successfully";
    });

    Tags("Categories");

    Description(builder => builder
      .Produces<CategoryListResponse>(200, "application/json"));
  }

  public override async Task HandleAsync(EmptyRequest _, CancellationToken cancellationToken)
  {
    var categories = new List<CategoryRecord>
    {
      new(1, "Lập Trình", "lap-trinh", "💻"),
      new(2, "Thiết Kế", "thiet-ke", "🎨"),
      new(3, "Kinh Doanh", "kinh-doanh", "💼"),
      new(4, "Marketing", "marketing", "📊"),
      new(5, "Phát Triển Cá Nhân", "phat-trien-ca-nhan", "🚀")
    };

    await SendOkAsync(new CategoryListResponse(categories), cancellationToken);
  }
}
