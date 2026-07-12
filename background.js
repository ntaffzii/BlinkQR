// สร้างเมนูคลิกขวาตอนติดตั้ง Extension
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "scanQRContextMenu",
        title: "🔍 สแกน QR Code จากรูปนี้",
        contexts: ["image"]
    });
});

// ดักจับการคลิกขวาที่รูปภาพ
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "scanQRContextMenu" && tab) {
        // ฉีดไฟล์เข้าหน้าเว็บเพื่อจัดการรูปภาพจากการคลิกขวา
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["libs/jsQR.js", "content.js"]
        }, () => {
            // ส่ง URL ของรูปภาพไปให้ content.js ถอดรหัส
            chrome.tabs.sendMessage(tab.id, { action: "scan-image-url", url: info.srcUrl });
        });
    }
});

// ดักรับข้อความประสานงานระบบ
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // รับคำสั่งเริ่มโหมดลากครอบพื้นที่
    if (request.action === "start-crop") {
        chrome.scripting.insertCSS({
            target: { tabId: request.tabId },
            files: ["content.css"]
        });
        chrome.scripting.executeScript({
            target: { tabId: request.tabId },
            files: ["libs/jsQR.js", "content.js"]
        }, () => {
            chrome.tabs.sendMessage(request.tabId, { action: "init-crop-ui" });
        });
    }

    // รับพิกซลที่ลากครอบมา แล้วสั่งแคปหน้าจอภาพเต็ม
    if (request.action === "capture-screen") {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
            // ส่งภาพหน้าจอเต็มและพิกัดกลับไปให้ content.js ทำการตัด (Crop)
            chrome.tabs.sendMessage(sender.tab.id, {
                action: "process-cropped-image",
                dataUrl: dataUrl,
                rect: request.rect
            });
        });
    }

    // รับคำสั่งเปิดแท็บใหม่ (ใช้ในกรณีที่ Content Script เปิดตรงๆ แล้วติด Popup Blocker)
    if (request.action === "open-new-tab") {
        chrome.tabs.create({ url: request.url });
    }
});