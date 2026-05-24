// Hook barcode scanner into the app
// Replaces the mock scanner with real camera scanner

(function() {
  // Wait for app to fully load
  setTimeout(() => {
    // Store original openScanModal
    const originalScan = window.openScanModal;

    // Override with real scanner
    window.openScanModal = async function(onResult) {
      if (!window.BarcodeScanner) {
        console.error('BarcodeScanner not loaded');
        return;
      }

      // Create modal
      const modal = document.createElement('div');
      modal.id = 'scanner-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
      `;

      const videoContainer = document.createElement('div');
      videoContainer.style.cssText = `
        width: 100%;
        max-width: 400px;
        aspect-ratio: 4/5;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #0EA5E9;
        box-shadow: 0 0 30px rgba(14, 165, 233, 0.3);
      `;

      const video = document.createElement('div');
      video.id = 'barcode-video';
      video.style.cssText = `
        width: 100%;
        height: 100%;
      `;
      videoContainer.appendChild(video);

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        width: 300px;
        height: 300px;
        border: 2px solid #00FF00;
        box-shadow: inset 0 0 0 9999px rgba(0,0,0,0.3);
        border-radius: 8px;
      `;

      const text = document.createElement('p');
      text.textContent = '📷 สแกนบาร์โค้ด...';
      text.style.cssText = `
        color: white;
        text-align: center;
        margin-top: 20px;
        font-size: 16px;
        font-family: inherit;
      `;

      const manualBtn = document.createElement('button');
      manualBtn.textContent = 'กรอกรหัสเอง';
      manualBtn.style.cssText = `
        padding: 10px 20px;
        margin-top: 15px;
        background: #0EA5E9;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-family: inherit;
      `;

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'ยกเลิก';
      cancelBtn.style.cssText = `
        padding: 10px 20px;
        margin-left: 10px;
        background: #666;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-family: inherit;
      `;

      const btnContainer = document.createElement('div');
      btnContainer.style.marginTop = '15px';
      btnContainer.appendChild(manualBtn);
      btnContainer.appendChild(cancelBtn);

      modal.appendChild(videoContainer);
      modal.appendChild(overlay);
      modal.appendChild(text);
      modal.appendChild(btnContainer);
      document.body.appendChild(modal);

      // Start scanner
      const started = await window.BarcodeScanner.startScan(
        (barcode) => {
          // Success
          document.body.removeChild(modal);
          window.BarcodeScanner.stop();
          if (onResult) onResult(barcode);
        },
        (error) => {
          // Error - allow manual input
          console.error('Scanner error:', error);
          text.textContent = '❌ ' + error;
        }
      );

      if (!started) {
        text.textContent = '❌ ไม่สามารถเปิดกล้องได้';
      }

      // Manual input button
      manualBtn.onclick = async () => {
        window.BarcodeScanner.stop();
        document.body.removeChild(modal);

        const barcode = await window.BarcodeScanner.manualInput();
        if (barcode && onResult) {
          onResult(barcode);
        }
      };

      // Cancel button
      cancelBtn.onclick = () => {
        window.BarcodeScanner.stop();
        document.body.removeChild(modal);
      };
    };

    console.log('✅ Real barcode scanner hooked');
  }, 500);
})();
