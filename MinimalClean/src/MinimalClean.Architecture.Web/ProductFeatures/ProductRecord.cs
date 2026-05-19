namespace MinimalClean.Architecture.Web.ProductFeatures;

public record ProductRecord(
  int Id,
  string Name,
  string Slug,
  string Instructor,
  string Category,
  string CategorySlug,
  decimal UnitPrice,
  decimal OriginalPrice,
  decimal Rating,
  int RatingCount,
  int Students,
  string Duration,
  int Lessons,
  string Level,
  string Language,
  string Thumbnail,
  string Description,
  bool IsBestseller,
  bool IsNew,
  bool IsFlashSale);
