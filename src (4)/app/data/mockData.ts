export interface Course {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  ratingCount: number;
  students: number;
  duration: string;
  lessons: number;
  level: string;
  language: string;
  thumbnail: string;
  tags: string[];
  description: string;
  bestseller?: boolean;
  isNew?: boolean;
  isFlashSale?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  tags: string[];
  views: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  total: number;
  items: { courseId: number; title: string; price: number }[];
  paymentMethod: string;
}

export interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  courseId: number;
}

export const categories = [
  { id: 1, name: 'Lập Trình', slug: 'lap-trinh', icon: '💻', count: 245, color: '#1890ff' },
  { id: 2, name: 'Thiết Kế', slug: 'thiet-ke', icon: '🎨', count: 132, color: '#722ed1' },
  { id: 3, name: 'Marketing', slug: 'marketing', icon: '📈', count: 98, color: '#13c2c2' },
  { id: 4, name: 'Kinh Doanh', slug: 'kinh-doanh', icon: '💼', count: 176, color: '#fa8c16' },
  { id: 5, name: 'Ngoại Ngữ', slug: 'ngoai-ngu', icon: '🌍', count: 89, color: '#52c41a' },
  { id: 6, name: 'Âm Nhạc', slug: 'am-nhac', icon: '🎵', count: 64, color: '#eb2f96' },
  { id: 7, name: 'Sức Khỏe', slug: 'suc-khoe', icon: '🏋️', count: 53, color: '#f5222d' },
  { id: 8, name: 'Nhiếp Ảnh', slug: 'nhiep-anh', icon: '📷', count: 41, color: '#faad14' },
];

