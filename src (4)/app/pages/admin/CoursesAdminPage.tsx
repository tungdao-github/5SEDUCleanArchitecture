import { useState } from 'react';
import {
  Table, Button, Input, Select, Tag, Space, Modal, Form,
  Typography, Row, Col, Card, Popconfirm, message, Switch, Badge,
  InputNumber, Tooltip,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  DownloadOutlined, EyeOutlined, StarOutlined,
  FilterOutlined, ImportOutlined,
} from '@ant-design/icons';
import { courses, categories, formatPrice } from '../../data/mockData';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function CoursesAdminPage() {
  const [data, setData] = useState(courses);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const filtered = data.filter(c =>
    (filterCat === 'all' || c.categorySlug === filterCat) &&
    (!search || c.title.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (course?: any) => {
    setEditingCourse(course || null);
    form.setFieldsValue(course || {});
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setLoading(false);
      setModalOpen(false);
      message.success(editingCourse ? 'Cập nhật khóa học thành công!' : 'Thêm khóa học thành công!');
    } catch {}
  };

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(c => c.id !== id));
    message.success('Đã xóa khóa học');
  };

  const columns = [
    {
      title: 'Khóa Học',
      key: 'course',
      render: (_: any, record: any) => (
        <div className="flex gap-3 items-center">
          <img src={record.thumbnail} alt={record.title} className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 line-clamp-1">{record.title}</div>
            <div className="text-gray-500 text-xs">{record.instructor}</div>
            <div className="flex gap-1 mt-0.5">
              {record.bestseller && <Tag color="orange" className="text-xs m-0">BESTSELLER</Tag>}
              {record.isNew && <Tag color="green" className="text-xs m-0">MỚI</Tag>}
            </div>
          </div>
        </div>
      ),
      width: 300,
    },
    {
      title: 'Danh Mục',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Giá',
      key: 'price',
      render: (_: any, record: any) => (
        <div>
          <div className="font-bold text-blue-600">{formatPrice(record.price)}</div>
          {record.originalPrice > record.price && (
            <div className="text-gray-400 line-through text-xs">{formatPrice(record.originalPrice)}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Đánh Giá',
      key: 'rating',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-1">
          <StarOutlined className="text-yellow-400" />
          <span className="font-medium">{record.rating}</span>
          <span className="text-gray-400 text-xs">({record.ratingCount.toLocaleString()})</span>
        </div>
      ),
    },
    {
      title: 'Học Viên',
      dataIndex: 'students',
      key: 'students',
      render: (s: number) => <span className="font-medium">{s.toLocaleString()}</span>,
      sorter: (a: any, b: any) => a.students - b.students,
    },
    {
      title: 'Flash Sale',
      dataIndex: 'isFlashSale',
      key: 'flash',
      render: (val: boolean, record: any) => (
        <Switch
          checked={val}
          size="small"
          onChange={(checked) => {
            setData(prev => prev.map(c => c.id === record.id ? { ...c, isFlashSale: checked } : c));
          }}
        />
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Xóa khóa học?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">Quản Lý Khóa Học</Title>
          <Text className="text-gray-500">{data.length} khóa học • {filtered.length} đang hiển thị</Text>
        </div>
        <Space>
          <Button icon={<ImportOutlined />}>Nhập Excel</Button>
          <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit()}>
            Thêm Khóa Học
          </Button>
        </Space>
      </div>

      {/* Stats */}
      <Row gutter={[12, 12]} className="mb-6">
        {[
          { label: 'Tổng khóa học', value: data.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Bestseller', value: data.filter(c => c.bestseller).length, color: 'bg-orange-50 text-orange-700' },
          { label: 'Flash Sale', value: data.filter(c => c.isFlashSale).length, color: 'bg-red-50 text-red-700' },
          { label: 'Mới nhất', value: data.filter(c => c.isNew).length, color: 'bg-green-50 text-green-700' },
        ].map((s, i) => (
          <Col span={6} key={i}>
            <div className={`${s.color} rounded-xl p-3 text-center`}>
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
            placeholder="Tìm khóa học..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select value={filterCat} onChange={setFilterCat} style={{ width: 180 }}>
            <Option value="all">Tất cả danh mục</Option>
            {categories.map(c => <Option key={c.slug} value={c.slug}>{c.name}</Option>)}
          </Select>
          <Select defaultValue="all" style={{ width: 140 }}>
            <Option value="all">Trình độ</Option>
            <Option value="basic">Cơ bản</Option>
            <Option value="intermediate">Trung cấp</Option>
            <Option value="advanced">Nâng cao</Option>
          </Select>
          <Select defaultValue="all" style={{ width: 140 }}>
            <Option value="all">Trạng thái</Option>
            <Option value="active">Đang bán</Option>
            <Option value="draft">Nháp</Option>
          </Select>
        </div>
      </Card>

      <Card className="rounded-xl border-gray-100">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} khóa học` }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        title={editingCourse ? 'Chỉnh Sửa Khóa Học' : 'Thêm Khóa Học Mới'}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        confirmLoading={loading}
        okText="Lưu"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item name="title" label="Tên khóa học" rules={[{ required: true }]}>
                <Input placeholder="Nhập tên khóa học..." size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
                <Select placeholder="Chọn danh mục" size="large">
                  {categories.map(c => <Option key={c.slug} value={c.name}>{c.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="instructor" label="Giảng viên" rules={[{ required: true }]}>
                <Input placeholder="Tên giảng viên" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="price" label="Giá bán (₫)" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={0} size="large" formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="originalPrice" label="Giá gốc (₫)">
                <InputNumber className="w-full" min={0} size="large" formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="level" label="Trình độ" rules={[{ required: true }]}>
                <Select size="large">
                  <Option value="Từ cơ bản">Từ cơ bản</Option>
                  <Option value="Trung cấp">Trung cấp</Option>
                  <Option value="Nâng cao">Nâng cao</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả khóa học">
                <TextArea rows={4} placeholder="Nhập mô tả khóa học..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="thumbnail" label="Ảnh đại diện">
                <Input placeholder="URL ảnh đại diện" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="language" label="Ngôn ngữ">
                <Select size="large">
                  <Option value="Tiếng Việt">Tiếng Việt</Option>
                  <Option value="Tiếng Anh">Tiếng Anh</Option>
                  <Option value="Song ngữ">Song ngữ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="bestseller" label="Bestseller" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isNew" label="Khóa học mới" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isFlashSale" label="Flash Sale" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
