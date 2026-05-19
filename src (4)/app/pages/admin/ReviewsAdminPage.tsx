import { useState } from 'react';
import {
  Table, Tag, Button, Input, Select, Card, Typography, Avatar, Space,
  Modal, Popconfirm, message, Rate, Row, Col, Badge,
} from 'antd';
import {
  SearchOutlined, DeleteOutlined, CheckCircleOutlined,
  CloseCircleOutlined, EyeOutlined, MessageOutlined, StarFilled,
} from '@ant-design/icons';
import { reviews, courses } from '../../data/mockData';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const extendedReviews = [
  ...reviews,
  { id: 5, user: 'Phan Văn E', avatar: 'https://i.pravatar.cc/40?img=8', rating: 2, date: '15/05/2025', comment: 'Nội dung không như mô tả, video chất lượng thấp. Rất thất vọng.', courseId: 1 },
  { id: 6, user: 'Đỗ Thị F', avatar: 'https://i.pravatar.cc/40?img=10', rating: 5, date: '14/05/2025', comment: 'Xuất sắc! Giảng viên nhiệt tình, nội dung cực kỳ thực tế.', courseId: 2 },
  { id: 7, user: 'Bùi Minh G', avatar: 'https://i.pravatar.cc/40?img=12', rating: 1, date: '13/05/2025', comment: 'Spam spam spam mua ngay tại link xxxx.com', courseId: 3 },
  { id: 8, user: 'Vũ Thị H', avatar: 'https://i.pravatar.cc/40?img=14', rating: 4, date: '12/05/2025', comment: 'Khóa học tốt, chỉ cần thêm bài tập thực hành là hoàn hảo.', courseId: 4 },
  { id: 9, user: 'Ngô Văn I', avatar: 'https://i.pravatar.cc/40?img=16', rating: 3, date: '11/05/2025', comment: 'Bình thường, không có gì nổi bật so với các khóa khác.', courseId: 1 },
  { id: 10, user: 'Lý Thị K', avatar: 'https://i.pravatar.cc/40?img=18', rating: 5, date: '10/05/2025', comment: 'Tuyệt vời! Đây là khóa học tốt nhất tôi từng tham gia.', courseId: 5 },
].map(r => ({ ...r, status: (r as any).status ?? (r.rating <= 2 ? 'flagged' : 'approved'), replied: false }));

