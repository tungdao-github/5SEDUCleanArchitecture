import { useState } from 'react';
import {
  Card, Row, Col, Table, Tag, Avatar, Progress, Select,
  Typography, Button, Badge,
} from 'antd';
import {
  ArrowUpOutlined, ArrowDownOutlined, UserOutlined, BookOutlined,
  ShoppingCartOutlined, DollarOutlined, EyeOutlined, StarOutlined,
  BarChartOutlined, RiseOutlined,
} from '@ant-design/icons';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { adminStats, courses, orders, formatPrice } from '../../data/mockData';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;

const COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1'];

export default function DashboardPage() {
  const [period, setPeriod] = useState('year');

  const recentOrders = orders.map(o => ({
    ...o,
    customer: `Khách hàng #${Math.floor(Math.random() * 9000 + 1000)}`,
    avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 50 + 1)}`,
  }));

  const orderColumns = [
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.avatar} size={32} />
          <span className="text-sm font-medium">{record.customer}</span>
        </div>
      ),
    },
    { title: 'Mã đơn', dataIndex: 'id', key: 'id', render: (id: string) => <span className="text-blue-600 font-mono text-xs">{id}</span> },
    { title: 'Ngày', dataIndex: 'date', key: 'date', render: (d: string) => <span className="text-sm text-gray-600">{d}</span> },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const config: Record<string, { color: string; label: string }> = {
          pending: { color: 'orange', label: 'Chờ xử lý' },
          processing: { color: 'blue', label: 'Đang xử lý' },
          shipping: { color: 'cyan', label: 'Đang giao' },
          delivered: { color: 'green', label: 'Hoàn thành' },
          cancelled: { color: 'red', label: 'Đã hủy' },
        };
        return <Tag color={config[s]?.color}>{config[s]?.label}</Tag>;
      },
    },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', render: (t: number) => <span className="font-bold text-blue-600">{formatPrice(t)}</span> },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">Dashboard Tổng Quan</Title>
          <Text className="text-gray-500">Chào mừng trở lại! Đây là tổng quan hệ thống.</Text>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
            <Option value="today">Hôm nay</Option>
            <Option value="week">7 ngày</Option>
            <Option value="month">30 ngày</Option>
            <Option value="year">Năm nay</Option>
          </Select>
          <Button type="primary">Xuất báo cáo</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {[
          {
            title: 'Tổng Doanh Thu',
            value: adminStats.totalRevenue,
            prefix: '₫',
            growth: adminStats.revenueGrowth,
            icon: <DollarOutlined className="text-blue-500 text-2xl" />,
            bg: 'bg-blue-50',
            format: (v: number) => (v / 1000000).toFixed(0) + 'M',
          },
          {
            title: 'Tổng Học Viên',
            value: adminStats.totalStudents,
            growth: adminStats.studentGrowth,
            icon: <UserOutlined className="text-purple-500 text-2xl" />,
            bg: 'bg-purple-50',
            format: (v: number) => v.toLocaleString(),
          },
          {
            title: 'Tổng Khóa Học',
            value: adminStats.totalCourses,
            growth: 8.5,
            icon: <BookOutlined className="text-green-500 text-2xl" />,
            bg: 'bg-green-50',
            format: (v: number) => v.toString(),
          },
          {
            title: 'Đơn Hàng Tháng Này',
            value: adminStats.totalOrders,
            growth: 12.3,
            icon: <ShoppingCartOutlined className="text-orange-500 text-2xl" />,
            bg: 'bg-orange-50',
            format: (v: number) => v.toLocaleString(),
          },
        ].map((kpi, i) => (
          <Col xs={12} lg={6} key={i}>
            <Card className={`${kpi.bg} border-0 rounded-xl`}>
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
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

      {/* Charts Row */}
      <Row gutter={[16, 16]} className="mb-6">
        {/* Revenue Chart */}
        <Col xs={24} lg={16}>
          <Card className="rounded-xl border-gray-100 h-full" title={
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">📈 Doanh Thu Theo Tháng</span>
              <Select defaultValue="revenue" size="small" style={{ width: 120 }}>
                <Option value="revenue">Doanh thu</Option>
                <Option value="orders">Đơn hàng</Option>
              </Select>
            </div>
          }>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={adminStats.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => formatPrice(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={2} fill="url(#colorRevenue)" name="Doanh thu" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Category pie chart */}
        <Col xs={24} lg={8}>
          <Card className="rounded-xl border-gray-100 h-full" title={<span className="font-bold text-gray-800">🥧 Doanh Thu Theo Danh Mục</span>}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={adminStats.categoryRevenue}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  nameKey="name"
                >
                  {adminStats.categoryRevenue.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {adminStats.categoryRevenue.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-sm">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Orders and Top Courses */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card
            className="rounded-xl border-gray-100"
            title={<span className="font-bold text-gray-800">📋 Đơn Hàng Gần Đây</span>}
            extra={<Button type="link" size="small">Xem tất cả</Button>}
          >
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            className="rounded-xl border-gray-100 h-full"
            title={<span className="font-bold text-gray-800">🏆 Top Khóa Học</span>}
          >
            <div className="space-y-4">
              {adminStats.topCourses.map((course, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-start gap-2">
                      <span className={`w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800 line-clamp-1">{course.title}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-7">
                    <Progress
                      percent={Math.round((course.students / adminStats.topCourses[0].students) * 100)}
                      size="small"
                      strokeColor={COLORS[i]}
                      showInfo={false}
                      className="flex-1 mb-0"
                    />
                    <span className="text-xs text-gray-500 flex-shrink-0">{course.students.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom row: orders bar chart and activity log */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card className="rounded-xl border-gray-100" title={<span className="font-bold text-gray-800">📊 So Sánh Doanh Thu & Đơn Hàng</span>}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={adminStats.monthlyRevenue.slice(6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#1890ff" name="Doanh thu (₫)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" fill="#52c41a" name="Đơn hàng" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="rounded-xl border-gray-100 h-full" title={<span className="font-bold text-gray-800">🕐 Nhật Ký Hoạt Động</span>}>
            <div className="space-y-3">
              {[
                { action: 'Thêm khóa học mới "Python Advanced"', user: 'Admin', time: '5 phút trước', color: 'bg-blue-100 text-blue-700' },
                { action: 'Cập nhật đơn hàng #ORD-2025-012', user: 'Manager', time: '12 phút trước', color: 'bg-green-100 text-green-700' },
                { action: 'Xóa bình luận spam', user: 'Moderator', time: '25 phút trước', color: 'bg-red-100 text-red-700' },
                { action: 'Thêm mã giảm giá SUMMER30', user: 'Admin', time: '1 giờ trước', color: 'bg-purple-100 text-purple-700' },
                { action: 'Cập nhật cấu hình SEO trang chủ', user: 'Admin', time: '2 giờ trước', color: 'bg-yellow-100 text-yellow-700' },
                { action: 'Export báo cáo tháng 4/2025', user: 'Manager', time: '3 giờ trước', color: 'bg-gray-100 text-gray-700' },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`px-2 py-0.5 rounded text-xs font-medium ${log.color} flex-shrink-0 mt-0.5`}>
                    {log.user}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 line-clamp-1">{log.action}</div>
                    <div className="text-xs text-gray-400">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
