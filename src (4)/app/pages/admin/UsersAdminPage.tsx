import { useState } from 'react';
import {
  Table, Tag, Button, Input, Select, Card, Typography, Avatar, Space,
  Modal, Form, Row, Col, Switch, Popconfirm, message, Badge,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  UserOutlined, LockOutlined, MailOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;

const mockUsers = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Nam', 'Phạm Thị Lan', 'Hoàng Minh Tuấn'][i % 5],
  email: `user${i + 1}@example.com`,
  phone: `090${Math.floor(Math.random() * 9000000 + 1000000)}`,
  avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
  role: i === 0 ? 'Super Admin' : i < 3 ? 'Admin' : i < 6 ? 'Moderator' : 'Student',
  status: i % 7 === 0 ? 'banned' : 'active',
  courses: Math.floor(Math.random() * 20),
  points: Math.floor(Math.random() * 5000),
  joinDate: `${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}/${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}/2024`,
  lastLogin: '17/05/2025',
}));

const roleColors: Record<string, string> = {
  'Super Admin': 'red',
  'Admin': 'purple',
  'Moderator': 'blue',
  'Student': 'green',
};

export default function UsersAdminPage() {
  const [data, setData] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [form] = Form.useForm();

  const filtered = data.filter(u =>
    (filterRole === 'all' || u.role === filterRole) &&
    (filterStatus === 'all' || u.status === filterStatus) &&
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (user?: any) => {
    setEditUser(user || null);
    form.setFieldsValue(user || {});
    setModalOpen(true);
  };

  const toggleStatus = (id: number) => {
    setData(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
    message.success('Đã cập nhật trạng thái tài khoản');
  };

  const columns = [
    {
      title: 'Người Dùng',
      key: 'user',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <Badge dot status={record.status === 'active' ? 'success' : 'error'} offset={[-4, 28]}>
            <Avatar src={record.avatar} size={40} />
          </Badge>
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-gray-500 text-xs">{record.email}</div>
          </div>
        </div>
      ),
      width: 220,
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color={roleColors[role]}>{role}</Tag>,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: string, record: any) => (
        <Switch
          checked={s === 'active'}
          size="small"
          checkedChildren="Active"
          unCheckedChildren="Banned"
          onChange={() => toggleStatus(record.id)}
        />
      ),
    },
    {
      title: 'Khóa Học',
      dataIndex: 'courses',
      key: 'courses',
      render: (n: number) => <span className="font-medium">{n}</span>,
      sorter: (a: any, b: any) => a.courses - b.courses,
    },
    {
      title: 'Điểm Thưởng',
      dataIndex: 'points',
      key: 'points',
      render: (p: number) => <span className="text-yellow-600 font-medium">{p.toLocaleString()}</span>,
    },
    {
      title: 'Ngày Tham Gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (d: string) => <span className="text-gray-500 text-sm">{d}</span>,
    },
    {
      title: 'Đăng Nhập Cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (d: string) => <span className="text-gray-500 text-sm">{d}</span>,
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Button size="small" icon={<LockOutlined />} onClick={() => { message.info('Đã gửi link đặt lại mật khẩu'); }} />
          <Popconfirm
            title="Xóa tài khoản?"
            onConfirm={() => { setData(prev => prev.filter(u => u.id !== record.id)); message.success('Đã xóa!'); }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">Quản Lý Người Dùng</Title>
          <Text className="text-gray-500">{data.length} tài khoản • {filtered.length} đang hiển thị</Text>
        </div>
        <Space>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => openEdit()}>
            Thêm Người Dùng
          </Button>
        </Space>
      </div>

      {/* Stats */}
      <Row gutter={[12, 12]} className="mb-6">
        {[
          { label: 'Tổng người dùng', value: data.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Đang hoạt động', value: data.filter(u => u.status === 'active').length, color: 'bg-green-50 text-green-700' },
          { label: 'Bị khóa', value: data.filter(u => u.status === 'banned').length, color: 'bg-red-50 text-red-700' },
          { label: 'Admin', value: data.filter(u => u.role.includes('Admin')).length, color: 'bg-purple-50 text-purple-700' },
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
            placeholder="Tìm kiếm người dùng..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select value={filterRole} onChange={setFilterRole} style={{ width: 160 }}>
            <Option value="all">Tất cả vai trò</Option>
            <Option value="Super Admin">Super Admin</Option>
            <Option value="Admin">Admin</Option>
            <Option value="Moderator">Moderator</Option>
            <Option value="Student">Student</Option>
          </Select>
          <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 160 }}>
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Đang hoạt động</Option>
            <Option value="banned">Bị khóa</Option>
          </Select>
        </div>
      </Card>

      <Card className="rounded-xl border-gray-100">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} người dùng` }}
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={editUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
        onCancel={() => setModalOpen(false)}
        onOk={async () => { await form.validateFields(); setModalOpen(false); message.success('Lưu thành công!'); }}
        okText="Lưu"
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                <Select>
                  <Option value="Student">Student</Option>
                  <Option value="Moderator">Moderator</Option>
                  <Option value="Admin">Admin</Option>
                  <Option value="Super Admin">Super Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            {!editUser && (
              <Col span={24}>
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 8 }]}>
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
