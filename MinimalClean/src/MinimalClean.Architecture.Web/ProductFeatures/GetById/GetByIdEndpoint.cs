using FastEndpoints;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using MinimalClean.Architecture.Web.Domain.ProductAggregate;
using MinimalClean.Architecture.Web.Extensions;

namespace MinimalClean.Architecture.Web.ProductFeatures.GetById;

public sealed class GetProductByIdRequest
{
  public const string Route = "/Products/{ProductId}";
  public int ProductId { get; init; }
}

public class GetByIdEndpoint(IMediator mediator)
  : Endpoint<GetProductByIdRequest,
             Results<Ok<ProductRecord>,
                     NotFound,
                     ProblemHttpResult>,
             GetProductByIdMapper>
{
  public override void Configure()
  {
    Get(GetProductByIdRequest.Route);
    AllowAnonymous();

    Summary(s =>
    {
      s.Summary = "Get a product by ID";
      s.Description = "Retrieves a specific product by its unique identifier. Returns detailed product information including ID, name, and unit price.";
      s.ExampleRequest = new GetProductByIdRequest { ProductId = 1 };
      s.ResponseExamples[200] = ProductRecordFactory.FromDto(new ProductDto(
        ProductId.From(1),
        "React & TypeScript",
        "react-typescript",
        "EduClean",
        "Programming",
        "programming",
        499000m,
        1299000m,
        4.8m,
        120,
        2400,
        "40 giờ",
        120,
        "Trung cấp",
        "Tiếng Việt",
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
        "Sample course",
        true,
        false,
        false));

      // Document possible responses
      s.Responses[200] = "Product found and returned successfully";
      s.Responses[404] = "Product with specified ID not found";
    });

    // Add tags for API grouping
    Tags("Products");

    // Add additional metadata
    Description(builder => builder
      .Accepts<GetProductByIdRequest>()
      .Produces<ProductRecord>(200, "application/json")
      .ProducesProblem(404));
  }

  public override async Task<Results<Ok<ProductRecord>, NotFound, ProblemHttpResult>>
    ExecuteAsync(GetProductByIdRequest request, CancellationToken ct)
  {
    var result = await mediator.Send(new GetProductQuery(ProductId.From(request.ProductId)), ct);

    return result.ToGetByIdResult(Map.FromEntity);
  }
}

public sealed class GetProductByIdValidator : Validator<GetProductByIdRequest>
{
  public GetProductByIdValidator()
  {
    RuleFor(x => x.ProductId)
      .GreaterThan(0)
      .WithMessage("Product ID must be greater than 0");
  }
}


public sealed class GetProductByIdMapper
  : Mapper<GetProductByIdRequest, ProductRecord, ProductDto>
{
  public override ProductRecord FromEntity(ProductDto e)
    => ProductRecordFactory.FromDto(e);
}
