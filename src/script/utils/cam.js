export default class Camera {
  #currentStream;
  #streaming = false;

  #videoElement;
  #selectCameraElement;
  #canvasElement;

  #takePictureButton;

  // Menyimpan stream baru ke dalam array global
  static addNewStream(stream) {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [stream];
      return;
    }

    window.currentStreams = [...window.currentStreams, stream];
  }

  // Menghentikan semua stream video yang aktif
  static stopAllStreams() {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [];
      return;
    }

    window.currentStreams.forEach((stream) => {
      if (stream.active) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
  }

  // Konstruktor menerima elemen-elemen HTML
  constructor({ video, cameraSelect, canvas, options = {} }) {
    this.#videoElement = video;
    this.#selectCameraElement = cameraSelect;
    this.#canvasElement = canvas;

    this.#initialListener();
  }

  // Listener awal saat video bisa diputar & saat dropdown kamera berubah
  #initialListener() {
    this.#videoElement.oncanplay = () => {
      if (this.#streaming) return;
      const width = this.#videoElement.videoWidth;
      const height = this.#videoElement.videoHeight;

      console.log('Video can play. Setting canvas size.');
      this.#canvasElement.width = width;
      this.#canvasElement.height = height;
      this.#streaming = true;
    };

    this.#selectCameraElement.onchange = async () => {
      console.log('Camera changed. Restarting stream.');
      await this.stop();
      await this.launch();
    };
  }

  // Menampilkan daftar perangkat kamera
  async #populateDeviceList(stream) {
    try {
      if (!(stream instanceof MediaStream)) {
        return Promise.reject(Error('MediaStream not found!'));
      }

      const { deviceId } = stream.getVideoTracks()[0].getSettings();

      const enumeratedDevices = await navigator.mediaDevices.enumerateDevices();
      const list = enumeratedDevices.filter((device) => {
        return device.kind === 'videoinput';
      });

      const html = list.reduce((accumulator, device, currentIndex) => {
        return accumulator.concat(`
          <option
            value="${device.deviceId}"
            ${deviceId === device.deviceId ? 'selected' : ''}
          >
            ${device.label || `Camera ${currentIndex + 1}`}
          </option>
        `);
      }, '');

      this.#selectCameraElement.innerHTML = html;
    } catch (error) {
      console.error('#populateDeviceList: error:', error);
    }
  }

  // Mengambil stream dari kamera sesuai pilihan
  async #getStream() {
    try {
      const deviceId =
        !this.#streaming && !this.#selectCameraElement.value
          ? undefined
          : { exact: this.#selectCameraElement.value };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          aspectRatio: 4 / 3,
          deviceId,
        },
      });
      console.log('Stream obtained successfully.');
      await this.#populateDeviceList(stream);

      return stream;
    } catch (error) {
      console.error('#getStream: error:', error);
      return null;
    }
  }

  // Meluncurkan kamera dan menampilkan hasil di video element
  async launch() {
    console.log('Launching camera...');
    this.#currentStream = await this.#getStream();
    Camera.addNewStream(this.#currentStream);

    this.#videoElement.srcObject = this.#currentStream;
    this.#videoElement.play();

    this.#clearCanvas();
  }

  // Menghentikan stream video
  stop() {
    console.log('Stopping camera...');
    if (this.#videoElement) {
      this.#videoElement.srcObject = null;
      this.#streaming = false;
    }

    if (this.#currentStream instanceof MediaStream) {
      this.#currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    this.#clearCanvas();
  }

  // Mengosongkan canvas
  #clearCanvas() {
    const context = this.#canvasElement.getContext('2d');
    context.fillStyle = '#AAAAAA';
    context.fillRect(0, 0, this.#canvasElement.width, this.#canvasElement.height);
  }

  // Mengambil gambar dari video dan menyimpannya sebagai blob
  async takePicture() {
    console.log('Taking picture...');
    const width = this.#videoElement.videoWidth;
    const height = this.#videoElement.videoHeight;
    this.#canvasElement.width = width;
    this.#canvasElement.height = height;

    const context = this.#canvasElement.getContext('2d');
    context.drawImage(this.#videoElement, 0, 0, width, height);

    return await new Promise((resolve) => {
      this.#canvasElement.toBlob((blob) => {
        console.log('Picture taken and converted to blob.');
        resolve(blob);
      });
    });
  }

  // Menambahkan event listener pada tombol yang akan mengambil gambar
  addCheeseButtonListener(selector, callback) {
    this.#takePictureButton = document.querySelector(selector);
    this.#takePictureButton.onclick = callback;
  }
}
