using Microsoft.EntityFrameworkCore;
using MinimalClean.Architecture.Web.Domain.ProductAggregate;
using Microsoft.Extensions.Logging;

namespace MinimalClean.Architecture.Web.Infrastructure.Data;

public static class SeedData
{
  public const int NUMBER_OF_PRODUCTS = 10;

  public static async Task InitializeAsync(AppDbContext dbContext, ILogger logger)
  {
    if (await dbContext.Products.AnyAsync())
    {
      logger.LogInformation("DB has data - seeding not required.");
      return; // DB has been seeded
    }
    await PopulateTestDataAsync(dbContext, logger);
  }

  public static async Task PopulateTestDataAsync(AppDbContext dbContext, ILogger logger)
  {
    logger.LogInformation("Seeding database with sample data.");

    var products = new[]
    {
      new Product(ProductId.From(1), "React & TypeScript - Xây Dựng Ứng Dụng Thực Tế", "react-typescript-thuc-te", "Nguyễn Văn An", "Lập Trình", "lap-trinh", 499000m, 1299000m, 4.8m, 2341, 15420, "42 giờ", 186, "Trung cấp", "Tiếng Việt", "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop", "Khóa học React và TypeScript toàn diện, từ cơ bản đến nâng cao.", true),
      new Product(ProductId.From(2), "Python for Data Science & Machine Learning", "python-data-science-ml", "Trần Thị Bình", "Lập Trình", "lap-trinh", 599000m, 1599000m, 4.9m, 4521, 28760, "60 giờ", 240, "Từ cơ bản", "Tiếng Việt", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop", "Học Python chuyên sâu về Data Science và Machine Learning.", true, false, true),
      new Product(ProductId.From(3), "UI/UX Design với Figma - Từ Cơ Bản Đến Chuyên Nghiệp", "uiux-figma-co-ban", "Lê Hoàng Nam", "Thiết Kế", "thiet-ke", 399000m, 999000m, 4.7m, 1876, 9845, "35 giờ", 145, "Từ cơ bản", "Tiếng Việt", "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop", "Thiết kế giao diện người dùng chuyên nghiệp với Figma.", false, true),
      new Product(ProductId.From(4), "Digital Marketing - Chiến Lược Marketing Online", "digital-marketing-chien-luoc", "Phạm Thị Lan", "Marketing", "marketing", 449000m, 1199000m, 4.6m, 3210, 18920, "38 giờ", 162, "Từ cơ bản", "Tiếng Việt", "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=225&fit=crop", "Chiến lược marketing online toàn diện cho doanh nghiệp.", true, false, true),
      new Product(ProductId.From(5), "Node.js & Express - Backend Development", "nodejs-express-backend", "Hoàng Minh Tuấn", "Lập Trình", "lap-trinh", 549000m, 1399000m, 4.8m, 2987, 12450, "48 giờ", 198, "Trung cấp", "Tiếng Việt", "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop", "Xây dựng backend với Node.js, REST API và database."),
      new Product(ProductId.From(6), "Tiếng Anh Giao Tiếp - Từ Sơ Cấp Đến Nâng Cao", "tieng-anh-giao-tiep", "Jennifer Smith", "Ngoại Ngữ", "ngoai-ngu", 299000m, 799000m, 4.7m, 5432, 45670, "50 giờ", 220, "Từ cơ bản", "Song ngữ", "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=225&fit=crop", "Học tiếng Anh giao tiếp với lộ trình thực tế.", true),
      new Product(ProductId.From(7), "Adobe Photoshop - Chỉnh Sửa Ảnh Chuyên Nghiệp", "photoshop-chinh-sua-anh", "Đinh Thị Mai", "Thiết Kế", "thiet-ke", 349000m, 899000m, 4.6m, 1543, 8920, "30 giờ", 128, "Từ cơ bản", "Tiếng Việt", "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=225&fit=crop", "Thành thạo Adobe Photoshop từ cơ bản đến nâng cao.", false, true),
      new Product(ProductId.From(8), "Kinh Doanh Online - Xây Dựng Thương Hiệu Cá Nhân", "kinh-doanh-online-thuong-hieu", "Nguyễn Quang Hải", "Kinh Doanh", "kinh-doanh", 499000m, 1299000m, 4.5m, 2876, 21340, "45 giờ", 185, "Từ cơ bản", "Tiếng Việt", "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=225&fit=crop", "Kinh doanh online và xây dựng thương hiệu cá nhân.", false, false, true),
      new Product(ProductId.From(9), "Flutter - Phát Triển Ứng Dụng Mobile", "flutter-mobile-app", "Vũ Thành Long", "Lập Trình", "lap-trinh", 649000m, 1699000m, 4.8m, 1654, 7820, "55 giờ", 210, "Trung cấp", "Tiếng Việt", "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop", "Phát triển ứng dụng mobile cross-platform với Flutter.", false, true),
      new Product(ProductId.From(10), "Excel Nâng Cao - Phân Tích Dữ Liệu", "excel-nang-cao-phan-tich", "Trần Văn Đức", "Kinh Doanh", "kinh-doanh", 249000m, 699000m, 4.7m, 4321, 32450, "25 giờ", 105, "Trung cấp", "Tiếng Việt", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop", "Kỹ năng Excel nâng cao và phân tích dữ liệu.", true)
    };

    dbContext.Products.AddRange(products);
    await dbContext.SaveChangesAsync();
  }
}
