import { useState } from 'react';
import {
  Card, Form, Input, Button, Switch, Select, Typography,
  Tabs, Row, Col, Divider, Tag, Table, message, Modal, InputNumber,
} from 'antd';
import {
  SettingOutlined, PictureOutlined, GlobalOutlined, BellOutlined,
  SecurityScanOutlined, ApiOutlined, MailOutlined, DeleteOutlined,
  PlusOutlined, SaveOutlined, SyncOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const coupons = [
  { code: 'EDULEARN20', discount: 20, type: 'percent', uses: 245, limit: 500, expiry: '31/12/2025', active: true },
  { code: 'NEW50', discount: 50, type: 'percent', uses: 89, limit: 200, expiry: '30/06/2025', active: true },
  { code: 'SUMMER30', discount: 30, type: 'percent', uses: 12, limit: 100, expiry: '31/08/2025', active: false },
  { code: 'FLAT100K', discount: 100000, type: 'fixed', uses: 56, limit: 300, expiry: '31/12/2025', active: true },
];

export default function SettingsPage() {
  const [generalForm] = Form.useForm();
  const [seoForm] = Form.useForm();
  const [couponModal, setCouponModal] = useState(false);
  const [couponData, setCouponData] = useState(coupons);

  const couponColumns = [
    { title: 'Mã', dataIndex: 'code', key: 'code', render: (c: string) => <Tag color="blue" className="font-mono">{c}</Tag> },
    {
      title: 'Giảm Giá',
      key: 'discount',
      render: (_: any, r: any) => (
        <span>{r.type === 'percent' ? `${r.discount}%` : `${r.discount.toLocaleString()}đ`}</span>
      ),
    },
    {
      title: 'Lượt Dùng',
      key: 'uses',
      render: (_: any, r: any) => <span>{r.uses} / {r.limit}</span>,
    },
    { title: 'Hết Hạn', dataIndex: 'expiry', key: 'expiry' },
    {
      title: 'Trạng Thái',
      dataIndex: 'active',
      key: 'active',
      render: (a: boolean, r: any) => (
        <Switch
          checked={a}
          size="small"
          onChange={(checked) => {
            setCouponData(prev => prev.map(c => c.code === r.code ? { ...c, active: checked } : c));
          }}
        />
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (_: any, r: any) => (
        <Button
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => { setCouponData(prev => prev.filter(c => c.code !== r.code)); message.success('Đã xóa mã!'); }}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <Title level={3} className="mb-1">⚙️ Cấu Hình Hệ Thống</Title>
        <Text className="text-gray-500">Quản lý cài đặt và cấu hình toàn bộ hệ thống</Text>
      </div>

      <Tabs
        defaultActiveKey="general"
        tabPlacement="left"
        className="admin-settings-tabs"
        items={[
          {
            key: 'general',
            label: <span><SettingOutlined /> Cài Đặt Chung</span>,
            children: (
              <Card className="rounded-xl border-gray-100">
                <Title level={5} className="mb-4">Thông Tin Website</Title>
                <Form form={generalForm} layout="vertical">
                  <Row gutter={[16, 0]}>
                    <Col span={12}>
                      <Form.Item name="siteName" label="Tên Website" initialValue="EduLearn">
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="siteUrl" label="Địa chỉ Website" initialValue="https://edulearn.vn">
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="description" label="Mô tả" initialValue="Nền tảng học tập trực tuyến hàng đầu Việt Nam">
                        <TextArea rows={3} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="email" label="Email Liên Hệ" initialValue="support@edulearn.vn">
                        <Input prefix={<MailOutlined />} size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="phone" label="Điện Thoại" initialValue="0909 123 456">
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="address" label="Địa Chỉ" initialValue="123 Nguyễn Huệ, Q.1, TP.HCM">
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider />
                  <Title level={5} className="mb-4">Cài Đặt Hệ Thống</Title>
                  <Row gutter={[16, 8]}>
                    {[
                      { name: 'maintenance', label: 'Chế độ bảo trì', desc: 'Tắt website để bảo trì' },
                      { name: 'registration', label: 'Cho phép đăng ký', desc: 'Cho phép người dùng mới đăng ký', init: true },
                      { name: 'emailVerify', label: 'Xác minh email', desc: 'Yêu cầu xác minh email khi đăng ký', init: true },
                      { name: 'reviews', label: 'Hiển thị đánh giá', desc: 'Cho phép học viên đánh giá khóa học', init: true },
                    ].map(s => (
                      <Col span={12} key={s.name}>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-800">{s.label}</div>
                            <div className="text-xs text-gray-500">{s.desc}</div>
                          </div>
                          <Form.Item name={s.name} valuePropName="checked" initialValue={s.init || false} className="mb-0">
                            <Switch />
                          </Form.Item>
                        </div>
                      </Col>
                    ))}
                  </Row>

                  <Divider />
                  <div className="flex gap-3">
                    <Button type="primary" icon={<SaveOutlined />} size="large" onClick={() => message.success('Đã lưu cài đặt!')}>
                      Lưu Cài Đặt
                    </Button>
                    <Button icon={<SyncOutlined />} onClick={() => message.info('Đã xóa cache hệ thống!')}>
                      Xóa Cache
                    </Button>
                  </div>
                </Form>
              </Card>
            ),
          },
          {
            key: 'seo',
            label: <span><GlobalOutlined /> SEO & Meta</span>,
            children: (
              <Card className="rounded-xl border-gray-100">
                <Title level={5} className="mb-4">Cài Đặt SEO Tổng Thể</Title>
                <Form form={seoForm} layout="vertical">
                  <Form.Item name="metaTitle" label="Meta Title mặc định" initialValue="EduLearn - Nền Tảng Học Tập Trực Tuyến #1 Việt Nam">
                    <Input showCount maxLength={60} size="large" />
                  </Form.Item>
                  <Form.Item name="metaDesc" label="Meta Description mặc định" initialValue="Học tập không giới hạn với hơn 248 khóa học chất lượng cao từ các chuyên gia hàng đầu.">
                    <TextArea showCount maxLength={160} rows={3} />
                  </Form.Item>
                  <Form.Item name="keywords" label="Meta Keywords">
                    <Input placeholder="học online, khóa học, e-learning, ..." />
                  </Form.Item>
                  <Row gutter={[16, 0]}>
                    <Col span={12}>
                      <Form.Item name="ogTitle" label="OG Title">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="ogImage" label="OG Image URL">
                        <Input placeholder="https://..." />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider />
                  <Title level={5} className="mb-3">Robots & Sitemap</Title>
                  <Row gutter={[16, 8]}>
                    {[
                      { name: 'sitemap', label: 'Tự động tạo Sitemap', init: true },
                      { name: 'robots', label: 'Cho phép Googlebot', init: true },
                      { name: 'canonical', label: 'Tự động Canonical URL', init: true },
                    ].map(s => (
                      <Col span={8} key={s.name}>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">{s.label}</span>
                          <Switch defaultChecked={s.init} size="small" />
                        </div>
                      </Col>
                    ))}
                  </Row>

                  <div className="flex gap-3 mt-4">
                    <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success('Đã lưu SEO!')}>Lưu SEO</Button>
                    <Button onClick={() => message.info('Đang tạo sitemap...')}>Tạo Sitemap</Button>
                    <Button onClick={() => message.info('Đang kiểm tra SEO...')}>Kiểm Tra SEO</Button>
                  </div>
                </Form>
              </Card>
            ),
          },
          {
            key: 'coupons',
            label: <span>🎫 Mã Giảm Giá</span>,
            children: (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Title level={5} className="mb-0">Quản Lý Mã Giảm Giá</Title>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setCouponModal(true)}>
                    Thêm Mã Mới
                  </Button>
                </div>
                <Card className="rounded-xl border-gray-100">
                  <Table
                    dataSource={couponData}
                    columns={couponColumns}
                    rowKey="code"
                    pagination={false}
                    size="middle"
                  />
                </Card>

                <Modal
                  open={couponModal}
                  title="Thêm Mã Giảm Giá Mới"
                  onCancel={() => setCouponModal(false)}
                  onOk={() => { setCouponModal(false); message.success('Đã thêm mã giảm giá!'); }}
                  okText="Tạo Mã"
                  cancelText="Hủy"
                >
                  <Form layout="vertical" className="mt-4">
                    <Form.Item name="code" label="Mã giảm giá" rules={[{ required: true }]}>
                      <Input placeholder="VD: SUMMER30" style={{ textTransform: 'uppercase' }} />
                    </Form.Item>
                    <Row gutter={[16, 0]}>
                      <Col span={12}>
                        <Form.Item name="type" label="Loại">
                          <Select defaultValue="percent">
                            <Option value="percent">Phần trăm (%)</Option>
                            <Option value="fixed">Số tiền cố định</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="discount" label="Giá trị" rules={[{ required: true }]}>
                          <InputNumber className="w-full" min={1} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="limit" label="Giới hạn lượt dùng">
                          <InputNumber className="w-full" min={1} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="expiry" label="Ngày hết hạn">
                          <Input placeholder="DD/MM/YYYY" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Modal>
              </div>
            ),
          },
          {
            key: 'payments',
            label: <span>💳 Thanh Toán</span>,
            children: (
              <Card className="rounded-xl border-gray-100">
                <Title level={5} className="mb-4">Cổng Thanh Toán</Title>
                <div className="space-y-4">
                  {[
                    { name: 'VNPay', logo: '🏦', enabled: true, desc: 'Thanh toán qua cổng VNPay' },
                    { name: 'ZaloPay', logo: '📱', enabled: true, desc: 'Ví điện tử ZaloPay' },
                    { name: 'MoMo', logo: '💜', enabled: false, desc: 'Ví điện tử MoMo' },
                    { name: 'Stripe', logo: '💳', enabled: false, desc: 'Thẻ quốc tế qua Stripe' },
                  ].map(gw => (
                    <div key={gw.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{gw.logo}</span>
                        <div>
                          <div className="font-medium text-gray-900">{gw.name}</div>
                          <div className="text-gray-500 text-sm">{gw.desc}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Tag color={gw.enabled ? 'green' : 'default'}>{gw.enabled ? 'Đang hoạt động' : 'Chưa kích hoạt'}</Tag>
                        <Switch defaultChecked={gw.enabled} />
                        <Button size="small">Cấu hình</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ),
          },
          {
            key: 'email',
            label: <span><MailOutlined /> Email</span>,
            children: (
              <Card className="rounded-xl border-gray-100">
                <Title level={5} className="mb-4">Cài Đặt Email (SMTP)</Title>
                <Form layout="vertical">
                  <Row gutter={[16, 0]}>
                    <Col span={12}>
                      <Form.Item name="smtpHost" label="SMTP Host" initialValue="smtp.gmail.com">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="smtpPort" label="SMTP Port" initialValue={587}>
                        <InputNumber className="w-full" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="smtpUser" label="Tên đăng nhập">
                        <Input placeholder="email@domain.com" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="smtpPass" label="Mật khẩu">
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="fromEmail" label="Email gửi" initialValue="noreply@edulearn.vn">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="fromName" label="Tên hiển thị" initialValue="EduLearn">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div className="flex gap-3">
                    <Button type="primary" onClick={() => message.success('Đã lưu cài đặt email!')}>Lưu</Button>
                    <Button onClick={() => message.info('Email test đã được gửi!')}>Gửi Test Email</Button>
                  </div>
                </Form>
              </Card>
            ),
          },
        ]}
      />
    </AdminLayout>
  );
}
