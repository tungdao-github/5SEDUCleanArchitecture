import { useState } from 'react';
import {
  Card, Typography, Button, Switch, Select, Input, Tabs, Row, Col,
  Slider, ColorPicker, Divider, Tag, message, Modal, Upload,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined,
  EyeOutlined, DragOutlined, PictureOutlined, UpOutlined,
  DownOutlined, BgColorsOutlined, LayoutOutlined, MobileOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface BannerItem {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  active: boolean;
  order: number;
}

const initBanners: BannerItem[] = [
  { id: 1, title: 'Học Lập Trình Cùng Chuyên Gia', subtitle: 'Hơn 248 khóa học từ các chuyên gia hàng đầu Việt Nam', buttonText: 'Khám Phá Ngay', buttonLink: '/courses', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', active: true, order: 1 },
  { id: 2, title: 'Flash Sale 50% Hôm Nay', subtitle: 'Ưu đãi có hạn - Chỉ còn 24 giờ!', buttonText: 'Mua Ngay', buttonLink: '/courses?sale=true', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', active: true, order: 2 },
  { id: 3, title: 'Chứng Chỉ Được Công Nhận', subtitle: 'Nâng cao sự nghiệp với chứng chỉ từ EduLearn', buttonText: 'Tìm Hiểu Thêm', buttonLink: '/about', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', active: false, order: 3 },
];

export default function AppearancePage() {
  const [banners, setBanners] = useState(initBanners);
  const [editBanner, setEditBanner] = useState<BannerItem | null>(null);
  const [bannerModal, setBannerModal] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#1d4ed8');
  const [borderRadius, setBorderRadius] = useState(10);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [headerStyle, setHeaderStyle] = useState('sticky');
  const [footerColumns, setFooterColumns] = useState(4);
  const [showChat, setShowChat] = useState(true);
  const [showFlashSale, setShowFlashSale] = useState(true);
  const [courseGridCols, setCourseGridCols] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  const openEditBanner = (banner?: BannerItem) => {
    setEditBanner(banner || { id: 0, title: '', subtitle: '', buttonText: '', buttonLink: '', image: '', active: true, order: banners.length + 1 });
    setBannerModal(true);
  };

  const saveBanner = () => {
    if (!editBanner) return;
    if (editBanner.id === 0) {
      setBanners(prev => [...prev, { ...editBanner, id: Date.now() }]);
      message.success('Đã thêm banner mới!');
    } else {
      setBanners(prev => prev.map(b => b.id === editBanner.id ? editBanner : b));
      message.success('Đã cập nhật banner!');
    }
    setBannerModal(false);
  };

  const moveBanner = (id: number, dir: 'up' | 'down') => {
    setBanners(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex(b => b.id === id);
      if (dir === 'up' && idx > 0) [sorted[idx].order, sorted[idx - 1].order] = [sorted[idx - 1].order, sorted[idx].order];
      if (dir === 'down' && idx < sorted.length - 1) [sorted[idx].order, sorted[idx + 1].order] = [sorted[idx + 1].order, sorted[idx].order];
      return [...sorted];
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">🎨 Quản Lý Giao Diện</Title>
          <Text className="text-gray-500">Tùy chỉnh giao diện và banner website</Text>
        </div>
        <div className="flex gap-3">
          <Button icon={<EyeOutlined />} onClick={() => setPreviewModal(true)}>Xem Trước</Button>
          <Button type="primary" icon={<SaveOutlined />} size="large" onClick={() => message.success('Đã lưu cài đặt giao diện!')}>
            Lưu Thay Đổi
          </Button>
        </div>
      </div>

      <Tabs
        defaultActiveKey="banners"
        items={[
          {
            key: 'banners',
            label: <span><PictureOutlined /> Banner & Slider</span>,
            children: (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Text className="text-gray-600">{banners.length} banner • {banners.filter(b => b.active).length} đang hiển thị</Text>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditBanner()}>Thêm Banner</Button>
                </div>

                <div className="space-y-4">
                  {[...banners].sort((a, b) => a.order - b.order).map((banner, idx) => (
                    <Card
                      key={banner.id}
                      className={`rounded-xl border ${!banner.active ? 'opacity-60 border-gray-200' : 'border-blue-200'}`}
                    >
                      <div className="flex gap-4 items-center">
                        {/* Drag Handle & Order */}
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <Button size="small" icon={<UpOutlined />} disabled={idx === 0} onClick={() => moveBanner(banner.id, 'up')} />
                          <Text className="text-gray-400 font-mono text-xs">{banner.order}</Text>
                          <Button size="small" icon={<DownOutlined />} disabled={idx === banners.length - 1} onClick={() => moveBanner(banner.id, 'down')} />
                        </div>

                        {/* Preview */}
                        <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 line-clamp-1">{banner.title}</div>
                          <div className="text-gray-500 text-sm line-clamp-1">{banner.subtitle}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Tag color="blue" className="text-xs">{banner.buttonText}</Tag>
                            <Text className="text-gray-400 text-xs">{banner.buttonLink}</Text>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Switch
                            checked={banner.active}
                            size="small"
                            onChange={checked => setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, active: checked } : b))}
                          />
                          <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEditBanner(banner)} />
                          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => { setBanners(prev => prev.filter(b => b.id !== banner.id)); message.success('Đã xóa banner!'); }} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
          {
            key: 'theme',
            label: <span><BgColorsOutlined /> Màu Sắc & Font</span>,
            children: (
              <div className="max-w-2xl space-y-6">
                <Card className="rounded-xl border-gray-100">
                  <Title level={5} className="mb-4">Màu Sắc Chính</Title>
                  <Row gutter={[16, 16]}>
                    {[
                      { label: 'Màu chính (Primary)', value: '#1d4ed8' },
                      { label: 'Màu phụ (Secondary)', value: '#7c3aed' },
                      { label: 'Màu thành công', value: '#16a34a' },
                      { label: 'Màu cảnh báo', value: '#d97706' },
                    ].map((item, i) => (
                      <Col span={12} key={i}>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-sm text-gray-700">{item.label}</div>
                            <div className="text-gray-400 text-xs font-mono">{item.value}</div>
                          </div>
                          <div className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer hover:scale-110 transition-transform" style={{ background: item.value }} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>

                <Card className="rounded-xl border-gray-100">
                  <Title level={5} className="mb-4">Typography</Title>
                  <Row gutter={[16, 16]}>
                    <Col span={16}>
                      <Text className="text-gray-600 text-sm block mb-2">Font chữ chính</Text>
                      <Select value={fontFamily} onChange={setFontFamily} className="w-full" size="large">
                        {['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Be Vietnam Pro'].map(f => (
                          <Option key={f} value={f}><span style={{ fontFamily: f }}>{f}</span></Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Text className="text-gray-600 text-sm block mb-2">Border radius</Text>
                      <div className="flex items-center gap-2">
                        <Slider min={0} max={20} value={borderRadius} onChange={setBorderRadius} className="flex-1" />
                        <Tag>{borderRadius}px</Tag>
                      </div>
                    </Col>
                  </Row>
                </Card>

                <Card className="rounded-xl border-gray-100">
                  <Title level={5} className="mb-4">Chế Độ Hiển Thị</Title>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-800">Dark Mode</div>
                      <div className="text-gray-400 text-xs">Giao diện tối cho website</div>
                    </div>
                    <Switch checked={darkMode} onChange={setDarkMode} />
                  </div>
                </Card>
              </div>
            ),
          },
          {
            key: 'layout',
            label: <span><LayoutOutlined /> Bố Cục & Hiển Thị</span>,
            children: (
              <div className="max-w-2xl space-y-4">
                <Card className="rounded-xl border-gray-100">
                  <Title level={5} className="mb-4">Header & Navigation</Title>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text className="text-sm text-gray-600 block mb-2">Kiểu Header</Text>
                      <Select value={headerStyle} onChange={setHeaderStyle} className="w-full">
                        <Option value="sticky">Cố định khi cuộn (Sticky)</Option>
                        <Option value="fixed">Luôn cố định (Fixed)</Option>
                        <Option value="static">Tĩnh (Static)</Option>
                      </Select>
                    </Col>
                    <Col span={12}>
                      <Text className="text-sm text-gray-600 block mb-2">Cột Footer</Text>
                      <Select value={footerColumns} onChange={setFooterColumns} className="w-full">
                        <Option value={3}>3 cột</Option>
                        <Option value={4}>4 cột</Option>
                        <Option value={5}>5 cột</Option>
                      </Select>
                    </Col>
                  </Row>
                </Card>

                <Card className="rounded-xl border-gray-100">
                  <Title level={5} className="mb-4">Trang Khóa Học</Title>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text className="text-sm text-gray-600 block mb-2">Số cột lưới khóa học</Text>
                      <Select value={courseGridCols} onChange={setCourseGridCols} className="w-full">
                        <Option value={2}>2 cột</Option>
                        <Option value={3}>3 cột</Option>
                        <Option value={4}>4 cột</Option>
                      </Select>
                    </Col>
                  </Row>
                </Card>

                <Card className="rounded-xl border-gray-100">
                  <Title level={5} className="mb-4">Hiển Thị Tính Năng</Title>
                  <div className="space-y-3">
                    {[
                      { label: 'Hiện chat hỗ trợ (floating)', desc: 'Widget chat góc dưới phải', value: showChat, onChange: setShowChat },
                      { label: 'Hiện banner Flash Sale', desc: 'Banner đếm ngược flash sale ở homepage', value: showFlashSale, onChange: setShowFlashSale },
                      { label: 'Hiện thanh thông báo (top bar)', desc: 'Thông tin liên hệ và mạng xã hội', value: true, onChange: () => {} },
                      { label: 'Hiện so sánh khóa học', desc: 'Tính năng so sánh tối đa 4 khóa học', value: true, onChange: () => {} },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{item.label}</div>
                          <div className="text-gray-400 text-xs">{item.desc}</div>
                        </div>
                        <Switch checked={item.value} onChange={item.onChange} />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="rounded-xl border-gray-100">
                  <Title level={5} className="mb-4"><MobileOutlined /> Responsive</Title>
                  <Row gutter={[12, 12]}>
                    {[
                      { label: 'Mobile (<768px)', status: true },
                      { label: 'Tablet (768-1024px)', status: true },
                      { label: 'Desktop (>1024px)', status: true },
                    ].map((item, i) => (
                      <Col span={8} key={i}>
                        <div className="text-center p-3 bg-green-50 rounded-xl">
                          <div className="text-green-600 font-medium text-sm">{item.label}</div>
                          <Tag color="green" className="mt-1">Tối ưu</Tag>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </div>
            ),
          },
          {
            key: 'custom',
            label: 'CSS Tùy Chỉnh',
            children: (
              <div className="max-w-3xl">
                <Card className="rounded-xl border-gray-100">
                  <Title level={5} className="mb-3">CSS Tùy Chỉnh</Title>
                  <Text className="text-gray-500 text-sm block mb-3">Thêm CSS tùy chỉnh sẽ được áp dụng cho toàn bộ website</Text>
                  <TextArea
                    rows={16}
                    className="font-mono text-sm"
                    placeholder={`/* Ví dụ tùy chỉnh CSS */\n.ant-btn-primary {\n  background: linear-gradient(135deg, #1d4ed8, #7c3aed);\n}\n\n.course-card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 20px 40px rgba(0,0,0,0.1);\n}`}
                    defaultValue={`.hero-banner {\n  min-height: 520px;\n}\n\n.course-card {\n  transition: transform 0.3s, box-shadow 0.3s;\n}`}
                  />
                  <div className="flex gap-2 mt-3">
                    <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success('Đã lưu CSS!')}>Lưu CSS</Button>
                    <Button onClick={() => message.info('Đang xem trước...')}>Xem Trước</Button>
                  </div>
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* Edit Banner Modal */}
      <Modal
        open={bannerModal}
        title={editBanner?.id === 0 ? 'Thêm Banner Mới' : 'Chỉnh Sửa Banner'}
        onCancel={() => setBannerModal(false)}
        onOk={saveBanner}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        {editBanner && (
          <div className="mt-4 space-y-3">
            <div>
              <Text className="text-sm text-gray-600 block mb-1">Tiêu đề</Text>
              <Input value={editBanner.title} onChange={e => setEditBanner({ ...editBanner, title: e.target.value })} size="large" placeholder="Tiêu đề banner" />
            </div>
            <div>
              <Text className="text-sm text-gray-600 block mb-1">Phụ đề</Text>
              <Input value={editBanner.subtitle} onChange={e => setEditBanner({ ...editBanner, subtitle: e.target.value })} placeholder="Mô tả ngắn" />
            </div>
            <Row gutter={[12, 0]}>
              <Col span={12}>
                <Text className="text-sm text-gray-600 block mb-1">Nút CTA</Text>
                <Input value={editBanner.buttonText} onChange={e => setEditBanner({ ...editBanner, buttonText: e.target.value })} placeholder="VD: Khám Phá Ngay" />
              </Col>
              <Col span={12}>
                <Text className="text-sm text-gray-600 block mb-1">Link nút</Text>
                <Input value={editBanner.buttonLink} onChange={e => setEditBanner({ ...editBanner, buttonLink: e.target.value })} placeholder="/courses" />
              </Col>
            </Row>
            <div>
              <Text className="text-sm text-gray-600 block mb-1">URL hình ảnh</Text>
              <Input value={editBanner.image} onChange={e => setEditBanner({ ...editBanner, image: e.target.value })} placeholder="https://..." />
            </div>
            {editBanner.image && (
              <img src={editBanner.image} alt="preview" className="w-full h-32 object-cover rounded-xl" />
            )}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <Text className="text-sm font-medium">Hiển thị banner này</Text>
              <Switch checked={editBanner.active} onChange={v => setEditBanner({ ...editBanner, active: v })} />
            </div>
          </div>
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal
        open={previewModal}
        title="Xem Trước Giao Diện"
        onCancel={() => setPreviewModal(false)}
        footer={<Button onClick={() => setPreviewModal(false)}>Đóng</Button>}
        width={900}
      >
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center text-sm">
              <span className="font-bold">EduLearn</span>
              <div className="flex gap-4">
                <span>Khóa Học</span><span>Blog</span><span>Về Chúng Tôi</span>
              </div>
              <span>Đăng nhập</span>
            </div>
            <div className="relative h-40 overflow-hidden">
              <img src={banners[0]?.image} alt="banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center px-8">
                <div className="text-white">
                  <div className="font-bold text-xl">{banners[0]?.title}</div>
                  <div className="text-sm opacity-80 mt-1">{banners[0]?.subtitle}</div>
                  <button className="mt-3 bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm">{banners[0]?.buttonText}</button>
                </div>
              </div>
            </div>
            <div className="p-4 text-gray-400 text-sm">[ Nội dung trang chủ... ]</div>
          </div>
          <Text className="text-gray-500 text-xs mt-2 block">Xem trước chỉ mang tính tham khảo</Text>
        </div>
      </Modal>
    </AdminLayout>
  );
}
