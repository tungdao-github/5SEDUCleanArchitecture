import { useState } from 'react';
import {
  Table, Button, Input, Select, Tag, Space, Modal, Form,
  Typography, Row, Col, Card, Popconfirm, message, Switch,
  Avatar, Badge, Tabs, Upload,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, FileTextOutlined, PictureOutlined,
  StarOutlined, LikeOutlined, MessageOutlined,
} from '@ant-design/icons';
import { blogPosts } from '../../data/mockData';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const blogCategories = ['Công Nghệ', 'Lập Trình', 'Thiết Kế', 'Marketing', 'Kinh Doanh', 'Kỹ Năng Mềm'];

const extendedPosts = [
  ...blogPosts,
  {
    id: 7, title: 'Top 10 Framework JavaScript 2025', slug: 'top-10-framework-js-2025',
    category: 'Lập Trình', author: 'Admin', authorAvatar: 'https://i.pravatar.cc/40?img=3',
    date: '10/05/2025', readTime: '7 phút', thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200',
    excerpt: 'Khám phá các framework JS hot nhất năm 2025...', content: '...', tags: ['JS', 'Framework'],
    views: 3200, published: true, featured: false,
  },
  {
    id: 8, title: 'Học Máy - Hướng Dẫn Toàn Diện Cho Người Mới', slug: 'hoc-may-toan-dien',
    category: 'Công Nghệ', author: 'Lê Văn C', authorAvatar: 'https://i.pravatar.cc/40?img=7',
    date: '08/05/2025', readTime: '12 phút', thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=200',
    excerpt: 'Machine Learning từ A đến Z...', content: '...', tags: ['AI', 'ML'],
    views: 5600, published: false, featured: true,
  },
].map(p => ({ ...p, published: (p as any).published ?? true, featured: (p as any).featured ?? false, likes: Math.floor(Math.random() * 500), comments: Math.floor(Math.random() * 80) }));

