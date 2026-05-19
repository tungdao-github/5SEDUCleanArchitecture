using Ardalis.GuardClauses;

namespace MinimalClean.Architecture.Web.Domain.CategoryAggregate;

public record CategoryId(int Value) : IComparable<CategoryId>
{
  public static readonly CategoryId New = new(0);

  public int CompareTo(CategoryId? other) => Value.CompareTo(other?.Value ?? 0);

  public static CategoryId From(int id)
  {
    Guard.Against.InvalidInput(id, nameof(id), id => id > 0, "CategoryId must be greater than 0");
    return new CategoryId(id);
  }

  public override string ToString() => Value.ToString();
}
