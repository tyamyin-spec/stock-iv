// Hook real barcode scanner into the app
// Replaces the mock scanner with live camera scanner

(function() {
  // Wait for app to fully load
  setTimeout(() => {
    // Override openScanModal with real scanner
    window.openScanModal = async function(onResult) {
      if (!window.BarcodeScanner) {
        console.error('BarcodeScanner not loaded');
        return;
      }

      // Create modal
      const modal = document.createElement('div');
      modal.id = 'scanner-modal-v2';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
      `;

      const header = document.createElement('div');
      header.style.cssText = `
        color: white;
        margin-bottom: 20px;
        text-align: center;
      `;
      header.innerHTML = '<h2 style="margin: 0; font-size: 18px;">📷 สแกนบาร์โค้ด</h2>';

      const videoContainer = document.createElement('div');
      videoContainer.style.cssText = `
        width: 100%;
        max-width: 400px;
        aspect-ratio: 1;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        border: 3px solid #0EA5E9;
        box-shadow: 0 0 30px rgba(14, 165, 233, 0.5);
        position: relative;
      `;

      const video = document.createElement('div');
      video.id = 'barcode-video';
      video.style.cssText = `
        width: 100%;
        height: 100%;
      `;
      videoContainer.appendChild(video);

      // Scanner overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 280px;
        height: 280px;
        border: 3px solid #00FF00;
        border-radius: 12px;
        box-shadow:
          inset 0 0 0 9999px rgba(0,0,0,0.4),
          0 0 20px rgba(0,255,0,0.5);
      `;
      videoContainer.appendChild(overlay);

      // Status text
      const status = document.createElement('p');
      status.id = 'scanner-status';
      status.textContent = '📍 วางบาร์โค้ดหน้ากล้อง...';
      status.style.cssText = `
        color: #00FF00;
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        font-family: inherit;
        min-height: 20px;
      `;

      // Buttons
      const manualBtn = document.createElement('button');
      manualBtn.textContent = 'กรอกรหัสเอง';
      manualBtn.style.cssText = `
        padding: 12px 24px;
        margin-top: 15px;
        background: #0EA5E9;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-family: inherit;
        font-weight: 500;
        transition: all 0.3s;
      `;
      manualBtn.onmouseover = () => manualBtn.style.background = '#0284c7';
      manualBtn.onmouseout = () => manualBtn.style.background = '#0EA5E9';

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'ยกเลิก';
      cancelBtn.style.cssText = `
        padding: 12px 24px;
        margin-left: 10px;
        background: #666;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-family: inherit;
        font-weight: 500;
        transition: all 0.3s;
      `;
      cancelBtn.onmouseover = () => cancelBtn.style.background = '#777';
      cancelBtn.onmouseout = () => cancelBtn.style.background = '#666';

      const btnContainer = document.createElement('div');
      btnContainer.style.marginTop = '15px';
      btnContainer.appendChild(manualBtn);
      btnContainer.appendChild(cancelBtn);

      modal.appendChild(header);
      modal.appendChild(videoContainer);
      modal.appendChild(status);
      modal.appendChild(btnContainer);
      document.body.appendChild(modal);

      // Start scanner
      console.log('Starting real barcode scan...');
      const started = await window.BarcodeScanner.startScan(
        video,
        (barcode) => {
          // Success
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
          window.BarcodeScanner.stop();
          console.log('✅ Scan success, barcode:', barcode);
          if (onResult) onResult(barcode);
        },
        (error) => {
          // Error
          console.error('Scanner error:', error);
          status.textContent = '❌ ' + error;
          status.style.color = '#FF6B6B';
        }
      );

      if (!started) {
        status.textContent = '❌ ไม่สามารถเปิดกล้องได้';
        status.style.color = '#FF6B6B';
      }

      // Manual input button
      manualBtn.onclick = async () => {
        window.BarcodeScanner.stop();
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }

        const barcode = await window.BarcodeScanner.manualInput();
        if (barcode && onResult) {
          console.log('✅ Manual input, barcode:', barcode);
          onResult(barcode);
        }
      };

      // Cancel button
      cancelBtn.onclick = () => {
        window.BarcodeScanner.stop();
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      };
    };

    console.log('✅ Real barcode scanner hooked - live camera enabled');
  }, 500);
})();
