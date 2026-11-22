# 🦅 BlinkQR

> Fast, lightweight, and privacy-first QR code scanner extension for Chromium browsers — scan any QR code on your screen without reaching for your phone.

[![Release](https://img.shields.io/github/v/release/ntaffzii/BlinkQR?style=flat-square&color=ff6a00)](https://github.com/ntaffzii/BlinkQR/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blue.svg?style=flat-square)](manifest.json)

---

## ✨ Features

- **📷 Screen Crop & Scan** — Click **ลากครอบสแกน** in the popup and drag a selection box over any QR code on your screen (supports high-DPI / Retina displays and `Esc` to cancel).
- **🖱️ Right-Click Context Menu** — Right-click any image on a webpage and select **🔍 สแกน QR Code จากรูปนี้** to decode it in one click.
- **📁 Local Image Upload** — Upload an image file directly from your computer inside the popup, view decoded text in the **Result Log**, and copy it with one click.
- **🔗 Smart Navigation** — Automatically opens valid `http://` and `https://` URLs in a new tab, or displays plain text results ready to copy.
- **🎨 Neon-Matte UI** — Clean dark matte-black popup with a custom digital falcon-eye emblem.

---

## 📦 Installation

### Option 1: Download from Releases (Recommended)
1. Go to the [**Releases**](https://github.com/ntaffzii/BlinkQR/releases) page and download the latest `.zip` archive (or source code).
2. Extract the downloaded folder to a permanent location on your computer.
3. Open your Chromium-based browser (Chrome, Edge, Brave, Arc, etc.) and navigate to `chrome://extensions/`.
4. Enable **Developer mode** (toggle in the top-right corner).
5. Click **Load unpacked** and select the extracted `BlinkQR` folder.

### Option 2: Clone from Source
```bash
git clone https://github.com/ntaffzii/BlinkQR.git
```
Then follow steps 3–5 above and select the cloned `BlinkQR` directory.

---

## 🚀 How to Use

1. **Crop & Scan:** Click the BlinkQR icon in your toolbar → click **ลากครอบสแกน** → drag over the QR code on the current tab.
2. **Right-Click Scan:** Right-click any image on a webpage → choose **🔍 สแกน QR Code จากรูปนี้**. *(If a site blocks cross-origin image reading via CORS, use Crop & Scan instead.)*
3. **Upload Image:** Click the BlinkQR icon → click **อัปโหลดรูปภาพ** → select an image file from your device.

---

## 🔒 Privacy & Permissions

All QR decoding runs **100% locally** in your browser using [`jsQR`](https://github.com/cozmo/jsQR). No screenshots, images, or decoded data are ever sent to external servers.

| Permission | Purpose |
| :--- | :--- |
| `contextMenus` | Adds the right-click "Scan QR Code" option on images. |
| `activeTab` | Captures the visible tab area when using Screen Crop & Scan. |
| `scripting` | Injects the crop overlay and decoder script into the active page on demand. |
| `tabs` | Opens decoded `http://` / `https://` links in a new tab. |

---

## 🛠️ Tech Stack

- **Platform:** Chromium Extension (Manifest V3)
- **Frontend:** HTML5, CSS3 (Matte-Black & Neon-Orange theme)
- **Logic:** Vanilla JavaScript (`background.js`, `content.js`, `popup.js`)
- **Decoder:** [jsQR](https://github.com/cozmo/jsQR)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
