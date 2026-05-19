import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Row, Col, Card, Tag, Avatar, Button, Input, Typography, Divider,
  List, Breadcrumb,
} from 'antd';
import {
  SearchOutlined, EyeOutlined, ClockCircleOutlined, CalendarOutlined,
  ArrowRightOutlined, ShareAltOutlined, HeartOutlined,
} from '@ant-design/icons';
import { blogPosts } from '../data/mockData';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text, Paragraph } = Typography;

const blogCategories = ['Tất cả', 'Lập Trình', 'Thiết Kế', 'Marketing', 'Ngoại Ngữ', 'Học Tập'];

export function BlogListPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchKw, setSearchKw] = useState('');

  const filtered = blogPosts.filter(p =>
    (activeCategory === 'Tất cả' || p.category === activeCategory) &&
    (!searchKw || p.title.toLowerCase().includes(searchKw.toLowerCase()))
  );

  const featured = blogPosts[0];
  const rest = filtered.slice(1);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Title level={1} className="text-white mb-2">Blog EduLearn</Title>
          <Text className="text-blue-100 text-lg block mb-6">
            Kiến thức, xu hướng và mẹo học tập từ các chuyên gia
          </Text>
          <div className="max-w-md mx-auto">
            <Input
              size="large"
              placeholder="Tìm kiếm bài viết..."
              prefix={<SearchOutlined />}
              value={searchKw}
              onChange={e => setSearchKw(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blogCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {activeCategory === 'Tất cả' && !searchKw && (
          <Card
            className="rounded-2xl overflow-hidden border-0 shadow-md mb-8 cursor-pointer hover:shadow-lg transition-shadow"
            styles={{ body: { padding: 0 } }}
            onClick={() => navigate(`/blog/${featured.slug}`)}
          >
            <Row>
              <Col xs={24} md={14}>
                <img src={featured.thumbnail} alt={featured.title} className="w-full h-64 md:h-full object-cover" />
              </Col>
              <Col xs={24} md={10}>
                <div className="p-8 flex flex-col justify-center h-full">
                  <Tag color="blue" className="w-fit mb-3">{featured.category}</Tag>
                  <Title level={3} className="mb-3 leading-snug">{featured.title}</Title>
                  <Paragraph className="text-gray-600 mb-4">{featured.excerpt}</Paragraph>
                  <div className="flex items-center gap-3 text-gray-500 text-sm mb-4">
                    <Avatar src={featured.authorAvatar} size={28} />
                    <span>{featured.author}</span>
                    <span className="flex items-center gap-1"><CalendarOutlined /> {featured.date}</span>
                    <span className="flex items-center gap-1"><ClockCircleOutlined /> {featured.readTime}</span>
                  </div>
                  <Button type="primary" icon={<ArrowRightOutlined />} className="w-fit">
                    Đọc ngay
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Post list */}
        <Row gutter={[20, 20]}>
          {filtered.map(post => (
            <Col xs={24} sm={12} md={8} key={post.id}>
              <Card
                hoverable
                className="rounded-xl border-gray-100 overflow-hidden hover:shadow-lg transition-shadow h-full"
                cover={
                  <div className="relative">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Tag color="blue" className="backdrop-blur">{post.category}</Tag>
                    </div>
                  </div>
                }
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base cursor-pointer hover:text-blue-600">
                  {post.title}
                </h3>
                <Text className="text-gray-500 text-sm block mb-3 line-clamp-2">{post.excerpt}</Text>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <Avatar src={post.authorAvatar} size={18} />
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><EyeOutlined /> {post.views.toLocaleString()}</span>
                </div>
                <Divider className="my-3" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map(t => <Tag key={t} className="text-xs m-0">{t}</Tag>)}
                  </div>
                  <div className="flex gap-1">
                    <button className="text-gray-400 hover:text-red-500 text-sm p-1"><HeartOutlined /></button>
                    <button className="text-gray-400 hover:text-blue-500 text-sm p-1"><ShareAltOutlined /></button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </MainLayout>
  );
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug) || blogPosts[0];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { title: <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Trang chủ</span> },
            { title: <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/blog')}>Blog</span> },
            { title: post.title },
          ]}
          className="mb-6"
        />

        {/* Article header */}
        <div className="mb-6">
          <Tag color="blue" className="mb-3">{post.category}</Tag>
          <Title level={1} className="text-3xl leading-tight mb-4">{post.title}</Title>
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Avatar src={post.authorAvatar} size={36} />
              <div>
                <div className="font-medium text-gray-800">{post.author}</div>
                <div className="text-xs text-gray-400">Chuyên gia {post.category}</div>
              </div>
            </div>
            <span className="flex items-center gap-1"><CalendarOutlined /> {post.date}</span>
            <span className="flex items-center gap-1"><ClockCircleOutlined /> {post.readTime}</span>
            <span className="flex items-center gap-1"><EyeOutlined /> {post.views.toLocaleString()} lượt xem</span>
          </div>
          <div className="flex gap-2">
            {['Facebook', 'Twitter', 'LinkedIn', 'Copy link'].map(social => (
              <Button key={social} size="small" icon={<ShareAltOutlined />}>
                {social}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured image */}
        <img src={post.thumbnail} alt={post.title} className="w-full rounded-2xl mb-8 shadow-md" style={{ maxHeight: 400, objectFit: 'cover' }} />

        {/* Article content */}
        <div className="prose max-w-none text-gray-700 leading-relaxed text-base space-y-4">
          <Paragraph className="text-lg text-gray-600 font-medium">{post.excerpt}</Paragraph>

          {[1, 2, 3].map(i => (
            <div key={i}>
              <Title level={3}>{i}. {['Tại sao điều này quan trọng?', 'Phương pháp hiệu quả nhất', 'Áp dụng thực tế như thế nào?'][i - 1]}</Title>
              <Paragraph className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </Paragraph>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {['Điểm quan trọng thứ nhất cần ghi nhớ', 'Điểm quan trọng thứ hai cần áp dụng', 'Thực hành hàng ngày để đạt kết quả tốt nhất'].map((point, j) => (
                  <li key={j}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Tag key={tag} className="rounded-full cursor-pointer hover:bg-blue-50">{tag}</Tag>
            ))}
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-10">
          <Title level={4} className="mb-4">Bài Viết Liên Quan</Title>
          <Row gutter={[16, 16]}>
            {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
              <Col xs={24} sm={8} key={related.id}>
                <Card
                  hoverable
                  className="rounded-xl border-gray-100 overflow-hidden"
                  cover={<img src={related.thumbnail} alt={related.title} className="h-32 object-cover" />}
                  styles={{ body: { padding: '12px' } }}
                  onClick={() => navigate(`/blog/${related.slug}`)}
                >
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{related.title}</h4>
                  <div className="text-gray-400 text-xs mt-1">{related.date}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </MainLayout>
  );
}