export default function ReviewsAdminPage() {
  const [data, setData] = useState(extendedReviews);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyModal, setReplyModal] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [previewReview, setPreviewReview] = useState<any>(null);

  const filtered = data.filter(r =>
    (filterRating === 'all' || r.rating === Number(filterRating)) &&
    (filterStatus === 'all' || r.status === filterStatus) &&
    (!search || r.user.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase()))
  );

  const approve = (id: number) => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    message.success('Đã duyệt đánh giá!');
  };

  const flag = (id: number) => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: 'flagged' } : r));
    message.warning('Đã đánh dấu vi phạm!');
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    setData(prev => prev.map(r => r.id === replyModal.id ? { ...r, replied: true } : r));
    message.success('Đã gửi phản hồi!');
    setReplyModal(null);
    setReplyText('');
  };

  const columns = [
    {
      title: 'Người Dùng',
      key: 'user',
      render: (_: any, r: any) => (
        <div className="flex items-center gap-2">
          <Avatar src={r.avatar} size={36} />
          <div>
            <div className="font-medium text-sm text-gray-900">{r.user}</div>
            <div className="text-gray-400 text-xs">{r.date}</div>
          </div>
        </div>
      ),
      width: 160,
    },
    {
      title: 'Khóa Học',
      key: 'course',
      render: (_: any, r: any) => {
        const c = courses.find(x => x.id === r.courseId);
        return c ? <Tag color="blue" className="text-xs">{c.title.substring(0, 25)}...</Tag> : '-';
      },
    },
    {
      title: 'Đánh Giá',
      key: 'rating',
      render: (_: any, r: any) => (
        <div>
          <Rate disabled value={r.rating} className="text-xs" />
          <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-xs">{r.comment}</div>
        </div>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'approved' ? 'green' : s === 'flagged' ? 'red' : 'default'}>
          {s === 'approved' ? 'Đã duyệt' : s === 'flagged' ? 'Vi phạm' : 'Chờ duyệt'}
        </Tag>
      ),
    },
    {
      title: 'Đã Trả Lời',
      dataIndex: 'replied',
      key: 'replied',
      render: (v: boolean) => v ? <Tag color="green">Có</Tag> : <Tag>Chưa</Tag>,
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => setPreviewReview(r)} />
          <Button size="small" icon={<MessageOutlined />} onClick={() => setReplyModal(r)} type="primary" ghost />
          {r.status !== 'approved' && (
            <Button size="small" icon={<CheckCircleOutlined />} className="text-green-600 border-green-600" onClick={() => approve(r.id)} />
          )}
          {r.status !== 'flagged' && (
            <Button size="small" icon={<CloseCircleOutlined />} danger onClick={() => flag(r.id)} />
          )}
          <Popconfirm title="Xóa đánh giá?" onConfirm={() => { setData(prev => prev.filter(x => x.id !== r.id)); message.success('Đã xóa!'); }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = {
    total: data.length,
    approved: data.filter(r => r.status === 'approved').length,
    flagged: data.filter(r => r.status === 'flagged').length,
    avgRating: (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1),
    unreplied: data.filter(r => !r.replied).length,
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">⭐ Quản Lý Đánh Giá</Title>
          <Text className="text-gray-500">{data.length} đánh giá • Rating trung bình: {stats.avgRating}/5</Text>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[12, 12]} className="mb-6">
        {[
          { label: 'Tổng đánh giá', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Đã duyệt', value: stats.approved, color: 'bg-green-50 text-green-700' },
          { label: 'Vi phạm', value: stats.flagged, color: 'bg-red-50 text-red-700' },
          { label: 'Chưa trả lời', value: stats.unreplied, color: 'bg-orange-50 text-orange-700' },
          { label: 'Rating TB', value: `${stats.avgRating} ⭐`, color: 'bg-yellow-50 text-yellow-700' },
        ].map((s, i) => (
          <Col key={i} xs={12} sm={8} lg={4} flex="auto">
            <div className={`${s.color} rounded-xl p-4 text-center`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs opacity-75 mt-1">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Rating distribution */}
      <Card className="rounded-xl border-gray-100 mb-4">
        <Title level={5} className="mb-3">Phân Bổ Đánh Giá</Title>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = data.filter(r => r.rating === star).length;
            const percent = Math.round((count / data.length) * 100);
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 flex-shrink-0">
                  <StarFilled className="text-yellow-400 text-xs" />
                  <span className="text-sm">{star}</span>
                </div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }} />
                </div>
                <div className="text-gray-500 text-xs w-16 flex-shrink-0">{count} ({percent}%)</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <Card className="rounded-xl border-gray-100 mb-4">
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Tìm đánh giá..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select value={filterRating} onChange={setFilterRating} style={{ width: 140 }}>
            <Option value="all">Tất cả sao</Option>
            <Option value="5">5 sao</Option>
            <Option value="4">4 sao</Option>
            <Option value="3">3 sao</Option>
            <Option value="2">2 sao</Option>
            <Option value="1">1 sao</Option>
          </Select>
          <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 160 }}>
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="flagged">Vi phạm</Option>
          </Select>
        </div>
      </Card>

      <Card className="rounded-xl border-gray-100">
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: total => `Tổng ${total} đánh giá` }}
          rowClassName={r => r.status === 'flagged' ? 'bg-red-50' : ''}
          size="middle"
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Reply Modal */}
      <Modal
        open={!!replyModal}
        title="Phản Hồi Đánh Giá"
        onCancel={() => setReplyModal(null)}
        onOk={sendReply}
        okText="Gửi Phản Hồi"
        cancelText="Hủy"
      >
        {replyModal && (
          <div className="mt-4">
            <div className="p-3 bg-gray-50 rounded-xl mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar src={replyModal.avatar} size={32} />
                <Text strong className="text-sm">{replyModal.user}</Text>
                <Rate disabled value={replyModal.rating} className="text-xs" />
              </div>
              <Text className="text-gray-700 text-sm">{replyModal.comment}</Text>
            </div>
            <TextArea
              rows={4}
              placeholder="Nhập phản hồi của bạn..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
          </div>
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!previewReview} title="Chi Tiết Đánh Giá" onCancel={() => setPreviewReview(null)} footer={<Button onClick={() => setPreviewReview(null)}>Đóng</Button>}>
        {previewReview && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar src={previewReview.avatar} size={48} />
              <div>
                <Text strong>{previewReview.user}</Text>
                <div className="flex items-center gap-2">
                  <Rate disabled value={previewReview.rating} />
                  <Text className="text-gray-400 text-sm">{previewReview.date}</Text>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <Text>{previewReview.comment}</Text>
            </div>
            <div className="flex gap-2">
              <Tag color={previewReview.status === 'approved' ? 'green' : 'red'}>
                {previewReview.status === 'approved' ? 'Đã duyệt' : 'Vi phạm'}
              </Tag>
              <Tag color={previewReview.replied ? 'green' : 'default'}>
                {previewReview.replied ? 'Đã trả lời' : 'Chưa trả lời'}
              </Tag>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
