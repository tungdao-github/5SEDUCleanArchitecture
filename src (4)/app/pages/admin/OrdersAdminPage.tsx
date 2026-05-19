import { useState } from 'react';
import {
  Table, Tag, Button, Input, Select, Card, Typography, Row, Col,
  Modal, Steps, Space, Popconfirm, message, Badge,
} from 'antd';
import {
  SearchOutlined, EyeOutlined, DownloadOutlined, DeleteOutlined,
  CheckCircleOutlined, CarOutlined, InboxOutlined, ReloadOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { orders, courses, formatPrice } from '../../data/mockData';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  pending: { color: 'orange', label: 'Chờ xác nhận', icon: <InboxOutlined /> },
  processing: { color: 'blue', label: 'Đang xử lý', icon: <ReloadOutlined /> },
  shipping: { color: 'cyan', label: 'Đang giao', icon: <CarOutlined /> },
  delivered: { color: 'green', label: 'Đã giao', icon: <CheckCircleOutlined /> },
  cancelled: { color: 'red', label: 'Đã hủy', icon: null },
};

const extendedOrders = [
  ...orders,
  { id: 'ORD-2025-004', date: '03/05/2025', status: 'pending' as const, total: 449000, items: [{ courseId: 4, title: 'Digital Marketing', price: 449000 }], paymentMethod: 'VNPay' },
  { id: 'ORD-2025-005', date: '01/05/2025', status: 'delivered' as const, total: 649000, items: [{ courseId: 9, title: 'Flutter App', price: 649000 }], paymentMethod: 'ZaloPay' },
  { id: 'ORD-2025-006', date: '28/04/2025', status: 'cancelled' as const, total: 299000, items: [{ courseId: 6, title: 'Tiếng Anh Giao Tiếp', price: 299000 }], paymentMethod: 'Thẻ' },
];

export default function OrdersAdminPage() {
  const [data, setData] = useState(extendedOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filtered = data.filter(o =>
    (filterStatus === 'all' || o.status === filterStatus) &&
    (!search || o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id: string, newStatus: string) => {
    setData(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
    message.success('Cập nhật trạng thái thành công!');
  };

  const columns = [
    {
      title: 'Mã Đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <span className="text-blue-600 font-mono font-medium">{id}</span>,
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'date',
      key: 'date',
      render: (d: string) => <span className="text-gray-600 text-sm">{d}</span>,
    },
    {
      title: 'Sản Phẩm',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => (
        <div>
          {items.map((item, i) => (
            <div key={i} className="text-sm text-gray-700 line-clamp-1">{item.title}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'Thanh Toán',
      dataIndex: 'paymentMethod',
      key: 'payment',
      render: (p: string) => <Tag>{p}</Tag>,
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'total',
      key: 'total',
      render: (t: number) => <span className="font-bold text-blue-600">{formatPrice(t)}</span>,
      sorter: (a: any, b: any) => a.total - b.total,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: string, record: any) => (
        <Select
          value={s}
          size="small"
          style={{ width: 140 }}
          onChange={(val) => updateStatus(record.id, val)}
        >
          {Object.entries(statusConfig).map(([key, val]) => (
            <Option key={key} value={key}>
              <Tag color={val.color} className="m-0">{val.label}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => setSelectedOrder(record)} />
          <Button size="small" icon={<DownloadOutlined />} onClick={() => message.info('Đang xuất PDF...')} />
          <Popconfirm title="Xóa đơn hàng?" onConfirm={() => { setData(prev => prev.filter(o => o.id !== record.id)); message.success('Đã xóa!'); }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = {
    total: data.length,
    pending: data.filter(o => o.status === 'pending').length,
    processing: data.filter(o => o.status === 'processing').length,
    delivered: data.filter(o => o.status === 'delivered').length,
    totalRevenue: data.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">Quản Lý Đơn Hàng</Title>
          <Text className="text-gray-500">{data.length} đơn hàng tổng cộng</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>Xuất Excel</Button>
          <Button icon={<DownloadOutlined />}>Xuất PDF tất cả</Button>
        </Space>
      </div>

      {/* Stats */}
      <Row gutter={[12, 12]} className="mb-6">
        {[
          { label: 'Tổng đơn', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Chờ xử lý', value: stats.pending, color: 'bg-orange-50 text-orange-700' },
          { label: 'Đang xử lý', value: stats.processing, color: 'bg-cyan-50 text-cyan-700' },
          { label: 'Hoàn thành', value: stats.delivered, color: 'bg-green-50 text-green-700' },
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
            placeholder="Tìm mã đơn hàng..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 180 }}>
            <Option value="all">Tất cả trạng thái</Option>
            {Object.entries(statusConfig).map(([key, val]) => (
              <Option key={key} value={key}>{val.label}</Option>
            ))}
          </Select>
          <Select defaultValue="all" style={{ width: 160 }}>
            <Option value="all">Tất cả thanh toán</Option>
            <Option value="vnpay">VNPay</Option>
            <Option value="zalopay">ZaloPay</Option>
            <Option value="card">Thẻ tín dụng</Option>
          </Select>
        </div>
      </Card>

      <Card className="rounded-xl border-gray-100">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} đơn hàng` }}
          size="middle"
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        open={!!selectedOrder}
        title={`Chi Tiết Đơn Hàng - ${selectedOrder?.id}`}
        onCancel={() => setSelectedOrder(null)}
        footer={[
          <Button key="pdf" icon={<DownloadOutlined />}>Xuất PDF</Button>,
          <Button key="close" onClick={() => setSelectedOrder(null)}>Đóng</Button>,
        ]}
        width={600}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <Row gutter={[16, 8]}>
              <Col span={12}><Text type="secondary">Mã đơn:</Text> <Text strong>{selectedOrder.id}</Text></Col>
              <Col span={12}><Text type="secondary">Ngày đặt:</Text> <Text strong>{selectedOrder.date}</Text></Col>
              <Col span={12}><Text type="secondary">Thanh toán:</Text> <Text strong>{selectedOrder.paymentMethod}</Text></Col>
              <Col span={12}><Text type="secondary">Trạng thái:</Text> <Tag color={statusConfig[selectedOrder.status]?.color}>{statusConfig[selectedOrder.status]?.label}</Tag></Col>
            </Row>

            <div>
              <Text strong className="block mb-2">Sản phẩm:</Text>
              {selectedOrder.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">{item.title}</span>
                  <span className="font-medium text-blue-600">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
