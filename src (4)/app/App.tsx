import { ConfigProvider, App as AntdApp } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { BrowserRouter, Routes, Route } from 'react-router';

import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import ComparisonPage from './pages/ComparisonPage';
import { BlogListPage, BlogDetailPage } from './pages/BlogPage';
import DashboardPage from './pages/admin/DashboardPage';
import CoursesAdminPage from './pages/admin/CoursesAdminPage';
import OrdersAdminPage from './pages/admin/OrdersAdminPage';
import UsersAdminPage from './pages/admin/UsersAdminPage';
import SettingsPage from './pages/admin/SettingsPage';
import LearningPage from './pages/LearningPage';
import CertificatePage from './pages/CertificatePage';
import NotificationsPage from './pages/NotificationsPage';
import BlogAdminPage from './pages/admin/BlogAdminPage';
import CategoriesAdminPage from './pages/admin/CategoriesAdminPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import ActivityLogPage from './pages/admin/ActivityLogPage';
import RolesPage from './pages/admin/RolesPage';
import ReviewsAdminPage from './pages/admin/ReviewsAdminPage';
import MediaPage from './pages/admin/MediaPage';
import AppearancePage from './pages/admin/AppearancePage';
import HistoryPage from './pages/HistoryPage';

const antdTheme = {
  token: {
    colorPrimary: '#1d4ed8',
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorInfo: '#0ea5e9',
    borderRadius: 10,
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },
};

export default function App() {
  return (
    <ConfigProvider locale={viVN} theme={antdTheme}>
      <AntdApp>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/learn/:slug" element={<LearningPage />} />
          <Route path="/certificate/:slug" element={<CertificatePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/courses" element={<CoursesAdminPage />} />
          <Route path="/admin/orders" element={<OrdersAdminPage />} />
          <Route path="/admin/users" element={<UsersAdminPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/blog" element={<BlogAdminPage />} />
          <Route path="/admin/categories" element={<CategoriesAdminPage />} />
          <Route path="/admin/coupons" element={<SettingsPage />} />
          <Route path="/admin/admins" element={<UsersAdminPage />} />
          <Route path="/admin/roles" element={<RolesPage />} />
          <Route path="/admin/reviews" element={<ReviewsAdminPage />} />
          <Route path="/admin/media" element={<MediaPage />} />
          <Route path="/admin/appearance" element={<AppearancePage />} />
          <Route path="/admin/activity-log" element={<ActivityLogPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/analytics/revenue" element={<AnalyticsPage />} />
          <Route path="/admin/analytics/students" element={<AnalyticsPage />} />
          <Route path="/admin/analytics/courses" element={<AnalyticsPage />} />
          <Route path="/admin/appearance" element={<SettingsPage />} />
          <Route path="/admin/seo" element={<SettingsPage />} />
          <Route path="/admin/payments" element={<SettingsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}
