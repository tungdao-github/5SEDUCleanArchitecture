# Gắn API cho frontend `src (4)`

## Hiện trạng

- Backend chính: `src/Clean.Architecture.Web`
  - Chạy ở `https://localhost:57679`
  - API hiện có: `/Contributors`
- Backend gần với frontend khóa học hơn: `MinimalClean/src/MinimalClean.Architecture.Web`
  - Chạy ở `https://localhost:57379`
  - API hiện có: `/Products`, `/Products/{id}`, `/cart`, `/cart/{id}`, `/checkout`
- Frontend: `src (4)`
  - Là React/TSX UI, đang đọc dữ liệu từ `app/data/mockData.ts`
  - Chưa có `package.json`, nên thư mục này hiện giống source export hơn là một app Vite hoàn chỉnh

## Cách nối không đập đi xây lại

1. Giữ nguyên UI trong `src (4)/app/pages` và `src (4)/app/components`.
2. Thêm lớp adapter API trong `src (4)/app/services`.
3. Trang nào cần dữ liệu thật thì thay import từ `mockData.ts` bằng service tương ứng từng phần.
4. Backend chỉ mở CORS cho port frontend local, không đổi endpoint, không đổi Clean Architecture layers.

## Cấu hình API base URL

Tạo file `.env` trong `src (4)` theo mẫu:

```env
VITE_API_BASE_URL=https://localhost:57379
```

Nếu dùng backend chính `Clean.Architecture.Web`, đổi thành:

```env
VITE_API_BASE_URL=https://localhost:57679
```

## Chạy local

Backend phù hợp với màn khóa học hiện tại:

```powershell
dotnet run --project MinimalClean\src\MinimalClean.Architecture.Web\MinimalClean.Architecture.Web.csproj --launch-profile https
```

Frontend:

```powershell
cd "src (4)"
npm install
npm run dev
```

Mở `http://localhost:5173`.

## API đã gắn thử

Trang `src (4)/app/pages/CoursesPage.tsx` đã thử gọi:

```http
GET https://localhost:57379/Products?page=1&per_page=50
```

Vì backend `Products` hiện chỉ trả `id`, `name`, `unitPrice`, frontend dùng `productToCourse()` để map sang model `Course` và giữ mock data làm fallback cho các field chưa có như ảnh, instructor, rating, category.

## Lộ trình nên làm tiếp

1. Hoàn thiện backend domain `Course`, `Category`, `Order`, `User` trong các layer hiện có.
2. Tạo endpoint theo từng màn hình: `/Courses`, `/Courses/{slug}`, `/Categories`, `/Orders`, `/Auth/login`.
3. Mỗi endpoint có DTO riêng ở Web layer, handler/use case riêng ở UseCases layer, entity ở Core layer.
4. Frontend thay dần từng page từ mock sang service API. Không xóa `mockData.ts` ngay; giữ làm fallback/dev seed đến khi API đủ field.
