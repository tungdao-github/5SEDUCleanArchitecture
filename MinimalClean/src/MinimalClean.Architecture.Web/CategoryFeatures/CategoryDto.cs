using MinimalClean.Architecture.Web.Domain.CategoryAggregate;

namespace MinimalClean.Architecture.Web.CategoryFeatures;

public record CategoryDto(
  CategoryId Id,
  string Name,
  string Slug,
  string Icon);
