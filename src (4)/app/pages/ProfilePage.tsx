import { useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  Row, Col, Card, Avatar, Button, Input, Form, Tabs, Tag, Progress,
  Typography, Statistic, Upload, Badge, List, Rate, message,
} from 'antd';
import {
  UserOutlined, EditOutlined, CameraOutlined, TrophyOutlined,
  BookOutlined, StarOutlined, GiftOutlined, LockOutlined,
  EnvironmentOutlined, MailOutlined, PhoneOutlined, CalendarOutlined,
  PlusOutlined, DeleteOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { courses, orders, formatPrice } from '../data/mockData';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text } = Typography;

const addresses = [
  { id: 1, name: 'Nhà', address: '123 Nguyễn Huệ, P. Bến Nghé, Q. 1, TP.HCM', phone: '0909 123 456', default: true },
  { id: 2, name: 'Văn phòng', address: '456 Lê Lợi, P. Bến Thành, Q. 1, TP.HCM', phone: '0909 123 456', default: false },
];

const loyaltyPoints = 2850;
const loyaltyTier = 'Gold';

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const enrolledCourses = courses.slice(0, 5).map(c => ({
    ...c,
    progress: Math.floor(Math.random() * 100),
    completedLessons: Math.floor(Math.random() * 50),
  }));

  const tierConfig = {
    Bronze: { color: '#cd7f32', next: 'Silver', pointsNeeded: 1000 },
    Silver: { color: '#c0c0c0', next: 'Gold', pointsNeeded: 2000 },
    Gold: { color: '#ffd700', next: 'Platinum', pointsNeeded: 5000 },
    Platinum: { color: '#e5e4e2', next: null, pointsNeeded: null },
  };
  const tier = tierConfig[loyaltyTier as keyof typeof tierConfig];

  return (
    <MainLayout>
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative">
              <Avatar
                src="https://i.pravatar.cc/150?img=10"
                size={100}
                className="border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-md">
                <CameraOutlined className="text-xs" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <Title level={3} className="text-white mb-1">Nguyễn Văn An</Title>
              <Text className="text-blue-100 block">an.nguyen@example.com</Text>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <Tag color="gold" className="flex items-center gap-1">
                  <TrophyOutlined /> {loyaltyTier} Member
                </Tag>
                <Tag color="blue">{loyaltyPoints.toLocaleString()} điểm</Tag>
                <Tag color="green">{enrolledCourses.length} khóa đang học</Tag>
              </div>
            </div>
            <div className="sm:ml-auto">
              <Button
                type="default"
                icon={<EditOutlined />}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => setEditing(!editing)}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          {/* Stats */}
          <Col xs={24}>
            <Row gutter={[16, 16]}>
              {[
                { title: 'Khóa học đang học', value: 5, icon: <BookOutlined className="text-blue-500" />, color: 'bg-blue-50' },
                { title: 'Khóa học hoàn thành', value: 3, icon: <CheckCircleOutlined className="text-green-500" />, color: 'bg-green-50' },
                { title: 'Điểm tích lũy', value: loyaltyPoints, icon: <GiftOutlined className="text-yellow-500" />, color: 'bg-yellow-50' },
                { title: 'Chứng chỉ đạt được', value: 3, icon: <TrophyOutlined className="text-purple-500" />, color: 'bg-purple-50' },
              ].map((s, i) => (
                <Col xs={12} md={6} key={i}>
                  <Card className={`${s.color} border-0 rounded-xl`}>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{s.icon}</div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
                        <div className="text-gray-500 text-xs">{s.title}</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Tabs */}
          <Col xs={24}>
            <Card className="rounded-xl border-gray-100 shadow-sm">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                  {
                    key: 'info',
                    label: <span><UserOutlined /> Thông Tin</span>,
                    children: (
                      <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                          fullName: 'Nguyễn Văn An',
                          email: 'an.nguyen@example.com',
                          phone: '0909 123 456',
                          dob: '01/01/1995',
                          address: 'TP. Hồ Chí Minh',
                          bio: 'Lập trình viên đam mê học hỏi công nghệ mới.',
                        }}
                      >
                        <Row gutter={[16, 0]}>
                          <Col xs={24} md={12}>
                            <Form.Item name="fullName" label="Họ và tên">
                              <Input prefix={<UserOutlined />} disabled={!editing} size="large" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item name="email" label="Email">
                              <Input prefix={<MailOutlined />} disabled size="large" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item name="phone" label="Số điện thoại">
                              <Input prefix={<PhoneOutlined />} disabled={!editing} size="large" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item name="dob" label="Ngày sinh">
                              <Input prefix={<CalendarOutlined />} disabled={!editing} size="large" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item name="address" label="Địa chỉ">
                              <Input prefix={<EnvironmentOutlined />} disabled={!editing} size="large" />
                            </Form.Item>
                          </Col>
                          <Col xs={24}>
                            <Form.Item name="bio" label="Giới thiệu bản thân">
                              <Input.TextArea disabled={!editing} rows={3} />
                            </Form.Item>
                          </Col>
                        </Row>
                        {editing && (
                          <div className="flex gap-3">
                            <Button type="primary" onClick={() => { setEditing(false); message.success('Cập nhật thành công!'); }}>
                              Lưu thay đổi
                            </Button>
                            <Button onClick={() => setEditing(false)}>Hủy</Button>
                          </div>
                        )}
                      </Form>
                    ),
                  },
                  {
                    key: 'courses',
                    label: <span><BookOutlined /> Khóa Học Của Tôi</span>,
                    children: (
                      <div className="space-y-4">
                        {enrolledCourses.map(course => (
                          <div key={course.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                            <img src={course.thumbnail} alt={course.title} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 mb-1 line-clamp-1">{course.title}</div>
                              <div className="text-gray-500 text-sm mb-2">{course.instructor}</div>
                              <div className="flex items-center gap-2">
                                <Progress percent={course.progress} size="small" className="flex-1 mb-0" />
                                <span className="text-xs text-gray-500 flex-shrink-0">{course.progress}%</span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">{course.completedLessons}/{course.lessons} bài học</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {course.progress === 100 ? (
                                <Tag color="green"><CheckCircleOutlined /> Hoàn thành</Tag>
                              ) : (
                                <Tag color="blue">Đang học</Tag>
                              )}
                              <Button size="small" type="primary">Tiếp tục</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: 'addresses',
                    label: <span><EnvironmentOutlined /> Địa Chỉ</span>,
                    children: (
                      <div>
                        <div className="space-y-3 mb-4">
                          {addresses.map(addr => (
                            <div key={addr.id} className={`p-4 rounded-xl border-2 ${addr.default ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">{addr.name}</span>
                                    {addr.default && <Tag color="blue">Mặc định</Tag>}
                                  </div>
                                  <div className="text-gray-600 text-sm">{addr.address}</div>
                                  <div className="text-gray-500 text-sm mt-1">{addr.phone}</div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="small" icon={<EditOutlined />} />
                                  <Button size="small" danger icon={<DeleteOutlined />} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button type="dashed" block icon={<PlusOutlined />}>
                          Thêm địa chỉ mới
                        </Button>
                      </div>
                    ),
                  },
                  {
                    key: 'loyalty',
                    label: <span><GiftOutlined /> Điểm Thưởng</span>,
                    children: (
                      <div>
                        <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 border-0 rounded-xl mb-6">
                          <div className="flex justify-between items-center text-white">
                            <div>
                              <div className="text-3xl font-bold">{loyaltyPoints.toLocaleString()}</div>
                              <div className="text-yellow-100">điểm tích lũy</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold flex items-center gap-1">
                                <TrophyOutlined /> {loyaltyTier}
                              </div>
                              <div className="text-yellow-100 text-sm">Thành viên hạng vàng</div>
                            </div>
                          </div>
                          {tier.next && tier.pointsNeeded && (
                            <div className="mt-4">
                              <div className="text-yellow-100 text-sm mb-1">
                                Cần thêm {(tier.pointsNeeded - loyaltyPoints).toLocaleString()} điểm để lên hạng {tier.next}
                              </div>
                              <Progress
                                percent={Math.round((loyaltyPoints / tier.pointsNeeded) * 100)}
                                strokeColor="white"
                                railColor="rgba(255,255,255,0.3)"
                                showInfo={false}
                                className="mb-0"
                              />
                            </div>
                          )}
                        </Card>

                        <Title level={5} className="mb-3">Đổi Điểm</Title>
                        <Row gutter={[12, 12]}>
                          {[
                            { points: 500, reward: 'Giảm 50.000đ cho đơn hàng tiếp theo' },
                            { points: 1000, reward: 'Giảm 120.000đ cho đơn hàng tiếp theo' },
                            { points: 2000, reward: 'Khóa học miễn phí (dưới 300.000đ)' },
                            { points: 5000, reward: 'Khóa học VIP miễn phí (dưới 1.000.000đ)' },
                          ].map((r, i) => (
                            <Col xs={24} sm={12} key={i}>
                              <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">{r.reward}</div>
                                  <div className="text-yellow-600 text-sm">{r.points.toLocaleString()} điểm</div>
                                </div>
                                <Button
                                  type="primary"
                                  size="small"
                                  disabled={loyaltyPoints < r.points}
                                  onClick={() => message.success('Đổi thành công!')}
                                >
                                  Đổi
                                </Button>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    ),
                  },
                  {
                    key: 'password',
                    label: <span><LockOutlined /> Bảo Mật</span>,
                    children: (
                      <div className="max-w-md">
                        <Title level={5} className="mb-4">Đổi Mật Khẩu</Title>
                        <Form layout="vertical">
                          <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}>
                            <Input.Password prefix={<LockOutlined />} size="large" placeholder="Nhập mật khẩu hiện tại" />
                          </Form.Item>
                          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 8 }]}>
                            <Input.Password prefix={<LockOutlined />} size="large" placeholder="Tối thiểu 8 ký tự" />
                          </Form.Item>
                          <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" rules={[{ required: true }]}>
                            <Input.Password prefix={<LockOutlined />} size="large" placeholder="Nhập lại mật khẩu mới" />
                          </Form.Item>
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => message.success('Đổi mật khẩu thành công!')}
                          >
                            Đổi Mật Khẩu
                          </Button>
                        </Form>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}