export default function BlogAdminPage() {
  const [data, setData] = useState(extendedPosts);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [previewPost, setPreviewPost] = useState<any>(null);
  const [form] = Form.useForm();

  const filtered = data.filter(p =>
    (filterCat === 'all' || p.category === filterCat) &&
    (filterStatus === 'all' || (filterStatus === 'published' ? p.published : !p.published)) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (post?: any) => {
    setEditing(post || null);
    form.setFieldsValue(post || { published: true, featured: false });
    setModalOpen(true);
  };

  const togglePublished = (id: number, val: boolean) => {
    setData(prev => prev.map(p => p.id === id ? { ...p, published: val } : p));
    message.success(val ? 'Đã đăng bài!' : 'Đã ẩn bài!');
  };

  const toggleFeatured = (id: number, val: boolean) => {
    setData(prev => prev.map(p => p.id === id ? { ...p, featured: val } : p));
    message.success(val ? 'Đã đặt bài nổi bật!' : 'Đã bỏ nổi bật!');
  };

  const columns = [
    {
      title: 'Bài Viết',
      key: 'post',
      render: (_: any, r: any) => (
        <div className="flex gap-3 items-start">
          <img src={r.thumbnail} alt={r.title} className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 line-clamp-1 text-sm">{r.title}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <Avatar src={r.authorAvatar} size={16} />
              <Text className="text-gray-400 text-xs">{r.author}</Text>
              <span className="text-gray-300">•</span>
              <Text className="text-gray-400 text-xs">{r.date}</Text>
            </div>
            {r.featured && <Tag color="gold" className="text-xs mt-1">Nổi Bật</Tag>}
          </div>
        </div>
      ),
      width: 280,
    },
    {
      title: 'Danh Mục',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Lượt Xem',
      dataIndex: 'views',
      key: 'views',
      render: (v: number) => (
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <EyeOutlined />
          <span>{v.toLocaleString()}</span>
        </div>
      ),
      sorter: (a: any, b: any) => a.views - b.views,
    },
    {
      title: 'Tương Tác',
      key: 'engagement',
      render: (_: any, r: any) => (
        <Space>
          <span className="text-sm text-gray-500"><LikeOutlined /> {r.likes}</span>
          <span className="text-sm text-gray-500"><MessageOutlined /> {r.comments}</span>
        </Space>
      ),
    },
    {
      title: 'Nổi Bật',
      key: 'featured',
      render: (_: any, r: any) => (
        <Switch checked={r.featured} size="small" onChange={val => toggleFeatured(r.id, val)} />
      ),
    },
    {
      title: 'Trạng Thái',
      key: 'published',
      render: (_: any, r: any) => (
        <Switch
          checked={r.published}
          size="small"
          checkedChildren="Đăng"
          unCheckedChildren="Nháp"
          onChange={val => togglePublished(r.id, val)}
        />
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => setPreviewPost(r)} />
          <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="Xóa bài viết?" onConfirm={() => { setData(prev => prev.filter(p => p.id !== r.id)); message.success('Đã xóa!'); }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = {
    total: data.length,
    published: data.filter(p => p.published).length,
    draft: data.filter(p => !p.published).length,
    featured: data.filter(p => p.featured).length,
    views: data.reduce((s, p) => s + p.views, 0),
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">📝 Quản Lý Blog</Title>
          <Text className="text-gray-500">{data.length} bài viết • {stats.published} đã đăng</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => openEdit()}>
          Viết Bài Mới
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={[12, 12]} className="mb-6">
        {[
          { label: 'Tổng bài viết', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Đã đăng', value: stats.published, color: 'bg-green-50 text-green-700' },
          { label: 'Bản nháp', value: stats.draft, color: 'bg-gray-50 text-gray-700' },
          { label: 'Nổi bật', value: stats.featured, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Lượt xem', value: stats.views.toLocaleString(), color: 'bg-purple-50 text-purple-700' },
        ].map((s, i) => (
          <Col key={i} xs={12} sm={8} lg={4} flex="auto">
            <div className={`${s.color} rounded-xl p-4 text-center`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs opacity-75 mt-1">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card className="rounded-xl border-gray-100 mb-4">
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Tìm bài viết..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select value={filterCat} onChange={setFilterCat} style={{ width: 180 }}>
            <Option value="all">Tất cả danh mục</Option>
            {blogCategories.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
          <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 160 }}>
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="published">Đã đăng</Option>
            <Option value="draft">Bản nháp</Option>
          </Select>
        </div>
      </Card>

      <Card className="rounded-xl border-gray-100">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: total => `Tổng ${total} bài` }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        title={editing ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}
        onCancel={() => setModalOpen(false)}
        onOk={async () => { await form.validateFields(); setModalOpen(false); message.success('Lưu thành công!'); }}
        okText="Lưu"
        cancelText="Hủy"
        width={780}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true }]}>
            <Input size="large" placeholder="Nhập tiêu đề hấp dẫn..." />
          </Form.Item>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
                <Select size="large" placeholder="Chọn danh mục">
                  {blogCategories.map(c => <Option key={c} value={c}>{c}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="author" label="Tác giả">
                <Input size="large" placeholder="Tên tác giả" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="thumbnail" label="Ảnh đại diện (URL)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="excerpt" label="Tóm tắt" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="Mô tả ngắn về bài viết..." showCount maxLength={200} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung bài viết" rules={[{ required: true }]}>
            <TextArea rows={8} placeholder="Viết nội dung bài viết tại đây..." />
          </Form.Item>
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item name="published" label="Đăng bài" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="Đăng" unCheckedChildren="Nháp" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="featured" label="Bài nổi bật" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="readTime" label="Thời gian đọc">
                <Input placeholder="VD: 5 phút" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        open={!!previewPost}
        title="Xem Trước Bài Viết"
        onCancel={() => setPreviewPost(null)}
        footer={[<Button key="close" onClick={() => setPreviewPost(null)}>Đóng</Button>]}
        width={700}
      >
        {previewPost && (
          <div>
            <img src={previewPost.thumbnail} alt={previewPost.title} className="w-full h-52 object-cover rounded-xl mb-4" />
            <div className="flex gap-2 mb-3">
              <Tag color="blue">{previewPost.category}</Tag>
              <Tag color={previewPost.published ? 'green' : 'default'}>{previewPost.published ? 'Đã đăng' : 'Nháp'}</Tag>
              {previewPost.featured && <Tag color="gold">Nổi bật</Tag>}
            </div>
            <Title level={4}>{previewPost.title}</Title>
            <div className="flex items-center gap-3 text-gray-500 text-sm mb-3">
              <Avatar src={previewPost.authorAvatar} size={20} />
              <span>{previewPost.author}</span>
              <span>•</span>
              <span>{previewPost.date}</span>
              <span>•</span>
              <span>{previewPost.readTime} đọc</span>
            </div>
            <p className="text-gray-700">{previewPost.excerpt}</p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
