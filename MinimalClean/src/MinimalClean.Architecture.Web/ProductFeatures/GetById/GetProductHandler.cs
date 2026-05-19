using MinimalClean.Architecture.Web.Domain.ProductAggregate;
using MinimalClean.Architecture.Web.Domain.ProductAggregate.Specifications;

namespace MinimalClean.Architecture.Web.ProductFeatures.GetById;

public record GetProductQuery(ProductId ProductId) : IQuery<Result<ProductDto>>;

public class GetProductHandler(IReadRepository<Product> _repository)
  : IQueryHandler<GetProductQuery, Result<ProductDto>>
{
  public async ValueTask<Result<ProductDto>> Handle(GetProductQuery request, CancellationToken cancellationToken)
  {
    var spec = new ProductByIdSpec(request.ProductId);
    var entity = await _repository.FirstOrDefaultAsync(spec, cancellationToken);
    if (entity == null) return Result.NotFound();

    return new ProductDto(
      entity.Id,
      entity.Name,
      entity.Slug,
      entity.Instructor,
      entity.Category,
      entity.CategorySlug,
      entity.UnitPrice,
      entity.OriginalPrice,
      entity.Rating,
      entity.RatingCount,
      entity.Students,
      entity.Duration,
      entity.Lessons,
      entity.Level,
      entity.Language,
      entity.Thumbnail,
      entity.Description,
      entity.IsBestseller,
      entity.IsNew,
      entity.IsFlashSale);
  }
}
