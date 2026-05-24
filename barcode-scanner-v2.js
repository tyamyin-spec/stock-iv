// Real barcode scanner using Camera API + QuaggaJS
// Scans physical barcodes from camera with permission handling

window.BarcodeScanner = {
  isReady: false,
  isScanning: false,
  lastResult: null,
  quaggaLoaded: false,

  // Initialize QuaggaJS
  async init() {
    return new Promise((resolve) => {
      if (window.BarcodeScanner.quaggaLoaded) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/quagga@0.12.1/dist/quagga.min.js';
      script.onload = function() {
        console.log('✅ QuaggaJS loaded');
        window.BarcodeScanner.quaggaLoaded = true;
        window.BarcodeScanner.isReady = true;
        resolve(true);
      };
      script.onerror = function() {
        console.error('Failed to load QuaggaJS');
        resolve(false);
      };
      document.head.appendChild(script);
    });
  },

  async startScan(videoElement, onDetected, onError) {
    if (!window.BarcodeScanner.quaggaLoaded) {
      const loaded = await window.BarcodeScanner.init();
      if (!loaded) {
        onError('Failed to load barcode scanner');
        return false;
      }
    }

    try {
      // Request camera permission
      console.log('📷 Requesting camera permission...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 640 },
          height: { min: 480 },
          facingMode: 'environment' // Back camera
        },
        audio: false
      });

      console.log('✅ Camera permission granted');
      window.BarcodeScanner.isScanning = true;

      // Initialize Quagga
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            facingMode: 'environment'
          },
          target: videoElement
        },
        locator: {
          halfSample: true
        },
        numOfWorkers: 4,
        frequency: 10,
        decoder: {
          workers: {
            numOfWorkers: 4,
            workerPath: 'https://cdn.jsdelivr.net/npm/quagga@0.12.1/dist/quagga.worker.min.js'
          },
          multiple: false,
          readers: [
            'code_128_reader',
            'ean_reader',
            'ean_8_reader',
            'code_39_reader',
            'code_39_vin_reader',
            'codabar_reader',
            'upc_reader',
            'upc_e_reader',
            'i2of5_reader'
          ]
        }
      }, function(err) {
        if (err) {
          console.error('Quagga init error:', err);
          onError(err.message || 'Failed to initialize scanner');
          window.BarcodeScanner.isScanning = false;
          if (stream) {
            stream.getTracks().forEach(t => t.stop());
          }
          return;
        }

        console.log('📷 Barcode scanner started - aim at barcode...');
        Quagga.start();

        // Detect barcode
        Quagga.onDetected((result) => {
          if (result && result.codeResult && result.codeResult.code) {
            const barcode = result.codeResult.code;
            console.log('✅ Barcode detected:', barcode);
            window.BarcodeScanner.lastResult = barcode;

            // Stop and cleanup
            Quagga.stop();
            if (stream) {
              stream.getTracks().forEach(t => t.stop());
            }
            window.BarcodeScanner.isScanning = false;

            // Callback with detected barcode
            setTimeout(() => onDetected(barcode), 100);
          }
        });
      });

      return true;

    } catch (e) {
      console.error('Camera/Scanner error:', e);
      let errorMsg = 'เกิดข้อผิดพลาด';

      if (e.name === 'NotAllowedError') {
        errorMsg = 'ปฏิเสธการใช้กล้อง - อนุญาต permission สำหรับกล้องเพื่อสแกนบาร์โค้ด';
      } else if (e.name === 'NotFoundError') {
        errorMsg = 'ไม่พบกล้องในอุปกรณ์นี้';
      } else if (e.name === 'NotReadableError') {
        errorMsg = 'กล้องถูกใช้งานโดยโปรแกรมอื่น';
      } else {
        errorMsg = e.message || 'Failed to access camera';
      }

      onError(errorMsg);
      window.BarcodeScanner.isScanning = false;
      return false;
    }
  },

  stop() {
    if (window.BarcodeScanner.isScanning) {
      try {
        if (window.Quagga) {
          Quagga.stop();
        }
        window.BarcodeScanner.isScanning = false;
        console.log('📷 Scanner stopped');
      } catch (e) {
        console.error('Error stopping scanner:', e);
      }
    }
  },

  // Manual barcode input fallback
  async manualInput() {
    return new Promise(resolve => {
      const barcode = prompt('กรอกรหัสบาร์โค้ด:');
      resolve(barcode || null);
    });
  }
};

console.log('✅ Barcode Scanner v2 loaded - ready to scan');