export const courses: Course[] = [
  {
    id: 1,
    title: 'React & TypeScript - Xây Dựng Ứng Dụng Thực Tế',
    slug: 'react-typescript-thuc-te',
    instructor: 'Nguyễn Văn An',
    instructorAvatar: 'https://i.pravatar.cc/150?img=1',
    category: 'Lập Trình',
    categorySlug: 'lap-trinh',
    price: 499000,
    originalPrice: 1299000,
    discount: 62,
    rating: 4.8,
    ratingCount: 2341,
    students: 15420,
    duration: '42 giờ',
    lessons: 186,
    level: 'Trung cấp',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    tags: ['React', 'TypeScript', 'Redux', 'Next.js'],
    description: 'Khóa học React và TypeScript toàn diện nhất, từ cơ bản đến nâng cao. Xây dựng các dự án thực tế.',
    bestseller: true,
  },
  {
    id: 2,
    title: 'Python for Data Science & Machine Learning',
    slug: 'python-data-science-ml',
    instructor: 'Trần Thị Bình',
    instructorAvatar: 'https://i.pravatar.cc/150?img=5',
    category: 'Lập Trình',
    categorySlug: 'lap-trinh',
    price: 599000,
    originalPrice: 1599000,
    discount: 63,
    rating: 4.9,
    ratingCount: 4521,
    students: 28760,
    duration: '60 giờ',
    lessons: 240,
    level: 'Từ cơ bản',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    tags: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
    description: 'Học Python từ đầu đến chuyên sâu về Data Science và Machine Learning với các dự án thực tế.',
    bestseller: true,
    isFlashSale: true,
  },
  {
    id: 3,
    title: 'UI/UX Design với Figma - Từ Cơ Bản Đến Chuyên Nghiệp',
    slug: 'uiux-figma-co-ban',
    instructor: 'Lê Hoàng Nam',
    instructorAvatar: 'https://i.pravatar.cc/150?img=8',
    category: 'Thiết Kế',
    categorySlug: 'thiet-ke',
    price: 399000,
    originalPrice: 999000,
    discount: 60,
    rating: 4.7,
    ratingCount: 1876,
    students: 9845,
    duration: '35 giờ',
    lessons: 145,
    level: 'Từ cơ bản',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    tags: ['Figma', 'UI Design', 'UX Design', 'Prototype'],
    description: 'Khóa học UI/UX Design chuyên nghiệp với Figma. Thiết kế giao diện người dùng đẹp và thân thiện.',
    isNew: true,
  },
  {
    id: 4,
    title: 'Digital Marketing - Chiến Lược Marketing Online',
    slug: 'digital-marketing-chien-luoc',
    instructor: 'Phạm Thị Lan',
    instructorAvatar: 'https://i.pravatar.cc/150?img=9',
    category: 'Marketing',
    categorySlug: 'marketing',
    price: 449000,
    originalPrice: 1199000,
    discount: 63,
    rating: 4.6,
    ratingCount: 3210,
    students: 18920,
    duration: '38 giờ',
    lessons: 162,
    level: 'Từ cơ bản',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=225&fit=crop',
    tags: ['SEO', 'Google Ads', 'Facebook Ads', 'Content Marketing'],
    description: 'Chiến lược marketing online toàn diện. Học cách chạy quảng cáo hiệu quả và tăng doanh thu.',
    bestseller: true,
    isFlashSale: true,
  },
  {
    id: 5,
    title: 'Node.js & Express - Backend Development',
    slug: 'nodejs-express-backend',
    instructor: 'Hoàng Minh Tuấn',
    instructorAvatar: 'https://i.pravatar.cc/150?img=11',
    category: 'Lập Trình',
    categorySlug: 'lap-trinh',
    price: 549000,
    originalPrice: 1399000,
    discount: 61,
    rating: 4.8,
    ratingCount: 2987,
    students: 12450,
    duration: '48 giờ',
    lessons: 198,
    level: 'Trung cấp',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    tags: ['Node.js', 'Express', 'MongoDB', 'REST API'],
    description: 'Xây dựng backend mạnh mẽ với Node.js và Express. MongoDB, REST API và nhiều hơn nữa.',
  },
  {
    id: 6,
    title: 'Tiếng Anh Giao Tiếp - Từ Sơ Cấp Đến Nâng Cao',
    slug: 'tieng-anh-giao-tiep',
    instructor: 'Jennifer Smith',
    instructorAvatar: 'https://i.pravatar.cc/150?img=15',
    category: 'Ngoại Ngữ',
    categorySlug: 'ngoai-ngu',
    price: 299000,
    originalPrice: 799000,
    discount: 63,
    rating: 4.7,
    ratingCount: 5432,
    students: 45670,
    duration: '50 giờ',
    lessons: 220,
    level: 'Từ cơ bản',
    language: 'Song ngữ',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=225&fit=crop',
    tags: ['Tiếng Anh', 'Giao tiếp', 'IELTS', 'Business English'],
    description: 'Học tiếng Anh giao tiếp từ sơ cấp đến nâng cao với giáo viên bản ngữ người Mỹ.',
    bestseller: true,
  },
  {
    id: 7,
    title: 'Adobe Photoshop - Chỉnh Sửa Ảnh Chuyên Nghiệp',
    slug: 'photoshop-chinh-sua-anh',
    instructor: 'Đinh Thị Mai',
    instructorAvatar: 'https://i.pravatar.cc/150?img=20',
    category: 'Thiết Kế',
    categorySlug: 'thiet-ke',
    price: 349000,
    originalPrice: 899000,
    discount: 61,
    rating: 4.6,
    ratingCount: 1543,
    students: 8920,
    duration: '30 giờ',
    lessons: 128,
    level: 'Từ cơ bản',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=225&fit=crop',
    tags: ['Photoshop', 'Adobe', 'Photo Editing', 'Design'],
    description: 'Thành thạo Adobe Photoshop từ cơ bản đến nâng cao. Chỉnh sửa ảnh chuyên nghiệp.',
    isNew: true,
  },
  {
    id: 8,
    title: 'Kinh Doanh Online - Xây Dựng Thương Hiệu Cá Nhân',
    slug: 'kinh-doanh-online-thuong-hieu',
    instructor: 'Nguyễn Quang Hải',
    instructorAvatar: 'https://i.pravatar.cc/150?img=25',
    category: 'Kinh Doanh',
    categorySlug: 'kinh-doanh',
    price: 499000,
    originalPrice: 1299000,
    discount: 62,
    rating: 4.5,
    ratingCount: 2876,
    students: 21340,
    duration: '45 giờ',
    lessons: 185,
    level: 'Từ cơ bản',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=225&fit=crop',
    tags: ['Kinh doanh', 'E-commerce', 'Thương hiệu', 'Shopify'],
    description: 'Học cách kinh doanh online hiệu quả và xây dựng thương hiệu cá nhân mạnh mẽ.',
    isFlashSale: true,
  },
  {
    id: 9,
    title: 'Flutter - Phát Triển Ứng Dụng Mobile',
    slug: 'flutter-mobile-app',
    instructor: 'Vũ Thành Long',
    instructorAvatar: 'https://i.pravatar.cc/150?img=30',
    category: 'Lập Trình',
    categorySlug: 'lap-trinh',
    price: 649000,
    originalPrice: 1699000,
    discount: 62,
    rating: 4.8,
    ratingCount: 1654,
    students: 7820,
    duration: '55 giờ',
    lessons: 210,
    level: 'Trung cấp',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    tags: ['Flutter', 'Dart', 'iOS', 'Android'],
    description: 'Phát triển ứng dụng mobile cross-platform với Flutter và Dart từ đầu.',
    isNew: true,
  },
  {
    id: 10,
    title: 'Excel Nâng Cao - Phân Tích Dữ Liệu',
    slug: 'excel-nang-cao-phan-tich',
    instructor: 'Trần Văn Đức',
    instructorAvatar: 'https://i.pravatar.cc/150?img=35',
    category: 'Kinh Doanh',
    categorySlug: 'kinh-doanh',
    price: 249000,
    originalPrice: 699000,
    discount: 64,
    rating: 4.7,
    ratingCount: 4321,
    students: 32450,
    duration: '25 giờ',
    lessons: 105,
    level: 'Trung cấp',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    tags: ['Excel', 'Data Analysis', 'VBA', 'Power BI'],
    description: 'Thành thạo Excel nâng cao và kỹ năng phân tích dữ liệu chuyên nghiệp.',
    bestseller: true,
  },
  {
    id: 11,
    title: 'Guitar - Học Đàn Từ Con Số 0',
    slug: 'guitar-hoc-dan-co-ban',
    instructor: 'Lâm Trọng Nghĩa',
    instructorAvatar: 'https://i.pravatar.cc/150?img=40',
    category: 'Âm Nhạc',
    categorySlug: 'am-nhac',
    price: 199000,
    originalPrice: 599000,
    discount: 67,
    rating: 4.9,
    ratingCount: 2134,
    students: 14560,
    duration: '20 giờ',
    lessons: 88,
    level: 'Từ cơ bản',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=225&fit=crop',
    tags: ['Guitar', 'Âm nhạc', 'Acoustic', 'Nhạc lý'],
    description: 'Học guitar từ con số 0 với phương pháp dạy độc đáo, dễ tiếp thu và vui vẻ.',
    isFlashSale: true,
  },
  {
    id: 12,
    title: 'Nhiếp Ảnh Chân Dung - Bắt Trọn Khoảnh Khắc',
    slug: 'nhiep-anh-chan-dung',
    instructor: 'Cao Minh Khải',
    instructorAvatar: 'https://i.pravatar.cc/150?img=45',
    category: 'Nhiếp Ảnh',
    categorySlug: 'nhiep-anh',
    price: 349000,
    originalPrice: 899000,
    discount: 61,
    rating: 4.6,
    ratingCount: 876,
    students: 4320,
    duration: '28 giờ',
    lessons: 115,
    level: 'Từ cơ bản',
    language: 'Tiếng Việt',
    thumbnail: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400&h=225&fit=crop',
    tags: ['Nhiếp ảnh', 'Portrait', 'Lightroom', 'Chỉnh màu'],
    description: 'Kỹ thuật chụp ảnh chân dung chuyên nghiệp. Ánh sáng, bố cục và hậu kỳ với Lightroom.',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '10 Kỹ Năng Lập Trình Cần Có Năm 2025',
    slug: '10-ky-nang-lap-trinh-2025',
    category: 'Lập Trình',
    author: 'Nguyễn Văn An',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    date: '15/05/2025',
    readTime: '8 phút',
    thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=225&fit=crop',
    excerpt: 'Khám phá 10 kỹ năng lập trình quan trọng nhất mà mỗi developer cần trang bị trong năm 2025.',
    content: 'Nội dung chi tiết về 10 kỹ năng lập trình...',
    tags: ['Lập trình', 'Career', 'Skills'],
    views: 12450,
  },
  {
    id: 2,
    title: 'Hướng Dẫn Học Online Hiệu Quả Từ A-Z',
    slug: 'huong-dan-hoc-online-hieu-qua',
    category: 'Học Tập',
    author: 'Trần Thị Bình',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    date: '12/05/2025',
    readTime: '6 phút',
    thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=225&fit=crop',
    excerpt: 'Bí quyết học online hiệu quả giúp bạn nắm vững kiến thức và tiến bộ nhanh chóng.',
    content: 'Nội dung chi tiết về cách học online hiệu quả...',
    tags: ['Học tập', 'Productivity', 'Online Learning'],
    views: 8920,
  },
  {
    id: 3,
    title: 'UI/UX Design: Xu Hướng Thiết Kế 2025',
    slug: 'uiux-xu-huong-2025',
    category: 'Thiết Kế',
    author: 'Lê Hoàng Nam',
    authorAvatar: 'https://i.pravatar.cc/150?img=8',
    date: '10/05/2025',
    readTime: '10 phút',
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=225&fit=crop',
    excerpt: 'Những xu hướng thiết kế UI/UX nổi bật nhất trong năm 2025 mà mọi designer cần biết.',
    content: 'Nội dung chi tiết về xu hướng UI/UX...',
    tags: ['UI/UX', 'Design', 'Trend 2025'],
    views: 6543,
  },
  {
    id: 4,
    title: 'Digital Marketing: Chiến Lược Nội Dung 2025',
    slug: 'digital-marketing-content-2025',
    category: 'Marketing',
    author: 'Phạm Thị Lan',
    authorAvatar: 'https://i.pravatar.cc/150?img=9',
    date: '08/05/2025',
    readTime: '7 phút',
    thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=225&fit=crop',
    excerpt: 'Chiến lược nội dung marketing hiệu quả cho doanh nghiệp trong kỷ nguyên số.',
    content: 'Nội dung chi tiết về chiến lược marketing...',
    tags: ['Marketing', 'Content', 'Strategy'],
    views: 9876,
  },
  {
    id: 5,
    title: 'Học Tiếng Anh Tại Nhà: Phương Pháp Hiệu Quả',
    slug: 'hoc-tieng-anh-tai-nha',
    category: 'Ngoại Ngữ',
    author: 'Jennifer Smith',
    authorAvatar: 'https://i.pravatar.cc/150?img=15',
    date: '05/05/2025',
    readTime: '9 phút',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=225&fit=crop',
    excerpt: 'Phương pháp học tiếng Anh tại nhà hiệu quả mà không cần đến trung tâm.',
    content: 'Nội dung chi tiết về học tiếng Anh...',
    tags: ['Tiếng Anh', 'Language Learning', 'Study Tips'],
    views: 15320,
  },
  {
    id: 6,
    title: 'Python vs JavaScript: Nên Học Gì Trước?',
    slug: 'python-vs-javascript',
    category: 'Lập Trình',
    author: 'Hoàng Minh Tuấn',
    authorAvatar: 'https://i.pravatar.cc/150?img=11',
    date: '02/05/2025',
    readTime: '5 phút',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=225&fit=crop',
    excerpt: 'So sánh Python và JavaScript - ngôn ngữ nào phù hợp với người mới bắt đầu học lập trình.',
    content: 'Nội dung chi tiết về so sánh Python và JavaScript...',
    tags: ['Python', 'JavaScript', 'Beginners'],
    views: 18760,
  },
];

