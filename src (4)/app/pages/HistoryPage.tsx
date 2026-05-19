import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Card, Typography, Button, Input, Select, Tag, Avatar, Empty,
  Tabs, Popconfirm, message, Badge, Progress, Tooltip,
} from 'antd';
import {
  SearchOutlined, DeleteOutlined, PlayCircleOutlined, ClockCircleOutlined,
  BookOutlined, ClearOutlined, HeartOutlined, ShoppingCartOutlined,
  HistoryOutlined, EyeOutlined,
} from '@ant-design/icons';
import { courses, formatPrice } from '../data/mockData';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text } = Typography;
const { Option } = Select;

const historyItems = [
  { courseId: 1, visitedAt: '17/05/2025 14:32', progress: 65, lastLesson: 'Thực Hành: Bài Tập Cơ Bản' },
  { courseId: 2, visitedAt: '17/05/2025 11:15', progress: 20, lastLesson: 'Màu Sắc & Typography' },
  { courseId: 3, visitedAt: '16/05/2025 21:40', progress: 100, lastLesson: 'Deploy Lên Production' },
  { courseId: 4, visitedAt: '16/05/2025 18:05', progress: 0, lastLesson: null },
  { courseId: 5, visitedAt: '15/05/2025 09:22', progress: 45, lastLesson: 'Chiến Lược Content Marketing' },
  { courseId: 6, visitedAt: '14/05/2025 20:10', progress: 80, lastLesson: 'Listening & Speaking' },
  { courseId: 7, visitedAt: '13/05/2025 16:55', progress: 30, lastLesson: 'Kỹ Thuật Đàm Phán' },
  { courseId: 8, visitedAt: '12/05/2025 10:30', progress: 0, lastLesson: null },
];

