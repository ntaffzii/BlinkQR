// 1. รองรับการกดปุ่มลากครอบหน้าจอ
document.getElementById('cropBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        // ส่งข้อความไปหา background.js ให้เริ่มโหมดลากครอบในแท็บนี้
        chrome.runtime.sendMessage({ action: "start-crop", tabId: tab.id });
        window.close(); // ปิดหน้าต่างป๊อปอัปเพื่อไม่ให้บังหน้าจอ
    }
});

// 2. รองรับการอัปโหลดไฟล์ภาพ
document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById('popupCanvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // ถอดรหัสด้วยไลบรารี jsQR
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            const resultContainer = document.getElementById('resultContainer');
            const resultText = document.getElementById('resultText');

            if (code) {
                // ตรวจสอบว่าเป็น URL หรือไม่ ถ้าใช่ให้เปิดแท็บใหม่ทันที
                if (code.data.startsWith('http://') || code.data.startsWith('https://')) {
                    chrome.tabs.create({ url: code.data });
                } else {
                    // ถ้าเป็นข้อความธรรมดา ให้แสดงผลใน UI
                    resultContainer.style.display = 'block';
                    resultText.innerText = code.data;
                }
            } else {
                resultContainer.style.display = 'block';
                resultText.innerText = "❌ ไม่พบ QR Code ในรูปภาพนี้";
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// 3. ปุ่มคัดลอกข้อความลง Clipboard
document.getElementById('copyBtn').addEventListener('click', () => {
    const text = document.getElementById('resultText').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('คัดลอกลงคลิปบอร์ดแล้ว!');
    });
});