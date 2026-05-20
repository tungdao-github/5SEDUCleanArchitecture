import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import {
  Row, Col, Select, Slider, Checkbox, Radio, Input, Button, Space,
  Typography, Tag, Breadcrumb, Pagination, Empty, Drawer,
} from 'antd';
import {
  FilterOutlined, SearchOutlined, AppstoreOutlined, BarsOutlined,
} from '@ant-design/icons';
import { categories as mockCategories, formatPrice } from '../data/mockData';
import { useCourses } from '../services/useCourses';
import { useCategories } from '../services/useCategories';
import CourseCard from '../components/shared/CourseCard';
import MainLayout from '../components/layout/MainLayout';
import { message } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMinPrice = Math.max(0, Math.min(2000000, Number(searchParams.get('min')) || 0));
  const initialMaxPrice = Math.max(initialMinPrice, Math.min(2000000, Number(searchParams.get('max')) || 2000000));
  const initialRating = [0, 4, 4.5, 4.8].includes(Number(searchParams.get('rating')))
    ? Number(searchParams.get('rating'))
    : 0;
  const initialPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const initialLevels = searchParams.get('levels')?.split(',').filter(Boolean) ?? [];
  const initialView = searchParams.get('view') === 'list' ? 'list' : 'grid';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialView);
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('cat') ? [searchParams.get('cat')!] : []
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevels);
  const [selectedRating, setSelectedRating] = useState<number>(initialRating);
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [page, setPage] = useState(initialPage);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [cartCount] = useState(2);
  const { courses, isLoading: isLoadingCourses, error: courseApiError } = useCourses();
  const { categories } = useCategories();
  const pageSize = 9;

  const displayCategories = categories.length > 0 ? categories : mockCategories;

  const updateQueryParams = (nextValues: {
    q?: string;
    cat?: string[];
    sale?: string | null;
    levels?: string[];
    rating?: number;
    min?: number;
    max?: number;
    page?: number;
    sort?: string;
    view?: 'grid' | 'list';
  }) => {
    const next = new URLSearchParams(searchParams);
    if (nextValues.q !== undefined) {
      if (nextValues.q.trim()) next.set('q', nextValues.q.trim());
      else next.delete('q');
    }

    if (nextValues.cat !== undefined) {
      if (nextValues.cat.length > 0) next.set('cat', nextValues.cat[0]);
      else next.delete('cat');
    }

    if (nextValues.sale !== undefined) {
      if (nextValues.sale) next.set('sale', nextValues.sale);
      else next.delete('sale');
    }

    if (nextValues.levels !== undefined) {
      if (nextValues.levels.length > 0) next.set('levels', nextValues.levels.join(','));
      else next.delete('levels');
    }

    if (nextValues.rating !== undefined) {
      if (nextValues.rating > 0) next.set('rating', String(nextValues.rating));
      else next.delete('rating');
    }

    if (nextValues.min !== undefined && nextValues.max !== undefined) {
      if (nextValues.min > 0 || nextValues.max < 2000000) {
        next.set('min', String(nextValues.min));
        next.set('max', String(nextValues.max));
      } else {
        next.delete('min');
        next.delete('max');
      }
    }

    if (nextValues.page !== undefined) {
      if (nextValues.page > 1) next.set('page', String(nextValues.page));
      else next.delete('page');
    }

    if (nextValues.sort !== undefined) {
      if (nextValues.sort && nextValues.sort !== 'popular') next.set('sort', nextValues.sort);
      else next.delete('sort');
    }

    if (nextValues.view !== undefined) {
      if (nextValues.view === 'list') next.set('view', 'list');
      else next.delete('view');
    }

    setSearchParams(next);
  };

  const filteredCourses = useMemo(() => {
    let result = [...courses];
    if (keyword) result = result.filter(c => c.title.toLowerCase().includes(keyword.toLowerCase()) || c.description.toLowerCase().includes(keyword.toLowerCase()));
    if (selectedCategories.length > 0) result = result.filter(c => selectedCategories.includes(c.categorySlug));
    if (selectedLevels.length > 0) result = result.filter(c => selectedLevels.includes(c.level));
    if (selectedRating > 0) result = result.filter(c => c.rating >= selectedRating);
    result = result.filter(c => c.price >= priceRange[0] && c.price <= priceRange[1]);
    if (searchParams.get('sale') === 'true') result = result.filter(c => c.isFlashSale);

    switch (sort) {
      case 'popular': return result.sort((a, b) => b.students - a.students);
      case 'newest': return result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      default: return result;
    }
  }, [courses, keyword, selectedCategories, selectedLevels, selectedRating, priceRange, sort, searchParams]);

  const paginatedCourses = filteredCourses.slice((page - 1) * pageSize, page * pageSize);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <Text className="font-semibold text-gray-800 block mb-3">🔍 Tìm kiếm</Text>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tên khóa học..."
          value={keyword}
          onChange={e => {
            setKeyword(e.target.value);
            updateQueryParams({ q: e.target.value, page: 1 });
            setPage(1);
          }}
          allowClear
        />
      </div>

      <div>
        <Text className="font-semibold text-gray-800 block mb-3">📂 Danh Mục</Text>
        <Checkbox.Group
          className="flex flex-col gap-2"
          value={selectedCategories}
          onChange={(vals) => {
            const nextCategories = vals as string[];
            setSelectedCategories(nextCategories);
            updateQueryParams({ cat: nextCategories, page: 1 });
            setPage(1);
          }}
        >
          {displayCategories.map(cat => (
            <Checkbox key={cat.slug} value={cat.slug}>
              <span className="text-sm">{cat.icon} {cat.name}</span>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <div>
        <Text className="font-semibold text-gray-800 block mb-3">💰 Khoảng Giá</Text>
        <Slider
          range
          min={0}
          max={2000000}
          step={50000}
          value={priceRange}
          onChange={(val) => {
            const nextRange = val as [number, number];
            setPriceRange(nextRange);
            updateQueryParams({ min: nextRange[0], max: nextRange[1], page: 1 });
            setPage(1);
          }}
          tooltip={{ formatter: (v) => formatPrice(v!) }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <Text className="font-semibold text-gray-800 block mb-3">📊 Trình Độ</Text>
        <Checkbox.Group
          className="flex flex-col gap-2"
          value={selectedLevels}
          onChange={(vals) => {
            const nextLevels = vals as string[];
            setSelectedLevels(nextLevels);
            updateQueryParams({ levels: nextLevels, page: 1 });
            setPage(1);
          }}
        >
          {['Từ cơ bản', 'Trung cấp', 'Nâng cao'].map(level => (
            <Checkbox key={level} value={level}>
              <span className="text-sm">{level}</span>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <div>
        <Text className="font-semibold text-gray-800 block mb-3">⭐ Đánh Giá Tối Thiểu</Text>
        <Radio.Group value={selectedRating} onChange={e => {
          setSelectedRating(e.target.value);
          updateQueryParams({ rating: e.target.value, page: 1 });
          setPage(1);
        }} className="flex flex-col gap-2">
          {[0, 4, 4.5, 4.8].map(r => (
            <Radio key={r} value={r}>
              <span className="text-sm">
                {r === 0 ? 'Tất cả' : `${r}★ trở lên`}
              </span>
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <Button
        block
        onClick={() => {
          setSelectedCategories([]);
          setSelectedLevels([]);
          setSelectedRating(0);
          setPriceRange([0, 2000000]);
          setKeyword('');
          updateQueryParams({ q: '', cat: [], levels: [], rating: 0, min: 0, max: 2000000, page: 1, sale: null });
          setPage(1);
        }}
      >
        Xóa bộ lọc
      </Button>
    </div>
  );

  return (
    <MainLayout cartCount={cartCount}>
      <div className="bg-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ title: 'Trang chủ' }, { title: 'Khóa học' }]} className="text-blue-200 mb-3" />
          <Title level={2} className="text-white mb-0">
            {searchParams.get('sale') === 'true' ? '⚡ Flash Sale' : 'Tất Cả Khóa Học'}
          </Title>
          <Text className="text-blue-100">
            {isLoadingCourses
              ? 'Đang tải dữ liệu từ API...'
              : `${filteredCourses.length} khóa học được tìm thấy`}
          </Text>
          {courseApiError && (
            <Text className="block text-blue-100 text-sm mt-1">
              API chưa sẵn sàng, đang hiển thị dữ liệu mẫu.
            </Text>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          {/* Filter sidebar - desktop */}
          <Col xs={0} lg={6}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <Text className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-4">
                <FilterOutlined /> Bộ Lọc
              </Text>
              <FilterPanel />
            </div>
          </Col>

          {/* Course listing */}
          <Col xs={24} lg={18}>
            {/* Toolbar */}
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setFilterDrawer(true)}
                  className="lg:hidden"
                >
                  Bộ lọc
                </Button>
                <Text className="text-gray-500 text-sm">
                  Hiển thị <strong>{paginatedCourses.length}</strong> / {filteredCourses.length} kết quả
                </Text>
                {selectedCategories.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {selectedCategories.map(cat => (
                        <Tag
                        key={cat}
                        closable
                        onClose={() => {
                          setSelectedCategories(prev => {
                            const nextCategories = prev.filter(c => c !== cat);
                            updateQueryParams({ cat: nextCategories, page: 1 });
                            return nextCategories;
                          });
                        }}
                      >
                        {displayCategories.find(c => c.slug === cat)?.name ?? cat}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={sort}
                  onChange={(nextSort) => {
                    setSort(nextSort);
                    updateQueryParams({ sort: nextSort, page: 1 });
                    setPage(1);
                  }}
                  style={{ width: 180 }}
                  size="small"
                >
                  <Option value="popular">Phổ biến nhất</Option>
                  <Option value="newest">Mới nhất</Option>
                  <Option value="rating">Đánh giá cao</Option>
                  <Option value="price-asc">Giá tăng dần</Option>
                  <Option value="price-desc">Giá giảm dần</Option>
                </Select>
                <Space.Compact size="small">
                  <Button
                    icon={<AppstoreOutlined />}
                    type={viewMode === 'grid' ? 'primary' : 'default'}
                    onClick={() => {
                      setViewMode('grid');
                      updateQueryParams({ view: 'grid' });
                    }}
                  />
                  <Button
                    icon={<BarsOutlined />}
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    onClick={() => {
                      setViewMode('list');
                      updateQueryParams({ view: 'list' });
                    }}
                  />
                </Space.Compact>
              </div>
            </div>

            {paginatedCourses.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center shadow-sm">
                <Empty description="Không tìm thấy khóa học phù hợp" />
                <Button
                  type="primary"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedLevels([]);
                    setSelectedRating(0);
                    setPriceRange([0, 2000000]);
                    setKeyword('');
                    updateQueryParams({ q: '', cat: [], levels: [], rating: 0, min: 0, max: 2000000, page: 1, sale: null });
                    setPage(1);
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {paginatedCourses.map(course => (
                    <Col
                      key={course.id}
                      xs={24}
                      sm={viewMode === 'grid' ? 12 : 24}
                      md={viewMode === 'grid' ? 12 : 24}
                      lg={viewMode === 'grid' ? 8 : 24}
                    >
                      <CourseCard
                        course={course}
                        compact={viewMode === 'list'}
                        onAddToCart={() => message.success('Đã thêm vào giỏ!')}
                      />
                    </Col>
                  ))}
                </Row>
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={page}
                    total={filteredCourses.length}
                    pageSize={pageSize}
                    onChange={p => {
                      setPage(p);
                      updateQueryParams({ page: p });
                      window.scrollTo(0, 0);
                    }}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} khóa học`}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>

      {/* Mobile filter drawer */}
      <Drawer
        title={<span><FilterOutlined /> Bộ Lọc</span>}
        placement="left"
        open={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        styles={{ wrapper: { width: 300 } }}
      >
        <FilterPanel />
      </Drawer>
    </MainLayout>
  );
}
