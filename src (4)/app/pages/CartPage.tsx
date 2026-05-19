import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Row, Col, Card, Button, Input, Divider, Tag, Empty, Typography,
  message, Steps, Checkbox, InputNumber,
} from 'antd';
import {
  ShoppingCartOutlined, DeleteOutlined, HeartOutlined, TagOutlined,
  SafetyCertificateOutlined, ArrowRightOutlined, GiftOutlined,
} from '@ant-design/icons';
import { courses as mockCourses, formatPrice } from '../data/mockData';
import { useCart } from '../services/useCart';
import { useCourses } from '../services/useCourses';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text } = Typography;

export default function CartPage() {
  const navigate = useNavigate();
  const { items: cartItems, total: cartTotal, add: addToCart, clear: clearCart } = useCart();
  const { courses } = useCourses();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());

  const displayItems = useMemo(() => {
    return cartItems.map(cartItem => {
      const course = courses.find(c => c.id === cartItem.productId) ||
                    mockCourses.find(c => c.id === cartItem.productId);
      return {
        ...cartItem,
        ...course,
        selected: selectedItemIds.has(cartItem.productId),
      };
    });
  }, [cartItems, courses, selectedItemIds]);

  const selectedItems = displayItems.filter(i => i.selected);
  const subtotal = selectedItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const couponDiscount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount) : 0;
  const total = subtotal - couponDiscount;

  const removeItem = async (productId: number) => {
    setSelectedItemIds(prev => {
      const updated = new Set(prev);
      updated.delete(productId);
      return updated;
    });
    message.success('Đã xóa khỏi giỏ hàng');
  };

  const toggleSelect = (productId: number) => {
    setSelectedItemIds(prev => {
      const updated = new Set(prev);
      if (updated.has(productId)) {
        updated.delete(productId);
      } else {
        updated.add(productId);
      }
      return updated;
    });
  };

  const selectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItemIds(new Set(displayItems.map(i => i.productId)));
    } else {
      setSelectedItemIds(new Set());
    }
  };

  const applyCoupon = async () => {
    setCouponLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setCouponLoading(false);
    if (coupon.toUpperCase() === 'EDULEARN20') {
      setAppliedCoupon({ code: 'EDULEARN20', discount: 0.2 });
      message.success('Mã giảm giá đã được áp dụng! Giảm 20%');
    } else if (coupon.toUpperCase() === 'NEW50') {
      setAppliedCoupon({ code: 'NEW50', discount: 0.5 });
      message.success('Mã giảm giá đã được áp dụng! Giảm 50%');
    } else {
      message.error('Mã giảm giá không hợp lệ');
    }
  };

  return (
    <MainLayout cartCount={displayItems.length}>
      <div className="bg-blue-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Title level={2} className="text-white mb-0 flex items-center gap-2">
            <ShoppingCartOutlined /> Giỏ Hàng ({displayItems.length} khóa học)
          </Title>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {displayItems.length === 0 ? (
          <div className="text-center py-20">
            <Empty
              image={<ShoppingCartOutlined className="text-8xl text-gray-300" />}
              description={
                <div>
                  <div className="text-gray-500 text-lg mb-2">Giỏ hàng trống</div>
                  <div className="text-gray-400">Hãy thêm khóa học yêu thích vào giỏ hàng</div>
                </div>
              }
            />
            <Button type="primary" size="large" className="mt-6" onClick={() => navigate('/courses')}>
              Khám Phá Khóa Học
            </Button>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {/* Cart Items */}
            <Col xs={24} lg={16}>
              <Card className="rounded-xl shadow-sm border-gray-100 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <Checkbox
                    checked={selectedItems.length === displayItems.length && displayItems.length > 0}
                    indeterminate={selectedItems.length > 0 && selectedItems.length < displayItems.length}
                    onChange={e => selectAll(e.target.checked)}
                  >
                    <span className="font-medium">Chọn tất cả ({displayItems.length})</span>
                  </Checkbox>
                  {selectedItems.length > 0 && (
                    <Button
                      type="link"
                      danger
                      size="small"
                      onClick={() => {
                        selectedItems.forEach(i => removeItem(i.productId));
                        setSelectedItemIds(new Set());
                      }}
                    >
                      Xóa đã chọn ({selectedItems.length})
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {displayItems.map(item => (
                    <div key={item.productId} className={`flex gap-4 p-4 rounded-xl border transition-colors ${item.selected ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100 bg-white'}`}>
                      <Checkbox checked={item.selected} onChange={() => toggleSelect(item.productId)} className="mt-1" />
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-28 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/courses/${item.slug}`)}
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 line-clamp-2 mb-1"
                          onClick={() => navigate(`/courses/${item.slug}`)}
                        >
                          {item.title}
                        </h3>
                        <div className="text-gray-500 text-sm mb-2">
                          Giảng viên: {item.instructor}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag color="blue">{item.category}</Tag>
                          <Tag>{item.level}</Tag>
                          <Tag>{item.duration}</Tag>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-blue-600 font-bold text-lg">{formatPrice(item.unitPrice)}</div>
                          {item.originalPrice && item.originalPrice > item.unitPrice && (
                            <div className="text-gray-400 line-through text-sm">{formatPrice(item.originalPrice)}</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="text"
                            size="small"
                            icon={<HeartOutlined />}
                            className="text-gray-400 hover:text-red-500"
                          />
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => removeItem(item.productId)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suggested courses */}
              <Card className="rounded-xl shadow-sm border-gray-100">
                <Title level={5} className="mb-4">💡 Có Thể Bạn Thích</Title>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {courses.slice(0, 3).map(c => (
                    <div
                      key={c.id}
                      className="border border-gray-100 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/courses/${c.slug}`)}
                    >
                      <img src={c.thumbnail} alt={c.title} className="w-full h-24 object-cover rounded-lg mb-2" />
                      <div className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">{c.title}</div>
                      <div className="text-blue-600 font-bold text-sm">{formatPrice(c.price)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* Order Summary */}
            <Col xs={24} lg={8}>
              <div className="sticky top-24 space-y-4">
                {/* Coupon */}
                <Card className="rounded-xl shadow-sm border-gray-100">
                  <Title level={5} className="mb-3 flex items-center gap-2">
                    <GiftOutlined className="text-blue-500" /> Mã Giảm Giá
                  </Title>
                  {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <Tag color="green">{appliedCoupon.code}</Tag>
                        <span className="text-green-700 text-sm ml-2">Giảm {appliedCoupon.discount * 100}%</span>
                      </div>
                      <Button size="small" danger onClick={() => { setAppliedCoupon(null); setCoupon(''); }}>
                        Xóa
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá..."
                        value={coupon}
                        onChange={e => setCoupon(e.target.value.toUpperCase())}
                        onPressEnter={applyCoupon}
                        prefix={<TagOutlined className="text-gray-400" />}
                      />
                      <Button
                        type="primary"
                        onClick={applyCoupon}
                        loading={couponLoading}
                        disabled={!coupon}
                      >
                        Áp dụng
                      </Button>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    Thử: <span className="text-blue-500 cursor-pointer" onClick={() => setCoupon('EDULEARN20')}>EDULEARN20</span> hoặc <span className="text-blue-500 cursor-pointer" onClick={() => setCoupon('NEW50')}>NEW50</span>
                  </div>
                </Card>

                {/* Summary */}
                <Card className="rounded-xl shadow-sm border-gray-100">
                  <Title level={5} className="mb-4">Tóm Tắt Đơn Hàng</Title>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính ({selectedItems.length} khóa học)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá ({appliedCoupon.code})</span>
                        <span>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <Divider className="my-2" />
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="text-green-600 text-xs text-right">
                        Bạn tiết kiệm {formatPrice(couponDiscount)}!
                      </div>
                    )}
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    className="mt-4 h-12 rounded-xl text-base font-semibold bg-blue-600"
                    icon={<ArrowRightOutlined />}
                    disabled={selectedItems.length === 0}
                    onClick={() => navigate('/checkout')}
                  >
                    Tiến Hành Thanh Toán
                  </Button>
                  <Button block className="mt-2" onClick={() => navigate('/courses')}>
                    Tiếp Tục Mua Sắm
                  </Button>

                  <div className="mt-4 space-y-2">
                    {[
                      { icon: <SafetyCertificateOutlined className="text-green-500" />, text: 'Thanh toán bảo mật SSL' },
                      { icon: '🔄', text: 'Hoàn tiền 30 ngày' },
                      { icon: '🔐', text: 'Thông tin bảo mật tuyệt đối' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-500 text-xs">
                        {item.icon}
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </MainLayout>
  );
}

  return (
    <MainLayout cartCount={cartItems.length}>
      <div className="bg-blue-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Title level={2} className="text-white mb-0 flex items-center gap-2">
            <ShoppingCartOutlined /> Giỏ Hàng ({cartItems.length} khóa học)
          </Title>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <Empty
              image={<ShoppingCartOutlined className="text-8xl text-gray-300" />}
              description={
                <div>
                  <div className="text-gray-500 text-lg mb-2">Giỏ hàng trống</div>
                  <div className="text-gray-400">Hãy thêm khóa học yêu thích vào giỏ hàng</div>
                </div>
              }
            />
            <Button type="primary" size="large" className="mt-6" onClick={() => navigate('/courses')}>
              Khám Phá Khóa Học
            </Button>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {/* Cart Items */}
            <Col xs={24} lg={16}>
              <Card className="rounded-xl shadow-sm border-gray-100 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <Checkbox
                    checked={selectedItems.length === cartItems.length}
                    indeterminate={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                    onChange={e => selectAll(e.target.checked)}
                  >
                    <span className="font-medium">Chọn tất cả ({cartItems.length})</span>
                  </Checkbox>
                  {selectedItems.length > 0 && (
                    <Button
                      type="link"
                      danger
                      size="small"
                      onClick={() => {
                        setCartItems(prev => prev.filter(i => !i.selected));
                        message.success('Đã xóa các mục đã chọn');
                      }}
                    >
                      Xóa đã chọn ({selectedItems.length})
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className={`flex gap-4 p-4 rounded-xl border transition-colors ${item.selected ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100 bg-white'}`}>
                      <Checkbox checked={item.selected} onChange={() => toggleSelect(item.id)} className="mt-1" />
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-28 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/courses/${item.slug}`)}
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 line-clamp-2 mb-1"
                          onClick={() => navigate(`/courses/${item.slug}`)}
                        >
                          {item.title}
                        </h3>
                        <div className="text-gray-500 text-sm mb-2">
                          Giảng viên: {item.instructor}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag color="blue">{item.category}</Tag>
                          <Tag>{item.level}</Tag>
                          <Tag>{item.duration}</Tag>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-blue-600 font-bold text-lg">{formatPrice(item.price)}</div>
                          {item.originalPrice > item.price && (
                            <div className="text-gray-400 line-through text-sm">{formatPrice(item.originalPrice)}</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="text"
                            size="small"
                            icon={<HeartOutlined />}
                            className="text-gray-400 hover:text-red-500"
                          />
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => removeItem(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suggested courses */}
              <Card className="rounded-xl shadow-sm border-gray-100">
                <Title level={5} className="mb-4">💡 Có Thể Bạn Thích</Title>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {courses.slice(4, 7).map(c => (
                    <div
                      key={c.id}
                      className="border border-gray-100 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/courses/${c.slug}`)}
                    >
                      <img src={c.thumbnail} alt={c.title} className="w-full h-24 object-cover rounded-lg mb-2" />
                      <div className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">{c.title}</div>
                      <div className="text-blue-600 font-bold text-sm">{formatPrice(c.price)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* Order Summary */}
            <Col xs={24} lg={8}>
              <div className="sticky top-24 space-y-4">
                {/* Coupon */}
                <Card className="rounded-xl shadow-sm border-gray-100">
                  <Title level={5} className="mb-3 flex items-center gap-2">
                    <GiftOutlined className="text-blue-500" /> Mã Giảm Giá
                  </Title>
                  {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <Tag color="green">{appliedCoupon.code}</Tag>
                        <span className="text-green-700 text-sm ml-2">Giảm {appliedCoupon.discount * 100}%</span>
                      </div>
                      <Button size="small" danger onClick={() => { setAppliedCoupon(null); setCoupon(''); }}>
                        Xóa
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá..."
                        value={coupon}
                        onChange={e => setCoupon(e.target.value.toUpperCase())}
                        onPressEnter={applyCoupon}
                        prefix={<TagOutlined className="text-gray-400" />}
                      />
                      <Button
                        type="primary"
                        onClick={applyCoupon}
                        loading={couponLoading}
                        disabled={!coupon}
                      >
                        Áp dụng
                      </Button>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    Thử: <span className="text-blue-500 cursor-pointer" onClick={() => setCoupon('EDULEARN20')}>EDULEARN20</span> hoặc <span className="text-blue-500 cursor-pointer" onClick={() => setCoupon('NEW50')}>NEW50</span>
                  </div>
                </Card>

                {/* Summary */}
                <Card className="rounded-xl shadow-sm border-gray-100">
                  <Title level={5} className="mb-4">Tóm Tắt Đơn Hàng</Title>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính ({selectedItems.length} khóa học)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá ({appliedCoupon.code})</span>
                        <span>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <Divider className="my-2" />
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="text-green-600 text-xs text-right">
                        Bạn tiết kiệm {formatPrice(couponDiscount)}!
                      </div>
                    )}
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    className="mt-4 h-12 rounded-xl text-base font-semibold bg-blue-600"
                    icon={<ArrowRightOutlined />}
                    disabled={selectedItems.length === 0}
                    onClick={() => navigate('/checkout')}
                  >
                    Tiến Hành Thanh Toán
                  </Button>
                  <Button block className="mt-2" onClick={() => navigate('/courses')}>
                    Tiếp Tục Mua Sắm
                  </Button>

                  <div className="mt-4 space-y-2">
                    {[
                      { icon: <SafetyCertificateOutlined className="text-green-500" />, text: 'Thanh toán bảo mật SSL' },
                      { icon: '🔄', text: 'Hoàn tiền 30 ngày' },
                      { icon: '🔐', text: 'Thông tin bảo mật tuyệt đối' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-500 text-xs">
                        {item.icon}
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </MainLayout>
  );
}
