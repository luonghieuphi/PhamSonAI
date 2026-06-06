/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  isCustom?: boolean;
}

export type CategoryID =
  | 'thiet-ke-lai'
  | 'banner'
  | 'poster-flyer'
  | 'tem-nhan-bao-bi'
  | 'mockup'
  | 'tach-nen-xoa-vat-the'
  | 'upscale'
  | 'vector'
  | 'favorite';

declare global {
  interface Window {
    electronAPI?: {
      chat: (message: string, history: any[]) => Promise<any>;
      analyzeImage: (imageBase64: string, mimeType: string, fileName: string) => Promise<any>;
      changeUrl: (url: string) => void;
      sendPrompt: (text: string) => void;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }

  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement> & {
        src?: string;
        style?: React.CSSProperties;
        id?: string;
      };
    }
  }
}

export interface Category {
  id: CategoryID;
  name: string;
  icon: string; // lucide icon name
  description: string;
}
