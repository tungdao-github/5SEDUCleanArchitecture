import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import {
  Input, Row, Col, Card, Tag, Button, Tabs, Typography, Empty, Spin, Select,
} from 'antd';
import {
  SearchOutlined, FilterOutlined, AudioOutlined, FireOutlined,
} from '@ant-design/icons';
import { courses, blogPosts, formatPrice } from '../data/mockData';
import CourseCard from '../components/shared/CourseCard';
import MainLayout from '../components/layout/MainLayout';
import { message } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const hotKeywords = ['React', 'Python', 'Marketing', 'Tiếng Anh', 'Figma', 'Excel', 'Flutter'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState('popular');
  const [listening, setListening] = useState(false);

  const filteredCourses = useMemo(() => {
    if (!query.trim()) return courses;
    return courses.filter(c =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return blogPosts;
    return blogPosts.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      message.warning('Trình duyệt không hỗ trợ nhận diện giọng nói');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    setListening(true);
    recognition.start();
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setQuery(text);
      setSearchParams({ q: text });
      setListening(false);
    };
    recognition.onerror = () => {
      setListening(false);
      message.error('Không thể nhận diện giọng nói');
    };
    recognition.onend = () => setListening(false);
  };

  const handleSearch = (val: string) => {
    setQuery(val);
    setSearchParams({ q: val });
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Title level={2} className="text-white text-center mb-6">
            🔍 Tìm Kiếm Khóa Học
          </Title>
          <div className="relative">
            <Input
              size="large"
              placeholder="Tìm kiếm khóa học, kỹ năng, giảng viên..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onPressEnter={e => handleSearch((e.target as HTMLInputElement).value)}
              prefix={<SearchOutlined className="text-gray-400 text-lg" />}
              suffix={
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleVoiceSearch}
                    className={`text-gray-400 hover:text-blue-500 transition-colors ${listening ? 'text-red-500 animate-pulse' : ''}`}
                    title="Tìm kiếm bằng giọng nói"
                  >
                    <AudioOutlined className="text-lg" />
                  </button>
                  <Button type="primary" onClick={() => handleSearch(query)} className="rounded-lg">
                    Tìm
                  </Button>
                </div>
              }
              className="rounded-2xl py-3 text-lg"
              style={{ borderRadius: 16 }}
            />
            {listening && (
              <div className="absolute -bottom-8 left-0 right-0 text-center text-white text-sm">
                🎤 Đang nghe... Hãy nói điều bạn muốn tìm
              </div>
            )}
          </div>

          {/* Hot keywords */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-blue-200 text-sm flex items-center gap-1">
              <FireOutlined /> Hot:
            </span>
            {hotKeywords.map(kw => (
              <button
                key={kw}
                onClick={() => handleSearch(kw)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {query && (
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <Text className="text-gray-600">
                Kết quả tìm kiếm cho: <strong>"{query}"</strong>
              </Text>
              <Text className="text-gray-400 ml-2">
                ({filteredCourses.length} khóa học, {filteredPosts.length} bài viết)
              </Text>
            </div>
            <Select value={sort} onChange={setSort} style={{ width: 160 }}>
              <Option value="popular">Phổ biến nhất</Option>
              <Option value="newest">Mới nhất</Option>
              <Option value="rating">Đánh giá cao</Option>
              <Option value="price-asc">Giá tăng dần</Option>
            </Select>
          </div>
        )}

        <Tabs
          defaultActiveKey="courses"
          items={[
            {
              key: 'courses',
              label: `Khóa Học (${filteredCourses.length})`,
              children: filteredCourses.length === 0 ? (
                <Empty description={`Không tìm thấy khóa học cho "${query}"`} />
              ) : (
                <Row gutter={[16, 16]}>
                  {filteredCourses.map(c => (
                    <Col xs={24} sm={12} md={8} lg={6} key={c.id}>
                      <CourseCard course={c} onAddToCart={() => message.success('Đã thêm vào giỏ!')} />
                    </Col>
                  ))}
                </Row>
              ),
            },
            {
              key: 'blog',
              label: `Bài Viết (${filteredPosts.length})`,
              children: filteredPosts.length === 0 ? (
                <Empty description={`Không tìm thấy bài viết cho "${query}"`} />
              ) : (
                <Row gutter={[16, 16]}>
                  {filteredPosts.map(post => (
                    <Col xs={24} md={8} key={post.id}>
                      <Card
                        hoverable
                        className="rounded-xl border-gray-100 overflow-hidden"
                        cover={<img src={post.thumbnail} alt={post.title} className="h-48 object-cover" />}
                        onClick={() => navigate(`/blog/${post.slug}`)}
                      >
                        <Tag color="blue" className="mb-2">{post.category}</Tag>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{post.title}</h3>
                        <Text className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</Text>
                        <div className="text-gray-400 text-xs mt-2">{post.date} • {post.readTime}</div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ),
            },
          ]}
        />

        {!query && (
          <div className="text-center py-12">
            <SearchOutlined className="text-8xl text-gray-200 block mx-auto mb-4" />
            <Title level={4} className="text-gray-400">Nhập từ khóa để tìm kiếm</Title>
            <Text className="text-gray-400 block mb-6">Hãy tìm kiếm khóa học theo tên, kỹ năng hoặc giảng viên</Text>
            <div className="flex flex-wrap justify-center gap-2">
              {hotKeywords.map(kw => (
                <Button key={kw} onClick={() => handleSearch(kw)}>{kw}</Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
