using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MinimalClean.Architecture.Web.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ExpandProductsForCourses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Products",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Products",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CategorySlug",
                table: "Products",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Products",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "Products",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Instructor",
                table: "Products",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsBestseller",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFlashSale",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsNew",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Products",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Lessons",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Level",
                table: "Products",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "OriginalPrice",
                table: "Products",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                table: "Products",
                type: "decimal(3,2)",
                precision: 3,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "RatingCount",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Products",
                type: "nvarchar(220)",
                maxLength: 220,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Students",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "Products",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Category", "CategorySlug", "Description", "Duration", "Instructor", "IsBestseller", "IsFlashSale", "IsNew", "Language", "Lessons", "Level", "Name", "OriginalPrice", "Rating", "RatingCount", "Slug", "Students", "Thumbnail", "UnitPrice" },
                values: new object[] { "Lập Trình", "lap-trinh", "Khóa học React và TypeScript toàn diện, từ cơ bản đến nâng cao.", "42 giờ", "Nguyễn Văn An", true, false, false, "Tiếng Việt", 186, "Trung cấp", "React & TypeScript - Xây Dựng Ứng Dụng Thực Tế", 1299000m, 4.8m, 2341, "react-typescript-thuc-te", 15420, "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop", 499000m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Category", "CategorySlug", "Description", "Duration", "Instructor", "IsBestseller", "IsFlashSale", "IsNew", "Language", "Lessons", "Level", "Name", "OriginalPrice", "Rating", "RatingCount", "Slug", "Students", "Thumbnail", "UnitPrice" },
                values: new object[] { "Lập Trình", "lap-trinh", "Học Python chuyên sâu về Data Science và Machine Learning.", "60 giờ", "Trần Thị Bình", true, true, false, "Tiếng Việt", 240, "Từ cơ bản", "Python for Data Science & Machine Learning", 1599000m, 4.9m, 4521, "python-data-science-ml", 28760, "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop", 599000m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Category", "CategorySlug", "Description", "Duration", "Instructor", "IsBestseller", "IsFlashSale", "IsNew", "Language", "Lessons", "Level", "Name", "OriginalPrice", "Rating", "RatingCount", "Slug", "Students", "Thumbnail", "UnitPrice" },
                values: new object[] { "Thiết Kế", "thiet-ke", "Thiết kế giao diện người dùng chuyên nghiệp với Figma.", "35 giờ", "Lê Hoàng Nam", false, false, true, "Tiếng Việt", 145, "Từ cơ bản", "UI/UX Design với Figma - Từ Cơ Bản Đến Chuyên Nghiệp", 999000m, 4.7m, 1876, "uiux-figma-co-ban", 9845, "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop", 399000m });

            migrationBuilder.CreateIndex(
                name: "IX_Products_Slug",
                table: "Products",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_Slug",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CategorySlug",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Instructor",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsBestseller",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsFlashSale",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsNew",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Lessons",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OriginalPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "RatingCount",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Students",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "Products");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Products",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Name", "UnitPrice" },
                values: new object[] { "Coffee Mug", 9.99m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Name", "UnitPrice" },
                values: new object[] { "T-Shirt", 19.99m });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Name", "UnitPrice" },
                values: new object[] { "Sticker Pack", 3.99m });
        }
    }
}
