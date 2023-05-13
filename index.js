import Webcam from 'node-webcam';
import { createCanvas, loadImage } from 'canvas';
import jsQR from 'jsqr';

const webcam = Webcam.create({
    width: 640,
    height: 480,
    dest: 'image.jpg',
});

function captureAndCheckQRCode() {
    webcam.capture('image', async (err, data) => {
        if (err) {
            console.error('Error capturing image:', err);
            return;
        }

        const canvas = createCanvas();
        const ctx = canvas.getContext('2d');

        const image = await loadImage('image.jpg');
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);
        const resizedCanvas = createCanvas(300, 300);
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.drawImage(canvas, 0, 0, 300, 300);

        const imageData = resizedCtx.getImageData(0, 0, resizedCanvas.width, resizedCanvas.height);
        const code = jsQR(imageData.data, resizedCanvas.width, resizedCanvas.height);

        if (code) {
            console.log('QR code found:', code.data);
        } else {
            console.log('No QR code found in the image');
            // Continue capturing and checking for QR codes
            captureAndCheckQRCode();
        }
    });
}

// Start capturing and checking for QR codes
captureAndCheckQRCode();
