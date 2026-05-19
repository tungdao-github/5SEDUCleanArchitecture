import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Button, Input, Row, Col, Card, Rate, Tag, Badge, Statistic,
  Carousel, Typography, Tabs, Avatar, Progress, message,
} from 'antd';
import {
  SearchOutlined, PlayCircleOutlined, TrophyOutlined, TeamOutlined,
  BookOutlined, StarFilled, ArrowRightOutlined, FireOutlined,
  CheckCircleOutlined, ThunderboltOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons';
import { categories, blogPosts, testimonials, formatPrice } from '../data/mockData';
import { useCourses } from '../services/useCourses';
import CourseCard from '../components/shared/CourseCard';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text } = Typography;

export default function HomePage() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(2);
  const [flashSaleTime, setFlashSaleTime] = useState({ h: 5, m: 43, s: 21 });
  const [searchValue, setSearchValue] = useState('');
  const { courses } = useCourses();

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    setCartCount(c => c + 1);
    message.success('Đã thêm vào giỏ hàng!', 1.5);
  };

  const flashSaleCourses = courses.filter(c => c.isFlashSale);
  const featuredCourses = courses.filter(c => c.bestseller);
  const newCourses = courses.filter(c => c.isNew);

  const heroSlides = [
    {
      bg: 'from-blue-900 via-blue-800 to-purple-900',
      tag: '🎯 Nền tảng học tập #1 Việt Nam',
      title: 'Học Không Giới Hạn,\nThành Công Không Biên Giới',
      desc: 'Hơn 248 khóa học chất lượng cao từ các chuyên gia hàng đầu. Học mọi lúc, mọi nơi trên mọi thiết bị.',
      cta: 'Khám Phá Ngay',
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    },
    {
      bg: 'from-purple-900 via-pink-800 to-rose-900',
      tag: '⚡ Flash Sale - Giảm đến 70%',
      title: 'Hàng Ngàn Khóa Học\nChỉ Từ 199.000đ',
      desc: 'Cơ hội vàng để nâng cấp kỹ năng với mức giá không thể tốt hơn. Chỉ trong thời gian có hạn!',
      cta: 'Xem Flash Sale',
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    },
    {
      bg: 'from-green-900 via-teal-800 to-cyan-900',
      tag: '🏆 Chứng chỉ được công nhận',
      title: 'Nhận Chứng Chỉ Quốc Tế\nTăng Cơ Hội Việc Làm',
      desc: 'Hoàn thành khóa học và nhận chứng chỉ được các nhà tuyển dụng hàng đầu công nhận.',
      cta: 'Tìm Hiểu Thêm',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    },
  ];

  return (
    <MainLayout cartCount={cartCount}>
      {/* Hero Carousel */}
      <Carousel autoplay autoplaySpeed={5000} dots={{ className: 'custom-dots' }} effect="fade">
        {heroSlides.map((slide, idx) => (
          <div key={idx}>
            <div className={`bg-gradient-to-r ${slide.bg} min-h-[520px] flex items-center`}>
              <div className="max-w-7xl mx-auto px-4 w-full py-16">
                <Row gutter={[32, 32]} align="middle">
                  <Col xs={24} lg={12}>
                    <Tag color="gold" className="mb-4 text-sm px-3 py-1 rounded-full border-0">
                      {slide.tag}
                    </Tag>
                    <Title level={1} className="text-white mb-4 leading-tight" style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
                      {slide.title.split('\n').map((line, i) => (
                        <span key={i}>{line}{i === 0 && <br />}</span>
                      ))}
                    </Title>
                    <Text className="text-blue-100 text-lg block mb-8">{slide.desc}</Text>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="primary"
                        size="large"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate('/courses')}
                        className="bg-yellow-500 border-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 h-12 rounded-xl"
                      >
                        {slide.cta}
                      </Button>
                      <Button
                        size="large"
                        icon={<PlayCircleOutlined />}
                        className="border-white text-white hover:bg-white/10 h-12 rounded-xl px-6"
                        ghost
                      >
                        Xem Demo
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-6 mt-8">
                      {[
                        { val: '85K+', label: 'Học viên' },
                        { val: '248+', label: 'Khóa học' },
                        { val: '4.8★', label: 'Đánh giá' },
                      ].map(s => (
                        <div key={s.label}>
                          <div className="text-white font-bold text-2xl">{s.val}</div>
                          <div className="text-blue-200 text-sm">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </Col>
                  <Col xs={0} lg={12} className="flex justify-center">
                    <div className="relative">
                      <img
                        src={slide.img}
                        alt="Hero"
                        className="rounded-2xl shadow-2xl object-cover"
                        style={{ width: 500, height: 340 }}
                      />
                      <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircleOutlined className="text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Học viên mới</div>
                          <div className="font-bold text-gray-900">+1,234 tháng này</div>
                        </div>
                      </div>
                      <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg">
                        <div className="text-xs text-gray-500 mb-1">Đánh giá trung bình</div>
                        <div className="flex items-center gap-1">
                          <StarFilled className="text-yellow-400" />
                          <span className="font-bold text-gray-900">4.8/5.0</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[16, 16]}>
            {[
              { icon: <TeamOutlined className="text-blue-600 text-2xl" />, val: '85,420+', label: 'Học Viên Đang Học', bg: 'bg-blue-50' },
              { icon: <BookOutlined className="text-purple-600 text-2xl" />, val: '248+', label: 'Khóa Học Chất Lượng', bg: 'bg-purple-50' },
              { icon: <TrophyOutlined className="text-yellow-600 text-2xl" />, val: '150+', label: 'Giảng Viên Chuyên Gia', bg: 'bg-yellow-50' },
              { icon: <SafetyCertificateOutlined className="text-green-600 text-2xl" />, val: '98%', label: 'Hài Lòng Sau Khóa Học', bg: 'bg-green-50' },
            ].map((stat, i) => (
              <Col xs={12} md={6} key={i}>
                <div className={`${stat.bg} rounded-xl p-4 flex items-center gap-3`}>
                  <div className="flex-shrink-0">{stat.icon}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl">{stat.val}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="mb-1">Danh Mục Khóa Học</Title>
              <Text className="text-gray-500">Khám phá hàng trăm khóa học theo chủ đề yêu thích</Text>
            </div>
            <Button type="link" icon={<ArrowRightOutlined />} onClick={() => navigate('/courses')}>
              Xem tất cả
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            {categories.map(cat => (
              <Col xs={12} sm={8} md={6} lg={3} key={cat.id}>
                <div
                  className="bg-white rounded-xl p-4 text-center cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100"
                  onClick={() => navigate(`/courses?cat=${cat.slug}`)}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-2"
                    style={{ background: `${cat.color}15` }}
                  >
                    {cat.icon}
                  </div>
                  <div className="font-medium text-gray-800 text-sm mb-1">{cat.name}</div>
                  <div className="text-xs text-gray-400">{cat.count} khóa</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <FireOutlined className="text-yellow-300 text-3xl" />
              <div>
                <div className="text-white font-bold text-2xl">⚡ Flash Sale</div>
                <div className="text-red-100 text-sm">Ưu đãi chỉ có trong thời gian giới hạn!</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Text className="text-white mr-2">Kết thúc sau:</Text>
              {[
                { val: flashSaleTime.h, label: 'Giờ' },
                { val: flashSaleTime.m, label: 'Phút' },
                { val: flashSaleTime.s, label: 'Giây' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white font-bold text-xl">:</span>}
                  <div className="bg-gray-900 text-white rounded-lg w-14 h-14 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold leading-none">{String(t.val).padStart(2, '0')}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{t.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Row gutter={[16, 16]}>
            {flashSaleCourses.map(course => (
              <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                <CourseCard course={course} onAddToCart={handleAddToCart} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-6">
            <Button
              size="large"
              onClick={() => navigate('/courses?sale=true')}
              className="bg-white text-red-600 border-white hover:bg-red-50 font-bold px-8 rounded-xl"
            >
              Xem Tất Cả Flash Sale <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="mb-1">Khóa Học Nổi Bật</Title>
              <Text className="text-gray-500">Được lựa chọn bởi hàng chục ngàn học viên</Text>
            </div>
            <Button type="link" icon={<ArrowRightOutlined />} onClick={() => navigate('/courses')}>Xem tất cả</Button>
          </div>
          <Tabs
            defaultActiveKey="bestseller"
            items={[
              {
                key: 'bestseller',
                label: <span><TrophyOutlined /> Bestseller</span>,
                children: (
                  <Row gutter={[20, 20]}>
                    {featuredCourses.map(c => (
                      <Col xs={24} sm={12} md={8} lg={6} key={c.id}>
                        <CourseCard course={c} onAddToCart={handleAddToCart} />
                      </Col>
                    ))}
                  </Row>
                ),
              },
              {
                key: 'new',
                label: <span>🆕 Mới Nhất</span>,
                children: (
                  <Row gutter={[20, 20]}>
                    {newCourses.map(c => (
                      <Col xs={24} sm={12} md={8} lg={6} key={c.id}>
                        <CourseCard course={c} onAddToCart={handleAddToCart} />
                      </Col>
                    ))}
                  </Row>
                ),
              },
              {
                key: 'all',
                label: <span><BookOutlined /> Tất Cả</span>,
                children: (
                  <Row gutter={[20, 20]}>
                    {courses.slice(0, 8).map(c => (
                      <Col xs={24} sm={12} md={8} lg={6} key={c.id}>
                        <CourseCard course={c} onAddToCart={handleAddToCart} />
                      </Col>
                    ))}
                  </Row>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <Title level={2}>Tại Sao Chọn EduLearn?</Title>
            <Text className="text-gray-500 text-lg">Chúng tôi cam kết mang lại trải nghiệm học tập tốt nhất</Text>
          </div>
          <Row gutter={[24, 24]}>
            {[
              { icon: '🎯', title: 'Nội Dung Thực Tế', desc: 'Khóa học được xây dựng từ kinh nghiệm thực tế của các chuyên gia hàng đầu trong ngành.' },
              { icon: '📱', title: 'Học Mọi Thiết Bị', desc: 'Truy cập khóa học từ máy tính, điện thoại, máy tính bảng. Học offline khi không có internet.' },
              { icon: '🔄', title: 'Học Trọn Đời', desc: 'Sau khi mua, bạn sở hữu khóa học mãi mãi. Nội dung được cập nhật liên tục miễn phí.' },
              { icon: '💬', title: 'Hỗ Trợ 24/7', desc: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc qua chat, email và điện thoại.' },
              { icon: '🏆', title: 'Chứng Chỉ Uy Tín', desc: 'Chứng chỉ hoàn thành được công nhận bởi hơn 500 doanh nghiệp hàng đầu Việt Nam.' },
              { icon: '💰', title: 'Hoàn Tiền 30 Ngày', desc: 'Không hài lòng? Chúng tôi hoàn tiền 100% trong vòng 30 ngày, không hỏi lý do.' },
            ].map((item, i) => (
              <Col xs={24} sm={12} md={8} key={i}>
                <div className="bg-white rounded-xl p-6 h-full hover:shadow-md transition-shadow border border-gray-100">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <Text className="text-gray-500">{item.desc}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <Title level={2}>Học Viên Nói Gì?</Title>
            <Text className="text-gray-500">Hơn 85,000 học viên đã tin tưởng EduLearn</Text>
          </div>
          <Row gutter={[24, 24]}>
            {testimonials.map(t => (
              <Col xs={24} md={8} key={t.id}>
                <Card className="h-full border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar src={t.avatar} size={48} />
                    <div>
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-blue-600 text-sm">{t.role}</div>
                    </div>
                  </div>
                  <Rate disabled defaultValue={t.rating} className="text-sm mb-3" />
                  <Text className="text-gray-600 italic">"{t.comment}"</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Blog Preview */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="mb-1">Tin Tức & Blog</Title>
              <Text className="text-gray-500">Cập nhật xu hướng và kiến thức mới nhất</Text>
            </div>
            <Button type="link" icon={<ArrowRightOutlined />} onClick={() => navigate('/blog')}>Xem tất cả</Button>
          </div>
          <Row gutter={[20, 20]}>
            {blogPosts.slice(0, 3).map(post => (
              <Col xs={24} md={8} key={post.id}>
                <Card
                  hoverable
                  className="overflow-hidden rounded-xl border-gray-100 hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  cover={
                    <img src={post.thumbnail} alt={post.title} className="h-48 object-cover w-full" />
                  }
                >
                  <Tag color="blue" className="mb-2">{post.category}</Tag>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base">{post.title}</h3>
                  <Text className="text-gray-500 text-sm line-clamp-2 block mb-3">{post.excerpt}</Text>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Avatar src={post.authorAvatar} size={20} />
                      <span>{post.author}</span>
                    </div>
                    <span>{post.date} • {post.readTime}</span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Title level={2} className="text-white mb-4">Bắt Đầu Hành Trình Học Tập Ngay Hôm Nay!</Title>
          <Text className="text-blue-100 text-lg block mb-8">
            Tham gia cùng 85,000+ học viên đang nâng cấp kỹ năng mỗi ngày
          </Text>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="large"
              onClick={() => navigate('/courses')}
              className="bg-yellow-400 border-yellow-400 text-gray-900 font-bold hover:bg-yellow-300 h-12 px-10 rounded-xl text-base"
            >
              Khám Phá Khóa Học
            </Button>
            <Button
              size="large"
              ghost
              onClick={() => navigate('/login?tab=register')}
              className="border-white text-white hover:bg-white/10 h-12 px-10 rounded-xl text-base"
            >
              Đăng Ký Miễn Phí
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
