import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Row, Col, Card, Button, Empty, Typography, message, Tag, Tooltip } from 'antd';
import {
  HeartFilled, ShoppingCartOutlined, DeleteOutlined, ShareAltOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { courses, formatPrice } from '../data/mockData';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text } = Typography;

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(courses.slice(0, 5));

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(c => c.id !== id));
    message.success('Đã xóa khỏi danh sách yêu thích');
  };

  const addToCart = (id: number) => {
    message.success('Đã thêm vào giỏ hàng!');
  };

  return (
    <MainLayout wishlistCount={wishlist.length}>
      <div className="bg-gradient-to-r from-pink-600 to-red-500 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Title level={2} className="text-white mb-0 flex items-center gap-2">
            <HeartFilled /> Danh Sách Yêu Thích ({wishlist.length})
          </Title>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <HeartFilled className="text-8xl text-gray-200 block mx-auto mb-4" />
            <Empty description={
              <div>
                <div className="text-gray-500 text-lg mb-2">Danh sách yêu thích trống</div>
                <div className="text-gray-400">Hãy thêm các khóa học bạn quan tâm</div>
              </div>
            } />
            <Button type="primary" size="large" className="mt-6" onClick={() => navigate('/courses')}>
              Khám Phá Khóa Học
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <Text className="text-gray-600">{wishlist.length} khóa học được lưu</Text>
              <div className="flex gap-2">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => { message.success('Đã thêm tất cả vào giỏ hàng!'); }}
                >
                  Thêm tất cả vào giỏ
                </Button>
                <Button
                  danger
                  onClick={() => { setWishlist([]); message.success('Đã xóa tất cả'); }}
                >
                  Xóa tất cả
                </Button>
              </div>
            </div>

            <Row gutter={[16, 16]}>
              {wishlist.map(course => (
                <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                  <Card
                    className="rounded-xl border-gray-100 hover:shadow-lg transition-shadow overflow-hidden"
                    cover={
                      <div className="relative">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-40 object-cover cursor-pointer"
                          onClick={() => navigate(`/courses/${course.slug}`)}
                        />
                        <button
                          onClick={() => removeFromWishlist(course.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                        >
                          <HeartFilled className="text-sm" />
                        </button>
                        {course.isFlashSale && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <FireOutlined /> Flash Sale
                          </div>
                        )}
                      </div>
                    }
                    styles={{ body: { padding: '12px' } }}
                  >
                    <Tooltip title={course.title}>
                      <h3
                        className="font-semibold text-gray-900 line-clamp-2 text-sm cursor-pointer hover:text-blue-600 mb-2"
                        onClick={() => navigate(`/courses/${course.slug}`)}
                      >
                        {course.title}
                      </h3>
                    </Tooltip>

                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500 text-sm font-bold">{course.rating}</span>
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="text-gray-400 text-xs">({course.ratingCount.toLocaleString()})</span>
                    </div>

                    <div className="mb-3">
                      <span className="text-blue-600 font-bold">{formatPrice(course.price)}</span>
                      {course.originalPrice > course.price && (
                        <span className="text-gray-400 line-through text-xs ml-2">{formatPrice(course.originalPrice)}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="primary"
                        size="small"
                        icon={<ShoppingCartOutlined />}
                        block
                        onClick={() => addToCart(course.id)}
                        className="flex-1"
                      >
                        Thêm giỏ
                      </Button>
                      <Button
                        size="small"
                        icon={<ShareAltOutlined />}
                        onClick={() => message.info('Đã sao chép link!')}
                      />
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromWishlist(course.id)}
                      />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </MainLayout>
  );
}