export const orders: Order[] = [
  {
    id: 'ORD-2025-001',
    date: '15/05/2025',
    status: 'delivered',
    total: 1048000,
    items: [
      { courseId: 1, title: 'React & TypeScript - Xây Dựng Ứng Dụng Thực Tế', price: 499000 },
      { courseId: 3, title: 'UI/UX Design với Figma', price: 399000 },
    ],
    paymentMethod: 'VNPay',
  },
  {
    id: 'ORD-2025-002',
    date: '10/05/2025',
    status: 'processing',
    total: 599000,
    items: [
      { courseId: 2, title: 'Python for Data Science & Machine Learning', price: 599000 },
    ],
    paymentMethod: 'ZaloPay',
  },
  {
    id: 'ORD-2025-003',
    date: '05/05/2025',
    status: 'shipping',
    total: 748000,
    items: [
      { courseId: 4, title: 'Digital Marketing - Chiến Lược Marketing Online', price: 449000 },
      { courseId: 7, title: 'Adobe Photoshop - Chỉnh Sửa Ảnh', price: 349000 },
    ],
    paymentMethod: 'Thẻ tín dụng',
  },
];

export const reviews: Review[] = [
  {
    id: 1,
    user: 'Trần Minh Khoa',
    avatar: 'https://i.pravatar.cc/150?img=50',
    rating: 5,
    date: '14/05/2025',
    comment: 'Khóa học rất hay và thực tế. Giảng viên dạy rất dễ hiểu, bài tập phong phú. Tôi đã học xong và áp dụng vào công việc ngay.',
    courseId: 1,
  },
  {
    id: 2,
    user: 'Nguyễn Thị Hương',
    avatar: 'https://i.pravatar.cc/150?img=51',
    rating: 5,
    date: '12/05/2025',
    comment: 'Tuyệt vời! Nội dung cập nhật nhất, ví dụ thực tế và chi tiết. Đáng đồng tiền bát gạo!',
    courseId: 1,
  },
  {
    id: 3,
    user: 'Lê Văn Hùng',
    avatar: 'https://i.pravatar.cc/150?img=52',
    rating: 4,
    date: '10/05/2025',
    comment: 'Khóa học tốt, nội dung phong phú. Một số phần hơi nhanh nhưng có thể xem lại. Recommend!',
    courseId: 1,
  },
  {
    id: 4,
    user: 'Phạm Quỳnh Anh',
    avatar: 'https://i.pravatar.cc/150?img=53',
    rating: 5,
    date: '08/05/2025',
    comment: 'Học xong khóa này mình đã pass phỏng vấn frontend developer. Cảm ơn thầy rất nhiều!',
    courseId: 1,
  },
];