const searchHistory = [
  'React TypeScript', 'Python machine learning', 'Thiết kế UI/UX', 'Excel nâng cao',
  'Marketing online', 'Node.js backend', 'Photoshop cơ bản', 'Tiếng Anh giao tiếp',
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [history, setHistory] = useState(historyItems);
  const [searches, setSearches] = useState(searchHistory);

  const enriched = history.map(h => ({
    ...h,
    course: courses.find(c => c.id === h.courseId),
  })).filter(h => h.course);

  const filtered = enriched.filter(h =>
    !search || h.course!.title.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sort === 'recent') return historyItems.findIndex(x => x.courseId === a.courseId) - historyItems.findIndex(x => x.courseId === b.courseId);
    if (sort === 'progress') return b.progress - a.progress;
    return 0;
  });

  const removeItem = (courseId: number) => {
    setHistory(prev => prev.filter(h => h.courseId !== courseId));
    message.success('Đã xóa khỏi lịch sử');
  };

  const clearHistory = () => {
    setHistory([]);
    message.success('Đã xóa toàn bộ lịch sử');
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <HistoryOutlined className="text-2xl text-blue-600" />
            <div>
              <Title level={3} className="mb-0">Lịch Sử Xem</Title>
              <Text className="text-gray-500 text-sm">{history.length} khóa học đã xem</Text>
            </div>
          </div>
          <Popconfirm title="Xóa toàn bộ lịch sử?" onConfirm={clearHistory} okText="Xóa" cancelText="Hủy">
            <Button icon={<ClearOutlined />} danger>Xóa tất cả</Button>
          </Popconfirm>
        </div>

        <Tabs
          defaultActiveKey="courses"
          items={[
            {
              key: 'courses',
              label: <span><BookOutlined /> Khóa Học Đã Xem ({history.length})</span>,
              children: (
                <div>
                  {/* Filters */}
                  <div className="flex gap-3 mb-5 flex-wrap">
                    <Input
                      placeholder="Tìm trong lịch sử..."
                      prefix={<SearchOutlined />}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{ width: 280 }}
                      allowClear
                    />
                    <Select value={sort} onChange={setSort} style={{ width: 180 }}>
                      <Option value="recent">Xem gần nhất</Option>
                      <Option value="progress">Tiến độ cao nhất</Option>
                    </Select>
                  </div>

                  {filtered.length === 0 ? (
                    <Empty description="Chưa có lịch sử xem" className="py-16">
                      <Button type="primary" onClick={() => navigate('/courses')}>Khám Phá Khóa Học</Button>
                    </Empty>
                  ) : (
                    <div className="space-y-4">
                      {filtered.map(({ course, visitedAt, progress, lastLesson, courseId }) => (
                        <Card key={courseId} className="rounded-xl border-gray-100 hover:shadow-md transition-shadow">
                          <div className="flex gap-4 items-start">
                            <div className="relative flex-shrink-0">
                              <img
                                src={course!.thumbnail}
                                alt={course!.title}
                                className="w-32 h-20 object-cover rounded-xl cursor-pointer"
                                onClick={() => navigate(`/courses/${course!.slug}`)}
                              />
                              {progress === 100 && (
                                <div className="absolute inset-0 bg-green-600/80 rounded-xl flex items-center justify-center">
                                  <Tag color="green" className="text-xs m-0">Hoàn thành</Tag>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <Text
                                    strong
                                    className="text-gray-900 text-base block line-clamp-1 cursor-pointer hover:text-blue-600"
                                    onClick={() => navigate(`/courses/${course!.slug}`)}
                                  >
                                    {course!.title}
                                  </Text>
                                  <Text className="text-gray-500 text-sm">{course!.instructor}</Text>
                                </div>
                                <Tooltip title="Xóa khỏi lịch sử">
                                  <Button
                                    size="small"
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeItem(courseId)}
                                  />
                                </Tooltip>
                              </div>

                              <div className="flex items-center gap-2 my-2">
                                <Tag color="blue">{course!.category}</Tag>
                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                  <ClockCircleOutlined /> {visitedAt}
                                </span>
                              </div>

                              {/* Progress */}
                              <div className="mb-2">
                                <div className="flex justify-between mb-1">
                                  <Text className="text-xs text-gray-500">
                                    {progress === 0 ? 'Chưa bắt đầu' : progress === 100 ? 'Đã hoàn thành' : `Đang học: ${lastLesson}`}
                                  </Text>
                                  <Text className="text-xs font-medium text-blue-600">{progress}%</Text>
                                </div>
                                <Progress
                                  percent={progress}
                                  size="small"
                                  strokeColor={progress === 100 ? '#16a34a' : '#1d4ed8'}
                                  showInfo={false}
                                />
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={<PlayCircleOutlined />}
                                  onClick={() => navigate(`/learn/${course!.slug}`)}
                                >
                                  {progress === 0 ? 'Bắt Đầu Học' : progress === 100 ? 'Xem Lại' : 'Tiếp Tục'}
                                </Button>
                                {progress === 100 && (
                                  <Button
                                    size="small"
                                    className="border-green-500 text-green-600"
                                    onClick={() => navigate(`/certificate/${course!.slug}`)}
                                  >
                                    Xem Chứng Chỉ
                                  </Button>
                                )}
                                <Button size="small" icon={<HeartOutlined />}>Yêu thích</Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'searches',
              label: <span><SearchOutlined /> Tìm Kiếm Gần Đây ({searches.length})</span>,
              children: (
                <div>
                  <div className="flex justify-between mb-4">
                    <Text className="text-gray-500">Lịch sử tìm kiếm của bạn</Text>
                    <Button size="small" danger onClick={() => { setSearches([]); message.success('Đã xóa lịch sử tìm kiếm'); }}>
                      Xóa tất cả
                    </Button>
                  </div>
                  {searches.length === 0 ? (
                    <Empty description="Chưa có lịch sử tìm kiếm" className="py-12" />
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {searches.map((term, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group cursor-pointer"
                          onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                        >
                          <SearchOutlined className="text-gray-400 text-xs" />
                          <span className="text-gray-700 text-sm">{term}</span>
                          <button
                            className="text-gray-300 hover:text-red-400 text-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={e => { e.stopPropagation(); setSearches(prev => prev.filter((_, j) => j !== i)); }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hot searches suggestion */}
                  <div className="mt-8">
                    <Text strong className="text-gray-700 block mb-3">Có thể bạn quan tâm</Text>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {courses.slice(0, 4).map(c => (
                        <Card
                          key={c.id}
                          className="rounded-xl border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                          styles={{ body: { padding: 12 } }}
                          onClick={() => navigate(`/courses/${c.slug}`)}
                        >
                          <div className="flex gap-3">
                            <img src={c.thumbnail} alt={c.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 text-sm line-clamp-1">{c.title}</div>
                              <div className="text-blue-600 font-bold text-sm">{formatPrice(c.price)}</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </MainLayout>
  );
}
