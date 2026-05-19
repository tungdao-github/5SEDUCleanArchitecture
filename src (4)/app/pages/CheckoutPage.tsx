import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Row, Col, Card, Button, Input, Select, Form, Steps, Divider,
  Radio, Typography, Tag, Result, message, Space,
} from 'antd';
import {
  CreditCardOutlined, SafetyCertificateOutlined, CheckCircleOutlined,
  UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined,
  ShoppingOutlined, BankOutlined,
} from '@ant-design/icons';
import { courses as mockCourses, formatPrice } from '../data/mockData';
import { useCart } from '../services/useCart';
import { useCourses } from '../services/useCourses';
import { checkout } from '../services/cartApi';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text } = Typography;
const { Option } = Select;

const provinces = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState('vnpay');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [form] = Form.useForm();
  const { cartId, items: cartItems, total: cartTotal, clear: clearCart } = useCart();
  const { courses } = useCourses();

  const orderItems = useMemo(() => {
    return cartItems.map(cartItem => {
      const course = courses.find(c => c.id === cartItem.productId) ||
                    mockCourses.find(c => c.id === cartItem.productId);
      return {
        ...cartItem,
        ...course,
      };
    });
  }, [cartItems, courses]);

  const subtotal = cartItems.reduce((s, c) => s + c.totalPrice, 0);
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;

  const handlePayment = async () => {
    try {
      const values = await form.validateFields();
      setProcessing(true);

      // Call checkout API
      if (cartId) {
        await checkout(cartId, values.email);
      }

      await new Promise(r => setTimeout(r, 1500));
      setProcessing(false);
      setDone(true);
      clearCart();
      message.success('Thanh toán thành công!');
    } catch {
      message.error('Vui lòng điền đầy đủ thông tin hoặc lỗi thanh toán');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0 && !done) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <Result
            status="404"
            title="Giỏ Hàng Trống"
            subTitle="Vui lòng thêm khóa học vào giỏ hàng trước khi thanh toán"
            extra={[
              <Button type="primary" size="large" onClick={() => navigate('/courses')}>
                Bắt Đầu Mua Sắm
              </Button>,
            ]}
          />
        </div>
      </MainLayout>
    );
  }

  if (done) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <Result
            status="success"
            title="Thanh Toán Thành Công! 🎉"
            subTitle={
              <div className="space-y-2">
                <div>Mã đơn hàng: <strong>#ORD-2025-{Math.floor(Math.random() * 9000 + 1000)}</strong></div>
                <div>Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.</div>
                <div className="text-green-600">Bạn có thể bắt đầu học ngay bây giờ!</div>
              </div>
            }
            extra={[
              <Button type="primary" key="courses" size="large" onClick={() => navigate('/courses')}>
                Bắt Đầu Học Ngay
              </Button>,
              <Button key="orders" size="large" onClick={() => navigate('/orders')}>
                Xem Đơn Hàng
              </Button>,
            ]}
          >
            <Card className="rounded-xl border-gray-100 mt-4">
              <Title level={5} className="mb-4">Chi Tiết Đơn Hàng</Title>
              {orderItems.map(item => (
                <div key={item.productId} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <img src={item.thumbnail} alt={item.title} className="w-12 h-8 object-cover rounded" />
                    <span className="text-sm text-gray-700">{item.title}</span>
                  </div>
                  <span className="text-blue-600 font-medium">{formatPrice(item.unitPrice)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-3 pt-3 border-t">
                <span>Tổng cộng</span>
                <span className="text-blue-600 text-lg">{formatPrice(total)}</span>
              </div>
            </Card>
          </Result>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-blue-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Title level={2} className="text-white mb-4">Thanh Toán</Title>
          <Steps
            current={step}
            className="max-w-lg"
            items={[
              { title: <span className="text-white">Thông tin</span> },
              { title: <span className="text-white">Thanh toán</span> },
              { title: <span className="text-white">Xác nhận</span> },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          {/* Form */}
          <Col xs={24} lg={16}>
            <Form form={form} layout="vertical">
              {/* Contact Info */}
              <Card className="rounded-xl shadow-sm border-gray-100 mb-6">
                <Title level={5} className="mb-4 flex items-center gap-2">
                  <UserOutlined className="text-blue-500" /> Thông Tin Liên Hệ
                </Title>
                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                      <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
                      <Input prefix={<PhoneOutlined />} placeholder="0909 123 456" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
                      <Input prefix={<MailOutlined />} placeholder="example@email.com" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="province" label="Tỉnh/Thành phố">
                      <Select placeholder="Chọn tỉnh/thành" size="large">
                        {provinces.map(p => <Option key={p} value={p}>{p}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="address" label="Địa chỉ">
                      <Input prefix={<HomeOutlined />} placeholder="Số nhà, đường, phường..." size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Payment Method */}
              <Card className="rounded-xl shadow-sm border-gray-100 mb-6">
                <Title level={5} className="mb-4 flex items-center gap-2">
                  <CreditCardOutlined className="text-blue-500" /> Phương Thức Thanh Toán
                </Title>
                <Radio.Group value={payMethod} onChange={e => setPayMethod(e.target.value)} className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'vnpay', label: 'VNPay', desc: 'Thanh toán qua cổng VNPay', icon: '🏦', color: '#0071c5' },
                      { key: 'zalopay', label: 'ZaloPay', desc: 'Ví điện tử ZaloPay', icon: '📱', color: '#0068ff' },
                      { key: 'momo', label: 'MoMo', desc: 'Ví điện tử MoMo', icon: '💜', color: '#ae2070' },
                      { key: 'card', label: 'Thẻ tín dụng', desc: 'Visa, Mastercard, JCB', icon: '💳', color: '#1a73e8' },
                      { key: 'bank', label: 'Chuyển khoản', desc: 'Ngân hàng nội địa', icon: '🏧', color: '#34a853' },
                      { key: 'cod', label: 'Tiền mặt', desc: 'Thanh toán khi nhận hàng', icon: '💵', color: '#fbbc04' },
                    ].map(pm => (
                      <Radio key={pm.key} value={pm.key} className="w-full">
                        <div className={`border-2 rounded-xl p-3 cursor-pointer transition-colors ${payMethod === pm.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{pm.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{pm.label}</div>
                              <div className="text-gray-400 text-xs">{pm.desc}</div>
                            </div>
                          </div>
                        </div>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>

                {payMethod === 'card' && (
                  <div className="mt-4 space-y-3">
                    <Form.Item name="cardNumber" label="Số thẻ" rules={[{ required: payMethod === 'card', message: 'Nhập số thẻ' }]}>
                      <Input prefix={<CreditCardOutlined />} placeholder="1234 5678 9012 3456" maxLength={19} />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="cardExpiry" label="Ngày hết hạn">
                          <Input placeholder="MM/YY" maxLength={5} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="cardCvv" label="CVV">
                          <Input.Password placeholder="123" maxLength={3} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card>
            </Form>
          </Col>

          {/* Order Summary */}
          <Col xs={24} lg={8}>
            <div className="sticky top-24">
              <Card className="rounded-xl shadow-sm border-gray-100">
                <Title level={5} className="mb-4 flex items-center gap-2">
                  <ShoppingOutlined className="text-blue-500" /> Tóm Tắt Đơn Hàng
                </Title>
                <div className="space-y-3 mb-4">
                  {orderItems.map(item => (
                    <div key={item.productId} className="flex gap-3">
                      <img src={item.thumbnail} alt={item.title} className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{item.title}</div>
                        <div className="text-blue-600 font-bold text-sm">{formatPrice(item.unitPrice)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Divider className="my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá (10%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600 text-lg">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  className="mt-4 h-12 rounded-xl text-base font-semibold bg-blue-600"
                  loading={processing}
                  onClick={handlePayment}
                  icon={<CheckCircleOutlined />}
                  disabled={cartItems.length === 0}
                >
                  {processing ? 'Đang xử lý...' : `Thanh Toán ${formatPrice(total)}`}
                </Button>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <SafetyCertificateOutlined className="text-green-500" />
                    <span>Thanh toán được mã hóa SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span>🔒</span>
                    <span>Thông tin bảo mật 100%</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span>🔄</span>
                    <span>Hoàn tiền trong 30 ngày</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-3">
                  {['VNPAY', 'Visa', 'Mastercard', 'ZaloPay'].map(p => (
                    <Tag key={p} className="text-xs">{p}</Tag>
                  ))}
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}

  if (done) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <Result
            status="success"
            title="Thanh Toán Thành Công! 🎉"
            subTitle={
              <div className="space-y-2">
                <div>Mã đơn hàng: <strong>#ORD-2025-{Math.floor(Math.random() * 9000 + 1000)}</strong></div>
                <div>Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.</div>
                <div className="text-green-600">Bạn có thể bắt đầu học ngay bây giờ!</div>
              </div>
            }
            extra={[
              <Button type="primary" key="courses" size="large" onClick={() => navigate('/courses')}>
                Bắt Đầu Học Ngay
              </Button>,
              <Button key="orders" size="large" onClick={() => navigate('/orders')}>
                Xem Đơn Hàng
              </Button>,
            ]}
          >
            <Card className="rounded-xl border-gray-100 mt-4">
              <Title level={5} className="mb-4">Chi Tiết Đơn Hàng</Title>
              {orderItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <img src={item.thumbnail} alt={item.title} className="w-12 h-8 object-cover rounded" />
                    <span className="text-sm text-gray-700">{item.title}</span>
                  </div>
                  <span className="text-blue-600 font-medium">{formatPrice(item.price)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-3 pt-3 border-t">
                <span>Tổng cộng</span>
                <span className="text-blue-600 text-lg">{formatPrice(total)}</span>
              </div>
            </Card>
          </Result>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-blue-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Title level={2} className="text-white mb-4">Thanh Toán</Title>
          <Steps
            current={step}
            className="max-w-lg"
            items={[
              { title: <span className="text-white">Thông tin</span> },
              { title: <span className="text-white">Thanh toán</span> },
              { title: <span className="text-white">Xác nhận</span> },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          {/* Form */}
          <Col xs={24} lg={16}>
            <Form form={form} layout="vertical">
              {/* Contact Info */}
              <Card className="rounded-xl shadow-sm border-gray-100 mb-6">
                <Title level={5} className="mb-4 flex items-center gap-2">
                  <UserOutlined className="text-blue-500" /> Thông Tin Liên Hệ
                </Title>
                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                      <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
                      <Input prefix={<PhoneOutlined />} placeholder="0909 123 456" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
                      <Input prefix={<MailOutlined />} placeholder="example@email.com" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="province" label="Tỉnh/Thành phố">
                      <Select placeholder="Chọn tỉnh/thành" size="large">
                        {provinces.map(p => <Option key={p} value={p}>{p}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="address" label="Địa chỉ">
                      <Input prefix={<HomeOutlined />} placeholder="Số nhà, đường, phường..." size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Payment Method */}
              <Card className="rounded-xl shadow-sm border-gray-100 mb-6">
                <Title level={5} className="mb-4 flex items-center gap-2">
                  <CreditCardOutlined className="text-blue-500" /> Phương Thức Thanh Toán
                </Title>
                <Radio.Group value={payMethod} onChange={e => setPayMethod(e.target.value)} className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'vnpay', label: 'VNPay', desc: 'Thanh toán qua cổng VNPay', icon: '🏦', color: '#0071c5' },
                      { key: 'zalopay', label: 'ZaloPay', desc: 'Ví điện tử ZaloPay', icon: '📱', color: '#0068ff' },
                      { key: 'momo', label: 'MoMo', desc: 'Ví điện tử MoMo', icon: '💜', color: '#ae2070' },
                      { key: 'card', label: 'Thẻ tín dụng', desc: 'Visa, Mastercard, JCB', icon: '💳', color: '#1a73e8' },
                      { key: 'bank', label: 'Chuyển khoản', desc: 'Ngân hàng nội địa', icon: '🏧', color: '#34a853' },
                      { key: 'cod', label: 'Tiền mặt', desc: 'Thanh toán khi nhận hàng', icon: '💵', color: '#fbbc04' },
                    ].map(pm => (
                      <Radio key={pm.key} value={pm.key} className="w-full">
                        <div className={`border-2 rounded-xl p-3 cursor-pointer transition-colors ${payMethod === pm.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{pm.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{pm.label}</div>
                              <div className="text-gray-400 text-xs">{pm.desc}</div>
                            </div>
                          </div>
                        </div>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>

                {payMethod === 'card' && (
                  <div className="mt-4 space-y-3">
                    <Form.Item name="cardNumber" label="Số thẻ" rules={[{ required: payMethod === 'card', message: 'Nhập số thẻ' }]}>
                      <Input prefix={<CreditCardOutlined />} placeholder="1234 5678 9012 3456" maxLength={19} />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="cardExpiry" label="Ngày hết hạn">
                          <Input placeholder="MM/YY" maxLength={5} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="cardCvv" label="CVV">
                          <Input.Password placeholder="123" maxLength={3} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card>
            </Form>
          </Col>

          {/* Order Summary */}
          <Col xs={24} lg={8}>
            <div className="sticky top-24">
              <Card className="rounded-xl shadow-sm border-gray-100">
                <Title level={5} className="mb-4 flex items-center gap-2">
                  <ShoppingOutlined className="text-blue-500" /> Tóm Tắt Đơn Hàng
                </Title>
                <div className="space-y-3 mb-4">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.thumbnail} alt={item.title} className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{item.title}</div>
                        <div className="text-blue-600 font-bold text-sm">{formatPrice(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Divider className="my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá (10%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600 text-lg">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  className="mt-4 h-12 rounded-xl text-base font-semibold bg-blue-600"
                  loading={processing}
                  onClick={handlePayment}
                  icon={<CheckCircleOutlined />}
                >
                  {processing ? 'Đang xử lý...' : `Thanh Toán ${formatPrice(total)}`}
                </Button>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <SafetyCertificateOutlined className="text-green-500" />
                    <span>Thanh toán được mã hóa SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span>🔒</span>
                    <span>Thông tin bảo mật 100%</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span>🔄</span>
                    <span>Hoàn tiền trong 30 ngày</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-3">
                  {['VNPAY', 'Visa', 'Mastercard', 'ZaloPay'].map(p => (
                    <Tag key={p} className="text-xs">{p}</Tag>
                  ))}
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
