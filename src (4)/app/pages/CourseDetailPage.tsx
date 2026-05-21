import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Row, Col, Card, Button, Rate, Tag, Avatar, Collapse, Progress,
  Tabs, Typography, Badge, Divider, message, Breadcrumb, Modal,
  Input, Form,
} from 'antd';
import {
  PlayCircleOutlined, ClockCircleOutlined, UserOutlined, BookOutlined,
  TrophyOutlined, CheckCircleOutlined, HeartOutlined, ShareAltOutlined,
  StarFilled, GlobalOutlined, MobileOutlined, SyncOutlined,
  SafetyCertificateOutlined, ShoppingCartOutlined, ThunderboltOutlined,
  LockOutlined, UnlockOutlined,
} from '@ant-design/icons';
import { reviews, formatPrice } from '../data/mockData';
import { useCourses } from '../services/useCourses';
import { useCart } from '../services/useCart';
import CourseCard from '../components/shared/CourseCard';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text, Paragraph } = Typography;

const curriculum = [
  {
    section: 'Phần 1: Giới Thiệu & Chuẩn Bị',
    lessons: [
      { title: 'Giới thiệu khóa học', duration: '5:30', free: true },
      { title: 'Cài đặt môi trường phát triển', duration: '12:45', free: true },
      { title: 'Công cụ và tài nguyên cần thiết', duration: '8:20', free: false },
    ],
  },
  {
    section: 'Phần 2: Kiến Thức Nền Tảng',
    lessons: [
      { title: 'Các khái niệm cơ bản', duration: '18:30', free: false },
      { title: 'Thực hành bài tập 1', duration: '25:15', free: false },
      { title: 'Thực hành bài tập 2', duration: '22:40', free: false },
      { title: 'Quiz kiểm tra', duration: '10:00', free: false },
    ],
  },
  {
    section: 'Phần 3: Xây Dựng Dự Án Thực Tế',
    lessons: [
      { title: 'Lên kế hoạch dự án', duration: '15:20', free: false },
      { title: 'Xây dựng chức năng core', duration: '45:30', free: false },
      { title: 'Tối ưu hóa và testing', duration: '32:10', free: false },
      { title: 'Deployment và CI/CD', duration: '28:45', free: false },
    ],
  },
  {
    section: 'Phần 4: Nâng Cao & Mở Rộng',
    lessons: [
      { title: 'Best practices và pattern', duration: '20:15', free: false },
      { title: 'Tích hợp thư viện bên thứ 3', duration: '35:00', free: false },
      { title: 'Project cuối khóa', duration: '60:00', free: false },
    ],
  },
];

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { courses } = useCourses();
  const { add: addToCart, items: cartItems } = useCart();

  const course = courses.find(c => c.slug === slug) || courses[0];
  const related = courses.filter(c => c.categorySlug === course.categorySlug && c.id !== course.id).slice(0, 4);
  const isInCart = cartItems.some(item => item.productId === course.id);

  const totalLessons = curriculum.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalDuration = '42 giờ 30 phút';

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(course.id, 1);
      message.success('Đã thêm vào giỏ hàng!');
    } catch (err) {
      message.error('Lỗi thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <MainLayout cartCount={cartItems.length}>
      {/* Header */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { title: <span className="text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate('/')}>Trang chủ</span> },
              { title: <span className="text-gray-400 hover:text-white cursor-pointer" onClick={() => navigate('/courses')}>Khóa học</span> },
              { title: <span className="text-gray-400">{course.category}</span> },
              { title: <span className="text-white">{course.title}</span> },
            ]}
            className="mb-4"
          />
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag color="orange">BESTSELLER</Tag>
                <Tag color="blue">{course.category}</Tag>
                <Tag color="green">{course.level}</Tag>
                <Tag color="purple">{course.language}</Tag>
              </div>
              <Title level={1} className="text-white mb-3 text-2xl md:text-3xl leading-tight">
                {course.title}
              </Title>
              <Paragraph className="text-gray-300 text-lg mb-4">{course.description}</Paragraph>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <StarFilled className="text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-lg">{course.rating}</span>
                  <span className="text-gray-400">({course.ratingCount.toLocaleString()} đánh giá)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <UserOutlined />
                  <span>{course.students.toLocaleString()} học viên</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <ClockCircleOutlined />
                  <span>{totalDuration}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <BookOutlined />
                  <span>{totalLessons} bài học</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar src={course.instructorAvatar} size={32} />
                <span className="text-blue-400">{course.instructor}</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[32, 32]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Preview Video */}
            <div
              className="relative rounded-xl overflow-hidden cursor-pointer mb-8 group"
              onClick={() => setVideoModal(true)}
              style={{ paddingBottom: '56.25%' }}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircleOutlined className="text-blue-600 text-3xl" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-white text-sm">
                📺 Xem preview miễn phí
              </div>
            </div>

            <Tabs
              defaultActiveKey="overview"
              items={[
                {
                  key: 'overview',
                  label: 'Tổng Quan',
                  children: (
                    <div className="space-y-8">
                      {/* What you'll learn */}
                      <Card className="border-gray-100 rounded-xl">
                        <Title level={4} className="mb-4">🎯 Bạn Sẽ Học Được Gì?</Title>
                        <Row gutter={[12, 8]}>
                          {[
                            'Hiểu vững kiến thức nền tảng từ cơ bản đến nâng cao',
                            'Xây dựng dự án thực tế từ đầu đến cuối',
                            'Áp dụng best practices trong ngành',
                            'Deploy ứng dụng lên production',
                            'Tối ưu hiệu suất và performance',
                            'Làm việc với team sử dụng Git',
                            'Viết code clean và dễ maintain',
                            'Debug và fix lỗi hiệu quả',
                          ].map((item, i) => (
                            <Col xs={24} md={12} key={i}>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircleOutlined className="text-green-500 mt-0.5 flex-shrink-0" />
                                {item}
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </Card>

                      {/* Requirements */}
                      <Card className="border-gray-100 rounded-xl">
                        <Title level={4} className="mb-4">📋 Yêu Cầu Trước Khi Học</Title>
                        <ul className="space-y-2">
                          {[
                            'Biết sử dụng máy tính và có kết nối Internet',
                            'Không cần kinh nghiệm lập trình trước (chúng tôi dạy từ đầu)',
                            'Máy tính Windows, Mac hoặc Linux đều được',
                          ].map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-blue-500 mt-0.5">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </Card>

                      {/* Description */}
                      <Card className="border-gray-100 rounded-xl">
                        <Title level={4} className="mb-4">📝 Mô Tả Khóa Học</Title>
                        <Paragraph className="text-gray-700 text-sm leading-relaxed">
                          Đây là khóa học toàn diện nhất về {course.title} trên thị trường. Chúng tôi sẽ cùng bạn đi từ con số 0, xây dựng nền tảng vững chắc và tiến đến các kiến thức nâng cao.
                        </Paragraph>
                        <Paragraph className="text-gray-700 text-sm leading-relaxed">
                          Khóa học bao gồm <strong>{totalLessons}+ bài giảng video</strong>, bài tập thực hành, quiz kiểm tra và dự án cuối khóa thực tế. Nội dung được cập nhật thường xuyên để luôn bắt kịp xu hướng mới nhất.
                        </Paragraph>
                        <Paragraph className="text-gray-700 text-sm leading-relaxed">
                          Sau khi hoàn thành, bạn sẽ tự tin áp dụng kiến thức vào công việc thực tế và đủ năng lực để phỏng vấn vào các vị trí liên quan.
                        </Paragraph>
                      </Card>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map(tag => (
                          <Tag key={tag} className="rounded-full">{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'curriculum',
                  label: `Nội Dung (${totalLessons} bài)`,
                  children: (
                    <div>
                      <div className="bg-blue-50 rounded-xl p-4 mb-6 flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600"><BookOutlined className="mr-1" />{totalLessons} bài học</span>
                        <span className="text-gray-600"><ClockCircleOutlined className="mr-1" />{totalDuration}</span>
                        <span className="text-green-600"><UnlockOutlined className="mr-1" />2 bài học miễn phí</span>
                      </div>
                      <Collapse
                        defaultActiveKey={['0']}
                        items={curriculum.map((section, idx) => ({
                          key: String(idx),
                          label: (
                            <div className="flex justify-between items-center w-full pr-4">
                              <span className="font-semibold text-gray-800">{section.section}</span>
                              <span className="text-gray-400 text-sm">{section.lessons.length} bài</span>
                            </div>
                          ),
                          children: (
                            <ul className="space-y-1">
                              {section.lessons.map((lesson, li) => (
                                <li
                                  key={li}
                                  className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${
                                    lesson.free ? 'hover:bg-blue-50 cursor-pointer' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <PlayCircleOutlined className={lesson.free ? 'text-blue-500' : 'text-gray-400'} />
                                    <span className={lesson.free ? 'text-blue-600 underline cursor-pointer' : 'text-gray-700'}>
                                      {lesson.title}
                                    </span>
                                    {lesson.free && <Tag color="green" className="text-xs">Miễn phí</Tag>}
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-400 flex-shrink-0">
                                    <span>{lesson.duration}</span>
                                    {!lesson.free && <LockOutlined className="text-xs" />}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ),
                        }))}
                      />
                    </div>
                  ),
                },
                {
                  key: 'reviews',
                  label: `Đánh Giá (${course.ratingCount.toLocaleString()})`,
                  children: (
                    <div>
                      {/* Rating summary */}
                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <Row gutter={[24, 24]} align="middle">
                          <Col xs={24} sm={8} className="text-center">
                            <div className="text-6xl font-bold text-yellow-500">{course.rating}</div>
                            <Rate disabled defaultValue={course.rating} allowHalf className="text-xl" />
                            <div className="text-gray-500 text-sm mt-1">Đánh giá khóa học</div>
                          </Col>
                          <Col xs={24} sm={16}>
                            {[5, 4, 3, 2, 1].map(star => (
                              <div key={star} className="flex items-center gap-3 mb-2">
                                <Progress
                                  percent={star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : 2}
                                  strokeColor="#faad14"
                                  className="flex-1 mb-0"
                                  showInfo={false}
                                />
                                <div className="flex items-center gap-1 text-sm text-yellow-500 flex-shrink-0 w-12">
                                  {star}<StarFilled className="text-xs" />
                                </div>
                              </div>
                            ))}
                          </Col>
                        </Row>
                      </div>

                      {/* Review form */}
                      <Card className="border-gray-100 rounded-xl mb-6">
                        <Title level={5}>Viết Đánh Giá Của Bạn</Title>
                        <Rate className="mb-3" />
                        <Form.Item>
                          <Input.TextArea placeholder="Chia sẻ trải nghiệm của bạn..." rows={3} />
                        </Form.Item>
                        <Button type="primary">Gửi Đánh Giá</Button>
                      </Card>

                      {/* Reviews list */}
                      <div className="divide-y divide-gray-100">
                        {reviews.filter(r => r.courseId === course.id).map(review => (
                          <div key={review.id} className="py-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar src={review.avatar} size={40} />
                              <div>
                                <div className="font-semibold text-gray-900">{review.user}</div>
                                <div className="flex items-center gap-2">
                                  <Rate disabled defaultValue={review.rating} className="text-xs" />
                                  <span className="text-gray-400 text-xs">{review.date}</span>
                                </div>
                              </div>
                            </div>
                            <Text className="text-gray-700 text-sm">{review.comment}</Text>
                          </div>
                        ))}
                        <div className="pt-3">
                          <Button type="link">Xem thêm đánh giá...</Button>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'instructor',
                  label: 'Giảng Viên',
                  children: (
                    <Card className="border-gray-100 rounded-xl">
                      <div className="flex items-start gap-4">
                        <Avatar src={course.instructorAvatar} size={80} />
                        <div className="flex-1">
                          <Title level={4} className="mb-1">{course.instructor}</Title>
                          <Text className="text-blue-600 block mb-3">Chuyên gia {course.category}</Text>
                          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                            <span><StarFilled className="text-yellow-400 mr-1" />4.9 Điểm giảng dạy</span>
                            <span><UserOutlined className="mr-1" />45,230 học viên</span>
                            <span><BookOutlined className="mr-1" />12 khóa học</span>
                          </div>
                          <Paragraph className="text-gray-600 text-sm">
                            {course.instructor} là chuyên gia hàng đầu với hơn 10 năm kinh nghiệm trong lĩnh vực {course.category}.
                            Hiện tại đang làm việc tại các công ty công nghệ hàng đầu và có kinh nghiệm giảng dạy tại nhiều trường đại học.
                          </Paragraph>
                        </div>
                      </div>
                    </Card>
                  ),
                },
              ]}
            />
          </Col>

          {/* Sticky Purchase Card */}
          <Col xs={24} lg={8}>
            <div className="sticky top-24">
              <Card className="rounded-xl shadow-lg border-gray-100 overflow-hidden">
                {/* Price */}
                <div className="text-center pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-blue-600">{formatPrice(course.price)}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-gray-400 line-through text-lg">{formatPrice(course.originalPrice)}</span>
                    )}
                  </div>
                  {course.discount > 0 && (
                    <Tag color="red" className="text-base px-3 py-0.5">Giảm {course.discount}%</Tag>
                  )}
                  <div className="text-red-500 text-sm mt-2 font-medium">
                    ⚡ Ưu đãi kết thúc sau 5 giờ!
                  </div>
                </div>

                <div className="py-4 space-y-3">
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<PlayCircleOutlined />}
                    className="h-12 text-base font-semibold rounded-xl bg-green-600 border-green-600"
                    onClick={() => navigate(`/learn/${course.slug}`)}
                  >
                    Vào Học Ngay
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<ShoppingCartOutlined />}
                    className="bg-blue-600 border-blue-600 h-12 text-base font-semibold rounded-xl"
                    onClick={handleAddToCart}
                    loading={addingToCart}
                    disabled={isInCart}
                  >
                    {isInCart ? 'Đã Có Trong Giỏ' : 'Thêm Vào Giỏ Hàng'}
                  </Button>
                  <Button
                    size="large"
                    block
                    className="h-12 text-base font-semibold rounded-xl border-blue-600 text-blue-600"
                    onClick={() => navigate('/checkout')}
                  >
                    Mua Ngay
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      icon={<HeartOutlined />}
                      block
                      onClick={() => { setWishlisted(!wishlisted); message.success(wishlisted ? 'Đã bỏ yêu thích' : 'Đã thêm yêu thích!'); }}
                    >
                      {wishlisted ? 'Đã yêu thích' : 'Yêu thích'}
                    </Button>
                    <Button icon={<ShareAltOutlined />} block>Chia sẻ</Button>
                  </div>
                  <div className="text-center text-gray-500 text-xs">
                    Đảm bảo hoàn tiền trong 30 ngày
                  </div>
                </div>

                <Divider className="my-3" />

                {/* Course info */}
                <div className="space-y-2 text-sm">
                  <Title level={5} className="mb-3">Khóa Học Bao Gồm:</Title>
                  {[
                    { icon: <ClockCircleOutlined className="text-blue-500" />, text: `${totalDuration} video` },
                    { icon: <BookOutlined className="text-purple-500" />, text: `${totalLessons} bài giảng` },
                    { icon: <SyncOutlined className="text-green-500" />, text: 'Học mọi lúc, mọi nơi' },
                    { icon: <MobileOutlined className="text-orange-500" />, text: 'Mobile & Desktop' },
                    { icon: <SafetyCertificateOutlined className="text-red-500" />, text: 'Chứng chỉ hoàn thành' },
                    { icon: <GlobalOutlined className="text-teal-500" />, text: 'Truy cập trọn đời' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <Divider className="my-3" />

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {course.tags.map(tag => (
                    <Tag key={tag} className="text-xs rounded-full">{tag}</Tag>
                  ))}
                </div>
              </Card>

              {/* Related courses */}
              <div className="mt-6">
                <Title level={5} className="mb-3">Khóa Học Liên Quan</Title>
                <div className="space-y-3">
                  {related.slice(0, 3).map(rc => (
                    <div
                      key={rc.id}
                      className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/courses/${rc.slug}`)}
                    >
                      <img src={rc.thumbnail} alt={rc.title} className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{rc.title}</div>
                        <div className="text-blue-600 font-bold text-sm">{formatPrice(rc.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* More from category */}
        <div className="mt-12">
          <Title level={3} className="mb-6">Học Viên Cũng Mua</Title>
          <Row gutter={[16, 16]}>
            {related.map(c => (
              <Col xs={24} sm={12} md={8} lg={6} key={c.id}>
                <CourseCard course={c} onAddToCart={() => message.success('Đã thêm vào giỏ!')} />
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        open={videoModal}
        onCancel={() => setVideoModal(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="relative pt-[56.25%]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Course Preview"
            allow="autoplay; encrypted-media"
          />
        </div>
      </Modal>
    </MainLayout>
  );
}
