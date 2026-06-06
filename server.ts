/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client safely with telemetry User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request body parser
  app.use(express.json({ limit: '10mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. ChatGPT AI Assistant chat agent
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        res.status(400).json({ error: 'Nội dung tin nhắn không được bỏ trống.' });
        return;
      }

      // Check if GEMINI_API_KEY exists
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
        res.status(503).json({ 
          error: 'Chưa cấu hình API Key. Vui lòng thêm GEMINI_API_KEY trong mục Settings > Secrets.' 
        });
        return;
      }

      // Prepare system instruction for ChatGPT-style graphic designer partner
      const systemInstruction = 
        "Bạn là ChatGPT - chuyên gia hàng đầu về kĩ thuật Prompt Engineering cho vẽ ảnh AI (Midjourney, Stable Diffusion, Leonardo, Ideogram). " +
        "Bạn giao tiếp bằng tiếng Việt chuyên nghiệp, tự tin, mang tinh thần hỗ trợ tuyệt đối cho các nhà thiết kế (Designer), thầu quảng cáo, in ấn Corel / Photoshop. " +
        "Khi người dùng yêu cầu tối ưu hoặc tạo prompt vẽ ảnh: " +
        "- Hãy viết prompt chi tiết bằng tiếng Anh trong khối mã ``` để họ dễ copy dán vào AI. " +
        "- Luôn phân tích chi tiết: Bố cục (composition), ánh sáng (như rim light, neon, studio backlit), chất liệu (vải dệt thô, titan mờ, thạch anh nhám) và các thông số tỷ lệ (--ar 16:9, --ar 4:5). " +
        "- Trả lời ngắn gọn, tập trung thẳng vào chuyên môn thiết kế ảnh in ấn trung thực, không luyên thuyên lý thuyết suông.";

      // Reconstruct formatted conversation contents if history is provided
      const contentsList: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          contentsList.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          });
        });
      }
      
      // Append current message
      contentsList.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contentsList,
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      const text = response.text || 'Không có phản hồi từ mô hình AI.';
      res.json({ reply: text });
    } catch (error: any) {
      console.error('Lỗi API Chat:', error);
      res.status(500).json({ error: error.message || 'Lỗi hệ thống khi gọi AI.' });
    }
  });

  // 2. Multimodal Image-to-Prompt analysis (Tạo prompt từ ảnh gốc)
  app.post('/api/analyze-image', async (req, res) => {
    try {
      const { imageBase64, mimeType, fileName } = req.body;

      if (!imageBase64) {
        res.status(400).json({ error: 'Thiếu dữ liệu tệp ảnh base64.' });
        return;
      }

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
        res.status(503).json({ 
          error: 'Chưa cấu hình API Key. Vui lòng thêm GEMINI_API_KEY trong mục Settings > Secrets.' 
        });
        return;
      }

      const promptString = 
        `Hãy phân tích kỹ bức ảnh đính kèm (tên tệp: ${fileName || 'unnamed.png'}) có định dạng ${mimeType || 'image/png'}. ` +
        `Bạn là chuyên gia thiết kế đồ họa cao cấp kiêm Prompt Engineer viết prompt vẽ ảnh in ấn. ` +
        `Hãy trả về một mẫu Prompt tiếng Việt siêu chi tiết và một đoạn mã khối tiếng Anh cao cấp cho Midjourney / Stable Diffusion / Leonardo AI theo cấu trúc chuẩn sau: ` +
        `1. Tên Prompt đề xuất\n` +
        `2. Phân tích kết cấu chủ thể gốc, chất liệu khuyên dùng (ví dụ: thớ gỗ lim, nhám mịn, kính cường lực phản quang...).\n` +
        `3. Đề xuất ánh sáng: Chỉ định rõ ánh sáng ven (rim lighting), ánh sáng gắt một phía, hoặc phông nền mờ ảo bokeh rộng rãi.\n` +
        `4. Khối Prompt tiếng Anh chi tiết dạng markdown code block để dễ bấm nút CHÉP PROMPT để dán thẳng vào ChatGPT.\n` +
        `Lưu ý: Ngôn ngữ phân tích viết hoàn toàn bằng tiếng Việt thật tự tin, rực rỡ, chính xác thuật ngữ đồ họa in ấn.`;

      const imagePart = {
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: imageBase64,
        },
      };

      const textPart = {
        text: promptString,
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: { parts: [imagePart, textPart] }
      });

      const resultText = response.text || 'Phân tích ảnh thất bại.';
      res.json({ prompt: resultText });
    } catch (error: any) {
      console.error('Lỗi API analyze-image:', error);
      res.status(500).json({ error: error.message || 'Lỗi hệ thống khi xử lý phân tích hình ảnh.' });
    }
  });


  // --- VITE DEV OR STATIC ASSETS SERVING ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve client static HTML on everything else
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (http://0.0.0.0:${PORT})`);
  });
}

startServer();
