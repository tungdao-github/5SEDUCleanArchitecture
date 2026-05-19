import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Card, Button, Input, Form, Checkbox, Divider, Typography, Tabs,
  message, Steps, Alert,
} from 'antd';
import {
  UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined,
  EyeTwoTone, GoogleOutlined, FacebookOutlined, PhoneOutlined,
  SafetyCertificateOutlined, BookOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [form] = Form.useForm();

  const handleLogin = async (values: any) => {
    setLoginLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoginLoading(false);
    message.success('Đăng nhập thành công!');
    navigate('/');
  };

  const handleRegister = async (values: any) => {
    setRegisterLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setRegisterLoading(false);
    message.success('Đăng ký thành công! Vui lòng xác nhận email.');
    setActiveTab('login');
  };

  const handleForgot = async () => {
    setResetStep(1);
    await new Promise(r => setTimeout(r, 1000));
    message.info('Đã gửi mã OTP đến email của bạn!');
    setResetStep(2);
  };

  if (forgotMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <BookOutlined className="text-white text-2xl" />
            </div>
            <Title level={3} className="mb-1">Quên Mật Khẩu</Title>
            <Text className="text-gray-500">Đặt lại mật khẩu qua email hoặc SMS</Text>
          </div>

          <Card className="rounded-2xl shadow-lg border-0">
            <Steps
              current={resetStep}
              className="mb-6"
              items={[
                { title: 'Email' },
                { title: 'Xác nhận OTP' },
                { title: 'Mật khẩu mới' },
              ]}
              size="small"
            />

            {resetStep === 0 && (
              <Form onFinish={handleForgot} layout="vertical">
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                  <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" size="large" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block size="large" className="h-12 rounded-xl bg-blue-600">
                  Gửi Mã Xác Nhận
                </Button>
              </Form>
            )}

            {resetStep === 1 && (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">📧</div>
                <Text>Đang gửi mã xác nhận...</Text>
              </div>
            )}

            {resetStep === 2 && (
              <Form layout="vertical">
                <Alert message="Đã gửi mã OTP đến email của bạn" type="success" className="mb-4" showIcon />
                <Form.Item name="otp" label="Mã OTP (6 số)" rules={[{ required: true }]}>
                  <Input placeholder="Nhập mã OTP" size="large" maxLength={6} />
                </Form.Item>
                <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 8 }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Tối thiểu 8 ký tự" size="large" />
                </Form.Item>
                <Form.Item name="confirmPassword" label="Xác nhận mật khẩu" rules={[{ required: true }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" size="large" />
                </Form.Item>
                <Button
                  type="primary"
                  block
                  size="large"
                  className="h-12 rounded-xl bg-blue-600"
                  onClick={() => { message.success('Đặt lại mật khẩu thành công!'); setForgotMode(false); }}
                >
                  Đặt Lại Mật Khẩu
                </Button>
              </Form>
            )}

            <Button type="link" block className="mt-3" onClick={() => setForgotMode(false)}>
              ← Quay lại đăng nhập
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Left side - illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOutlined className="text-white text-4xl" />
          </div>
          <Title level={2} className="text-white mb-4">EduLearn</Title>
          <Text className="text-blue-100 text-lg block mb-8">
            Nền tảng học tập trực tuyến hàng đầu Việt Nam với hơn 248 khóa học chất lượng cao
          </Text>
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: '85K+', label: 'Học viên' },
              { val: '248+', label: 'Khóa học' },
              { val: '4.8★', label: 'Đánh giá' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3">
                <div className="text-white font-bold text-xl">{s.val}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 lg:max-w-xl flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 lg:hidden">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <BookOutlined className="text-white text-xl" />
            </div>
            <Title level={3} className="mb-0">EduLearn</Title>
          </div>

          <Card className="rounded-2xl shadow-lg border-0">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              items={[
                {
                  key: 'login',
                  label: 'Đăng Nhập',
                  children: (
                    <div>
                      {/* Social login */}
                      <div className="space-y-3 mb-6">
                        <Button
                          block
                          size="large"
                          icon={<GoogleOutlined className="text-red-500" />}
                          className="h-11 rounded-xl border-gray-200 hover:border-gray-300"
                          onClick={() => { message.info('Đang chuyển hướng đến Google...'); }}
                        >
                          Đăng nhập với Google
                        </Button>
                        <Button
                          block
                          size="large"
                          icon={<FacebookOutlined className="text-blue-600" />}
                          className="h-11 rounded-xl border-gray-200 hover:border-gray-300"
                          onClick={() => { message.info('Đang chuyển hướng đến Facebook...'); }}
                        >
                          Đăng nhập với Facebook
                        </Button>
                      </div>

                      <Divider>hoặc đăng nhập bằng email</Divider>

                      <Form onFinish={handleLogin} layout="vertical">
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
                        >
                          <Input
                            prefix={<MailOutlined className="text-gray-400" />}
                            placeholder="example@email.com"
                            size="large"
                            className="rounded-xl"
                          />
                        </Form.Item>
                        <Form.Item
                          name="password"
                          label="Mật khẩu"
                          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                        >
                          <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Nhập mật khẩu"
                            size="large"
                            className="rounded-xl"
                          />
                        </Form.Item>
                        <div className="flex justify-between items-center mb-4">
                          <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                          <Button type="link" size="small" onClick={() => setForgotMode(true)}>
                            Quên mật khẩu?
                          </Button>
                        </div>
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          size="large"
                          loading={loginLoading}
                          className="h-12 rounded-xl bg-blue-600 text-base font-semibold"
                        >
                          Đăng Nhập
                        </Button>
                      </Form>
                    </div>
                  ),
                },
                {
                  key: 'register',
                  label: 'Đăng Ký',
                  children: (
                    <div>
                      <div className="space-y-3 mb-4">
                        <Button
                          block
                          size="large"
                          icon={<GoogleOutlined className="text-red-500" />}
                          className="h-11 rounded-xl border-gray-200"
                          onClick={() => message.info('Đang chuyển hướng đến Google...')}
                        >
                          Đăng ký với Google
                        </Button>
                      </div>
                      <Divider>hoặc đăng ký bằng email</Divider>
                      <Form onFinish={handleRegister} layout="vertical">
                        <div className="grid grid-cols-2 gap-3 w-full">
                          <Form.Item name="firstName" label="Họ" rules={[{ required: true }]} className="mb-3">
                            <Input prefix={<UserOutlined />} placeholder="Họ" size="large" />
                          </Form.Item>
                          <Form.Item name="lastName" label="Tên" rules={[{ required: true }]} className="mb-3">
                            <Input placeholder="Tên" size="large" />
                          </Form.Item>
                        </div>
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                          <Input prefix={<MailOutlined />} placeholder="example@email.com" size="large" />
                        </Form.Item>
                        <Form.Item name="phone" label="Số điện thoại">
                          <Input prefix={<PhoneOutlined />} placeholder="0909 123 456" size="large" />
                        </Form.Item>
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 8, message: 'Tối thiểu 8 ký tự' }]}>
                          <Input.Password prefix={<LockOutlined />} placeholder="Tối thiểu 8 ký tự" size="large" />
                        </Form.Item>
                        <Form.Item name="agree" valuePropName="checked" rules={[{ required: true, message: 'Vui lòng đồng ý điều khoản' }]}>
                          <Checkbox>
                            Tôi đồng ý với <a href="#" className="text-blue-600">Điều khoản</a> và <a href="#" className="text-blue-600">Chính sách bảo mật</a>
                          </Checkbox>
                        </Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          size="large"
                          loading={registerLoading}
                          className="h-12 rounded-xl bg-blue-600 text-base font-semibold"
                        >
                          Tạo Tài Khoản
                        </Button>
                      </Form>
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          <div className="text-center mt-4 text-gray-500 text-sm">
            <SafetyCertificateOutlined className="text-green-500 mr-1" />
            Thông tin của bạn được bảo mật tuyệt đối
          </div>
        </div>
      </div>
    </div>
  );
}

