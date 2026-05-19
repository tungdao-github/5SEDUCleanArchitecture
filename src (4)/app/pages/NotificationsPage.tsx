import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Card, Typography, Badge, Button, Tabs, Avatar, Tag, Space, Switch,
  Divider, Empty, message,
} from 'antd';
import {
  BellOutlined, CheckOutlined, DeleteOutlined, SettingOutlined,
  ShoppingCartOutlined, BookOutlined, TrophyOutlined, TagOutlined,
  MessageOutlined, StarOutlined, UserOutlined, InfoCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';

const { Title, Text } = Typography;

type NotiType = 'order' | 'course' | 'promo' | 'system' | 'review' | 'achievement';

interface Notification {
  id: number;
  type: NotiType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  avatar?: string;
  link?: string;
}

const typeConfig: Record<NotiType, { icon: React.ReactNode; color: string; label: string }> = {
  order: { icon: <ShoppingCartOutlined />, color: 'bg-blue-100 text-blue-600', label: 'Đơn hàng' },
  course: { icon: <BookOutlined />, color: 'bg-purple-100 text-purple-600', label: 'Khóa học' },
  promo: { icon: <TagOutlined />, color: 'bg-orange-100 text-orange-600', label: 'Khuyến mãi' },
  system: { icon: <InfoCircleOutlined />, color: 'bg-gray-100 text-gray-600', label: 'Hệ thống' },
  review: { icon: <StarOutlined />, color: 'bg-yellow-100 text-yellow-600', label: 'Đánh giá' },
  achievement: { icon: <TrophyOutlined />, color: 'bg-green-100 text-green-600', label: 'Thành tích' },
};

const initNotifications: Notification[] = [
  { id: 1, type: 'order', title: 'Đơn hàng đã được xác nhận', body: 'Đơn hàng #ORD-2025-012 của bạn đã được xác nhận và đang được xử lý.', time: '5 phút trước', read: false, link: '/orders' },
  { id: 2, type: 'achievement', title: '🎉 Bạn đã hoàn thành khóa học!', body: 'Chúc mừng! Bạn đã hoàn thành khóa học "React & TypeScript". Nhận chứng chỉ của bạn ngay.', time: '1 giờ trước', read: false, link: '/certificate/react-typescript-thuc-te' },
  { id: 3, type: 'promo', title: 'Flash Sale 50% - Chỉ còn 5 giờ!', body: 'Hơn 30 khóa học giảm đến 50%. Đừng bỏ lỡ cơ hội học tập với giá tốt nhất!', time: '2 giờ trước', read: false, link: '/courses?sale=true' },
  { id: 4, type: 'course', title: 'Khóa học mới phù hợp với bạn', body: '"Python Advanced - Machine Learning" vừa được thêm vào. Dựa trên lịch sử học của bạn.', time: '3 giờ trước', read: true, link: '/courses' },
  { id: 5, type: 'review', title: 'Giảng viên đã trả lời câu hỏi của bạn', body: 'Nguyễn Văn An đã trả lời câu hỏi "Cách xử lý async trong useEffect?" của bạn.', time: '5 giờ trước', read: true, avatar: 'https://i.pravatar.cc/40?img=1' },
  { id: 6, type: 'system', title: 'Bảo mật: Đăng nhập từ thiết bị mới', body: 'Phát hiện đăng nhập từ thiết bị mới tại Hà Nội. Nếu không phải bạn, hãy đổi mật khẩu ngay.', time: '1 ngày trước', read: true },
  { id: 7, type: 'achievement', title: 'Bạn đã đạt 1,000 điểm thưởng!', body: 'Tích lũy 1,000 điểm thưởng - Đủ điều kiện nhận phần thưởng đặc biệt. Xem ngay!', time: '2 ngày trước', read: true, link: '/profile' },
  { id: 8, type: 'course', title: 'Nhắc nhở học tập', body: 'Bạn chưa học trong 3 ngày. Tiếp tục "Thiết Kế UI/UX Chuyên Nghiệp" để duy trì streak học tập!', time: '3 ngày trước', read: true, link: '/learn/ui-ux-design' },
  { id: 9, type: 'order', title: 'Thanh toán thành công', body: 'Bạn đã thanh toán thành công 699,000đ cho khóa học "Node.js Backend Mastery".', time: '4 ngày trước', read: true },
  { id: 10, type: 'promo', title: 'Mã giảm giá độc quyền dành cho bạn', body: 'Dùng mã LOYAL30 để được giảm 30% cho khóa học tiếp theo. Hết hạn sau 7 ngày.', time: '5 ngày trước', read: true },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = activeTab === 'all'
    ? notifications
    : activeTab === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeTab);

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    message.success('Đã đánh dấu tất cả là đã đọc');
  };

  const deleteNotif = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    message.success('Đã xóa tất cả thông báo');
  };

  const handleClick = (notif: Notification) => {
    markRead(notif.id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Badge count={unreadCount} size="small">
              <BellOutlined className="text-2xl text-gray-700" />
            </Badge>
            <div>
              <Title level={3} className="mb-0">Thông Báo</Title>
              <Text className="text-gray-500 text-sm">{unreadCount} chưa đọc</Text>
            </div>
          </div>
          <Space>
            {unreadCount > 0 && (
              <Button icon={<CheckOutlined />} onClick={markAllRead}>Đọc tất cả</Button>
            )}
            <Button icon={<DeleteOutlined />} danger onClick={clearAll}>Xóa tất cả</Button>
          </Space>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="mb-4"
          items={[
            { key: 'all', label: <span>Tất cả <Badge count={notifications.length} size="small" /></span> },
            { key: 'unread', label: <span>Chưa đọc <Badge count={unreadCount} size="small" /></span> },
            { key: 'order', label: '🛒 Đơn hàng' },
            { key: 'course', label: '📚 Khóa học' },
            { key: 'promo', label: '🏷 Khuyến mãi' },
            { key: 'achievement', label: '🏆 Thành tích' },
          ]}
        />

        {/* Notification List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <Empty description="Không có thông báo" className="py-12" />
          ) : (
            filtered.map(notif => (
              <Card
                key={notif.id}
                className={`rounded-xl cursor-pointer transition-all hover:shadow-md border ${!notif.read ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100'}`}
                styles={{ body: { padding: '12px 16px' } }}
                onClick={() => handleClick(notif)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon or Avatar */}
                  {notif.avatar ? (
                    <Avatar src={notif.avatar} size={44} />
                  ) : (
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${typeConfig[notif.type].color}`}>
                      {typeConfig[notif.type].icon}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold line-clamp-1 ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notif.title}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5 line-clamp-2">{notif.body}</div>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        <Text className="text-gray-400 text-xs whitespace-nowrap">{notif.time}</Text>
                        {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Tag className={`text-xs border-0 ${typeConfig[notif.type].color}`}>
                        {typeConfig[notif.type].label}
                      </Tag>
                      <div className="ml-auto flex gap-1" onClick={e => e.stopPropagation()}>
                        {!notif.read && (
                          <Button size="small" type="text" icon={<CheckCircleOutlined />} onClick={() => markRead(notif.id)} className="text-blue-500" />
                        )}
                        <Button size="small" type="text" danger icon={<CloseCircleOutlined />} onClick={() => deleteNotif(notif.id)} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <Card className="rounded-xl border-gray-100 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <SettingOutlined className="text-gray-600" />
            <Title level={5} className="mb-0">Cài Đặt Thông Báo</Title>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Thông báo qua Email', desc: 'Nhận thông báo về đơn hàng, khóa học qua email', value: emailNotif, onChange: setEmailNotif },
              { label: 'Thông báo Push', desc: 'Thông báo ngay trên trình duyệt', value: pushNotif, onChange: setPushNotif },
              { label: 'Email Khuyến Mãi', desc: 'Nhận thông tin flash sale và ưu đãi đặc biệt', value: promoNotif, onChange: setPromoNotif },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{item.label}</div>
                  <div className="text-gray-500 text-xs">{item.desc}</div>
                </div>
                <Switch checked={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
