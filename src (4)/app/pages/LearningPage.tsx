import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  Layout, Menu, Button, Progress, Typography, Tabs, Input,
  Tag, Avatar, Tooltip, Badge, Drawer, Rate, Form, message,
  Collapse, Divider, Space, Card, Checkbox,
} from 'antd';
import {
  PlayCircleOutlined, CheckCircleOutlined, LockOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, ArrowLeftOutlined,
  ArrowRightOutlined, LeftOutlined, FileTextOutlined,
  QuestionCircleOutlined, DownloadOutlined, MessageOutlined,
  StarOutlined, ClockCircleOutlined, BookOutlined,
  FullscreenOutlined, SettingOutlined, SoundOutlined,
  PauseCircleOutlined, CheckOutlined, HomeOutlined,
  BulbOutlined, NotificationOutlined,
} from '@ant-design/icons';
import { courses } from '../data/mockData';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'document';
  free?: boolean;
  completed?: boolean;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

const curriculum: Chapter[] = [
  {
    id: 1,
    title: 'Giới Thiệu Khóa Học',
    lessons: [
      { id: 1, title: 'Chào Mừng Đến Với Khóa Học', duration: '3:20', type: 'video', free: true, completed: true },
      { id: 2, title: 'Cài Đặt Môi Trường Phát Triển', duration: '12:45', type: 'video', free: true, completed: true },
      { id: 3, title: 'Tổng Quan Về Công Nghệ Sử Dụng', duration: '8:15', type: 'video', completed: true },
    ],
  },
  {
    id: 2,
    title: 'Kiến Thức Cơ Bản',
    lessons: [
      { id: 4, title: 'Khái Niệm Nền Tảng', duration: '15:30', type: 'video', completed: true },
      { id: 5, title: 'Thực Hành: Bài Tập Cơ Bản', duration: '22:10', type: 'video', completed: false },
      { id: 6, title: 'Kiểm Tra Kiến Thức Chương 2', duration: '10 câu', type: 'quiz', completed: false },
      { id: 7, title: 'Tài Liệu Tham Khảo', duration: 'PDF', type: 'document', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Nâng Cao & Thực Chiến',
    lessons: [
      { id: 8, title: 'Xây Dựng Dự Án Thực Tế - Phần 1', duration: '35:20', type: 'video', completed: false },
      { id: 9, title: 'Xây Dựng Dự Án Thực Tế - Phần 2', duration: '42:15', type: 'video', completed: false },
      { id: 10, title: 'Tối Ưu Hóa Hiệu Năng', duration: '18:50', type: 'video', completed: false },
      { id: 11, title: 'Deploy Lên Production', duration: '25:30', type: 'video', completed: false },
    ],
  },
  {
    id: 4,
    title: 'Dự Án Cuối Khóa',
    lessons: [
      { id: 12, title: 'Yêu Cầu Dự Án Cuối Khóa', duration: '5:00', type: 'video', completed: false },
      { id: 13, title: 'Nộp Bài & Nhận Chứng Chỉ', duration: '3:00', type: 'document', completed: false },
    ],
  },
];

const allLessons = curriculum.flatMap(c => c.lessons);

const mockQA = [
  { id: 1, user: 'Trần Minh', avatar: 'https://i.pravatar.cc/40?img=5', time: '2 giờ trước', question: 'Bài này có thể áp dụng cho React Native không?', answer: 'Có, các khái niệm cơ bản hoàn toàn tương thích với React Native.', upvotes: 12 },
  { id: 2, user: 'Lê Thị Hoa', avatar: 'https://i.pravatar.cc/40?img=9', time: '1 ngày trước', question: 'Lỗi "Cannot find module" khi cài đặt, phải làm sao?', answer: 'Bạn hãy thử chạy lại `npm install` hoặc xóa thư mục `node_modules` rồi cài lại.', upvotes: 8 },
  { id: 3, user: 'Hoàng Văn Bình', avatar: 'https://i.pravatar.cc/40?img=15', time: '3 ngày trước', question: 'Giảng viên có thể làm thêm bài về TypeScript generics không ạ?', answer: null, upvotes: 5 },
];

const mockNotes = [
  { id: 1, lessonId: 1, timestamp: '2:15', content: 'Cần nhớ cú pháp useState với generic type', color: '#fff7e6' },
  { id: 2, lessonId: 2, timestamp: '8:40', content: 'Cài đặt VS Code extensions: ESLint, Prettier, GitLens', color: '#f6ffed' },
];

const lessonTypeIcon = (type: string) => {
  if (type === 'quiz') return <QuestionCircleOutlined className="text-orange-400" />;
  if (type === 'document') return <FileTextOutlined className="text-blue-400" />;
  return <PlayCircleOutlined className="text-green-500" />;
};

export default function LearningPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.slug === slug) || courses[0];

  const [currentLessonId, setCurrentLessonId] = useState(5);
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [noteDrawer, setNoteDrawer] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(mockNotes);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2, 3, 4]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [qaQuestion, setQaQuestion] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const currentLesson = allLessons.find(l => l.id === currentLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const totalLessons = allLessons.length;
  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const markComplete = () => {
    if (!completedLessons.includes(currentLessonId)) {
      setCompletedLessons(prev => [...prev, currentLessonId]);
      message.success('Đã đánh dấu hoàn thành bài học!');
    }
    if (nextLesson) {
      setCurrentLessonId(nextLesson.id);
      setIsPlaying(false);
    }
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes(prev => [...prev, {
      id: Date.now(),
      lessonId: currentLessonId,
      timestamp: '0:00',
      content: noteText,
      color: '#f0f5ff',
    }]);
    setNoteText('');
    message.success('Đã lưu ghi chú!');
  };

  const currentChapterId = curriculum.find(ch => ch.lessons.some(l => l.id === currentLessonId))?.id;

  return (
    <Layout className="min-h-screen bg-gray-950">
      {/* Top Header */}
      <Header className="bg-gray-900 border-b border-gray-700 px-4 flex items-center justify-between h-14 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
            className="text-gray-300 hover:text-white"
          />
          <Link to="/" className="text-blue-400 font-bold text-lg hidden sm:block">EduLearn</Link>
          <Divider type="vertical" className="bg-gray-600 hidden sm:block" />
          <Text className="text-white font-medium text-sm line-clamp-1 max-w-xs hidden sm:block">
            {course.title}
          </Text>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Text className="text-gray-400 text-xs">{completedCount}/{totalLessons} bài</Text>
            <Progress
              percent={progressPercent}
              size="small"
              strokeColor="#1d4ed8"
              trailColor="#374151"
              style={{ width: 100 }}
              format={p => <span className="text-gray-300 text-xs">{p}%</span>}
            />
          </div>
          <Tooltip title="Ghi chú">
            <Badge count={notes.length} size="small">
              <Button
                type="text"
                icon={<BookOutlined />}
                onClick={() => setNoteDrawer(true)}
                className="text-gray-300 hover:text-white"
              />
            </Badge>
          </Tooltip>
          <Button
            type="text"
            icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setSiderCollapsed(!siderCollapsed)}
            className="text-gray-300 hover:text-white"
          />
        </div>
      </Header>

      <Layout>
        {/* Main Content */}
        <Content className="flex flex-col">
          {/* Video Player */}
          <div className="bg-black relative" style={{ paddingTop: '56.25%' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {currentLesson.type === 'video' ? (
                <>
                  {/* Mock Video Player */}
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10"
                      style={{ backgroundImage: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    <div className="relative z-10 text-center">
                      <Button
                        type="text"
                        icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white"
                        style={{ fontSize: 72 }}
                      />
                      <div className="mt-3">
                        <Text className="text-gray-300 text-sm">{currentLesson.title}</Text>
                      </div>
                    </div>

                    {/* Video Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 px-4 py-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer relative group">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: isPlaying ? '35%' : '0%', transition: 'width 0.3s' }} />
                          <div className="absolute -top-1 bg-blue-500 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100" style={{ left: isPlaying ? '35%' : '0%' }} />
                        </div>
                        <span className="text-gray-400 text-xs flex-shrink-0">{currentLesson.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button size="small" type="text" icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={() => setIsPlaying(!isPlaying)} className="text-white p-0" />
                          <Button size="small" type="text" icon={<SoundOutlined />} className="text-white p-0" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="small" type="text" icon={<SettingOutlined />} className="text-gray-300 p-0" />
                          <Button size="small" type="text" icon={<FullscreenOutlined />} className="text-gray-300 p-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : currentLesson.type === 'quiz' ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="text-center p-8 max-w-lg">
                    <QuestionCircleOutlined className="text-orange-400 text-6xl mb-4" />
                    <Title level={3} className="text-white mb-2">Bài Kiểm Tra</Title>
                    <Text className="text-gray-400 block mb-6">{currentLesson.title}</Text>
                    <Button type="primary" size="large">Bắt Đầu Làm Bài</Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileTextOutlined className="text-blue-400 text-6xl mb-4" />
                    <Title level={3} className="text-white mb-2">Tài Liệu Học Tập</Title>
                    <Text className="text-gray-400 block mb-6">{currentLesson.title}</Text>
                    <Button type="primary" size="large" icon={<DownloadOutlined />}>Tải Tài Liệu</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lesson Nav + Actions */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Button
                icon={<ArrowLeftOutlined />}
                disabled={!prevLesson}
                onClick={() => prevLesson && setCurrentLessonId(prevLesson.id)}
                className="border-gray-600 text-gray-300"
              >
                <span className="hidden sm:inline">Bài Trước</span>
              </Button>
              <Button
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                disabled={!nextLesson}
                onClick={() => nextLesson && setCurrentLessonId(nextLesson.id)}
                className="border-gray-600 text-gray-300"
              >
                <span className="hidden sm:inline">Bài Tiếp</span>
              </Button>
            </div>

            <div className="text-center hidden md:block">
              <Text className="text-gray-300 text-sm font-medium line-clamp-1">{currentLesson.title}</Text>
              <Text className="text-gray-500 text-xs">
                Bài {currentIndex + 1} / {totalLessons} • {currentLesson.duration}
              </Text>
            </div>

            <Button
              type="primary"
              icon={completedLessons.includes(currentLessonId) ? <CheckOutlined /> : <CheckCircleOutlined />}
              onClick={markComplete}
              className={completedLessons.includes(currentLessonId) ? 'bg-green-600 border-green-600' : ''}
            >
              {completedLessons.includes(currentLessonId) ? 'Đã Hoàn Thành' : 'Đánh Dấu Hoàn Thành'}
            </Button>
          </div>

          {/* Info Tabs */}
          <div className="bg-white flex-1">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="px-6"
              items={[
                {
                  key: 'overview',
                  label: <span><BookOutlined /> Tổng Quan</span>,
                  children: (
                    <div className="py-4 max-w-3xl">
                      <Title level={4}>{currentLesson.title}</Title>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <span><ClockCircleOutlined className="mr-1" />{currentLesson.duration}</span>
                        <span><PlayCircleOutlined className="mr-1" />Video HD</span>
                        <span><DownloadOutlined className="mr-1" />Tài nguyên đính kèm</span>
                      </div>
                      <Paragraph className="text-gray-700 leading-relaxed">
                        Trong bài học này, bạn sẽ tìm hiểu các khái niệm quan trọng và cách áp dụng chúng vào thực tế.
                        Giảng viên sẽ hướng dẫn từng bước từ cơ bản đến nâng cao, kèm theo các ví dụ thực tế và bài tập củng cố kiến thức.
                      </Paragraph>
                      <Divider />
                      <Title level={5}>Bạn Sẽ Học Được</Title>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {['Nắm vững kiến thức nền tảng', 'Áp dụng vào dự án thực tế', 'Debug và xử lý lỗi hiệu quả', 'Best practices trong phát triển'].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircleOutlined className="text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      <Divider />
                      <div className="flex items-center gap-4">
                        <Avatar src={course.instructorAvatar} size={48} />
                        <div>
                          <Text strong className="block">{course.instructor}</Text>
                          <Text className="text-gray-500 text-sm">Giảng viên khóa học</Text>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'qa',
                  label: <span><MessageOutlined /> Hỏi & Đáp <Badge count={mockQA.length} size="small" /></span>,
                  children: (
                    <div className="py-4 max-w-3xl">
                      <Card className="mb-4 border-blue-100 bg-blue-50 rounded-xl">
                        <Title level={5} className="mb-3"><QuestionCircleOutlined className="mr-2 text-blue-500" />Đặt Câu Hỏi</Title>
                        <TextArea
                          rows={3}
                          placeholder="Nhập câu hỏi của bạn..."
                          value={qaQuestion}
                          onChange={e => setQaQuestion(e.target.value)}
                          className="mb-3"
                        />
                        <Button type="primary" onClick={() => { message.success('Đã gửi câu hỏi!'); setQaQuestion(''); }}>
                          Gửi Câu Hỏi
                        </Button>
                      </Card>

                      <div className="space-y-4">
                        {mockQA.map(qa => (
                          <Card key={qa.id} className="rounded-xl border-gray-100">
                            <div className="flex gap-3 mb-3">
                              <Avatar src={qa.avatar} size={36} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Text strong className="text-sm">{qa.user}</Text>
                                  <Text className="text-gray-400 text-xs">{qa.time}</Text>
                                  <Tag color="blue" className="text-xs ml-auto">{qa.upvotes} votes</Tag>
                                </div>
                                <Text className="text-gray-800 text-sm">{qa.question}</Text>
                              </div>
                            </div>
                            {qa.answer && (
                              <div className="ml-12 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                <div className="flex items-center gap-2 mb-1">
                                  <Avatar src={course.instructorAvatar} size={24} />
                                  <Text strong className="text-xs text-green-700">{course.instructor} (Giảng viên)</Text>
                                </div>
                                <Text className="text-gray-700 text-sm">{qa.answer}</Text>
                              </div>
                            )}
                            {!qa.answer && (
                              <div className="ml-12 text-xs text-gray-400 italic">Chưa có câu trả lời</div>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'notes',
                  label: <span><BulbOutlined /> Ghi Chú</span>,
                  children: (
                    <div className="py-4 max-w-3xl">
                      <Card className="mb-4 rounded-xl border-yellow-100 bg-yellow-50">
                        <Title level={5} className="mb-3"><BulbOutlined className="mr-2 text-yellow-500" />Thêm Ghi Chú</Title>
                        <TextArea
                          rows={3}
                          placeholder="Ghi lại điều quan trọng..."
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          className="mb-3"
                        />
                        <Button type="primary" onClick={addNote}>Lưu Ghi Chú</Button>
                      </Card>

                      <div className="space-y-3">
                        {notes.map(note => (
                          <Card key={note.id} size="small" className="rounded-xl" styles={{ body: { background: note.color } }}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <Tag color="blue" className="mb-2">Bài {allLessons.findIndex(l => l.id === note.lessonId) + 1} • {note.timestamp}</Tag>
                                <Text className="text-gray-800 text-sm block">{note.content}</Text>
                              </div>
                              <Button
                                size="small"
                                danger
                                type="text"
                                onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
                              >✕</Button>
                            </div>
                          </Card>
                        ))}
                        {notes.length === 0 && (
                          <div className="text-center py-8 text-gray-400">
                            <BulbOutlined className="text-4xl mb-2 block" />
                            Chưa có ghi chú nào
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'review',
                  label: <span><StarOutlined /> Đánh Giá</span>,
                  children: (
                    <div className="py-4 max-w-xl">
                      <Card className="rounded-xl border-gray-100">
                        <Title level={5} className="mb-4">Đánh Giá Khóa Học</Title>
                        <div className="text-center mb-6">
                          <Rate value={rating} onChange={setRating} className="text-3xl" />
                          <div className="mt-2">
                            <Text className="text-gray-500 text-sm">
                              {['', 'Rất tệ', 'Không tốt', 'Bình thường', 'Tốt', 'Tuyệt vời'][rating] || 'Chọn số sao'}
                            </Text>
                          </div>
                        </div>
                        <TextArea
                          rows={4}
                          placeholder="Chia sẻ trải nghiệm học tập của bạn..."
                          value={reviewText}
                          onChange={e => setReviewText(e.target.value)}
                          className="mb-4"
                        />
                        <Button
                          type="primary"
                          size="large"
                          block
                          onClick={() => { message.success('Cảm ơn đánh giá của bạn!'); setRating(0); setReviewText(''); }}
                        >
                          Gửi Đánh Giá
                        </Button>
                      </Card>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </Content>

        {/* Right Sidebar - Curriculum */}
        <Sider
          width={340}
          collapsed={siderCollapsed}
          collapsedWidth={0}
          className="bg-white border-l border-gray-200 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 56px)', position: 'sticky', top: 56 }}
        >
          {/* Progress Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-2">
              <Text strong className="text-sm">Tiến Độ Khóa Học</Text>
              <Tag color="blue">{progressPercent}%</Tag>
            </div>
            <Progress
              percent={progressPercent}
              strokeColor="#1d4ed8"
              trailColor="#e5e7eb"
              size="small"
              showInfo={false}
            />
            <Text className="text-gray-500 text-xs mt-1 block">
              {completedCount} / {totalLessons} bài học hoàn thành
            </Text>
          </div>

          {/* Curriculum List */}
          <Collapse
            defaultActiveKey={[String(currentChapterId)]}
            ghost
            className="border-0"
            items={curriculum.map(chapter => ({
              key: String(chapter.id),
              label: (
                <div className="flex items-center justify-between w-full pr-2">
                  <Text strong className="text-sm text-gray-800 line-clamp-1">{chapter.title}</Text>
                  <Text className="text-gray-400 text-xs flex-shrink-0 ml-2">
                    {chapter.lessons.filter(l => completedLessons.includes(l.id)).length}/{chapter.lessons.length}
                  </Text>
                </div>
              ),
              children: (
                <div className="divide-y divide-gray-50">
                  {chapter.lessons.map(lesson => {
                    const isActive = lesson.id === currentLessonId;
                    const isDone = completedLessons.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => { setCurrentLessonId(lesson.id); setIsPlaying(false); }}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                          ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isDone
                            ? <CheckCircleOutlined className="text-green-500" />
                            : lessonTypeIcon(lesson.type)
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <Text
                            className={`text-sm block line-clamp-2 ${isActive ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
                          >
                            {lesson.title}
                          </Text>
                          <div className="flex items-center gap-2 mt-1">
                            <Text className="text-gray-400 text-xs">{lesson.duration}</Text>
                            {lesson.free && <Tag color="green" className="text-xs m-0 px-1">Miễn phí</Tag>}
                            {isDone && <Tag color="success" className="text-xs m-0 px-1">Xong</Tag>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
            }))}
          />
        </Sider>
      </Layout>

      {/* Notes Drawer */}
      <Drawer
        title={<span><BulbOutlined className="mr-2 text-yellow-500" />Ghi Chú Của Tôi</span>}
        open={noteDrawer}
        onClose={() => setNoteDrawer(false)}
        width={400}
        extra={<Tag color="blue">{notes.length} ghi chú</Tag>}
      >
        <div className="mb-4">
          <TextArea
            rows={3}
            placeholder="Thêm ghi chú mới..."
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            className="mb-2"
          />
          <Button type="primary" block onClick={addNote}>Lưu Ghi Chú</Button>
        </div>
        <Divider />
        <div className="space-y-3">
          {notes.map(note => (
            <Card key={note.id} size="small" className="rounded-xl" styles={{ body: { background: note.color } }}>
              <Tag color="blue" className="mb-2">Bài {allLessons.findIndex(l => l.id === note.lessonId) + 1} • {note.timestamp}</Tag>
              <Text className="text-gray-800 text-sm block">{note.content}</Text>
            </Card>
          ))}
          {notes.length === 0 && <div className="text-center text-gray-400 py-8">Chưa có ghi chú nào</div>}
        </div>
      </Drawer>
    </Layout>
  );
}
