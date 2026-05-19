import { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Button, Typography, Space, Divider, Tag, message } from 'antd';
import {
  DownloadOutlined, ShareAltOutlined, HomeOutlined,
  TrophyOutlined, CheckCircleOutlined, StarFilled,
  PrinterOutlined, LinkedinOutlined,
} from '@ant-design/icons';
import { courses } from '../data/mockData';

const { Title, Text } = Typography;

export default function CertificatePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const certRef = useRef<HTMLDivElement>(null);
  const course = courses.find(c => c.slug === slug) || courses[0];
  const certId = `EDU-${Date.now().toString(36).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    message.success('Đang tải chứng chỉ PDF...');
  };

  const handleShare = (platform: string) => {
    message.success(`Đã chia sẻ lên ${platform}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950">
      {/* Top Bar */}
      <div className="bg-blue-950/80 backdrop-blur border-b border-blue-800 px-6 py-3 flex items-center justify-between print:hidden">
        <Link to="/" className="text-blue-300 font-bold text-xl">EduLearn</Link>
        <Space>
          <Button icon={<HomeOutlined />} onClick={() => navigate('/')} className="border-blue-600 text-blue-200">
            Trang Chủ
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint} className="border-blue-600 text-blue-200">
            In
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
            Tải PDF
          </Button>
        </Space>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Congrats Banner */}
        <div className="text-center mb-8 print:hidden">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 rounded-full px-6 py-2 mb-4">
            <TrophyOutlined className="text-yellow-400" />
            <span className="font-semibold">Chúc mừng bạn đã hoàn thành khóa học!</span>
          </div>
          <Title level={2} className="text-white mb-2">Chứng Chỉ Của Bạn Đã Sẵn Sàng</Title>
          <Text className="text-blue-300">Chia sẻ thành tích của bạn với thế giới</Text>
        </div>

        {/* Certificate Card */}
        <div
          ref={certRef}
          className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: '1.414 / 1' }}
        >
          {/* Decorative border */}
          <div className="absolute inset-3 border-4 border-blue-800 rounded-xl pointer-events-none z-10" />
          <div className="absolute inset-4 border border-yellow-400/50 rounded-xl pointer-events-none z-10" />

          {/* BG Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <TrophyOutlined style={{ fontSize: 400, color: '#1d4ed8' }} />
          </div>

          {/* Corner Ornaments */}
          {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-12 h-12 z-10`}>
              <div className="w-full h-full border-2 border-yellow-500 rounded-sm"
                style={{ borderRadius: i === 0 ? '8px 0 0 0' : i === 1 ? '0 8px 0 0' : i === 2 ? '0 0 0 8px' : '0 0 8px 0' }} />
            </div>
          ))}

          {/* Certificate Content */}
          <div className="relative z-20 h-full flex flex-col items-center justify-center px-16 py-10 text-center">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EL</span>
              </div>
              <div>
                <div className="font-bold text-blue-800 text-xl tracking-wide">EduLearn</div>
                <div className="text-xs text-gray-500 tracking-widest uppercase">Certificate of Completion</div>
              </div>
            </div>

            <Divider className="my-3 border-yellow-400" style={{ borderWidth: 2 }} />

            <div className="text-gray-500 text-sm tracking-widest uppercase mb-2">Chứng nhận rằng</div>

            {/* Student Name */}
            <div className="font-bold text-blue-900 mb-2" style={{ fontSize: 'clamp(24px, 4vw, 48px)', fontFamily: 'Georgia, serif' }}>
              Nguyễn Văn Học Viên
            </div>

            <div className="text-gray-500 text-sm mb-3">đã hoàn thành xuất sắc khóa học</div>

            {/* Course Title */}
            <div className="font-bold text-gray-800 mb-3 max-w-xl" style={{ fontSize: 'clamp(14px, 2.5vw, 26px)', fontFamily: 'Georgia, serif' }}>
              "{course.title}"
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => <StarFilled key={i} className="text-yellow-400" style={{ fontSize: 16 }} />)}
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 mb-6 text-center">
              <div>
                <div className="font-bold text-blue-700 text-lg">{course.duration}</div>
                <div className="text-gray-500 text-xs">Thời Lượng</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="font-bold text-blue-700 text-lg">{course.lessons}</div>
                <div className="text-gray-500 text-xs">Bài Học</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="font-bold text-blue-700 text-lg">{course.level}</div>
                <div className="text-gray-500 text-xs">Trình Độ</div>
              </div>
            </div>

            {/* Footer Row */}
            <div className="flex items-end justify-between w-full max-w-lg">
              <div className="text-center">
                <div className="w-32 border-b-2 border-gray-400 mb-1 mx-auto" />
                <div className="font-semibold text-gray-700 text-sm">{course.instructor}</div>
                <div className="text-gray-400 text-xs">Giảng Viên</div>
              </div>
              <div className="text-center">
                <CheckCircleOutlined className="text-green-500 text-3xl mb-1" />
                <div className="text-gray-500 text-xs">Đã xác thực</div>
              </div>
              <div className="text-center">
                <div className="w-32 border-b-2 border-gray-400 mb-1 mx-auto" />
                <div className="font-semibold text-gray-700 text-sm">{issueDate}</div>
                <div className="text-gray-400 text-xs">Ngày Cấp</div>
              </div>
            </div>

            {/* Cert ID */}
            <div className="absolute bottom-4 right-8 text-gray-300 text-xs">
              ID: {certId}
            </div>
          </div>
        </div>

        {/* Share Actions */}
        <div className="mt-8 print:hidden">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <Title level={5} className="text-white mb-4 text-center">Chia Sẻ Thành Tích</Title>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                size="large"
                icon={<LinkedinOutlined />}
                onClick={() => handleShare('LinkedIn')}
                className="bg-blue-600 text-white border-blue-600 rounded-xl"
              >
                LinkedIn
              </Button>
              <Button
                size="large"
                icon={<ShareAltOutlined />}
                onClick={() => handleShare('Facebook')}
                className="bg-blue-500 text-white border-blue-500 rounded-xl"
              >
                Facebook
              </Button>
              <Button
                size="large"
                icon={<ShareAltOutlined />}
                onClick={() => handleShare('Twitter')}
                className="bg-sky-400 text-white border-sky-400 rounded-xl"
              >
                Twitter
              </Button>
              <Button
                size="large"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                className="bg-green-600 text-white border-green-600 rounded-xl"
              >
                Tải Về PDF
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <Space>
              <Button size="large" onClick={() => navigate('/courses')} className="border-blue-400 text-blue-300 rounded-xl">
                Khám Phá Khóa Học Khác
              </Button>
              <Button size="large" type="primary" onClick={() => navigate('/profile')} className="rounded-xl">
                Xem Hồ Sơ Của Tôi
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
}
