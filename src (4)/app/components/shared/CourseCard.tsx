import { useState } from 'react';
import { Link } from 'react-router';
import { Card, Rate, Tag, Tooltip, Button, Badge } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined, UserOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import { Course, formatPrice } from '../../data/mockData';

interface CourseCardProps {
  course: Course;
  onAddToCart?: (course: Course) => void;
  onAddToWishlist?: (course: Course) => void;
  isWishlisted?: boolean;
  compact?: boolean;
}

export default function CourseCard({ course, onAddToCart, onAddToWishlist, isWishlisted = false, compact = false }: CourseCardProps) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [hover, setHover] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    onAddToWishlist?.(course);
  };

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(course);
  };

  return (
    <div
      className={`relative group transition-all duration-300 ${hover ? 'transform -translate-y-1' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to={`/courses/${course.slug}`}>
        <Card
          hoverable
          className="overflow-hidden border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
          cover={
            <div className="relative overflow-hidden" style={{ height: compact ? 160 : 200 }}>
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {course.bestseller && (
                  <Tag color="orange" className="text-xs font-bold m-0">BESTSELLER</Tag>
                )}
                {course.isNew && (
                  <Tag color="green" className="text-xs font-bold m-0">MỚI</Tag>
                )}
                {course.isFlashSale && (
                  <Tag color="red" className="text-xs font-bold m-0">⚡ FLASH SALE</Tag>
                )}
                {course.discount > 0 && (
                  <Tag color="volcano" className="text-xs font-bold m-0">-{course.discount}%</Tag>
                )}
              </div>
              {/* Wishlist button */}
              <button
                onClick={handleWishlist}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${
                  wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                {wishlisted ? <HeartFilled className="text-sm" /> : <HeartOutlined className="text-sm" />}
              </button>
              {/* Hover overlay */}
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${hover ? 'opacity-100' : 'opacity-0'}`}>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleCart}
                  className="bg-blue-600"
                >
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          }
          styles={{ body: { padding: compact ? '12px' : '16px' } }}
        >
          <div className="flex items-center gap-1 mb-1.5">
            <Tag color="blue" className="text-xs m-0">{course.category}</Tag>
            <Tag color="default" className="text-xs m-0">{course.level}</Tag>
          </div>

          <Tooltip title={course.title}>
            <h3 className={`font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug ${compact ? 'text-sm' : 'text-base'}`}>
              {course.title}
            </h3>
          </Tooltip>

          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-500 text-sm font-bold">{course.rating}</span>
            <Rate disabled defaultValue={course.rating} className="text-xs" allowHalf />
            <span className="text-gray-400 text-xs">({course.ratingCount.toLocaleString()})</span>
          </div>

          {!compact && (
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <UserOutlined /> {course.students.toLocaleString()} học viên
              </span>
              <span className="flex items-center gap-1">
                <ClockCircleOutlined /> {course.duration}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="text-blue-600 font-bold text-lg">{formatPrice(course.price)}</span>
              {course.originalPrice > course.price && (
                <span className="text-gray-400 line-through text-sm ml-2">{formatPrice(course.originalPrice)}</span>
              )}
            </div>
            {compact && (
              <button
                onClick={handleCart}
                className="w-8 h-8 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center text-blue-600 transition-colors"
              >
                <ShoppingCartOutlined className="text-sm" />
              </button>
            )}
          </div>

          {!compact && (
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1 text-xs text-gray-500">
              <img src={course.instructorAvatar} alt={course.instructor} className="w-4 h-4 rounded-full" />
              <span>{course.instructor}</span>
            </div>
          )}
        </Card>
      </Link>
    </div>
  );
}
