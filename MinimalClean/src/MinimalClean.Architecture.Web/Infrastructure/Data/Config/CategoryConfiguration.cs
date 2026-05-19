using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MinimalClean.Architecture.Web.Domain.CategoryAggregate;

namespace MinimalClean.Architecture.Web.Infrastructure.Data.Config;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
  public void Configure(EntityTypeBuilder<Category> builder)
  {
    builder.Property(entity => entity.Id)
      .HasValueGenerator<VogenIntIdValueGenerator<AppDbContext, Category, CategoryId>>()
      .HasVogenConversion()
      .IsRequired();

    builder.Property(entity => entity.Name)
      .HasMaxLength(100)
      .IsRequired();

    builder.Property(entity => entity.Slug)
      .HasMaxLength(100)
      .IsRequired();

    builder.HasIndex(entity => entity.Slug)
      .IsUnique();

    builder.Property(entity => entity.Icon)
      .HasMaxLength(50)
      .IsRequired();

    builder.HasData(
      new Category(CategoryId.From(1), "Lập Trình", "lap-trinh", "💻"),
      new Category(CategoryId.From(2), "Thiết Kế", "thiet-ke", "🎨"),
      new Category(CategoryId.From(3), "Kinh Doanh", "kinh-doanh", "💼"),
      new Category(CategoryId.From(4), "Marketing", "marketing", "📊"),
      new Category(CategoryId.From(5), "Phát Triển Cá Nhân", "phat-trien-ca-nhan", "🚀")
    );
  }
}
