using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using MinimalClean.Architecture.Web.Domain.ProductAggregate;
using MinimalClean.Architecture.Web.ProductFeatures;

namespace MinimalClean.Architecture.Web.ProductFeatures.Create;

public sealed class CreateProductRequest
{ 
  public string Name { get; init; } = string.Empty;
  public decimal UnitPrice { get; init; }
}

public class CreateEndpoint(IRepository<Product> repository) : 
  Endpoint<CreateProductRequest, 
           Results<Created<ProductRecord>, ValidationProblem, ProblemHttpResult>>
{
  private readonly IRepository<Product> _repository = repository;

  public override void Configure()
  {
    Post("/Products");
    AllowAnonymous();

    Summary(s =>
    {
      s.Summary = "Create a new product";
      s.Description = "Creates a new product with the specified name and unit price.";
      s.ExampleRequest = new CreateProductRequest { Name = "Sample Product", UnitPrice = 19.99m };
      s.ResponseExamples[201] = ProductRecordFactory.FromDto(new ProductDto(
        ProductId.From(1),
        "Sample Product",
        "sample-product",
        "EduClean",
        "General",
        "general",
        19.99m,
        19.99m,
        0m,
        0,
        0,
        string.Empty,
        0,
        string.Empty,
        string.Empty,
        string.Empty,
        string.Empty,
        false,
        false,
        false));

      s.Responses[201] = "Product created successfully";
      s.Responses[400] = "Invalid request data";
    });

    Tags("Products");

    Description(builder => builder
      .Accepts<CreateProductRequest>()
      .Produces<ProductRecord>(201, "application/json")
      .ProducesProblem(400));
  }

  public override async Task<Results<Created<ProductRecord>, ValidationProblem, ProblemHttpResult>> 
    ExecuteAsync(CreateProductRequest request, CancellationToken cancellationToken)
  {
    var product = Product.Create(request.Name, request.UnitPrice);

    await _repository.AddAsync(product, cancellationToken);
    await _repository.SaveChangesAsync(cancellationToken);

    var response = ProductRecordFactory.FromDto(new ProductDto(
      product.Id,
      product.Name,
      product.Slug,
      product.Instructor,
      product.Category,
      product.CategorySlug,
      product.UnitPrice,
      product.OriginalPrice,
      product.Rating,
      product.RatingCount,
      product.Students,
      product.Duration,
      product.Lessons,
      product.Level,
      product.Language,
      product.Thumbnail,
      product.Description,
      product.IsBestseller,
      product.IsNew,
      product.IsFlashSale));
    return TypedResults.Created($"/Products/{product.Id.Value}", response);
  }
}

public sealed class CreateProductValidator : Validator<CreateProductRequest>
{
  public CreateProductValidator()
  {
    RuleFor(x => x.Name)
      .NotEmpty()
      .WithMessage("Product name is required")
      .MaximumLength(200)
      .WithMessage("Product name must not exceed 200 characters");

    RuleFor(x => x.UnitPrice)
      .GreaterThan(0)
      .WithMessage("Unit price must be greater than zero");
  }
}
