import { useState } from 'react';
import {
  Card, Table, Tag, Button, Typography, Row, Col, Modal, Form,
  Input, Switch, Checkbox, message, Popconfirm, Space, Badge, Divider, Select,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined,
  UserOutlined, SafetyCertificateOutlined, SettingOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;

interface Permission {
  key: string;
  label: string;
  group: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  color: string;
  userCount: number;
  isSystem: boolean;
  permissions: string[];
}

const allPermissions: Permission[] = [
  // Khóa học
  { key: 'course.view', label: 'Xem khóa học', group: 'Khóa Học' },
  { key: 'course.create', label: 'Thêm khóa học', group: 'Khóa Học' },
  { key: 'course.edit', label: 'Sửa khóa học', group: 'Khóa Học' },
  { key: 'course.delete', label: 'Xóa khóa học', group: 'Khóa Học' },
  { key: 'course.publish', label: 'Xuất bản khóa học', group: 'Khóa Học' },
  // Người dùng
  { key: 'user.view', label: 'Xem người dùng', group: 'Người Dùng' },
  { key: 'user.create', label: 'Thêm người dùng', group: 'Người Dùng' },
  { key: 'user.edit', label: 'Sửa người dùng', group: 'Người Dùng' },
  { key: 'user.delete', label: 'Xóa người dùng', group: 'Người Dùng' },
  { key: 'user.ban', label: 'Khóa tài khoản', group: 'Người Dùng' },
  // Đơn hàng
  { key: 'order.view', label: 'Xem đơn hàng', group: 'Đơn Hàng' },
  { key: 'order.edit', label: 'Cập nhật trạng thái', group: 'Đơn Hàng' },
  { key: 'order.refund', label: 'Hoàn tiền đơn hàng', group: 'Đơn Hàng' },
  { key: 'order.delete', label: 'Xóa đơn hàng', group: 'Đơn Hàng' },
  // Blog
  { key: 'blog.view', label: 'Xem bài viết', group: 'Blog' },
  { key: 'blog.create', label: 'Thêm bài viết', group: 'Blog' },
  { key: 'blog.edit', label: 'Sửa bài viết', group: 'Blog' },
  { key: 'blog.delete', label: 'Xóa bài viết', group: 'Blog' },
  { key: 'blog.publish', label: 'Đăng bài viết', group: 'Blog' },
  // Hệ thống
  { key: 'settings.view', label: 'Xem cài đặt', group: 'Hệ Thống' },
  { key: 'settings.edit', label: 'Chỉnh sửa cài đặt', group: 'Hệ Thống' },
  { key: 'analytics.view', label: 'Xem báo cáo', group: 'Hệ Thống' },
  { key: 'media.manage', label: 'Quản lý media', group: 'Hệ Thống' },
  { key: 'roles.manage', label: 'Quản lý phân quyền', group: 'Hệ Thống' },
];

const permGroups = [...new Set(allPermissions.map(p => p.group))];

const initRoles: Role[] = [
  {
    id: 1, name: 'Super Admin', description: 'Toàn quyền hệ thống', color: 'red',
    userCount: 1, isSystem: true,
    permissions: allPermissions.map(p => p.key),
  },
  {
    id: 2, name: 'Admin', description: 'Quản lý nội dung và người dùng', color: 'purple',
    userCount: 3, isSystem: true,
    permissions: allPermissions.filter(p => !['roles.manage', 'settings.edit'].includes(p.key)).map(p => p.key),
  },
  {
    id: 3, name: 'Moderator', description: 'Kiểm duyệt nội dung', color: 'blue',
    userCount: 5, isSystem: false,
    permissions: ['course.view', 'blog.view', 'blog.edit', 'blog.publish', 'user.view', 'user.ban', 'order.view'],
  },
  {
    id: 4, name: 'Editor', description: 'Quản lý nội dung blog và khóa học', color: 'green',
    userCount: 8, isSystem: false,
    permissions: ['course.view', 'course.create', 'course.edit', 'blog.view', 'blog.create', 'blog.edit', 'blog.publish', 'media.manage'],
  },
  {
    id: 5, name: 'Student', description: 'Học viên thông thường', color: 'default',
    userCount: 8234, isSystem: true,
    permissions: ['course.view', 'blog.view'],
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(initRoles);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [form] = Form.useForm();

  const openEdit = (role?: Role) => {
    setEditing(role || null);
    setSelectedPerms(role?.permissions || []);
    form.setFieldsValue(role || { color: 'blue' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        setRoles(prev => prev.map(r => r.id === editing.id ? { ...r, ...values, permissions: selectedPerms } : r));
        message.success('Đã cập nhật vai trò!');
      } else {
        setRoles(prev => [...prev, { id: Date.now(), userCount: 0, isSystem: false, permissions: selectedPerms, ...values }]);
        message.success('Đã tạo vai trò mới!');
      }
      setModalOpen(false);
    } catch {}
  };

  const togglePerm = (key: string) => {
    setSelectedPerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  const toggleGroup = (group: string, checked: boolean) => {
    const groupKeys = allPermissions.filter(p => p.group === group).map(p => p.key);
    if (checked) {
      setSelectedPerms(prev => [...new Set([...prev, ...groupKeys])]);
    } else {
      setSelectedPerms(prev => prev.filter(k => !groupKeys.includes(k)));
    }
  };

  const columns = [
    {
      title: 'Vai Trò',
      key: 'role',
      render: (_: any, r: Role) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.color === 'red' ? 'bg-red-100' : r.color === 'purple' ? 'bg-purple-100' : r.color === 'blue' ? 'bg-blue-100' : r.color === 'green' ? 'bg-green-100' : 'bg-gray-100'}`}>
            <SafetyCertificateOutlined className={r.color === 'red' ? 'text-red-500' : r.color === 'purple' ? 'text-purple-500' : r.color === 'blue' ? 'text-blue-500' : r.color === 'green' ? 'text-green-500' : 'text-gray-500'} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text strong>{r.name}</Text>
              {r.isSystem && <Tag className="text-xs">System</Tag>}
            </div>
            <Text className="text-gray-400 text-xs">{r.description}</Text>
          </div>
        </div>
      ),
      width: 240,
    },
    {
      title: 'Người Dùng',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (n: number) => (
        <div className="flex items-center gap-1 text-gray-600">
          <UserOutlined />
          <span className="font-medium">{n.toLocaleString()}</span>
        </div>
      ),
    },
    {
      title: 'Quyền Hạn',
      key: 'perms',
      render: (_: any, r: Role) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {permGroups.map(group => {
            const groupPerms = allPermissions.filter(p => p.group === group).map(p => p.key);
            const has = groupPerms.filter(k => r.permissions.includes(k)).length;
            if (has === 0) return null;
            return (
              <Tag key={group} color={has === groupPerms.length ? 'blue' : 'default'} className="text-xs">
                {group} ({has}/{groupPerms.length})
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_: any, r: Role) => (
        <Space>
          <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          {!r.isSystem && (
            <Popconfirm title="Xóa vai trò này?" onConfirm={() => { setRoles(prev => prev.filter(x => x.id !== r.id)); message.success('Đã xóa!'); }}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
      width: 100,
    },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">🔐 Phân Quyền & Vai Trò</Title>
          <Text className="text-gray-500">{roles.length} vai trò • {roles.reduce((s, r) => s + r.userCount, 0).toLocaleString()} người dùng</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => openEdit()}>
          Tạo Vai Trò Mới
        </Button>
      </div>

      {/* Role Cards */}
      <Row gutter={[12, 12]} className="mb-6">
        {roles.map(role => (
          <Col key={role.id} xs={12} sm={8} lg={4} flex="auto">
            <Card
              className="rounded-xl border-gray-100 text-center hover:shadow-md transition-shadow cursor-pointer"
              styles={{ body: { padding: '16px 12px' } }}
              onClick={() => openEdit(role)}
            >
              <SafetyCertificateOutlined className={`text-2xl mb-2 ${role.color === 'red' ? 'text-red-500' : role.color === 'purple' ? 'text-purple-500' : role.color === 'blue' ? 'text-blue-500' : role.color === 'green' ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="font-semibold text-gray-800 text-sm mb-1">{role.name}</div>
              <Tag color={role.color} className="text-xs">{role.userCount.toLocaleString()} users</Tag>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="rounded-xl border-gray-100">
        <Table
          dataSource={roles}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        title={editing ? `Chỉnh Sửa: ${editing.name}` : 'Tạo Vai Trò Mới'}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <Form.Item name="name" label="Tên vai trò" rules={[{ required: true }]}>
                <Input size="large" placeholder="VD: Editor" disabled={editing?.isSystem} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="color" label="Màu Tag">
                <Select size="large">
                  {['red', 'purple', 'blue', 'green', 'orange', 'cyan', 'default'].map(c => (
                    <Select.Option key={c} value={c}><Tag color={c}>{c}</Tag></Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả">
            <Input placeholder="Mô tả vai trò..." />
          </Form.Item>

          <Divider>Phân Quyền ({selectedPerms.length}/{allPermissions.length})</Divider>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {permGroups.map(group => {
              const groupPerms = allPermissions.filter(p => p.group === group);
              const checkedCount = groupPerms.filter(p => selectedPerms.includes(p.key)).length;
              const allChecked = checkedCount === groupPerms.length;
              const isDisabled = editing?.isSystem && editing.name === 'Super Admin';

              return (
                <div key={group} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Checkbox
                      checked={allChecked}
                      indeterminate={checkedCount > 0 && !allChecked}
                      onChange={e => toggleGroup(group, e.target.checked)}
                      disabled={isDisabled}
                    >
                      <Text strong className="text-sm">{group}</Text>
                    </Checkbox>
                    <Tag>{checkedCount}/{groupPerms.length}</Tag>
                  </div>
                  <div className="grid grid-cols-2 gap-1 ml-6">
                    {groupPerms.map(perm => (
                      <Checkbox
                        key={perm.key}
                        checked={selectedPerms.includes(perm.key)}
                        onChange={() => togglePerm(perm.key)}
                        disabled={isDisabled}
                        className="text-sm"
                      >
                        {perm.label}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
