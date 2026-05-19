import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import {
  Layout, Menu, Input, Badge, Avatar, Dropdown, Button, Space, Drawer,
  Typography, Tag, AutoComplete, message,
} from 'antd';
import {
  ShoppingCartOutlined, HeartOutlined, BellOutlined, UserOutlined,
  SearchOutlined, MenuOutlined, BookOutlined, LogoutOutlined,
  DashboardOutlined, OrderedListOutlined, LockOutlined, GlobalOutlined,
  PhoneOutlined, MailOutlined, FacebookOutlined, YoutubeOutlined,
  InstagramOutlined, TwitterOutlined, FireOutlined, StarOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { courses } from '../../data/mockData';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const navItems = [
  { key: '/', label: 'Trang Chủ' },
  {
    key: '/courses', label: 'Khóa Học',
    children: [
      { key: '/courses?cat=lap-trinh', label: '💻 Lập Trình' },
      { key: '/courses?cat=thiet-ke', label: '🎨 Thiết Kế' },
      { key: '/courses?cat=marketing', label: '📈 Marketing' },
      { key: '/courses?cat=kinh-doanh', label: '💼 Kinh Doanh' },
      { key: '/courses?cat=ngoai-ngu', label: '🌍 Ngoại Ngữ' },
      { key: '/courses?cat=am-nhac', label: '🎵 Âm Nhạc' },
    ]
  },
  { key: '/blog', label: 'Blog' },
  { key: '/about', label: 'Giới Thiệu' },
  { key: '/contact', label: 'Liên Hệ' },
];

const languages = [
  { key: 'vi', label: '🇻🇳 Tiếng Việt' },
  { key: 'en', label: '🇺🇸 English' },
  { key: 'zh', label: '🇨🇳 中文' },
];

interface MainLayoutProps {
  children: React.ReactNode;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function MainLayout({
  children,
  cartCount = 2,
  wishlistCount = 5,
  isLoggedIn = true,
}: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOptions, setSearchOptions] = useState<{ value: string; label: React.ReactNode }[]>([]);
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (value: string) => {
    if (value.trim()) navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleSearchChange = (val: string) => {
    if (!val) { setSearchOptions([]); return; }
    const filtered = courses
      .filter(c => c.title.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 6)
      .map(c => ({
        value: c.title,
        label: (
          <div className="flex items-center gap-2 py-1">
            <img src={c.thumbnail} alt={c.title} className="w-10 h-7 object-cover rounded" />
            <div>
              <div className="text-sm font-medium text-gray-800 line-clamp-1">{c.title}</div>
              <div className="text-xs text-orange-500">{(c.price).toLocaleString('vi-VN')}đ</div>
            </div>
          </div>
        ),
      }));
    setSearchOptions(filtered);
  };

  const userMenuItems = isLoggedIn ? [
    { key: 'profile', label: <Link to="/profile">Tài khoản của tôi</Link>, icon: <UserOutlined /> },
    { key: 'orders', label: <Link to="/orders">Đơn hàng</Link>, icon: <OrderedListOutlined /> },
    { key: 'wishlist', label: <Link to="/wishlist">Yêu thích</Link>, icon: <HeartOutlined /> },
    { key: 'history', label: <Link to="/history">Lịch sử xem</Link>, icon: <HistoryOutlined /> },
    { key: 'notifications', label: <Link to="/notifications">Thông báo</Link>, icon: <BellOutlined /> },
    { key: 'password', label: <Link to="/profile?tab=password">Đổi mật khẩu</Link>, icon: <LockOutlined /> },
    { type: 'divider' as const, key: 'divider-1' },
    { key: 'admin', label: <Link to="/admin">Quản trị viên</Link>, icon: <DashboardOutlined /> },
    { type: 'divider' as const, key: 'divider-2' },
    {
      key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />,
      onClick: () => { message.success('Đã đăng xuất!'); navigate('/login'); },
    },
  ] : [
    { key: 'login', label: <Link to="/login">Đăng nhập</Link> },
    { key: 'register', label: <Link to="/login?tab=register">Đăng ký</Link> },
  ];

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-gray-300 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span><PhoneOutlined className="mr-1" />0909 123 456</span>
            <span><MailOutlined className="mr-1" />support@edulearn.vn</span>
          </div>
          <div className="flex items-center gap-4">
            <Dropdown menu={{ items: languages.map(l => ({ key: l.key, label: l.label })), onClick: (e) => setLang(e.key) }}>
              <span className="cursor-pointer flex items-center gap-1 hover:text-white">
                <GlobalOutlined /> {languages.find(l => l.key === lang)?.label}
              </span>
            </Dropdown>
            <a href="#" className="hover:text-white"><FacebookOutlined /></a>
            <a href="#" className="hover:text-white"><YoutubeOutlined /></a>
            <a href="#" className="hover:text-white"><InstagramOutlined /></a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <Header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
        style={{ background: '#fff', padding: 0, height: 'auto', lineHeight: 'normal' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-white text-lg" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 leading-none">EduLearn</div>
              <div className="text-xs text-blue-600">Học Tập Không Giới Hạn</div>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {navItems.map(item =>
              item.children ? (
                <Dropdown
                  key={item.key}
                  menu={{
                    items: item.children.map(c => ({
                      key: c.key,
                      label: c.label,
                      onClick: () => navigate(c.key),
                    })),
                  }}
                  placement="bottomLeft"
                >
                  <Button
                    type="text"
                    className={`font-medium ${location.pathname === item.key ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    {item.label} ▾
                  </Button>
                </Dropdown>
              ) : (
                <Link key={item.key} to={item.key}>
                  <Button
                    type="text"
                    className={`font-medium ${location.pathname === item.key ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            )}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <AutoComplete
              options={searchOptions}
              onSearch={handleSearchChange}
              onSelect={(val) => navigate(`/search?q=${encodeURIComponent(val)}`)}
              className="w-full"
            >
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Tìm kiếm khóa học..."
                className="rounded-full"
                onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
              />
            </AutoComplete>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={<SearchOutlined />}
              className="sm:hidden"
              onClick={() => navigate('/search')}
            />
            <Link to="/wishlist">
              <Badge count={wishlistCount} size="small">
                <Button type="text" icon={<HeartOutlined />} />
              </Badge>
            </Link>
            <Link to="/cart">
              <Badge count={cartCount} size="small">
                <Button type="text" icon={<ShoppingCartOutlined />} />
              </Badge>
            </Link>
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>

            {isLoggedIn ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Avatar
                  src="https://i.pravatar.cc/150?img=10"
                  className="cursor-pointer border-2 border-blue-200"
                  size={36}
                />
              </Dropdown>
            ) : (
              <Space>
                <Link to="/login">
                  <Button>Đăng nhập</Button>
                </Link>
                <Link to="/login?tab=register">
                  <Button type="primary">Đăng ký</Button>
                </Link>
              </Space>
            )}

            <Button
              type="text"
              icon={<MenuOutlined />}
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            />
          </div>
        </div>

        {/* Secondary nav */}
        <div className="hidden md:flex bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 py-1">
            {['Lập Trình', 'Thiết Kế', 'Marketing', 'Kinh Doanh', 'Ngoại Ngữ', 'Âm Nhạc', 'Sức Khỏe', 'Nhiếp Ảnh'].map(cat => (
              <Button
                key={cat}
                type="text"
                size="small"
                className="text-white hover:bg-blue-700 text-xs"
                onClick={() => navigate(`/courses?cat=${cat.toLowerCase().replace(' ', '-')}`)}
              >
                {cat}
              </Button>
            ))}
            <div className="flex-1" />
            <Button
              type="text"
              size="small"
              icon={<FireOutlined />}
              className="text-yellow-300 font-bold"
              onClick={() => navigate('/courses?sale=true')}
            >
              Flash Sale
            </Button>
          </div>
        </div>
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <Link to="/" className="flex items-center gap-2">
            <BookOutlined className="text-blue-600 text-xl" />
            <span className="font-bold text-gray-900">EduLearn</span>
          </Link>
        }
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        styles={{ wrapper: { width: 280 } }}
      >
        <Menu
          mode="inline"
          items={navItems.map(item => ({
            key: item.key,
            label: item.label,
            children: item.children?.map(c => ({ key: c.key, label: c.label })),
            onClick: !item.children ? () => { navigate(item.key); setMobileOpen(false); } : undefined,
          }))}
        />
        <div className="mt-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm..."
            className="mb-3"
            onPressEnter={(e) => { handleSearch((e.target as HTMLInputElement).value); setMobileOpen(false); }}
          />
          {!isLoggedIn && (
            <Space className="w-full flex-col">
              <Button block onClick={() => { navigate('/login'); setMobileOpen(false); }}>Đăng nhập</Button>
              <Button block type="primary" onClick={() => { navigate('/login?tab=register'); setMobileOpen(false); }}>Đăng ký</Button>
            </Space>
          )}
        </div>
      </Drawer>

      {/* Content */}
      <Content>{children}</Content>

      {/* Footer */}
      <Footer style={{ background: '#111827', padding: 0 }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOutlined className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">EduLearn</div>
                  <div className="text-xs text-blue-400">Học Tập Không Giới Hạn</div>
                </div>
              </div>
              <Text className="text-gray-400 text-sm block mb-4">
                Nền tảng học tập trực tuyến hàng đầu Việt Nam với hơn 248 khóa học chất lượng cao.
              </Text>
              <div className="flex gap-3">
                {[FacebookOutlined, YoutubeOutlined, InstagramOutlined, TwitterOutlined].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Khóa Học</h4>
              <ul className="space-y-2">
                {['Lập Trình Web', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Ngoại Ngữ', 'Kinh Doanh'].map(item => (
                  <li key={item}>
                    <Link to="/courses" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Hỗ Trợ</h4>
              <ul className="space-y-2">
                {['Trung tâm trợ giúp', 'Điều khoản sử dụng', 'Chính sách bảo mật', 'Chính sách hoàn tiền', 'Liên hệ', 'Blog'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Liên Hệ</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-400 text-sm">
                  <PhoneOutlined className="mt-0.5 flex-shrink-0" />
                  <span>0909 123 456</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400 text-sm">
                  <MailOutlined className="mt-0.5 flex-shrink-0" />
                  <span>support@edulearn.vn</span>
                </li>
                <li className="text-gray-400 text-sm">
                  123 Nguyễn Huệ, Q.1, TP.HCM
                </li>
              </ul>
              <div className="mt-4">
                <div className="text-gray-400 text-sm mb-2">Chứng nhận thanh toán:</div>
                <div className="flex gap-2 flex-wrap">
                  {['VNPAY', 'ZaloPay', 'Visa', 'Mastercard'].map(p => (
                    <Tag key={p} className="bg-gray-700 border-gray-600 text-gray-300 text-xs">{p}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <Text className="text-gray-500 text-sm">
              © 2025 EduLearn. Bảo lưu mọi quyền.
            </Text>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Điều khoản</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Bảo mật</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Sitemap</a>
            </div>
          </div>
        </div>
      </Footer>

      {/* Floating Chat */}
      <ChatWidget />
    </Layout>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn? 😊' },
    { from: 'bot', text: 'Bạn có thể hỏi về khóa học, thanh toán hoặc tài khoản.' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể. Để được hỗ trợ ngay, bạn có thể gọi 0909 123 456.',
      }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <BookOutlined className="text-white text-sm" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">EduLearn Support</div>
                <div className="text-blue-200 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  Trực tuyến
                </div>
              </div>
            </div>
            <Button type="text" size="small" className="text-white" onClick={() => setOpen(false)}>✕</Button>
          </div>
          <div className="h-56 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.from === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-700 shadow-sm rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <Input
              size="small"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onPressEnter={sendMessage}
              className="rounded-full"
            />
            <Button type="primary" size="small" shape="circle" onClick={sendMessage}>→</Button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <span className="text-white text-2xl">{open ? '✕' : '💬'}</span>
      </button>
    </div>
  );
}
