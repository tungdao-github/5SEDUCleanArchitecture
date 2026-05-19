import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Row, Col, Card, Button, Select, Tag, Rate, Typography, Divider,
  message, Empty, Table,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, ShoppingCartOutlined, CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { courses, formatPrice } from '../data/mockData';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text } = Typography;
const { Option } = Select;

const compareFields = [
  { label: 'Giảng Viên', key: 'instructor' },
  { label: 'Danh Mục', key: 'category' },
  { label: 'Trình Độ', key: 'level' },
  { label: 'Thời Lượng', key: 'duration' },
  { label: 'Số Bài Học', key: 'lessons', suffix: ' bài' },
  { label: 'Ngôn Ngữ', key: 'language' },
  { label: 'Học Viên', key: 'students', format: (v: number) => v.toLocaleString() },
  { label: 'Lượt Đánh Giá', key: 'ratingCount', format: (v: number) => v.toLocaleString() },
];

export default function ComparisonPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(courses.slice(0, 2).map(c => c.id));

  const selectedCourses = selected.map(id => courses.find(c => c.id === id)!).filter(Boolean);

  const addCourse = (id: number) => {
    if (selected.includes(id)) { message.warning('Khóa học đã có trong so sánh'); return; }
    if (selected.length >= 4) { message.warning('Chỉ so sánh tối đa 4 khóa học'); return; }
    setSelected(prev => [...prev, id]);
  };

  const removeCourse = (id: number) => setSelected(prev => prev.filter(i => i !== id));

  const getBest = (key: string) => {
    if (key === 'rating') return Math.max(...selectedCourses.map(c => c.rating));
    if (key === 'students') return Math.max(...selectedCourses.map(c => c.students));
    if (key === 'price') return Math.min(...selectedCourses.map(c => c.price));
    return null;
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Title level={2} className="text-white mb-2">📊 So Sánh Khóa Học</Title>
          <Text className="text-teal-100">So sánh chi tiết các khóa học để chọn được khóa phù hợp nhất</Text>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add course selector */}
        <Card className="rounded-xl border-gray-100 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <Text className="font-medium">Thêm khóa học để so sánh:</Text>
            <Select
              showSearch
              placeholder="Chọn khóa học..."
              style={{ width: 320 }}
              filterOption={(input, option) => (option?.children as string).toLowerCase().includes(input.toLowerCase())}
              onSelect={(id: number) => addCourse(id)}
              value={undefined}
            >
              {courses.filter(c => !selected.includes(c.id)).map(c => (
                <Option key={c.id} value={c.id}>{c.title}</Option>
              ))}
            </Select>
            <Text className="text-gray-400 text-sm">
              {selected.length}/4 khóa học
            </Text>
          </div>
        </Card>

        {selected.length < 2 ? (
          <Empty description="Vui lòng thêm ít nhất 2 khóa học để so sánh" />
        ) : (
          <div className="overflow-x-auto">
            {/* Course headers */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
              <div />
              {selectedCourses.map(course => (
                <Card key={course.id} className="rounded-xl border-blue-200 bg-blue-50">
                  <div className="relative">
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                    >
                      <DeleteOutlined />
                    </button>
                    <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{course.title}</h3>
                    <Rate disabled defaultValue={course.rating} className="text-xs" allowHalf />
                    <div className="text-lg font-bold text-blue-600 mt-2">{formatPrice(course.price)}</div>
                    {course.originalPrice > course.price && (
                      <div className="text-gray-400 line-through text-xs">{formatPrice(course.originalPrice)}</div>
                    )}
                    <Button
                      type="primary"
                      block
                      size="small"
                      icon={<ShoppingCartOutlined />}
                      className="mt-3"
                      onClick={() => { message.success('Đã thêm vào giỏ!'); navigate('/cart'); }}
                    >
                      Thêm Giỏ Hàng
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Comparison table */}
            <Card className="rounded-xl border-gray-100">
              {/* Rating row */}
              <div className="grid gap-4 py-4 border-b border-gray-100" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
                <div className="font-medium text-gray-700">⭐ Đánh Giá</div>
                {selectedCourses.map(course => (
                  <div key={course.id} className={`text-center ${getBest('rating') === course.rating ? 'font-bold text-green-600' : ''}`}>
                    <span className="text-xl font-bold">{course.rating}</span>
                    <Rate disabled defaultValue={course.rating} className="text-xs block" allowHalf />
                    <span className="text-xs text-gray-400">({course.ratingCount.toLocaleString()} đánh giá)</span>
                  </div>
                ))}
              </div>

              {/* Price row */}
              <div className="grid gap-4 py-4 border-b border-gray-100" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
                <div className="font-medium text-gray-700">💰 Giá</div>
                {selectedCourses.map(course => (
                  <div key={course.id} className="text-center">
                    <span className={`text-lg font-bold ${getBest('price') === course.price ? 'text-green-600' : 'text-blue-600'}`}>
                      {formatPrice(course.price)}
                    </span>
                    {getBest('price') === course.price && <Tag color="green" className="block mt-1 mx-auto w-fit">Rẻ nhất</Tag>}
                  </div>
                ))}
              </div>

              {/* Other fields */}
              {compareFields.map((field, fi) => (
                <div key={field.key} className={`grid gap-4 py-4 ${fi < compareFields.length - 1 ? 'border-b border-gray-100' : ''}`} style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
                  <div className="font-medium text-gray-700">{field.label}</div>
                  {selectedCourses.map(course => {
                    const val = (course as any)[field.key];
                    return (
                      <div key={course.id} className="text-center text-gray-700 text-sm">
                        {field.format ? field.format(val) : val}{field.suffix || ''}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Tags row */}
              <div className="grid gap-4 py-4" style={{ gridTemplateColumns: `200px repeat(${selectedCourses.length}, 1fr)` }}>
                <div className="font-medium text-gray-700">🏷️ Tags</div>
                {selectedCourses.map(course => (
                  <div key={course.id} className="flex flex-wrap gap-1 justify-center">
                    {course.tags.map(tag => <Tag key={tag} className="text-xs">{tag}</Tag>)}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