export const adminStats = {
  totalRevenue: 2450000000,
  totalStudents: 85420,
  totalCourses: 248,
  totalOrders: 12450,
  revenueGrowth: 24.5,
  studentGrowth: 18.2,
  monthlyRevenue: [
    { month: 'T1', revenue: 145000000, orders: 890 },
    { month: 'T2', revenue: 168000000, orders: 1020 },
    { month: 'T3', revenue: 185000000, orders: 1150 },
    { month: 'T4', revenue: 210000000, orders: 1280 },
    { month: 'T5', revenue: 198000000, orders: 1210 },
    { month: 'T6', revenue: 234000000, orders: 1430 },
    { month: 'T7', revenue: 267000000, orders: 1620 },
    { month: 'T8', revenue: 248000000, orders: 1510 },
    { month: 'T9', revenue: 289000000, orders: 1760 },
    { month: 'T10', revenue: 312000000, orders: 1900 },
    { month: 'T11', revenue: 334000000, orders: 2030 },
    { month: 'T12', revenue: 360000000, orders: 2190 },
  ],
  categoryRevenue: [
    { name: 'Lập Trình', value: 38 },
    { name: 'Marketing', value: 22 },
    { name: 'Thiết Kế', value: 18 },
    { name: 'Kinh Doanh', value: 12 },
    { name: 'Ngoại Ngữ', value: 10 },
  ],
  topCourses: [
    { title: 'Python for Data Science', students: 28760, revenue: 17240000 },
    { title: 'Tiếng Anh Giao Tiếp', students: 45670, revenue: 13659000 },
    { title: 'React & TypeScript', students: 15420, revenue: 7699800 },
    { title: 'Digital Marketing', students: 18920, revenue: 8504000 },
    { title: 'Excel Nâng Cao', students: 32450, revenue: 8089500 },
  ],
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Minh Đức',
    role: 'Frontend Developer tại VNG',
    avatar: 'https://i.pravatar.cc/150?img=60',
    rating: 5,
    comment: 'Nhờ EduLearn, tôi đã chuyển ngành thành công từ kế toán sang lập trình. Các khóa học thực tế và có hỗ trợ mentoring tuyệt vời.',
  },
  {
    id: 2,
    name: 'Phạm Thị Ngọc',
    role: 'UI/UX Designer tại Tiki',
    avatar: 'https://i.pravatar.cc/150?img=61',
    rating: 5,
    comment: 'Platform học trực tuyến tốt nhất tôi từng dùng. Nội dung cập nhật liên tục, community sôi nổi và hỗ trợ 24/7.',
  },
  {
    id: 3,
    name: 'Lê Trung Kiên',
    role: 'Data Analyst tại Shopee',
    avatar: 'https://i.pravatar.cc/150?img=62',
    rating: 5,
    comment: 'Tôi đã học 5 khóa học trên EduLearn và đều rất hài lòng. Đặc biệt khóa Python for Data Science giúp tôi thăng chức nhanh chóng.',
  },
];
