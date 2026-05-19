using Ardalis.GuardClauses;

namespace MinimalClean.Architecture.Web.Domain.CategoryAggregate;

public class Category : EntityBase<Category, CategoryId>, IAggregateRoot
{
  private Category() { }

  public Category(CategoryId id, string name, string slug, string icon)
  {
    Guard.Against.InvalidInput(id, nameof(id), (id) => id != CategoryId.New,
      "Use Category.Create() to create new categories instead of passing CategoryId.New to the constructor.");
    Id = id;
    Name = name;
    Slug = slug;
    Icon = icon;
  }

  public string Name { get; private set; } = string.Empty;
  public string Slug { get; private set; } = string.Empty;
  public string Icon { get; private set; } = string.Empty;

  public static Category Create(string name, string slug, string icon)
  {
    return new Category(CategoryId.New, name, slug, icon) { };
  }

  public void Update(string name, string slug, string icon)
  {
    Name = name;
    Slug = slug;
    Icon = icon;
  }
}
