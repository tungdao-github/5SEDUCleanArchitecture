import { useState } from 'react';
import {
  Card, Button, Input, Select, Typography, Row, Col, Modal,
  Upload, Tag, Space, Popconfirm, message, Tabs, Progress,
  Badge, Tooltip,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, DeleteOutlined, DownloadOutlined,
  CopyOutlined, FileImageOutlined, FilePdfOutlined, FileOutlined,
  VideoCameraOutlined, FolderOutlined, UploadOutlined, EyeOutlined,
  AppstoreOutlined, BarsOutlined, CloudUploadOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

type FileType = 'image' | 'video' | 'pdf' | 'other';

interface MediaFile {
  id: number;
  name: string;
  type: FileType;
  size: string;
  url: string;
  folder: string;
  uploadedAt: string;
  width?: number;
  height?: number;
}

const mockMedia: MediaFile[] = [
  { id: 1, name: 'banner-homepage.jpg', type: 'image', size: '2.4 MB', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300', folder: 'banners', uploadedAt: '17/05/2025', width: 1920, height: 600 },
  { id: 2, name: 'course-react-thumbnail.jpg', type: 'image', size: '890 KB', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300', folder: 'courses', uploadedAt: '16/05/2025', width: 800, height: 450 },
  { id: 3, name: 'intro-video.mp4', type: 'video', size: '145 MB', url: '', folder: 'videos', uploadedAt: '15/05/2025' },
  { id: 4, name: 'syllabus-2025.pdf', type: 'pdf', size: '3.2 MB', url: '', folder: 'documents', uploadedAt: '14/05/2025' },
  { id: 5, name: 'logo-edulearn.png', type: 'image', size: '125 KB', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300', folder: 'brand', uploadedAt: '13/05/2025', width: 512, height: 512 },
  { id: 6, name: 'course-design.jpg', type: 'image', size: '1.1 MB', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300', folder: 'courses', uploadedAt: '12/05/2025', width: 800, height: 450 },
  { id: 7, name: 'marketing-ebook.pdf', type: 'pdf', size: '8.5 MB', url: '', folder: 'documents', uploadedAt: '11/05/2025' },
  { id: 8, name: 'avatar-placeholder.png', type: 'image', size: '42 KB', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', folder: 'brand', uploadedAt: '10/05/2025', width: 200, height: 200 },
  { id: 9, name: 'lesson-01.mp4', type: 'video', size: '320 MB', url: '', folder: 'videos', uploadedAt: '09/05/2025' },
  { id: 10, name: 'certificate-template.pdf', type: 'pdf', size: '1.8 MB', url: '', folder: 'documents', uploadedAt: '08/05/2025' },
  { id: 11, name: 'hero-banner-2.jpg', type: 'image', size: '3.1 MB', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300', folder: 'banners', uploadedAt: '07/05/2025', width: 1920, height: 800 },
  { id: 12, name: 'style-guide.pdf', type: 'other', size: '512 KB', url: '', folder: 'documents', uploadedAt: '06/05/2025' },
];

const folders = ['Tất cả', 'banners', 'courses', 'videos', 'documents', 'brand'];

const typeIcon = (type: FileType) => {
  if (type === 'image') return <FileImageOutlined className="text-blue-400" />;
  if (type === 'video') return <VideoCameraOutlined className="text-purple-400" />;
  if (type === 'pdf') return <FilePdfOutlined className="text-red-400" />;
  return <FileOutlined className="text-gray-400" />;
};

const typeColor = (type: FileType): string => {
  if (type === 'image') return 'blue';
  if (type === 'video') return 'purple';
  if (type === 'pdf') return 'red';
  return 'default';
};

export default function MediaPage() {
  const [files, setFiles] = useState(mockMedia);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('Tất cả');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadModal, setUploadModal] = useState(false);
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = files.filter(f =>
    (folder === 'Tất cả' || f.folder === folder) &&
    (filterType === 'all' || f.type === filterType) &&
    (!search || f.name.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    setFiles(prev => prev.filter(f => !selected.includes(f.id)));
    setSelected([]);
    message.success('Đã xóa các file đã chọn!');
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url || 'https://cdn.edulearn.vn/media/file.jpg').catch(() => {});
    message.success('Đã copy URL!');
  };

  const stats = {
    total: files.length,
    images: files.filter(f => f.type === 'image').length,
    videos: files.filter(f => f.type === 'video').length,
    pdfs: files.filter(f => f.type === 'pdf').length,
    used: 2.8,
    limit: 10,
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="mb-1">🖼️ Quản Lý Media</Title>
          <Text className="text-gray-500">{files.length} files • Đã dùng {stats.used}GB / {stats.limit}GB</Text>
        </div>
        <Space>
          {selected.length > 0 && (
            <Popconfirm title={`Xóa ${selected.length} file?`} onConfirm={deleteSelected}>
              <Button danger>Xóa {selected.length} file</Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<CloudUploadOutlined />} size="large" onClick={() => setUploadModal(true)}>
            Upload Files
          </Button>
        </Space>
      </div>

      {/* Storage Usage */}
      <Card className="rounded-xl border-gray-100 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-48">
            <div className="flex justify-between mb-1">
              <Text className="text-sm font-medium text-gray-700">Dung Lượng Lưu Trữ</Text>
              <Text className="text-sm text-gray-500">{stats.used}GB / {stats.limit}GB</Text>
            </div>
            <Progress percent={Math.round((stats.used / stats.limit) * 100)} strokeColor="#1d4ed8" showInfo={false} />
          </div>
          <div className="flex gap-4">
            {[
              { label: 'Hình ảnh', count: stats.images, color: 'text-blue-500', icon: <FileImageOutlined /> },
              { label: 'Video', count: stats.videos, color: 'text-purple-500', icon: <VideoCameraOutlined /> },
              { label: 'PDF', count: stats.pdfs, color: 'text-red-500', icon: <FilePdfOutlined /> },
            ].map((item, i) => (
              <div key={i} className={`text-center ${item.color}`}>
                <div className="text-xl mb-0.5">{item.icon}</div>
                <div className="font-bold text-lg">{item.count}</div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        {/* Folder Sidebar */}
        <div className="w-44 flex-shrink-0">
          <Card className="rounded-xl border-gray-100">
            <Title level={5} className="mb-3 text-sm"><FolderOutlined /> Thư Mục</Title>
            <div className="space-y-1">
              {folders.map(f => (
                <div
                  key={f}
                  className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${folder === f ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setFolder(f)}
                >
                  <FolderOutlined className="mr-2" />
                  {f === 'Tất cả' ? 'Tất cả' : f}
                  <span className="ml-1 text-xs text-gray-400">
                    ({f === 'Tất cả' ? files.length : files.filter(x => x.folder === f).length})
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Input
              placeholder="Tìm file..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 220 }}
              allowClear
            />
            <Select value={filterType} onChange={setFilterType} style={{ width: 140 }}>
              <Option value="all">Tất cả loại</Option>
              <Option value="image">Hình ảnh</Option>
              <Option value="video">Video</Option>
              <Option value="pdf">PDF</Option>
              <Option value="other">Khác</Option>
            </Select>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden ml-auto">
              <Button icon={<AppstoreOutlined />} type={viewMode === 'grid' ? 'primary' : 'default'} onClick={() => setViewMode('grid')} className="rounded-none border-0" />
              <Button icon={<BarsOutlined />} type={viewMode === 'list' ? 'primary' : 'default'} onClick={() => setViewMode('list')} className="rounded-none border-0 border-l border-gray-200" />
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(file => (
                <div
                  key={file.id}
                  className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all
                    ${selected.includes(file.id) ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => toggleSelect(file.id)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {file.type === 'image' ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-4xl">{file.type === 'video' ? '🎬' : file.type === 'pdf' ? '📄' : '📁'}</div>
                    )}
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {file.type === 'image' && (
                      <Button size="small" icon={<EyeOutlined />} onClick={e => { e.stopPropagation(); setPreview(file); }} className="border-white text-white" />
                    )}
                    <Button size="small" icon={<CopyOutlined />} onClick={e => { e.stopPropagation(); copyUrl(file.url); }} className="border-white text-white" />
                    <Popconfirm title="Xóa file?" onConfirm={() => { setFiles(prev => prev.filter(f => f.id !== file.id)); message.success('Đã xóa!'); }}>
                      <Button size="small" danger icon={<DeleteOutlined />} onClick={e => e.stopPropagation()} />
                    </Popconfirm>
                  </div>

                  {selected.includes(file.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-2 bg-white">
                    <div className="text-xs text-gray-700 font-medium line-clamp-1">{file.name}</div>
                    <div className="flex justify-between items-center mt-0.5">
                      <Tag color={typeColor(file.type)} className="text-xs m-0 px-1">{file.type}</Tag>
                      <span className="text-gray-400 text-xs">{file.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <Card className="rounded-xl border-gray-100">
              <div className="space-y-2">
                {filtered.map(file => (
                  <div key={file.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer
                    ${selected.includes(file.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}
                    onClick={() => toggleSelect(file.id)}
                  >
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      {file.type === 'image' ? (
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">{file.type === 'video' ? '🎬' : file.type === 'pdf' ? '📄' : '📁'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800 line-clamp-1">{file.name}</div>
                      <div className="text-gray-400 text-xs">{file.folder} • {file.uploadedAt}</div>
                    </div>
                    <Tag color={typeColor(file.type)} className="text-xs flex-shrink-0">{file.type}</Tag>
                    <span className="text-gray-400 text-xs flex-shrink-0 w-16 text-right">{file.size}</span>
                    <Space onClick={e => e.stopPropagation()}>
                      <Tooltip title="Copy URL">
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyUrl(file.url)} />
                      </Tooltip>
                      <Button size="small" icon={<DownloadOutlined />} />
                      <Popconfirm title="Xóa file?" onConfirm={() => { setFiles(prev => prev.filter(f => f.id !== file.id)); message.success('Đã xóa!'); }}>
                        <Button size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        open={uploadModal}
        title={<span><CloudUploadOutlined className="mr-2" />Upload Files</span>}
        onCancel={() => setUploadModal(false)}
        footer={null}
        width={600}
      >
        <div className="mt-4">
          <Dragger
            multiple
            beforeUpload={() => false}
            onChange={() => { message.success('File đã được chọn!'); }}
            className="mb-4"
          >
            <p className="ant-upload-drag-icon"><CloudUploadOutlined className="text-5xl text-blue-400" /></p>
            <p className="ant-upload-text font-semibold text-gray-700">Kéo thả file vào đây hoặc click để chọn</p>
            <p className="ant-upload-hint text-gray-400 text-sm">Hỗ trợ: JPG, PNG, GIF, MP4, PDF, DOC • Tối đa 500MB/file</p>
          </Dragger>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Select className="w-full" placeholder="Chọn thư mục" defaultValue="courses">
                {folders.filter(f => f !== 'Tất cả').map(f => <Option key={f} value={f}>{f}</Option>)}
              </Select>
            </Col>
            <Col span={12}>
              <Button type="primary" block icon={<UploadOutlined />} onClick={() => { setUploadModal(false); message.success('Upload thành công!'); }}>
                Upload
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* Image Preview */}
      <Modal open={!!preview} onCancel={() => setPreview(null)} footer={null} width={800} title={preview?.name}>
        {preview && (
          <div className="text-center">
            <img src={preview.url} alt={preview.name} className="max-w-full rounded-xl" />
            <div className="mt-3 flex justify-center gap-4 text-sm text-gray-500">
              <span>{preview.width} × {preview.height}px</span>
              <span>{preview.size}</span>
              <span>{preview.uploadedAt}</span>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <Button icon={<CopyOutlined />} onClick={() => copyUrl(preview.url)}>Copy URL</Button>
              <Button icon={<DownloadOutlined />}>Tải về</Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
