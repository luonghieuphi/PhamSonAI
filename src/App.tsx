/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  RefreshCw,
  Image as ImageIcon,
  FileText,
  Package,
  Layers,
  Scissors,
  Maximize,
  Minus,
  Compass,
  Video,
  Heart,
  Search,
  Copy,
  Check,
  RotateCcw,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Info,
  X,
  FileCode,
  Sliders,
  ChevronRight,
  Filter,
  Flame,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Send,
  ArrowRight,
  Link2
} from 'lucide-react';

import { PromptTemplate, CategoryID } from './types';
import { CATEGORIES, INITIAL_PROMPTS } from './data/prompts';

const QUICK_PROMPTS = [
  {
    id: 'thiet-ke-lai-banner',
    label: 'Thiết kế lại banner',
    icon: Sparkles,
    color: 'text-cyan-400',
    prompt: 'Thiết kế lại banner quảng cáo hiflex vỉa hè sắc nét, nâng cấp bố cục hiện đại, màu sắc tươi sáng, độ tương phản cao, ánh sáng studio sang trọng, chất lượng in ấn đỉnh cao 8k.'
  },
  {
    id: 'thiet-ke-lai-poster',
    label: 'Thiết kế lại poster',
    icon: ImageIcon,
    color: 'text-emerald-400',
    prompt: 'Thiết kế lại poster quảng cáo đứng nghệ thuật, tối giản thanh lịch, độ tương phản cực kỳ cao (high contrast), làm nổi bật thông điệp, ánh sáng góc nghiêng sâu.'
  },
  {
    id: 'tao-mockup-bao-bi',
    label: 'Tạo mockup bao bì',
    icon: Package,
    color: 'text-amber-400',
    prompt: 'Tạo phối cảnh mockup bao bì hộp giấy 3D cao cấp, đặt trên mặt đá cẩm thạch trắng mờ sang trọng, ánh sáng studio mềm mại, chân thực chi tiết 8k.'
  },
  {
    id: 'tao-mockup-bien-hieu',
    label: 'Tạo mockup biển hiệu',
    icon: Layers,
    color: 'text-blue-400',
    prompt: 'Mockup biển hiệu quảng cáo 3D khung sắt căng bạt ngoài trời vỉa hè phố xá đông đúc ngập tràn ánh nắng, góc chụp 3/4 chuyên nghiệp thực tế.'
  },
  {
    id: 'xoa-chu-giu-nen',
    label: 'Xóa chữ giữ nền',
    icon: Scissors,
    color: 'text-rose-400',
    prompt: 'Xác định vùng văn bản trên bạt quảng cáo, tiến hành xóa sạch hoàn toàn chữ viết và logo nhưng vẫn giữ nguyên vẹn hoa văn nền thiên nhiên sắc nét đồng nhất.'
  },
  {
    id: 'mo-rong-anh',
    label: 'Mở rộng ảnh',
    icon: Maximize,
    color: 'text-violet-400',
    prompt: 'Sử dụng công nghệ AI Outpainting để mở rộng đều hai bên bức ảnh bạt hiflex ban đầu, vẽ thêm bối cảnh vỉa hè mộc mạc tự nhiên cùng màu sắc hài hòa cực nghệ.'
  },
  {
    id: 'lam-net-anh',
    label: 'Làm nét ảnh',
    icon: RefreshCw,
    color: 'text-indigo-400',
    prompt: 'Khử mờ nhòe bạt in cũ, phục hồi các chi tiết siêu vi, làm nét hạt da, sợi chỉ, thớ bạt hiflex bóng bẩy với bộ lọc Super Resolution AI tăng nét gấp 4 lần.'
  },
  {
    id: 'chuyen-vector',
    label: 'Chuyển vector',
    icon: FileText,
    color: 'text-teal-400',
    prompt: 'Trực quan hóa và chuyển đổi bạt vẽ phác thảo sang dạng vector phẳng 2D, đường viền sắc nét, màu sắc phối màu mượt mà cao cấp, tách lớp rõ ràng.'
  }
];

