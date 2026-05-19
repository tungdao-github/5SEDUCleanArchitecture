import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Layout, Menu, Avatar, Badge, Button, Dropdown, Space, Typography } from 'antd';
import {
  DashboardOutlined, BookOutlined, ShoppingCartOutlined, UserOutlined,
  TagOutlined, FileTextOutlined, SettingOutlined, BarChartOutlined,
  BellOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  AppstoreOutlined, CarOutlined, CreditCardOutlined, PictureOutlined,
  StarOutlined, MessageOutlined, AuditOutlined, SafetyOutlined,
} from '@ant-design/icons';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'products',
    icon: <AppstoreOutlined />,
    label: 'Nội Dung',
    children: [
      { key: '/admin/categories', icon: <TagOutlined />, label: 'Danh Mục' },
      { key: '/admin/courses', icon: <BookOutlined />, label: 'Khóa Học' },
      { key: '/admin/blog', icon: <FileTextOutlined />, label: 'Bài Viết' },
      { key: '/admin/reviews', icon: <StarOutlined />, label: 'Đánh Giá' },
      { key: '/admin/media', icon: <PictureOutlined />, label: 'Thư Viện Media' },
    ],
  },
  {
    key: 'orders-group',
    icon: <ShoppingCartOutlined />,
    label: 'Đơn Hàng',
    children: [
      { key: '/admin/orders', icon: <ShoppingCartOutlined />, label: 'Quản Lý Đơn' },
      { key: '/admin/coupons', icon: <TagOutlined />, label: 'Mã Giảm Giá' },
      { key: '/admin/shipping', icon: <CarOutlined />, label: 'Vận Chuyển' },
      { key: '/admin/payments', icon: <CreditCardOutlined />, label: 'Thanh Toán' },
    ],
  },
  {
    key: 'users-group',
    icon: <UserOutlined />,
    label: 'Người Dùng',
    children: [
      { key: '/admin/users', icon: <UserOutlined />, label: 'Tài Khoản' },
      { key: '/admin/admins', icon: <SafetyOutlined />, label: 'Quản Trị Viên' },
      { key: '/admin/roles', icon: <AuditOutlined />, label: 'Phân Quyền' },
      { key: '/admin/activity-log', icon: <AuditOutlined />, label: 'Nhật Ký' },
    ],
  },
  {
    key: 'analytics',
    icon: <BarChartOutlined />,
    label: 'Thống Kê',
    children: [
      { key: '/admin/analytics/revenue', icon: <BarChartOutlined />, label: 'Doanh Thu' },
      { key: '/admin/analytics/students', icon: <UserOutlined />, label: 'Học Viên' },
      { key: '/admin/analytics/courses', icon: <BookOutlined />, label: 'Khóa Học' },
    ],
  },
  {
    key: 'settings-group',
    icon: <SettingOutlined />,
    label: 'Cài Đặt',
    children: [
      { key: '/admin/settings', icon: <SettingOutlined />, label: 'Cấu Hình Hệ Thống' },
      { key: '/admin/appearance', icon: <PictureOutlined />, label: 'Giao Diện' },
      { key: '/admin/seo', icon: <BarChartOutlined />, label: 'SEO' },
      { key: '/admin/chat', icon: <MessageOutlined />, label: 'Live Chat' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userMenu = [
    { key: 'profile', label: 'Hồ sơ', icon: <UserOutlined /> },
    { key: 'home', label: <Link to="/">Xem Website</Link>, icon: <BookOutlined /> },
    { type: 'divider' as const },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: () => navigate('/login') },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={240}
        style={{
          background: '#001529',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          overflow: 'auto',
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2 p-4 border-b border-gray-700 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOutlined className="text-white text-base" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-bold text-sm leading-none">EduLearn</div>
              <div className="text-blue-400 text-xs">Admin Panel</div>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['products', 'orders-group', 'users-group']}
          items={menuItems}
          onClick={({ key }) => { if (key.startsWith('/')) navigate(key); }}
          style={{ border: 'none', marginTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <Space>
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Badge count={2} dot>
              <Button type="text" icon={<MessageOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50">
                <Avatar src="https://i.pravatar.cc/150?img=10" size={32} />
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-800 leading-none">Admin</div>
                  <div className="text-xs text-gray-500">Super Admin</div>
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: '24px', minHeight: 'calc(100vh - 112px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
