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
