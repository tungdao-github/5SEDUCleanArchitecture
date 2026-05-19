import { useState } from 'react';
import {
  Card, Table, Tag, Avatar, Select, Input, Typography, Row, Col,
  Timeline, Modal, Button, DatePicker, Badge, Space,
} from 'antd';
import {
  SearchOutlined, FilterOutlined, EyeOutlined,
  UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
  SettingOutlined, ShoppingCartOutlined, LoginOutlined,
  WarningOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

type ActionType = 'create' | 'update' | 'delete' | 'login' | 'setting' | 'order' | 'warning';

interface LogEntry {
  id: number;
  user: string;
  avatar: string;
  role: string;
  action: string;
  target: string;
  type: ActionType;
  ip: string;
  device: string;
  time: string;
  details: string;
}

const typeConfig: Record<ActionType, { color: string; label: string; icon: React.ReactNode }> = {
  create: { color: 'green', label: 'Tạo mới', icon: <PlusOutlined /> },
  update: { color: 'blue', label: 'Cập nhật', icon: <EditOutlined /> },
  delete: { color: 'red', label: 'Xóa', icon: <DeleteOutlined /> },
  login: { color: 'cyan', label: 'Đăng nhập', icon: <LoginOutlined /> },
  setting: { color: 'purple', label: 'Cài đặt', icon: <SettingOutlined /> },
  order: { color: 'orange', label: 'Đơn hàng', icon: <ShoppingCartOutlined /> },
  warning: { color: 'gold', label: 'Cảnh báo', icon: <WarningOutlined /> },
};

const mockLogs: LogEntry[] = [
  { id: 1, user: 'Nguyễn Admin', avatar: 'https://i.pravatar.cc/40?img=1', role: 'Super Admin', action: 'Thêm khóa học mới "Python Advanced"', target: 'Khóa học #248', type: 'create', ip: '192.168.1.100', device: 'Chrome / Windows', time: '17/05/2025 14:32:15', details: 'Khóa học mới được tạo với giá 699,000đ, danh mục Lập Trình' },
  { id: 2, user: 'Trần Manager', avatar: 'https://i.pravatar.cc/40?img=2', role: 'Admin', action: 'Cập nhật trạng thái đơn hàng #ORD-2025-012', target: 'Đơn hàng ORD-2025-012', type: 'order', ip: '192.168.1.101', device: 'Firefox / Mac', time: '17/05/2025 13:55:42', details: 'Chuyển trạng thái từ "Đang xử lý" sang "Đã giao"' },
  { id: 3, user: 'Lê Moderator', avatar: 'https://i.pravatar.cc/40?img=3', role: 'Moderator', action: 'Xóa bình luận spam #CM-5678', target: 'Bình luận #5678', type: 'delete', ip: '10.0.0.55', device: 'Safari / iPhone', time: '17/05/2025 13:22:10', details: 'Bình luận vi phạm chính sách nội dung' },
  { id: 4, user: 'Nguyễn Admin', avatar: 'https://i.pravatar.cc/40?img=1', role: 'Super Admin', action: 'Thêm mã giảm giá SUMMER30', target: 'Mã giảm giá', type: 'create', ip: '192.168.1.100', device: 'Chrome / Windows', time: '17/05/2025 12:45:00', details: 'Mã giảm giá 30%, giới hạn 100 lượt, hết hạn 31/08/2025' },
  { id: 5, user: 'Nguyễn Admin', avatar: 'https://i.pravatar.cc/40?img=1', role: 'Super Admin', action: 'Cập nhật cấu hình SEO trang chủ', target: 'Cài đặt SEO', type: 'setting', ip: '192.168.1.100', device: 'Chrome / Windows', time: '17/05/2025 11:30:22', details: 'Cập nhật meta title và description cho trang chủ' },
  { id: 6, user: 'Phạm Editor', avatar: 'https://i.pravatar.cc/40?img=4', role: 'Admin', action: 'Đăng nhập vào hệ thống', target: 'Hệ thống', type: 'login', ip: '203.162.4.190', device: 'Edge / Windows', time: '17/05/2025 10:15:08', details: 'Đăng nhập thành công từ IP mới' },
  { id: 7, user: 'Trần Manager', avatar: 'https://i.pravatar.cc/40?img=2', role: 'Admin', action: 'Export báo cáo tháng 4/2025', target: 'Báo cáo', type: 'order', ip: '192.168.1.101', device: 'Firefox / Mac', time: '17/05/2025 09:50:33', details: 'Xuất file Excel báo cáo doanh thu tháng 4/2025' },
  { id: 8, user: 'Hệ thống', avatar: '', role: 'System', action: 'Phát hiện đăng nhập đáng ngờ', target: 'Tài khoản user123@email.com', type: 'warning', ip: '103.45.67.89', device: 'Unknown', time: '17/05/2025 08:30:00', details: '5 lần đăng nhập sai mật khẩu liên tiếp. Tài khoản bị khóa tạm thời.' },
  { id: 9, user: 'Nguyễn Admin', avatar: 'https://i.pravatar.cc/40?img=1', role: 'Super Admin', action: 'Xóa tài khoản người dùng spam', target: 'User #1892', type: 'delete', ip: '192.168.1.100', device: 'Chrome / Windows', time: '16/05/2025 18:22:45', details: 'Tài khoản vi phạm điều khoản sử dụng' },
  { id: 10, user: 'Lê Moderator', avatar: 'https://i.pravatar.cc/40?img=3', role: 'Moderator', action: 'Duyệt đánh giá khóa học', target: 'Đánh giá #R-2341', type: 'update', ip: '10.0.0.55', device: 'Safari / iPhone', time: '16/05/2025 16:10:00', details: 'Phê duyệt đánh giá 5 sao cho khóa học React TypeScript' },
  { id: 11, user: 'Phạm Editor', avatar: 'https://i.pravatar.cc/40?img=4', role: 'Admin', action: 'Cập nhật thông tin khóa học', target: 'Khóa học #12', type: 'update', ip: '203.162.4.190', device: 'Edge / Windows', time: '16/05/2025 15:40:18', details: 'Cập nhật mô tả và ảnh thumbnail' },
  { id: 12, user: 'Nguyễn Admin', avatar: 'https://i.pravatar.cc/40?img=1', role: 'Super Admin', action: 'Kích hoạt cổng thanh toán VNPay', target: 'Cài đặt thanh toán', type: 'setting', ip: '192.168.1.100', device: 'Chrome / Windows', time: '16/05/2025 14:00:00', details: 'Kích hoạt và cấu hình VNPay API' },
];

export default function ActivityLogPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  const filtered = mockLogs.filter(l =>
    (filterType === 'all' || l.type === filterType) &&
    (filterRole === 'all' || l.role === filterRole) &&
    (!search || l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()))
  );

  const columns = [
    {
      title: 'Người Dùng',
      key: 'user',
      render: (_: any, r: LogEntry) => (
        <div className="flex items-center gap-2">
          {r.avatar ? <Avatar src={r.avatar} size={32} /> : <Avatar icon={<SettingOutlined />} size={32} className="bg-gray-400" />}
          <div>
            <div className="font-medium text-sm text-gray-900">{r.user}</div>
            <Tag color={r.role === 'Super Admin' ? 'red' : r.role === 'Admin' ? 'purple' : r.role === 'Moderator' ? 'blue' : 'gray'} className="text-xs m-0">
              {r.role}
            </Tag>
          </div>
        </div>
      ),
      width: 180,
    },
    {
      title: 'Hoạt Động',
      key: 'action',
      render: (_: any, r: LogEntry) => (
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Tag color={typeConfig[r.type].color} icon={typeConfig[r.type].icon} className="text-xs">
              {typeConfig[r.type].label}
            </Tag>
          </div>
          <div className="text-sm text-gray-800">{r.action}</div>
          <div className="text-xs text-gray-400">{r.target}</div>
        </div>
      ),
    },
    {
      title: 'IP / Thiết Bị',
      key: 'device',
      render: (_: any, r: LogEntry) => (
        <div className="text-xs text-gray-500">
          <div className="font-mono">{r.ip}</div>
          <div>{r.device}</div>
        </div>
      ),
      width: 160,
    },
    {
      title: 'Thời Gian',
      dataIndex: 'time',
      key: 'time',
      render: (t: string) => <Text className="text-gray-500 text-xs">{t}</Text>,
      width: 140,
    },
    {
      title: 'Chi Tiết',
      key: 'detail',
      render: (_: any, r: LogEntry) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => setSelectedLog(r)} />
      ),
      width: 80,
    },
  ];

  const stats = {
    total: mockLogs.length,
    today: mockLogs.filter(l => l.time.includes('17/05/2025')).length,
    warnings: mockLogs.filter(l => l.type === 'warning').length,
    deletes: mockLogs.filter(l => l.type === 'delete').length,
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">🕐 Nhật Ký Hoạt Động</Title>
          <Text className="text-gray-500">Theo dõi mọi thay đổi trong hệ thống</Text>
        </div>
        <Space>
          <Button.Group>
            <Button type={viewMode === 'table' ? 'primary' : 'default'} onClick={() => setViewMode('table')}>Bảng</Button>
            <Button type={viewMode === 'timeline' ? 'primary' : 'default'} onClick={() => setViewMode('timeline')}>Timeline</Button>
          </Button.Group>
        </Space>
      </div>

      {/* Stats */}
      <Row gutter={[12, 12]} className="mb-6">
        {[
          { label: 'Tổng hoạt động', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Hôm nay', value: stats.today, color: 'bg-green-50 text-green-700' },
          { label: 'Cảnh báo', value: stats.warnings, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Xóa dữ liệu', value: stats.deletes, color: 'bg-red-50 text-red-700' },
        ].map((s, i) => (
          <Col span={6} key={i}>
            <div className={`${s.color} rounded-xl p-4 text-center`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm opacity-75">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card className="rounded-xl border-gray-100 mb-4">
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Tìm kiếm hoạt động..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          <Select value={filterType} onChange={setFilterType} style={{ width: 160 }}>
            <Option value="all">Tất cả loại</Option>
            {Object.entries(typeConfig).map(([key, val]) => (
              <Option key={key} value={key}>{val.label}</Option>
            ))}
          </Select>
          <Select value={filterRole} onChange={setFilterRole} style={{ width: 160 }}>
            <Option value="all">Tất cả vai trò</Option>
            <Option value="Super Admin">Super Admin</Option>
            <Option value="Admin">Admin</Option>
            <Option value="Moderator">Moderator</Option>
            <Option value="System">Hệ thống</Option>
          </Select>
          <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
        </div>
      </Card>

      {viewMode === 'table' ? (
        <Card className="rounded-xl border-gray-100">
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10, showTotal: total => `Tổng ${total} hoạt động` }}
            rowClassName={r => r.type === 'warning' ? 'bg-yellow-50' : r.type === 'delete' ? 'bg-red-50' : ''}
            size="middle"
          />
        </Card>
      ) : (
        <Card className="rounded-xl border-gray-100 p-6">
          <Timeline
            items={filtered.map(log => ({
              color: typeConfig[log.type].color === 'red' ? 'red' : typeConfig[log.type].color === 'green' ? 'green' : typeConfig[log.type].color === 'gold' ? 'orange' : 'blue',
              dot: typeConfig[log.type].icon,
              children: (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    {log.avatar ? <Avatar src={log.avatar} size={24} /> : <Avatar icon={<SettingOutlined />} size={24} className="bg-gray-400" />}
                    <Text strong className="text-sm">{log.user}</Text>
                    <Tag color={typeConfig[log.type].color} className="text-xs">{typeConfig[log.type].label}</Tag>
                    <Text className="text-gray-400 text-xs ml-auto">{log.time}</Text>
                  </div>
                  <div className="text-gray-800 text-sm">{log.action}</div>
                  <div className="text-gray-400 text-xs">{log.target} • {log.ip}</div>
                </div>
              ),
            }))}
          />
        </Card>
      )}

      {/* Detail Modal */}
      <Modal
        open={!!selectedLog}
        title="Chi Tiết Hoạt Động"
        onCancel={() => setSelectedLog(null)}
        footer={<Button onClick={() => setSelectedLog(null)}>Đóng</Button>}
        width={520}
      >
        {selectedLog && (
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {selectedLog.avatar ? <Avatar src={selectedLog.avatar} size={48} /> : <Avatar icon={<SettingOutlined />} size={48} className="bg-gray-400" />}
              <div>
                <div className="font-semibold">{selectedLog.user}</div>
                <Tag color={selectedLog.role === 'Super Admin' ? 'red' : 'purple'}>{selectedLog.role}</Tag>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><Text type="secondary">Loại hành động:</Text><br /><Tag color={typeConfig[selectedLog.type].color}>{typeConfig[selectedLog.type].label}</Tag></div>
              <div><Text type="secondary">Đối tượng:</Text><br /><Text strong>{selectedLog.target}</Text></div>
              <div><Text type="secondary">Địa chỉ IP:</Text><br /><Text className="font-mono">{selectedLog.ip}</Text></div>
              <div><Text type="secondary">Thiết bị:</Text><br /><Text>{selectedLog.device}</Text></div>
              <div className="col-span-2"><Text type="secondary">Thời gian:</Text><br /><Text>{selectedLog.time}</Text></div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Text type="secondary" className="text-xs block mb-1">Mô tả chi tiết:</Text>
              <Text className="text-sm">{selectedLog.details}</Text>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
