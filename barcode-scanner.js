// Real barcode scanner using Camera API + QuaggaJS
// Scans physical barcodes from camera

(async function loadQuagga() {
  // Load QuaggaJS library for barcode detection
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/quagga@0.12.1/dist/quagga.min.js';
  document.head.appendChild(script);

  script.onload = function() {
    console.log('✅ QuaggaJS loaded - barcode scanner ready');
    window.BarcodeScanner = {
      isReady: true,
      isScanning: false,
      lastResult: null,

      async startScan(onDetected, onError) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('Camera API not supported');
          onError('Camera not supported on this device');
          return false;
        }

        try {
          window.BarcodeScanner.isScanning = true;

          Quagga.init({
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: document.querySelector('#barcode-video'),
              constraints: {
                width: { min: 640 },
                height: { min: 480 },
                facingMode: "environment" // Back camera
              }
            },
            decoder: {
              workers: 2,
              debug: false,
              multiple: false,
              readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader",
                "i2of5_reader"
              ]
            }
          }, function(err) {
            if (err) {
              console.error('Quagga init error:', err);
              onError(err.message || 'Failed to initialize camera');
              window.BarcodeScanner.isScanning = false;
              return;
            }

            Quagga.start();
            console.log('📷 Barcode scanner started');

            Quagga.onDetected((result) => {
              if (result.codeResult && result.codeResult.code) {
                const barcode = result.codeResult.code;
                console.log('✅ Detected barcode:', barcode);
                window.BarcodeScanner.lastResult = barcode;

                // Stop scanning and callback
                Quagga.stop();
                window.BarcodeScanner.isScanning = false;
                onDetected(barcode);
              }
            });
          });

          return true;
        } catch (e) {
          console.error('Scanner error:', e);
          onError(e.message);
          window.BarcodeScanner.isScanning = false;
          return false;
        }
      },

      stop() {
        if (window.BarcodeScanner.isScanning) {
          try {
            Quagga.stop();
            window.BarcodeScanner.isScanning = false;
            console.log('📷 Barcode scanner stopped');
          } catch (e) {
            console.error('Error stopping scanner:', e);
          }
        }
      },

      // Fallback: manual barcode input
      async manualInput() {
        return new Promise(resolve => {
          const barcode = prompt('กรอกรหัสบาร์โค้ด:');
          if (barcode) {
            resolve(barcode);
          } else {
            resolve(null);
          }
        });
      }
    };
  };
})();

// Fallback if QuaggaJS fails to load
window.addEventListener('load', () => {
  if (!window.BarcodeScanner) {
    window.BarcodeScanner = {
      isReady: false,
      isScanning: false,

      async startScan(onDetected, onError) {
        const barcode = await window.BarcodeScanner.manualInput();
        if (barcode) {
          onDetected(barcode);
          return true;
        }
        return false;
      },

      stop() {},

      async manualInput() {
        return new Promise(resolve => {
          const barcode = prompt('กรอกรหัสบาร์โค้ด:');
          resolve(barcode);
        });
      }
    };
  }
});
