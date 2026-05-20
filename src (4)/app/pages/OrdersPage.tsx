import { useState, useMemo } from 'react';
import {
  Card, Tag, Button, Steps, Typography, Timeline, Table, Modal,
  Row, Col, Divider, Badge, message, Input, Form,
} from 'antd';
import {
  ShoppingCartOutlined, CheckCircleOutlined, CarOutlined, InboxOutlined,
  CloseCircleOutlined, EyeOutlined, DownloadOutlined, ReloadOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { courses as mockCourses, formatPrice } from '../data/mockData';
import { useOrders } from '../services/useOrders';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text } = Typography;

const statusConfig = {
  pending: { color: 'orange', icon: <InboxOutlined />, label: 'Chờ xác nhận' },
  processing: { color: 'blue', icon: <ReloadOutlined spin />, label: 'Đang xử lý' },
  shipping: { color: 'cyan', icon: <CarOutlined />, label: 'Đang giao' },
  delivered: { color: 'green', icon: <CheckCircleOutlined />, label: 'Đã giao' },
  cancelled: { color: 'red', icon: <CloseCircleOutlined />, label: 'Đã hủy' },
};

export default function OrdersPage() {
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('orderEmail'));
  const [emailInput, setEmailInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { orders, isLoading, error } = useOrders(userEmail);

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const getStepIndex = (status: string) => {
    return ['pending', 'processing', 'shipping', 'delivered'].indexOf(status);
  };

  const handleSearch = () => {
    if (!emailInput) {
      message.error('Vui lòng nhập email');
      return;
    }
    setIsSearching(true);
    setUserEmail(emailInput);
    localStorage.setItem('orderEmail', emailInput);
    setTimeout(() => setIsSearching(false), 500);
  };

  if (!userEmail) {
    return (
      <MainLayout>
        <div className="bg-blue-600 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <Title level={2} className="text-white mb-0">📦 Lịch Sử Đơn Hàng</Title>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="rounded-xl">
            <Title level={4} className="text-center mb-6">Tra Cứu Đơn Hàng</Title>
            <Form layout="vertical" onFinish={() => handleSearch()}>
              <Form.Item label="Email" name="email">
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập email để xem đơn hàng"
                  size="large"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  onPressEnter={handleSearch}
                />
              </Form.Item>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSearch}
                loading={isSearching}
              >
                Tra Cứu
              </Button>
            </Form>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-blue-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Title level={2} className="text-white mb-0">📦 Lịch Sử Đơn Hàng</Title>
          <div className="text-blue-100 text-sm">Email: {userEmail}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'Tất cả', count: orders.length },
            { key: 'pending', label: 'Chờ xác nhận', count: orders.filter(o => o.status === 'pending').length },
            { key: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
            { key: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
            { key: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
            { key: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length },
          ].map(f => (
            <Button
              key={f.key}
              type={filterStatus === f.key ? 'primary' : 'default'}
              onClick={() => setFilterStatus(f.key)}
              size="small"
            >
              {f.label} {f.count > 0 && <Badge count={f.count} size="small" className="ml-1" />}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="rounded-xl border-gray-100 text-center py-12">
              <ReloadOutlined className="text-3xl text-blue-500 mb-4 block animate-spin" />
              <Text className="text-gray-500">Đang tải đơn hàng...</Text>
            </Card>
          ) : error ? (
            <Card className="rounded-xl border-gray-100 text-center py-12">
              <Text className="text-red-500">{error}</Text>
              <Button type="link" onClick={() => setUserEmail(null)}>Tra cứu lại</Button>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="rounded-xl border-gray-100 text-center py-12">
              <ShoppingCartOutlined className="text-6xl text-gray-300 mb-4 block" />
              <Text className="text-gray-500">Không có đơn hàng nào</Text>
            </Card>
          ) : (
            filteredOrders.map(order => {
              const statusInfo = statusConfig[order.status];
              return (
                <Card key={order.id} className="rounded-xl shadow-sm border-gray-100">
                  {/* Order header */}
                  <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold text-gray-900">{order.id}</div>
                        <div className="text-gray-500 text-sm">{order.date}</div>
                      </div>
                      <Tag
                        color={statusInfo.color}
                        icon={statusInfo.icon}
                        className="flex items-center gap-1"
                      >
                        {statusInfo.label}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-gray-500 text-sm">{order.paymentMethod}</div>
                        <div className="text-blue-600 font-bold text-lg">{formatPrice(order.total)}</div>
                      </div>
                      <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => setSelectedOrder(order)}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>

                  {/* Progress steps */}
                  {order.status !== 'cancelled' && (
                    <Steps
                      current={getStepIndex(order.status)}
                      size="small"
                      className="mb-4"
                      items={[
                        { title: 'Xác nhận', icon: <InboxOutlined /> },
                        { title: 'Xử lý', icon: <ReloadOutlined /> },
                        { title: 'Giao hàng', icon: <CarOutlined /> },
                        { title: 'Hoàn thành', icon: <CheckCircleOutlined /> },
                      ]}
                    />
                  )}

                  {/* Order items */}
                  <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => {
                      const course = mockCourses.find(c => c.id === item.courseId);
                      return (
                        <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          {course && (
                            <img src={course.thumbnail} alt={item.title} className="w-16 h-11 object-cover rounded" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 text-sm line-clamp-1">{item.title}</div>
                          </div>
                          <div className="text-blue-600 font-medium text-sm flex-shrink-0">{formatPrice(item.price)}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <Button size="small" icon={<DownloadOutlined />} onClick={() => message.info('Đang tạo PDF...')}>
                      Xuất hóa đơn PDF
                    </Button>
                    {order.status === 'delivered' && (
                      <Button size="small">Đánh giá khóa học</Button>
                    )}
                    {order.status === 'pending' && (
                      <Button size="small" danger onClick={() => message.warning('Đã hủy đơn hàng')}>Hủy đơn</Button>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        open={!!selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        title={`Chi tiết đơn hàng ${selectedOrder?.id}`}
        footer={[
          <Button key="pdf" icon={<DownloadOutlined />} onClick={() => message.info('Đang tạo PDF...')}>
            Xuất PDF
          </Button>,
          <Button key="close" onClick={() => setSelectedOrder(null)}>Đóng</Button>,
        ]}
        width={600}
      >
        {selectedOrder && (
          <div>
            <Row gutter={[16, 16]} className="mb-4">
              <Col span={12}>
                <Text className="text-gray-500 block text-xs">Mã đơn hàng</Text>
                <Text className="font-bold">{selectedOrder.id}</Text>
              </Col>
              <Col span={12}>
                <Text className="text-gray-500 block text-xs">Ngày đặt</Text>
                <Text className="font-bold">{selectedOrder.date}</Text>
              </Col>
              <Col span={12}>
                <Text className="text-gray-500 block text-xs">Phương thức thanh toán</Text>
                <Text className="font-bold">{selectedOrder.paymentMethod}</Text>
              </Col>
              <Col span={12}>
                <Text className="text-gray-500 block text-xs">Trạng thái</Text>
                <Tag color={statusConfig[selectedOrder.status].color}>
                  {statusConfig[selectedOrder.status].label}
                </Tag>
              </Col>
            </Row>

            <Divider />

            <Title level={5} className="mb-3">Sản phẩm</Title>
            {selectedOrder.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{item.title}</span>
                <span className="font-medium text-blue-600">{formatPrice(item.price)}</span>
              </div>
            ))}

            <Divider />

            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{formatPrice(selectedOrder.total)}</span>
            </div>

            <Divider />

            <Title level={5} className="mb-3">Lịch sử theo dõi</Title>
            <Timeline
              items={[
                { color: 'green', children: <span><b>Đặt hàng thành công</b> - {selectedOrder.date} 09:00</span> },
                ...(selectedOrder.status !== 'pending' ? [{ color: 'blue', children: <span><b>Đang xử lý</b> - Đơn hàng đang được xử lý</span> }] : []),
                ...(selectedOrder.status === 'shipping' || selectedOrder.status === 'delivered' ? [{ color: 'cyan', children: <span><b>Đã giao cho đơn vị vận chuyển</b></span> }] : []),
                ...(selectedOrder.status === 'delivered' ? [{ color: 'green', children: <span><b>Giao hàng thành công</b></span> }] : []),
              ]}
            />
          </div>
        )}
      </Modal>
    </MainLayout>
  );
}
