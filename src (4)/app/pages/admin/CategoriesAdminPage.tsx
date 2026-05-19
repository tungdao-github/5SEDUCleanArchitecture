import { useState } from 'react';
import {
  Table, Button, Input, Tag, Space, Modal, Form, Select,
  Typography, Row, Col, Card, Popconfirm, message,
  ColorPicker, InputNumber, Badge,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  AppstoreOutlined, DragOutlined, ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons';
import { useCategories } from '../../services/useCategories';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;

const emojis = ['💻', '🎨', '📈', '💼', '🌍', '🎵', '🏋️', '📷', '🎬', '📚', '🔬', '🎯', '💡', '🚀', '🌐'];

export default function CategoriesAdminPage() {
  const { categories, isLoading } = useCategories();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = categories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      message.info('Tính năng thêm danh mục sẽ được cập nhật');
      setModalOpen(false);
    } catch {}
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <Text className="text-gray-500 font-mono">{id}</Text>,
      width: 60,
    },
    {
      title: 'Danh Mục',
      key: 'cat',
      render: (_: any, r: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-blue-100">
            {r.icon}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{r.name}</div>
            <Text className="text-gray-400 text-xs">/danh-muc/{r.slug}</Text>
          </div>
        </div>
      ),
      width: 220,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <Tag>{slug}</Tag>,
      width: 150,
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => <div className="text-2xl">{icon}</div>,
      width: 80,
    },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (_: any, r: any) => (
        <Space size="small">
          <Button size="small" type="text" icon={<EditOutlined />} disabled>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục?"
            onConfirm={() => message.info('Tính năng xóa sẽ được cập nhật')}
            disabled
          >
            <Button size="small" type="text" danger icon={<DeleteOutlined />} disabled>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <AdminLayout>
      <Card className="rounded-xl shadow-sm border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <Title level={4} className="m-0">Danh Mục</Title>
          <div className="flex gap-2">
            <Input.Search
              placeholder="Tìm danh mục..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 250 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} disabled>
              Thêm Danh Mục
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filtered.map(c => ({ ...c, key: c.id }))}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      <Modal
        title="Thêm/Sửa Danh Mục"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
            <Input placeholder="Lập Trình" />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input placeholder="lap-trinh" />
          </Form.Item>
          <Form.Item name="icon" label="Icon" rules={[{ required: true }]}>
            <Select placeholder="Chọn icon">
              {emojis.map(e => (
                <Select.Option key={e} value={e}>{e}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}

  const filtered = data.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (cat?: any) => {
    setEditing(cat || null);
    form.setFieldsValue(cat ? { ...cat } : { active: true, order: data.length + 1 });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        setData(prev => prev.map(c => c.id === editing.id ? { ...c, ...values } : c));
        message.success('Đã cập nhật danh mục!');
      } else {
        setData(prev => [...prev, { ...values, id: Date.now(), slug: values.name.toLowerCase().replace(/\s+/g, '-'), coursesCount: 0 }]);
        message.success('Đã thêm danh mục mới!');
      }
      setModalOpen(false);
    } catch {}
  };

  const moveOrder = (id: number, dir: 'up' | 'down') => {
    setData(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex(c => c.id === id);
      if (dir === 'up' && idx > 0) {
        [sorted[idx].order, sorted[idx - 1].order] = [sorted[idx - 1].order, sorted[idx].order];
      } else if (dir === 'down' && idx < sorted.length - 1) {
        [sorted[idx].order, sorted[idx + 1].order] = [sorted[idx + 1].order, sorted[idx].order];
      }
      return sorted;
    });
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'order',
      key: 'order',
      render: (o: number) => <Text className="text-gray-500 font-mono">{o}</Text>,
      width: 60,
    },
    {
      title: 'Danh Mục',
      key: 'cat',
      render: (_: any, r: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${r.color}20` }}>
            {r.icon}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{r.name}</div>
            <Text className="text-gray-400 text-xs">/danh-muc/{r.slug}</Text>
          </div>
        </div>
      ),
      width: 220,
    },
    {
      title: 'Màu Sắc',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-gray-200" style={{ background: color }} />
          <Text className="text-gray-500 text-xs font-mono">{color}</Text>
        </div>
      ),
    },
    {
      title: 'Khóa Học',
      dataIndex: 'coursesCount',
      key: 'courses',
      render: (n: number) => <Tag color="blue">{n} khóa học</Tag>,
      sorter: (a: any, b: any) => a.coursesCount - b.coursesCount,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'active',
      key: 'active',
      render: (a: boolean) => (
        <Badge status={a ? 'success' : 'default'} text={a ? 'Hiển thị' : 'Ẩn'} />
      ),
    },
    {
      title: 'Sắp Xếp',
      key: 'sort',
      render: (_: any, r: any, idx: number) => (
        <Space>
          <Button size="small" icon={<ArrowUpOutlined />} disabled={idx === 0} onClick={() => moveOrder(r.id, 'up')} />
          <Button size="small" icon={<ArrowDownOutlined />} disabled={idx === filtered.length - 1} onClick={() => moveOrder(r.id, 'down')} />
        </Space>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="Xóa danh mục?" onConfirm={() => { setData(prev => prev.filter(c => c.id !== r.id)); message.success('Đã xóa!'); }}>
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
          <Title level={3} className="mb-1">📂 Quản Lý Danh Mục</Title>
          <Text className="text-gray-500">{data.length} danh mục • {data.filter(c => c.active).length} đang hiển thị</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => openEdit()}>
          Thêm Danh Mục
        </Button>
      </div>

      {/* Category Cards Preview */}
      <Row gutter={[12, 12]} className="mb-6">
        {data.slice(0, 8).map(cat => (
          <Col xs={12} sm={8} md={6} lg={3} key={cat.id}>
            <Card
              className="rounded-xl text-center cursor-pointer hover:shadow-md transition-shadow border-gray-100"
              styles={{ body: { padding: '12px 8px' } }}
              onClick={() => openEdit(cat)}
            >
              <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-xl" style={{ background: `${cat.color}20` }}>
                {cat.icon}
              </div>
              <div className="font-medium text-gray-800 text-xs line-clamp-1">{cat.name}</div>
              <div className="text-gray-400 text-xs">{cat.coursesCount} kh</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Card className="rounded-xl border-gray-100 mb-4">
        <div className="mb-4">
          <Input
            placeholder="Tìm danh mục..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
        </div>
        <Table
          dataSource={filtered.sort((a, b) => a.order - b.order)}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        title={editing ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
        width={520}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
            <Input size="large" placeholder="VD: Lập Trình" />
          </Form.Item>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="icon" label="Icon (Emoji)">
                <Select size="large" placeholder="Chọn icon">
                  {emojis.map(e => <Select.Option key={e} value={e}>{e} {e}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="order" label="Thứ tự hiển thị">
                <InputNumber className="w-full" size="large" min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="color" label="Màu sắc (hex)">
            <Input placeholder="#1890ff" />
          </Form.Item>
          <Form.Item name="slug" label="Đường dẫn (slug)">
            <Input placeholder="lap-trinh" addonBefore="/danh-muc/" />
          </Form.Item>
          <Form.Item name="active" label="Hiển thị" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
