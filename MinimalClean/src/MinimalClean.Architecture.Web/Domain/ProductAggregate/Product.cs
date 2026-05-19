using Ardalis.GuardClauses;

namespace MinimalClean.Architecture.Web.Domain.ProductAggregate;

public class Product : EntityBase<Product, ProductId>, IAggregateRoot
{
  // Private constructor for EF Core
  private Product() { }

  // Private constructor for new (unpersisted) products
  private Product(string name, decimal unitPrice)
  {
    Name = name;
    UnitPrice = unitPrice;
    Slug = ToSlug(name);
    Category = "General";
    CategorySlug = "general";
  }

  // Constructor for reconstituting persisted products with a known ID
  public Product(ProductId id, string name, decimal unitPrice)
  {
    Guard.Against.InvalidInput(id, nameof(id), (id) => id != ProductId.New,
      "Use Product.Create() to create new products instead of passing ProductId.New to the constructor.");
    Id = id;
    Name = name;
    UnitPrice = unitPrice;
    Slug = ToSlug(name);
    Category = "General";
    CategorySlug = "general";
  }

  public Product(
    ProductId id,
    string name,
    string slug,
    string instructor,
    string category,
    string categorySlug,
    decimal unitPrice,
    decimal originalPrice,
    decimal rating,
    int ratingCount,
    int students,
    string duration,
    int lessons,
    string level,
    string language,
    string thumbnail,
    string description,
    bool isBestseller = false,
    bool isNew = false,
    bool isFlashSale = false)
  {
    Guard.Against.InvalidInput(id, nameof(id), (id) => id != ProductId.New,
      "Use Product.Create() to create new products instead of passing ProductId.New to the constructor.");
    Id = id;
    Name = name;
    Slug = slug;
    Instructor = instructor;
    Category = category;
    CategorySlug = categorySlug;
    UnitPrice = unitPrice;
    OriginalPrice = originalPrice;
    Rating = rating;
    RatingCount = ratingCount;
    Students = students;
    Duration = duration;
    Lessons = lessons;
    Level = level;
    Language = language;
    Thumbnail = thumbnail;
    Description = description;
    IsBestseller = isBestseller;
    IsNew = isNew;
    IsFlashSale = isFlashSale;
  }

  // Factory method for creating new products (before persistence)
  public static Product Create(string name, decimal unitPrice) => new Product(name, unitPrice);

  public string Name { get; private set; } = string.Empty;
  public string Slug { get; private set; } = string.Empty;
  public string Instructor { get; private set; } = string.Empty;
  public string Category { get; private set; } = string.Empty;
  public string CategorySlug { get; private set; } = string.Empty;
  public decimal UnitPrice { get; private set; }
  public decimal OriginalPrice { get; private set; }
  public decimal Rating { get; private set; }
  public int RatingCount { get; private set; }
  public int Students { get; private set; }
  public string Duration { get; private set; } = string.Empty;
  public int Lessons { get; private set; }
  public string Level { get; private set; } = string.Empty;
  public string Language { get; private set; } = string.Empty;
  public string Thumbnail { get; private set; } = string.Empty;
  public string Description { get; private set; } = string.Empty;
  public bool IsBestseller { get; private set; }
  public bool IsNew { get; private set; }
  public bool IsFlashSale { get; private set; }

  public Product UpdateName(string newName)
  {
    Name = newName;
    Slug = ToSlug(newName);
    return this;
  }

  public Product UpdatePrice(decimal newPrice)
  {
    UnitPrice = newPrice;
    return this;
  }

  public Product UpdateCourseDetails(
    string instructor,
    string category,
    string categorySlug,
    decimal originalPrice,
    decimal rating,
    int ratingCount,
    int students,
    string duration,
    int lessons,
    string level,
    string language,
    string thumbnail,
    string description,
    bool isBestseller,
    bool isNew,
    bool isFlashSale)
  {
    Instructor = instructor;
    Category = category;
    CategorySlug = categorySlug;
    OriginalPrice = originalPrice;
    Rating = rating;
    RatingCount = ratingCount;
    Students = students;
    Duration = duration;
    Lessons = lessons;
    Level = level;
    Language = language;
    Thumbnail = thumbnail;
    Description = description;
    IsBestseller = isBestseller;
    IsNew = isNew;
    IsFlashSale = isFlashSale;
    return this;
  }

  private static string ToSlug(string value)
  {
    var chars = value.ToLowerInvariant()
      .Select(c => char.IsLetterOrDigit(c) ? c : '-')
      .ToArray();

    return string.Join('-', new string(chars).Split('-', StringSplitOptions.RemoveEmptyEntries));
  }
}
