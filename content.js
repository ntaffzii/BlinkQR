// 👑 เพิ่มระบบ Guard ป้องกันการรันโค้ดซ้ำบนหน้าเว็บเดิม
if (!window.blinkQRInjected) {
    window.blinkQRInjected = true;

    // โยกตัวแปรทั้งหมดมาไว้ข้างในบล็อก Guard เพื่อป้องกันสภาวะตัวแปรชนกัน (Redeclaration)
    let overlay = null;
    let scanBox = null;
    let startX, startY;

    // ดักรับคำสั่งจาก background.js
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "init-crop-ui") {
            startCropMode();
        }
        if (message.action === "process-cropped-image") {
            processImageCrop(message.dataUrl, message.rect);
        }
        if (message.action === "scan-image-url") {
            scanImageUrlDirectly(message.url);
        }
    });

    function startCropMode() {
        if (document.querySelector('.qr-scanner-overlay')) return;

        overlay = document.createElement('div');
        overlay.className = 'qr-scanner-overlay';

        scanBox = document.createElement('div');
        scanBox.className = 'qr-scanner-box';

        document.body.appendChild(overlay);
        document.body.appendChild(scanBox);

        overlay.addEventListener('mousedown', onMouseDown);
        window.addEventListener('keydown', onKeyDown);
    }

    function onMouseDown(e) {
        startX = e.clientX;
        startY = e.clientY;

        scanBox.style.left = startX + 'px';
        scanBox.style.top = startY + 'px';
        scanBox.style.width = '0px';
        scanBox.style.height = '0px';

        overlay.addEventListener('mousemove', onMouseMove);
        overlay.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
        const currentX = e.clientX;
        const currentY = e.clientY;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(startX - currentX);
        const height = Math.abs(startY - currentY);

        scanBox.style.left = left + 'px';
        scanBox.style.top = top + 'px';
        scanBox.style.width = width + 'px';
        scanBox.style.height = height + 'px';
    }

    function onMouseUp(e) {
        overlay.removeEventListener('mousemove', onMouseMove);
        overlay.removeEventListener('mouseup', onMouseUp);

        const rect = scanBox.getBoundingClientRect();
        cleanUpCropUI();

        if (rect.width > 10 && rect.height > 10) {
            chrome.runtime.sendMessage({
                action: "capture-screen",
                rect: { x: rect.left, y: rect.top, w: rect.width, h: rect.height }
            });
        }
    }

    function onKeyDown(e) {
        if (e.key === "Escape") {
            cleanUpCropUI();
        }
    }

    function cleanUpCropUI() {
        if (overlay) overlay.remove();
        if (scanBox) scanBox.remove();
        window.removeEventListener('keydown', onKeyDown);
    }

    function processImageCrop(dataUrl, rect) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.w;
            canvas.height = rect.h;

            ctx.drawImage(
                img,
                rect.x * dpr, rect.y * dpr, rect.w * dpr, rect.h * dpr,
                0, 0, rect.w, rect.h
            );

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            handleScannerResult(code);
        };
        img.src = dataUrl;
    }

    function scanImageUrlDirectly(url) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                handleScannerResult(code);
            } catch (e) {
                alert("⚠️ รูปภาพนี้ถูกป้องกันความปลอดภัยไว้ กรุณาใช้ปุ่ม 'ลากครอบพื้นที่เพื่อสแกน' แทนครับ");
            }
        };
        img.onerror = function () {
            alert("❌ ไม่สามารถโหลดรูปภาพนี้มาสแกนได้ กรุณาใช้ปุ่ม 'ลากครอบพื้นที่เพื่อสแกน' แทนครับ");
        };
        img.src = url;
    }

    // ฟังก์ชันตัดสินใจปลายทางของข้อมูลคิวอาร์
    function handleScannerResult(code) {
        if (code && code.data) {
            if (code.data.startsWith('http://') || code.data.startsWith('https://')) {
                chrome.runtime.sendMessage({ action: "open-new-tab", url: code.data });
            } else {
                alert("🎉 เจอข้อความ: \n\n" + code.data);
            }
        } else {
            alert("❌ ไม่พบ QR Code ในพื้นที่ดังกล่าว กรุณาลองใหม่อีกครั้ง");
        }
    }
}