const TitleBar = () => {
  // Hiển thị TitleBar kể cả khi không có electronAPI để debug giao diện
  const isElectron = !!window.electronAPI;
  
  return (
    <div className="h-8 bg-[#0b1021] border-b border-slate-800 flex items-center justify-between px-3 select-none flex-shrink-0 z-[9999] relative" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex items-center gap-2">
        <img src="image/logo.png" className="w-4 h-4 object-contain" alt="Logo" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">PHẠM SƠN AI</span>
      </div>
      
      {isElectron ? (
        <div className="flex items-center h-full" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button 
            onClick={() => window.electronAPI?.minimize()} 
            className="px-3 h-full flex items-center hover:bg-slate-800 text-slate-400 transition-colors"
            title="Thu nhỏ"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => window.electronAPI?.maximize()} 
            className="px-3 h-full flex items-center hover:bg-slate-800 text-slate-400 transition-colors"
            title="Phóng to"
          >
            <Maximize className="w-3 h-3" />
          </button>
          <button 
            onClick={() => window.electronAPI?.close()} 
            className="px-3 h-full flex items-center hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 opacity-50">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
        </div>
      )}
    </div>
  );
};

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export default function App() {
  // Application State
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryID | 'all' | 'favorite'>('all');
  const [selectedQuickPromptId, setSelectedQuickPromptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Custom Prompts State
  const [customPrompts, setCustomPrompts] = useState<PromptTemplate[]>([]);

  // Editor State
  const [editorTitle, setEditorTitle] = useState('Chọn một mẫu prompt để bắt đầu');
  const [editorText, setEditorText] = useState(
    'Hãy chọn một mẫu thiết kế ở danh sách bên dưới hoặc tải ảnh của bạn lên ở cột bên phải để bắt đầu thiết kế prompt.'
  );
  const [activePromptId, setActivePromptId] = useState<string | null>(null);

  // New Prompt Modals/Inputs state
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptDesc, setNewPromptDesc] = useState('');
  const [newPromptCategory, setNewPromptCategory] = useState<CategoryID>('thiet-ke-lai');
  const [newPromptBody, setNewPromptBody] = useState('');

  // Image upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string>('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // WebView/Iframe URL State
  const [activeUrl, setActiveUrl] = useState('https://chatgpt.com');

  // Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'info' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Reference for file input picker
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sidebar Tabs and Calculator State
  const [activeSidebarTab, setActiveSidebarTab] = useState<'prompts' | 'ratio'>('prompts');
  const [wInput, setWInput] = useState('3.0');
  const [hInput, setHInput] = useState('2.0');
  const [ratioUnit, setRatioUnit] = useState<'meter' | 'cm'>('meter');
  const [ratioDpi, setRatioDpi] = useState<number>(72);

  const getGcd = (a: number, b: number): number => {
    return b === 0 ? a : getGcd(b, a % b);
  };

  const calculatedRatio = useMemo(() => {
    const w = parseFloat(wInput) || 0;
    const h = parseFloat(hInput) || 0;
    if (w <= 0 || h <= 0) return { ratioStr: 'N/A', decimalRatio: '0.00', pxW: 0, pxH: 0 };
    
    // Find GCD of scaled values to support float dimensions
    const scale = 100; // supports up to 2 decimal places
    const wInt = Math.round(w * scale);
    const hInt = Math.round(h * scale);
    
    const divisor = getGcd(wInt, hInt);
    const numW = wInt / divisor;
    const numH = hInt / divisor;
    
    // Convert to pixels based on DPI (1 inch = 2.54 cm = 0.0254 meters)
    let inchesW = 0;
    let inchesH = 0;
    if (ratioUnit === 'meter') {
      inchesW = w / 0.0254;
      inchesH = h / 0.0254;
    } else {
      inchesW = w / 2.54;
      inchesH = h / 2.54;
    }
    
    const pxW = Math.round(inchesW * ratioDpi);
    const pxH = Math.round(inchesH * ratioDpi);
    
    return {
      ratioStr: `${numW}:${numH}`,
      decimalRatio: (w / h).toFixed(2),
      pxW,
      pxH
    };
  }, [wInput, hInput, ratioUnit, ratioDpi]);

  // Load state from localStorage on mount
  useEffect(() => {
    // Load favorites
    const savedFavorites = localStorage.getItem('ai_design_assistant_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Lỗi khi đọc danh sách yêu thích', e);
      }
    }

    // Load custom prompts
    const savedCustom = localStorage.getItem('ai_design_assistant_custom');
    if (savedCustom) {
      try {
        setCustomPrompts(JSON.parse(savedCustom));
      } catch (e) {
        console.error('Lỗi khi đọc danh sách prompt tự tạo', e);
      }
    }

    // Initialize templates combined with custom prompts
    setPrompts(INITIAL_PROMPTS);
  }, []);

  const saveFavoritesToLocalStorage = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('ai_design_assistant_favorites', JSON.stringify(newFavorites));
  };

  const saveCustomPromptsToLocalStorage = (newCustom: PromptTemplate[]) => {
    setCustomPrompts(newCustom);
    localStorage.setItem('ai_design_assistant_custom', JSON.stringify(newCustom));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
      showToast('Đã xóa khỏi danh sách yêu thích!', 'info');
    } else {
      updated = [...favorites, id];
      showToast('Đã thêm vào mục yêu thích ⭐', 'success');
    }
    saveFavoritesToLocalStorage(updated);
  };

  const copyToClipboard = (text: string, label: string = 'Prompt') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast(`Đã sao chép ${label} vào bộ nhớ tạm!`, 'success');
      })
      .catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast(`Đã sao chép ${label} vào bộ nhớ tạm!`, 'success');
        } catch (err) {
          showToast('Sao chép thất bại, hãy bôi đen để copy!', 'error');
        }
        document.body.removeChild(textarea);
      });
  };

  const handleCopyQuickPrompt = () => {
    if (!selectedQuickPromptId) {
      showToast('Vui lòng chọn một mục prompt nhanh phía trên!', 'info');
      return;
    }
    const target = QUICK_PROMPTS.find(p => p.id === selectedQuickPromptId);
    if (target) {
      // 1. Sao chép vào clipboard như cũ
      copyToClipboard(target.prompt, target.label);
      
      // 2. Gửi trực tiếp vào ô nhập liệu của ChatGPT/Gemini nếu đang chạy Electron
      if (window.electronAPI?.sendPrompt) {
        window.electronAPI.sendPrompt(target.prompt);
        showToast('Đã dán prompt vào ô nhập liệu AI!', 'success');
      }
    }
  };

  const allPrompts = useMemo(() => {
    return [...customPrompts, ...prompts];
  }, [prompts, customPrompts]);

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter(item => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'favorite' && favorites.includes(item.id)) ||
        item.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.prompt.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [allPrompts, selectedCategory, favorites, searchQuery]);

  const handleUsePrompt = (item: PromptTemplate) => {
    setEditorTitle(item.title);
    setEditorText(item.prompt);
    setActivePromptId(item.id);
    showToast(`Đã tải mẫu "${item.title.replace(/^\d+\.\s*/, '')}" vào Workspace!`, 'info');
  };

  const handleSaveEditorAsCustom = () => {
    if (!editorText.trim() || editorText.startsWith('Hãy chọn một mẫu')) {
      showToast('Nội dung prompt trống hoặc chưa sẵn sàng!', 'error');
      return;
    }

    const cleanTitle = editorTitle.startsWith('Chọn một mẫu') 
      ? 'Mẫu thiết kế tùy biến' 
      : `${editorTitle} (Bản lưu)`;

    const newId = `custom-${Date.now()}`;
    const newCustomPrompt: PromptTemplate = {
      id: newId,
      title: cleanTitle,
      description: 'Được lưu từ vùng soạn thảo Workspace của bạn.',
      category: 'thiet-ke-lai',
      prompt: editorText,
      isCustom: true
    };

    const updatedCustom = [newCustomPrompt, ...customPrompts];
    saveCustomPromptsToLocalStorage(updatedCustom);
    saveFavoritesToLocalStorage([...favorites, newId]);
    setActivePromptId(newId);
    showToast('Đã lưu bản sao vào danh sách Custom và Favorites!', 'success');
  };

  const handleResetEditor = () => {
    if (activePromptId) {
      const original = allPrompts.find(p => p.id === activePromptId);
      if (original) {
        setEditorText(original.prompt);
        setEditorTitle(original.title);
        showToast('Đã khôi phục nội dung prompt ban đầu!', 'info');
        return;
      }
    }
    setEditorText('');
    setEditorTitle('Prompt Thiết kế mới');
    showToast('Đã dọn sạch Workspace!', 'info');
  };

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptTitle.trim() || !newPromptBody.trim()) {
      showToast('Vui lòng điền đủ Tiêu đề và Nội dung!', 'error');
      return;
    }

    const newId = `user-added-${Date.now()}`;
    const createdItem: PromptTemplate = {
      id: newId,
      title: `✒️ ${newPromptTitle.trim()}`,
      description: newPromptDesc.trim() || 'Prompt thủ công từ Designer',
      category: newPromptCategory,
      prompt: newPromptBody.trim(),
      isCustom: true
    };

    const updatedCustom = [createdItem, ...customPrompts];
    saveCustomPromptsToLocalStorage(updatedCustom);
    
    setEditorTitle(createdItem.title);
    setEditorText(createdItem.prompt);
    setActivePromptId(newId);

    setNewPromptTitle('');
    setNewPromptDesc('');
    setNewPromptBody('');
    setIsAddingPrompt(false);

    showToast('Tạo prompt thành công!', 'success');
  };

  const handleDeleteCustomPrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa mẫu prompt này?')) return;

    const updatedCustom = customPrompts.filter(p => p.id !== id);
    saveCustomPromptsToLocalStorage(updatedCustom);

    if (favorites.includes(id)) {
      saveFavoritesToLocalStorage(favorites.filter(favId => favId !== id));
    }

    if (activePromptId === id) {
      setEditorTitle('Chọn một mẫu prompt để bắt đầu');
      setEditorText('Đã xóa mẫu prompt hiện tại.');
      setActivePromptId(null);
    }

    showToast('Đã xóa bỏ prompt custom!', 'info');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Xin vui lòng chọn một tệp hình ảnh!', 'error');
      return;
    }

    setUploadedImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      showToast(`Đã đính kèm ảnh: ${file.name}`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUploadedImageName('');
    showToast('Đã gỡ bỏ ảnh.', 'info');
  };

  const handleSimulateImagePrompt = async () => {
    if (!uploadedImage) {
      showToast('Vui lòng đính kèm một bức ảnh lên trước!', 'error');
      return;
    }

    setIsAnalyzingImage(true);
    setAnalysisProgress(15);
    
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      // Vì tool này chỉ hiển thị giao diện, ta sẽ bỏ qua bước gọi API
      setEditorTitle(`🎨 Đã đính kèm: ${uploadedImageName}`);
      setEditorText(`[MÔ TẢ CỦA BẠN SẼ HIỂN THỊ TẠI ĐÂY]\n\nBạn có thể copy prompt mẫu ở bên trái để sử dụng cho ảnh này.`);
      showToast('Đã tải ảnh lên thành công!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Có lỗi kết nối. Hãy đảm bảo đã cấp API Key tại thiết lập!', 'error');
      
      const generatedTitle = `🎨 Thiết kế lại ảnh nền: ${uploadedImageName}`;
      const generatedPrompt = `[MẪU PROMPT PHÂN TÍCH OFFLINE ĐỂ THIẾT KẾ LẠI ẢNH: ${uploadedImageName}]

Mô tả yêu cầu chỉnh sửa hình ảnh:
Tôi muốn vẽ lại ảnh gốc này để làm banner in ấn chất lượng cao. Giữ lại nguyên hình dáng của chủ thể chính và các vật thể nằm ở trung tâm bức ảnh.

Bố cục đề xuất mới:
- Thiết lập bối cảnh xung quanh tối giản hiện đại sang trọng như phong cách phòng chụp Studio Bắc Âu.
- Chủ thể được nâng cấp bề mặt dệt da tự nhiên siêu mịn, viền kim loại sáng bóng sành điệu.
- Thắp sáng bằng đèn viền rim lighting màu vàng hổ phách, bóng đổ mềm mại xém sang bên trái.
- Chất lượng: 8k resolution, photorealistic, cinematic lighting, clean --ar 16:9.`;
      setEditorTitle(generatedTitle);
      setEditorText(generatedPrompt);
    } finally {
      setIsAnalyzingImage(false);
      setAnalysisProgress(0);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#070b13] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-900 overflow-hidden">
      <TitleBar />
      
      {/* Dynamic Alert Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-xl shadow-2xl transition-all duration-300 border glow-accent ${
          toast.type === 'success' 
            ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-400' 
            : toast.type === 'error'
            ? 'bg-slate-900/95 border-rose-500/40 text-rose-400'
            : 'bg-slate-900/95 border-cyan-500/40 text-cyan-400'
        }`}>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />}
          {toast.type === 'info' && <Sparkles className="w-5 h-5 mr-3 flex-shrink-0" />}
          <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Main 2-Part Workspace Container */}
      <div className="flex-1 flex overflow-hidden h-full w-full">
        
        {/* PART 1: Left Workstation Sidebar (Logo, Controls, Workspace, Upload tool, Web links) */}
        <aside className="w-[320px] bg-[#080d17] border-r border-slate-800 flex flex-col justify-between overflow-hidden flex-shrink-0 relative">
          
          {/* Header area with Logo & New Chat actions */}
          <div className="flex-shrink-0 border-b border-slate-800 bg-[#090e18] p-4 space-y-3">
            {/* "Video bài giảng" button row */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const url = 'https://edu.s99.vn/learn/khoa-hoc-ai-2026?video=53';
                  if (window.electronAPI) {
                    window.electronAPI.changeUrl(url);
                  } else {
                    setActiveUrl(url);
                  }
                  showToast('Đang tải Video bài giảng...', 'info');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-450 text-slate-950 transition-all font-mono active:scale-95 shadow shadow-cyan-950/40 text-center"
              >
                <Video className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>VIDEO BÀI GIẢNG</span>
              </button>

              {/* Tab Selector: Tiện ích vs Tính tỉ lệ */}
              <div className="grid grid-cols-2 gap-1.5 mt-1 bg-slate-950/85 p-1 rounded-xl border border-slate-850/70">
                <button
                  type="button"
                  onClick={() => setActiveSidebarTab('prompts')}
                  className={`py-1.5 px-2.5 rounded-lg font-black font-mono text-[9.5px] tracking-wider transition-all duration-200 uppercase flex items-center justify-center gap-1 active:scale-[0.97] ${
                    activeSidebarTab === 'prompts'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TIỆN ÍCH AI</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setActiveSidebarTab('ratio')}
                  className={`py-1.5 px-2.5 rounded-lg font-black font-mono text-[9.5px] tracking-wider transition-all duration-200 uppercase flex items-center justify-center gap-1 active:scale-[0.97] ${
                    activeSidebarTab === 'ratio'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Maximize className="w-3.5 h-3.5" />
                  <span>TÍNH TỈ LỆ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main scrollable body for sidebar control elements */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            
            {activeSidebarTab === 'prompts' && (
              <>
                {/* 4 Brand Prompt Buttons as requested */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase block text-left mb-1.5 font-mono">
                    CÔNG CỤ VIẾT PROMPT TỰ ĐỘNG
                  </span>
                  <div className="flex flex-col gap-2">
                    {[
                      {
                        id: 'prompt-banner-poster',
                        title: 'AI VIẾT PROMPT BANNER, POSTER',
                        desc: 'Tạo prompt bạt hiflex, poster quảng cáo',
                        icon: Sparkles,
                        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25 hover:bg-cyan-500/20 hover:border-cyan-500/50',
                        url: 'https://chatgpt.com/g/g-69eb4161200081918f60832d82f5c67f-chuyen-gia-tao-prompt-quang-cao'
                      },
                      {
                        id: 'prompt-hashtag',
                        title: 'AI VIẾT PROMPT HASHTAG',
                        desc: 'Sinh danh mục hashtag chuẩn SEO quảng cáo',
                        icon: FileText,
                        color: 'text-amber-400 bg-amber-500/10 border-amber-500/25 hover:bg-amber-500/20 hover:border-amber-500/50',
                        url: 'https://chatgpt.com/g/g-6a01b433ac148191adac927f29128033-ai-tao-hashtag-tu-anh'
                      },
                      {
                        id: 'prompt-logo-chibi',
                        title: 'AI TẠO LOGO CHIBI',
                        desc: 'Tạo hình trang trí, logo chibi ngộ nghĩnh',
                        icon: Package,
                        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 hover:bg-cyan-500/20 hover:border-emerald-500/50',
                        url: 'https://chatgpt.com/g/g-69fb80788b3c819184f7c289dd1bae5b-ai-tao-logo-chibi'
                      },
                      {
                        id: 'prompt-mockuphibi',
                        title: 'AI VIẾT PROMPT MOCKUPHIBI',
                        desc: 'Sinh phối cảnh bạt, biển hiệu 3D hiflex vỉa hè',
                        icon: Sliders,
                        color: 'text-violet-400 bg-violet-500/10 border-violet-500/25 hover:bg-violet-500/20 hover:border-violet-500/50',
                        url: 'https://chatgpt.com/g/g-6a054ddd66c88191aef258ae33b41821-tro-ly-ai-prompt-mockup'
                      },
                      {
                        id: 'prompt-boc-tach-thi-cong',
                        title: 'TRỢ LÝ AI BÓC TÁCH FILE',
                        desc: 'Hỗ trợ bóc tách, bóc khối lượng và chi tiết bản vẽ thi công',
                        icon: Layers,
                        color: 'text-rose-400 bg-rose-500/10 border-rose-500/25 hover:bg-rose-500/20 hover:border-rose-500/50',
                        url: 'https://chatgpt.com/g/g-6a21a5944b6081918e21f2fae7c2d85e-ai-boc-tach-thi-cong'
                      },
                      {
                        id: 'prompt-kich-net-pro',
                        title: 'TRỢ LÝ AI PHỤC HỒI KÍCH NÉT',
                        desc: 'Phục hồi, khử mờ nhòe và kích nét ảnh in chất lượng cao',
                        icon: Maximize,
                        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25 hover:bg-indigo-500/20 hover:border-indigo-500/50',
                        url: 'https://chatgpt.com/g/g-6a0d804cc7b48191b22af2669e441e32-kich-net-pro'
                      }
                    ].map(b => {
                      const IconComp = b.icon;
                      return (
                        <button
                          key={b.id}
                          onClick={() => {
                            if (window.electronAPI) {
                              window.electronAPI.changeUrl(b.url);
                            } else {
                              setActiveUrl(b.url);
                            }
                            showToast(`Đang tải công cụ: ${b.title}`, 'info');
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-800 text-left transition-all duration-200 cursor-pointer flex items-start gap-2.5 hover:bg-slate-900/40 active:scale-[0.98] shadow-sm"
                        >
                          <div className="p-1.5 rounded-lg bg-slate-900/65 border border-slate-800 flex-shrink-0">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={`text-[11px] font-black tracking-wide leading-tight ${b.color.split(' ')[0]}`}>{b.title}</h4>
                            <p className="text-[9.5px] opacity-75 truncate mt-0.5 font-medium text-slate-400">{b.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeSidebarTab === 'ratio' && (
              <div className="space-y-4">
                {/* Header Title */}
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase block text-left mb-1 font-mono">
                    TÍNH TỈ LỆ ẢNH & KÍCH THƯỚC BẠT
                  </span>
                  <p className="text-[10px] text-slate-400 leading-normal text-left font-sans">
                    Quy đổi kích thước thực tế (Mét/Cm) sang Pixel chuẩn in bạt không bị vỡ hình.
                  </p>
                </div>

                {/* Main Sizing Tool Box */}
                <div className="bg-[#0b1021] border border-slate-800 rounded-xl p-3.5 space-y-3.5 text-left relative overflow-hidden shadow-md">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

                  {/* Unit toggler */}
                  <div className="flex items-center justify-between border-b border-slate-850/50 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">ĐƠN VỊ THỰC TẾ</span>
                    <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setRatioUnit('meter');
                          const w = parseFloat(wInput) || 0;
                          const h = parseFloat(hInput) || 0;
                          if (ratioUnit === 'cm') {
                            setWInput((w / 100).toFixed(1));
                            setHInput((h / 100).toFixed(1));
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider transition ${
                          ratioUnit === 'meter' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        MÉT
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRatioUnit('cm');
                          const w = parseFloat(wInput) || 0;
                          const h = parseFloat(hInput) || 0;
                          if (ratioUnit === 'meter') {
                            setWInput(Math.round(w * 100).toString());
                            setHInput(Math.round(h * 100).toString());
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider transition ${
                          ratioUnit === 'cm' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        CM
                      </button>
                    </div>
                  </div>

                  {/* Width & Height inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 font-mono">CHIỀU RỘNG (W)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={wInput}
                          onChange={(e) => setWInput(e.target.value)}
                          className="w-full bg-[#070b13] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-cyan-400 outline-none focus:border-cyan-500/40 text-center font-black sans-serif [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 font-mono">
                          {ratioUnit === 'meter' ? 'm' : 'cm'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 font-mono">CHIỀU CAO (H)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={hInput}
                          onChange={(e) => setHInput(e.target.value)}
                          className="w-full bg-[#070b13] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-cyan-400 outline-none focus:border-cyan-500/40 text-center font-black sans-serif [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 font-mono">
                          {ratioUnit === 'meter' ? 'm' : 'cm'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Target print resolution (DPI) */}
                  <div className="border-t border-slate-850/50 pt-2.5 flex flex-col gap-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono text-left">
                      ĐỘ PHÂN GIẢI (DPI)
                    </label>
                    <select
                      value={ratioDpi}
                      onChange={(e) => setRatioDpi(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-teal-400 outline-none cursor-pointer font-mono"
                    >
                      <option value={72}>72 DPI (Bạt hiflex lớn)</option>
                      <option value={100}>100 DPI (Bạt trung bình)</option>
                      <option value={150}>150 DPI (Bạt trong nhà rất sắc nét)</option>
                      <option value={300}>300 DPI (Decal, Poster cực đại)</option>
                    </select>
                  </div>

                  {/* Calculation Result Panel */}
                  <div className="bg-[#060a13] rounded-lg border border-slate-850 p-2.5 space-y-3">
                    <div className="border-b border-slate-850/40 pb-2">
                      <div className="text-[9.5px] font-bold text-slate-400 uppercase font-mono text-left mb-1">
                        TỔNG TỈ LỆ (RATIO)
                      </div>
                      <div className="text-cyan-400 font-black font-mono text-xs text-left">
                        {calculatedRatio.ratioStr} <span className="text-[9.5px] text-slate-500 font-normal">({calculatedRatio.decimalRatio} : 1)</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[9.5px] font-bold text-slate-400 uppercase font-mono text-left mb-1">
                        KÍCH THƯỚC PHÙ HỢP PIXEL
                      </div>
                      <div className="text-emerald-400 font-black font-mono text-xs text-left">
                        {calculatedRatio.pxW} x {calculatedRatio.pxH} px
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggested Sizing Presets for Quick entry */}
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold tracking-wider text-slate-500 uppercase block text-left font-mono">
                    KÍCH THƯỚC BẠT PHỔ BIẾN
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { name: 'Bạt Đứng vỉa hè (0.8x1.2m)', w: '0.8', h: '1.2', unit: 'meter' },
                      { name: 'Bạt Ngang vỉa hè (3x2m)', w: '3.0', h: '2.0', unit: 'meter' },
                      { name: 'Băng rôn (5x1m)', w: '5.0', h: '1.0', unit: 'meter' },
                      { name: 'Phướn treo (0.6x1.6m)', w: '0.6', h: '1.6', unit: 'meter' },
                      { name: 'Khung Standee (60x160cm)', w: '60', h: '160', unit: 'cm' },
                      { name: 'Khung Standee (80x180cm)', w: '80', h: '180', unit: 'cm' }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setWInput(preset.w);
                          setHInput(preset.h);
                          setRatioUnit(preset.unit as 'meter' | 'cm');
                          showToast(`Đã chọn kích thước mẫu: ${preset.name}`, 'info');
                        }}
                        className="py-1.5 px-2 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg border border-slate-850 hover:border-slate-700 text-[9.5px] font-black text-left truncate transition font-sans"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* PART 1 FOOTER: Separator list and External platform buttons */}
          <div className="flex-shrink-0 border-t border-slate-800 bg-[#050912]">
            
            <div className="h-px bg-slate-800/50 w-full mb-3"></div>

            {/* Cổng AI & Website liên kết list of external platforms as requested */}
            <div className="px-4 pb-4 space-y-2 text-left">
              <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase block">
                AI THIẾT KẾ
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: 'ChatGPT', url: 'https://chatgpt.com', hover: 'hover:border-emerald-500/40 hover:text-emerald-400' },
                  { name: 'Gemini', url: 'https://gemini.google.com', hover: 'hover:border-cyan-500/40 hover:text-cyan-400' },
                  { name: 'Flow', url: 'https://labs.google/fx/vi/tools/flow', hover: 'hover:border-indigo-500/40 hover:text-indigo-400' },
                  { name: 'Google', url: 'https://www.google.com', hover: 'hover:border-blue-500/40 hover:text-blue-400' }
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (window.electronAPI) {
                        window.electronAPI.changeUrl(item.url);
                      } else {
                        setActiveUrl(item.url);
                      }
                      showToast(`Đang tải ${item.name}...`, 'info');
                    }}
                    className={`py-2 text-[10.5px] font-black text-center rounded-lg border border-slate-850/85 bg-[#090e18] text-slate-400 shadow-sm transition-all duration-200 block w-full ${item.hover}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </aside>

        {/* PART 2: Right Panel - FULLY EMBEDDED INTEGRATED CHATGPT WEB IFRAME */}
        <section className="flex-1 flex flex-col bg-[#050810] relative min-w-0 h-full">
          
          {/* Top Header Bar for Main panel containing the 4 requested utility buttons */}
          <div className="px-3 py-2 bg-[#090e18] border-b border-slate-800/80 flex items-center justify-between gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap">
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/85"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/85"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/85"></span>
            </div>
            
            <div className="flex-1 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const url = 'https://docs.google.com/document/d/1Shq9NXVvgG7WyOeBlM5UlOtdwdMIeVMsiPkQkkbVpPM/edit?tab=t.0';
                  if (window.electronAPI) {
                    window.electronAPI.changeUrl(url);
                  } else {
                    setActiveUrl(url);
                  }
                  showToast('Đang tải Tool Kích Nét...', 'info');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-extrabold uppercase bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/20 transition-all font-mono active:scale-95 shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>TẢI TOOL KÍCH NÉT</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = 'https://docs.google.com/spreadsheets/d/1gf6VPHy9cFFZGaSdByLlhfy9N_MeSrXG9-_XpqStvWg/edit?gid=463213276#gid=463213276';
                  if (window.electronAPI) {
                    window.electronAPI.changeUrl(url);
                  } else {
                    setActiveUrl(url);
                  }
                  showToast('Đang tải Shop Tài Khoản AI...', 'info');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-extrabold uppercase bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/20 transition-all font-mono active:scale-95 shadow"
              >
                <Package className="w-3.5 h-3.5" />
                <span>SHOP TẢI KHOẢN AI</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = 'https://fontdep.vn/';
                  if (window.electronAPI) {
                    window.electronAPI.changeUrl(url);
                  } else {
                    setActiveUrl(url);
                  }
                  showToast('Đang tải Kho Font Chữ Việt Hóa...', 'info');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-extrabold uppercase bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/20 transition-all font-mono active:scale-95 shadow"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>KHO FONT CHỮ VIỆT HÓA</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = 'https://docs.google.com/spreadsheets/d/1gf6VPHy9cFFZGaSdByLlhfy9N_MeSrXG9-_XpqStvWg/edit?gid=0#gid=0';
                  if (window.electronAPI) {
                    window.electronAPI.changeUrl(url);
                  } else {
                    setActiveUrl(url);
                  }
                  showToast('Đang kết nối Dịch Vụ Cài Đặt Phần Mềm...', 'info');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-extrabold uppercase bg-violet-500/10 hover:bg-violet-500 hover:text-slate-950 text-violet-400 border border-violet-500/20 transition-all font-mono active:scale-95 shadow"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>DỊCH VỤ CÀI ĐẶT PHẦN MỀM</span>
              </button>
            </div>
          </div>

          {/* Web Frame Holder - Vùng trống để Electron BrowserView đè lên */}
          <div className="flex-1 relative bg-slate-950">
            {!window.electronAPI && (
              <iframe
                id="chatgpt-iframe"
                src={activeUrl}
                className="w-full h-full border-none"
                allow="clipboard-write; clipboard-read"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

        </section>

        {/* RIGHT PANEL: QUICK PROMPTS IN DESIGN WORKSPACE */}
        <aside className="w-[280px] bg-[#080d17] border-l border-slate-800 flex flex-col justify-between overflow-hidden flex-shrink-0 relative">
          
          {/* Header area */}
          <div className="flex-shrink-0 border-b border-slate-800 bg-[#090e18] p-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-left">
                <h2 className="text-xs font-black tracking-widest text-slate-100 uppercase font-mono">
                  PROMPT NHANH
                </h2>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-sans block mt-0.5">Chọn mẫu và sao chép</span>
              </div>
            </div>
          </div>

          {/* Quick Prompts List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar text-left">
            {QUICK_PROMPTS.map(item => {
              const IconComp = item.icon;
              const isSelected = selectedQuickPromptId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedQuickPromptId(item.id)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-2.5 outline-none ${
                    isSelected
                      ? 'bg-[#0f172a] border-cyan-500/40 text-white shadow-md shadow-cyan-950/20 shadow-inner'
                      : 'bg-[#090e18]/80 border-slate-850 hover:bg-[#0c1222] hover:border-slate-750 text-slate-300'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? 'border-cyan-400 bg-cyan-950 text-cyan-400' : 'border-slate-700 bg-[#070b14]'
                  }`}>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  
                  <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex-shrink-0">
                    <IconComp className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>

                  <span className="text-[11px] font-black tracking-wide truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Prompt Action - Copy Button */}
          <div className="p-4 border-t border-slate-800 bg-[#050912]">
            <button
              type="button"
              onClick={handleCopyQuickPrompt}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-450 hover:to-indigo-450 text-slate-950 font-black text-xs rounded-xl tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-950/30 active:scale-95 duration-150"
            >
              <Copy className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>SAO CHÉP PROMPT</span>
            </button>
          </div>

        </aside>

      </div>

      {/* CREATE NEW PROMPT FLOATING MODAL */}
      {isAddingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
          <div className="w-full max-w-lg bg-[#0e162d] border border-slate-700/60 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddingPrompt(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4 pb-2 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Tạo mẫu Prompt mới
              </h3>
            </div>

            <form onSubmit={handleCreatePrompt} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tên tiêu đề mẫu prompt
                </label>
                <input
                  type="text"
                  required
                  value={newPromptTitle}
                  onChange={(e) => setNewPromptTitle(e.target.value)}
                  placeholder="Ví dụ: Thiết kế decal tem sữa dừa xi măng..."
                  className="w-full bg-[#070b13] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Mô tả ngắn gọn công việc
                </label>
                <input
                  type="text"
                  value={newPromptDesc}
                  onChange={(e) => setNewPromptDesc(e.target.value)}
                  placeholder="Ví dụ: Giúp tạo mockup nhãn dán, chai thủy tinh cao cấp dán bục xi măng..."
                  className="w-full bg-[#070b13] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Hộp danh mục phân loại
                  </label>
                  <select
                    value={newPromptCategory}
                    onChange={(e) => setNewPromptCategory(e.target.value as CategoryID)}
                    className="w-full bg-[#070b13] border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nội dung prompt chi tiết tiếng Anh
                </label>
                <textarea
                  required
                  rows={4}
                  value={newPromptBody}
                  onChange={(e) => setNewPromptBody(e.target.value)}
                  placeholder="Dán mã prompt vẽ ảnh hoặc phân tích mô tả vào đây..."
                  className="w-full bg-[#070b13] border border-slate-800 rounded-xl p-3 text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono resize-none placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingPrompt(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-850 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-800"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm bg-cyan-500 hover:bg-cyan-450 text-slate-950 font-bold transition-all shadow shadow-cyan-900/30"
                >
                  Xác nhận Tạo mẫu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
