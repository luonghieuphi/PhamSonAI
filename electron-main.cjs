const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let chatView;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    frame: false, // Bỏ thanh tiêu đề mặc định của Windows
    autoHideMenuBar: true, // Ẩn thanh menu (File, Edit...)
    icon: path.join(__dirname, 'image', 'logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
  });

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Khởi tạo BrowserView cho ChatGPT/AI
  chatView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.setBrowserView(chatView);

  // Vị trí: x=320 (sidebar), y=52 + 32 (thêm 32px cho title bar mới), width=còn lại, height=còn lại
  const updateBounds = () => {
    const { width, height } = mainWindow.getContentBounds();
    const titleBarHeight = 32;
    const headerHeight = 52;
    chatView.setBounds({
      x: 320,
      y: titleBarHeight + headerHeight,
      width: width - 320 - 280,
      height: height - titleBarHeight - headerHeight
    });
  };

  updateBounds();
  chatView.setAutoResize({ width: true, height: true });
  chatView.webContents.loadURL('https://chatgpt.com');

  mainWindow.on('resize', updateBounds);
  mainWindow.on('closed', () => { mainWindow = null; });
}

// Xử lý điều khiển cửa sổ từ React
ipcMain.on('window:minimize', () => mainWindow.minimize());
ipcMain.on('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on('window:close', () => mainWindow.close());

// Lắng nghe lệnh đổi URL từ React
ipcMain.on('url:change', (event, url) => {
  if (chatView) {
    chatView.webContents.loadURL(url);
  }
});

// Lắng nghe lệnh gửi Prompt vào ô nhập liệu của Web
ipcMain.on('prompt:send', async (event, text) => {
  if (!chatView) return;

  const currentUrl = chatView.webContents.getURL();
  const isChatGPT = currentUrl.includes('chatgpt.com');
  const isGemini = currentUrl.includes('gemini.google.com');
  const isGoogle = currentUrl.includes('google.com') && !currentUrl.includes('gemini') && !currentUrl.includes('labs.google');
  const isFlow = currentUrl.includes('labs.google/fx/vi/tools/flow');

  const script = `
    (async function() {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const textInput = \`${text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

      if (${isChatGPT}) {
        // --- 1. XỬ LÝ RIÊNG CHO CHATGPT ---
        const chatInputBox = document.querySelector('#prompt-textarea') || 
                             document.querySelector('div[contenteditable="true"]') ||
                             document.querySelector('textarea');
        if (chatInputBox) {
          chatInputBox.focus();
          try {
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, textInput);
          } catch (e) {
            if (chatInputBox.tagName === 'DIV') chatInputBox.innerText = textInput;
            else chatInputBox.value = textInput;
          }
          chatInputBox.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
      } else if (${isGemini}) {
        // --- 2. XỬ LÝ RIÊNG CHO GEMINI ---
        const chatInputBox = document.querySelector('.ql-editor[contenteditable="true"]') || 
                             document.querySelector('rich-textarea div[contenteditable="true"]') ||
                             document.querySelector('div[contenteditable="true"][role="textbox"]') ||
                             document.querySelector('div[contenteditable="true"]') ||
                             document.querySelector('textarea');
        if (chatInputBox) {
          chatInputBox.focus();
          try {
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, textInput);
          } catch (e) {
            if (chatInputBox.tagName === 'DIV') chatInputBox.innerText = textInput;
            else chatInputBox.value = textInput;
          }
          chatInputBox.dispatchEvent(new Event('input', { bubbles: true }));
          chatInputBox.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      } else if (${isGoogle}) {
        // --- 3. XỬ LÝ RIÊNG CHO GOOGLE ---
        const searchInput = document.querySelector('textarea[name="q"]') || 
                            document.querySelector('input[name="q"]') ||
                            document.querySelector('textarea') ||
                            document.querySelector('input[type="text"]');
        if (searchInput) {
          searchInput.focus();
          try {
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, textInput);
          } catch (e) {
            searchInput.value = textInput;
          }
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          searchInput.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      } else if (${isFlow}) {
        // --- 4. XỬ LÝ RIÊNG CHO GOOGLE IMAGEFX / VIDEOFX (FLOW) ---
        const editor = document.querySelector('[data-slate-editor="true"]') || 
                       document.querySelector('div[contenteditable="true"]');
        
        if (editor) {
          editor.focus();

          // Cố gắng tìm Slate editor instance qua React Fiber để cập nhật state chính xác
          let slateEditor = null;
          try {
            const reactKey = Object.keys(editor).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (reactKey) {
              let current = editor[reactKey];
              while (current) {
                if (current.memoizedProps && current.memoizedProps.editor) {
                  slateEditor = current.memoizedProps.editor;
                  break;
                }
                if (current.pendingProps && current.pendingProps.editor) {
                  slateEditor = current.pendingProps.editor;
                  break;
                }
                current = current.return;
              }
            }
          } catch (e) {
            console.error("Lỗi khi tìm Slate Editor qua React Fiber:", e);
          }

          if (slateEditor) {
            // --- CÁCH 1: CẬP NHẬT QUA SLATE API (Chuẩn nhất, tránh hiển thị nổi) ---
            try {
              const lastLineIdx = slateEditor.children.length - 1;
              const lastLine = slateEditor.children[lastLineIdx];
              const lastTextIdx = lastLine.children.length - 1;
              const lastText = lastLine.children[lastTextIdx];
              
              slateEditor.selection = {
                anchor: { path: [0, 0], offset: 0 },
                focus: { path: [lastLineIdx, lastTextIdx], offset: (lastText.text || '').length }
              };
              
              slateEditor.insertText(textInput);
              return true;
            } catch (err) {
              console.error("Lỗi khi dùng slateEditor.insertText:", err);
            }
          }

          // --- CÁCH 2: FALLBACK DÙNG BEFOREINPUT EVENT ---
          document.execCommand('selectAll', false, null);
          document.execCommand('delete', false, null);

          const beforeInputEvent = new InputEvent('beforeinput', {
            bubbles: true,
            cancelable: true,
            composed: true,
            inputType: 'insertText',
            data: textInput
          });
          
          editor.dispatchEvent(beforeInputEvent);
          return true;
        }
      } else {
        // --- 5. FALLBACK CHO CÁC TRANG KHÁC ---
        const chatInputBox = document.querySelector('#prompt-textarea') || 
                             document.querySelector('.ql-editor[contenteditable="true"]') ||
                             document.querySelector('textarea') || 
                             document.querySelector('div[contenteditable="true"]');
        if (chatInputBox) {
          chatInputBox.focus();
          try {
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, textInput);
          } catch (e) {
            if (chatInputBox.tagName === 'DIV') chatInputBox.innerText = textInput;
            else chatInputBox.value = textInput;
          }
          chatInputBox.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        }
      }
      return false;
    })();
  `;

  chatView.webContents.executeJavaScript(script);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
