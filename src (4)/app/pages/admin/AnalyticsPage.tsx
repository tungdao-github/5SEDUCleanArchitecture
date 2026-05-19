import { useState } from 'react';
import {
  Card, Row, Col, Select, Typography, Table, Tag, Avatar, Progress, Tabs,
  Statistic, DatePicker,
} from 'antd';
import {
  ArrowUpOutlined, ArrowDownOutlined, UserOutlined, BookOutlined,
  DollarOutlined, ShoppingCartOutlined, EyeOutlined, StarOutlined,
} from '@ant-design/icons';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList,
} from 'recharts';
import { adminStats, courses, formatPrice } from '../../data/mockData';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const COLORS = ['#1d4ed8', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

const studentGrowth = [
  { month: 'T1', new: 312, return: 180, total: 492 },
  { month: 'T2', new: 285, return: 210, total: 495 },
  { month: 'T3', new: 420, return: 250, total: 670 },
  { month: 'T4', new: 380, return: 290, total: 670 },
  { month: 'T5', new: 510, return: 320, total: 830 },
  { month: 'T6', new: 465, return: 340, total: 805 },
  { month: 'T7', new: 590, return: 380, total: 970 },
  { month: 'T8', new: 620, return: 410, total: 1030 },
  { month: 'T9', new: 540, return: 390, total: 930 },
  { month: 'T10', new: 680, return: 450, total: 1130 },
  { month: 'T11', new: 750, return: 480, total: 1230 },
  { month: 'T12', new: 820, return: 520, total: 1340 },
];

const conversionFunnel = [
  { name: 'Truy cập', value: 125000, fill: '#1d4ed8' },
  { name: 'Xem khóa học', value: 48000, fill: '#2563eb' },
  { name: 'Thêm giỏ hàng', value: 12500, fill: '#7c3aed' },
  { name: 'Bắt đầu checkout', value: 6800, fill: '#db2777' },
  { name: 'Hoàn thành', value: 4200, fill: '#16a34a' },
];

const deviceData = [
  { name: 'Desktop', value: 48 },
  { name: 'Mobile', value: 38 },
  { name: 'Tablet', value: 14 },
];

const topInstructors = [
  { name: 'Nguyễn Văn An', avatar: 'https://i.pravatar.cc/40?img=1', courses: 5, students: 12480, revenue: 312000000, rating: 4.9 },
  { name: 'Trần Thị Bình', avatar: 'https://i.pravatar.cc/40?img=2', courses: 3, students: 8920, revenue: 198000000, rating: 4.8 },
  { name: 'Lê Văn Cường', avatar: 'https://i.pravatar.cc/40?img=3', courses: 7, students: 7650, revenue: 145000000, rating: 4.7 },
  { name: 'Phạm Thị Dung', avatar: 'https://i.pravatar.cc/40?img=4', courses: 4, students: 6200, revenue: 128000000, rating: 4.6 },
  { name: 'Hoàng Minh Em', avatar: 'https://i.pravatar.cc/40?img=5', courses: 2, students: 4800, revenue: 96000000, rating: 4.5 },
];

const retentionData = [
  { week: 'Tuần 1', rate: 100 },
  { week: 'Tuần 2', rate: 78 },
  { week: 'Tuần 3', rate: 62 },
  { week: 'Tuần 4', rate: 51 },
  { week: 'Tuần 5', rate: 44 },
  { week: 'Tuần 6', rate: 38 },
  { week: 'Tuần 7', rate: 35 },
  { week: 'Tuần 8', rate: 33 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('year');
  const [tab, setTab] = useState('revenue');

  const kpis = [
    { title: 'Tổng Doanh Thu', value: adminStats.totalRevenue, format: (v: number) => `${(v / 1000000).toFixed(0)}M ₫`, growth: adminStats.revenueGrowth, icon: <DollarOutlined />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Tổng Học Viên', value: adminStats.totalStudents, format: (v: number) => v.toLocaleString(), growth: adminStats.studentGrowth, icon: <UserOutlined />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Tổng Đơn Hàng', value: adminStats.totalOrders, format: (v: number) => v.toLocaleString(), growth: 12.3, icon: <ShoppingCartOutlined />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Tỷ Lệ Chuyển Đổi', value: 3.36, format: (v: number) => `${v.toFixed(2)}%`, growth: 0.8, icon: <ArrowUpOutlined />, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const instructorColumns = [
    {
      title: '#', key: 'rank',
      render: (_: any, __: any, i: number) => (
        <div className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
          {i + 1}
        </div>
      ),
      width: 50,
    },
    {
      title: 'Giảng Viên', key: 'instructor',
      render: (_: any, r: any) => (
        <div className="flex items-center gap-2">
          <Avatar src={r.avatar} size={36} />
          <div>
            <div className="font-medium text-sm">{r.name}</div>
            <div className="text-gray-400 text-xs">{r.courses} khóa học</div>
          </div>
        </div>
      ),
    },
    { title: 'Học Viên', dataIndex: 'students', key: 'students', render: (v: number) => <span className="font-medium">{v.toLocaleString()}</span> },
    { title: 'Doanh Thu', dataIndex: 'revenue', key: 'revenue', render: (v: number) => <span className="font-bold text-blue-600">{formatPrice(v)}</span> },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (v: number) => (
        <div className="flex items-center gap-1">
          <StarOutlined className="text-yellow-400 text-xs" />
          <span className="font-medium text-sm">{v}</span>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">📊 Phân Tích & Báo Cáo</Title>
          <Text className="text-gray-500">Dữ liệu chi tiết về doanh thu, học viên và khóa học</Text>
        </div>
        <div className="flex gap-3">
          <RangePicker size="large" placeholder={['Từ ngày', 'Đến ngày']} className="rounded-xl" />
          <Select value={period} onChange={setPeriod} size="large" style={{ width: 130 }}>
            <Option value="today">Hôm nay</Option>
            <Option value="week">7 ngày</Option>
            <Option value="month">30 ngày</Option>
            <Option value="year">Năm nay</Option>
          </Select>
        </div>
      </div>

      {/* KPI Row */}
      <Row gutter={[16, 16]} className="mb-6">
        {kpis.map((kpi, i) => (
          <Col xs={12} lg={6} key={i}>
            <Card className={`${kpi.bg} border-0 rounded-xl`}>
              <div className="flex justify-between items-start mb-3">
                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm ${kpi.color} text-xl`}>
                  {kpi.icon}
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${kpi.growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(kpi.growth)}%
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.format(kpi.value)}</div>
              <div className="text-gray-500 text-sm">{kpi.title}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Tabs
        activeKey={tab}
        onChange={setTab}
        className="mb-6"
        items={[
          {
            key: 'revenue',
            label: '💰 Doanh Thu',
            children: (
              <div className="space-y-6">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={16}>
                    <Card className="rounded-xl border-gray-100" title={<span className="font-bold">📈 Doanh Thu Theo Tháng</span>}>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={adminStats.monthlyRevenue}>
                          <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v: number) => [formatPrice(v), 'Doanh thu']} />
                          <Area type="monotone" dataKey="revenue" stroke="#1d4ed8" strokeWidth={2} fill="url(#revGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card className="rounded-xl border-gray-100 h-full" title={<span className="font-bold">📱 Thiết Bị Truy Cập</span>}>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={deviceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}%`}>
                            {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => `${v}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>

                <Card className="rounded-xl border-gray-100" title={<span className="font-bold">🔽 Phễu Chuyển Đổi</span>}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} lg={12}>
                      {conversionFunnel.map((step, i) => (
                        <div key={i} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{step.name}</span>
                            <span className="text-sm text-gray-500">{step.value.toLocaleString()}</span>
                          </div>
                          <Progress
                            percent={Math.round((step.value / conversionFunnel[0].value) * 100)}
                            strokeColor={step.fill}
                            showInfo={false}
                            size="small"
                          />
                        </div>
                      ))}
                    </Col>
                    <Col xs={24} lg={12}>
                      <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tỷ lệ chuyển đổi tổng:</span>
                          <span className="font-bold text-green-600">3.36%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Doanh thu trung bình/đơn:</span>
                          <span className="font-bold text-blue-600">{formatPrice(adminStats.totalRevenue / adminStats.totalOrders)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Chi phí mỗi học viên mới:</span>
                          <span className="font-bold text-orange-600">85,000đ</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tỷ lệ hoàn tiền:</span>
                          <span className="font-bold text-red-500">1.2%</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </div>
            ),
          },
          {
            key: 'students',
            label: '👥 Học Viên',
            children: (
              <div className="space-y-6">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={16}>
                    <Card className="rounded-xl border-gray-100" title={<span className="font-bold">📊 Tăng Trưởng Học Viên</span>}>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={studentGrowth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="new" name="Học viên mới" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="return" name="Quay lại" fill="#16a34a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card className="rounded-xl border-gray-100 h-full" title={<span className="font-bold">🔄 Tỷ Lệ Giữ Chân</span>}>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={retentionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                          <Tooltip formatter={(v: number) => [`${v}%`, 'Tỷ lệ giữ chân']} />
                          <Line type="monotone" dataKey="rate" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed', r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>

                <Card className="rounded-xl border-gray-100" title={<span className="font-bold">🏆 Top Giảng Viên</span>}>
                  <Table
                    dataSource={topInstructors}
                    columns={instructorColumns}
                    rowKey="name"
                    pagination={false}
                    size="middle"
                  />
                </Card>
              </div>
            ),
          },
          {
            key: 'courses',
            label: '📚 Khóa Học',
            children: (
              <div className="space-y-6">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card className="rounded-xl border-gray-100" title={<span className="font-bold">🥇 Top Khóa Học</span>}>
                      {adminStats.topCourses.map((course, i) => (
                        <div key={i} className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                                {i + 1}
                              </div>
                              <span className="text-sm font-medium line-clamp-1">{course.title}</span>
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">{course.students.toLocaleString()} HV</span>
                          </div>
                          <Progress
                            percent={Math.round((course.students / adminStats.topCourses[0].students) * 100)}
                            strokeColor={COLORS[i]}
                            showInfo={false}
                            size="small"
                          />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card className="rounded-xl border-gray-100" title={<span className="font-bold">🥧 Doanh Thu Theo Danh Mục</span>}>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie data={adminStats.categoryRevenue} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name">
                            {adminStats.categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => `${v}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>

                <Card className="rounded-xl border-gray-100" title={<span className="font-bold">📈 Tỷ Lệ Hoàn Thành Khóa Học</span>}>
                  <Row gutter={[16, 8]}>
                    {courses.slice(0, 6).map((course, i) => (
                      <Col xs={24} md={12} key={course.id}>
                        <div className="flex items-center gap-3 py-2">
                          <img src={course.thumbnail} alt={course.title} className="w-10 h-8 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 line-clamp-1">{course.title}</div>
                            <div className="flex items-center gap-2">
                              <Progress percent={Math.floor(Math.random() * 40 + 45)} size="small" strokeColor={COLORS[i % COLORS.length]} showInfo={false} className="flex-1" />
                              <span className="text-xs text-gray-500 flex-shrink-0">{Math.floor(Math.random() * 40 + 45)}%</span>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </div>
            ),
          },
        ]}
      />
    </AdminLayout>
  );
}
