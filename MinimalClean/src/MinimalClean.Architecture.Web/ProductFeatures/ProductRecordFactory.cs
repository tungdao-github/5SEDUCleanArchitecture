namespace MinimalClean.Architecture.Web.ProductFeatures;

public static class ProductRecordFactory
{
  public static ProductRecord FromDto(ProductDto product) =>
    new(
      product.Id.Value,
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
      product.IsFlashSale);
}
