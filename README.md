# 🦅 BlinkQR - Fast & Smart QR Code Scanner

An elegant, high-performance, and secure Chromium browser extension designed to scan QR codes directly from your screen—**without reaching for your mobile phone**.

## ✨ Features
* **Screen Crop & Scan:** Drag a custom selection box over any area of your screen to scan hidden or small QR codes.
* **Context Menu:** Right-click any image on Facebook, Line, or any website to extract QR data in one click.
* **Local File Upload:** Drag and drop your downloaded images directly into the beautiful dark-neon extension popup.
* **Smart Navigation:** Automatically detects and opens valid URLs in a new tab.

## 🔒 Privacy First
All image processing and decoding are performed **100% locally** using the `jsQR` library. No data or screenshots are ever sent to any external servers.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3 (Custom Matte-Black theme)
* **Logic:** Vanilla JavaScript (Chrome Extension Manifest V3)
* **Core Library:** [jsQR](https://github.com/cozmo/jsQR)