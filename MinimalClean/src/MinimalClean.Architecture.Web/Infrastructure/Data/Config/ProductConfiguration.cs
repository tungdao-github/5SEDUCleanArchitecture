using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MinimalClean.Architecture.Web.Domain.ProductAggregate;

namespace MinimalClean.Architecture.Web.Infrastructure.Data.Config;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
  public void Configure(EntityTypeBuilder<Product> builder)
  {
    builder.Property(entity => entity.Id)
      .HasValueGenerator<VogenIntIdValueGenerator<AppDbContext, Product, ProductId>>()
      .HasVogenConversion()
      .IsRequired();

    builder.Property(entity => entity.Name)
      .HasMaxLength(200)
      .IsRequired();

    builder.Property(entity => entity.Slug)
      .HasMaxLength(220)
      .IsRequired();

    builder.HasIndex(entity => entity.Slug)
      .IsUnique();

    builder.Property(entity => entity.Instructor)
      .HasMaxLength(120)
      .IsRequired();

    builder.Property(entity => entity.Category)
      .HasMaxLength(100)
      .IsRequired();

    builder.Property(entity => entity.CategorySlug)
      .HasMaxLength(120)
      .IsRequired();

    builder.Property(entity => entity.UnitPrice)
      .HasPrecision(18, 2)
      .IsRequired();

    builder.Property(entity => entity.OriginalPrice)
      .HasPrecision(18, 2)
      .IsRequired();

    builder.Property(entity => entity.Rating)
      .HasPrecision(3, 2)
      .IsRequired();

    builder.Property(entity => entity.Duration)
      .HasMaxLength(50)
      .IsRequired();

    builder.Property(entity => entity.Level)
      .HasMaxLength(50)
      .IsRequired();

    builder.Property(entity => entity.Language)
      .HasMaxLength(50)
      .IsRequired();

    builder.Property(entity => entity.Thumbnail)
      .HasMaxLength(500)
      .IsRequired();

    builder.Property(entity => entity.Description)
      .HasMaxLength(2000)
      .IsRequired();

    builder.HasData(
      new Product(
        ProductId.From(1),
        "React & TypeScript - Xây Dựng Ứng Dụng Thực Tế",
        "react-typescript-thuc-te",
        "Nguyễn Văn An",
        "Lập Trình",
        "lap-trinh",
        499000m,
        1299000m,
        4.8m,
        2341,
        15420,
        "42 giờ",
        186,
        "Trung cấp",
        "Tiếng Việt",
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
        "Khóa học React và TypeScript toàn diện, từ cơ bản đến nâng cao.",
        true),
      new Product(
        ProductId.From(2),
        "Python for Data Science & Machine Learning",
        "python-data-science-ml",
        "Trần Thị Bình",
        "Lập Trình",
        "lap-trinh",
        599000m,
        1599000m,
        4.9m,
        4521,
        28760,
        "60 giờ",
        240,
        "Từ cơ bản",
        "Tiếng Việt",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
        "Học Python chuyên sâu về Data Science và Machine Learning.",
        true,
        false,
        true),
      new Product(
        ProductId.From(3),
        "UI/UX Design với Figma - Từ Cơ Bản Đến Chuyên Nghiệp",
        "uiux-figma-co-ban",
        "Lê Hoàng Nam",
        "Thiết Kế",
        "thiet-ke",
        399000m,
        999000m,
        4.7m,
        1876,
        9845,
        "35 giờ",
        145,
        "Từ cơ bản",
        "Tiếng Việt",
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
        "Thiết kế giao diện người dùng chuyên nghiệp với Figma.",
        false,
        true)
    );
  }
}
