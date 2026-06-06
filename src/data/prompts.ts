/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptTemplate, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'thiet-ke-lai',
    name: 'Thiết kế lại ảnh',
    icon: 'RefreshCw',
    description: 'Sửa đổi, làm mới diện mạo hoặc thay đổi phong cách dựa trên ảnh gốc'
  },
  {
    id: 'banner',
    name: 'Banner quảng cáo',
    icon: 'Image',
    description: 'Tạo banner Marketing, bài đăng mạng xã hội và quảng cáo hiển thị'
  },
  {
    id: 'poster-flyer',
    name: 'Poster / Flyer',
    icon: 'FileText',
    description: 'Thiết kế áp phích quảng cáo, tờ rơi sự kiện và biển hiệu khổ lớn'
  },
  {
    id: 'tem-nhan-bao-bi',
    name: 'Tem nhãn / Bao bì',
    icon: 'Package',
    description: 'Thiết kế nhãn chai, bao bì sản phẩm, hộp giấy carton cao cấp'
  },
  {
    id: 'mockup',
    name: 'Mockup sản phẩm',
    icon: 'Layers',
    description: 'Phối cảnh sản phẩm trên kệ, mặt bàn, studio hoặc biển hiệu thực tế'
  },
  {
    id: 'tach-nen-xoa-vat-the',
    name: 'Tách nền / Xóa vật thể',
    icon: 'Scissors',
    description: 'Prompt hỗ trợ cô lập chủ thể, loại bỏ các chi tiết thừa thãi'
  },
  {
    id: 'upscale',
    name: 'Làm nét / Upscale',
    icon: 'Maximize',
    description: 'Phục chế hình ảnh mờ, tăng độ phân giải cực nét cho file in ấn'
  },
  {
    id: 'vector',
    name: 'Chuyển vector',
    icon: 'Compass',
    description: 'Tạo hình ảnh vector phẳng, biểu tượng SVG tách lớp để dễ vẽ lại'
  }
];

export const INITIAL_PROMPTS: PromptTemplate[] = [];
