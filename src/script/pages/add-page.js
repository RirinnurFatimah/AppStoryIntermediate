import '../../styles/style.css';
import AddPresenter from '../presenter/add-presenter';
import { convertBase64ToBlob } from '../utils';
import * as appstoryAPI from '../data/api';
import { generateLoaderAbsoluteTemplate } from '../template';
import Camera from '../utils/cam';
import Map from '../utils/maps';

export default class AddPage {
    #presenter;
    #form;
    #camera;
    #isCameraOpen = false;
    #takenPhotos = [];
    #mapInstance = null;
    #mapMarker = null;
    #latitude = null;
    #longitude = null;

    async render() {
        return `
            <section>
                <div class="new-stories__header">
                    <div class="container">
                        <h1 class="new-stories__title">Add Your New Stories Here!</h1>
                        <p class="new-stories__description">
                        </p>
                    </div>
                </div>
            </section>

            <section class="container">
                <form id="stories-form" class="new-form">
                <div class="form-control">
                    <label for="content-input">Isi Catatan</label>
                    <textarea id="content-input" name="content" placeholder="Tulis isi catatanmu di sini"></textarea>
                </div>

                <div class="form-control">
                    <label for="photos-input">Tambahkan Foto</label>
                    <div>
                        <button id="photos-input-button" class="btn btn-outline" type="button">Pilih Gambar</button>
                        <input id="photos-input" name="photos" type="file" accept="image/*" multiple hidden>
                        <button id="open-camera-button" class="btn btn-outline" type="button">Buka Kamera</button>
                    </div>
                    <div id="camera-container" class="camera-container">
                        <video id="camera-video" class="new-form__camera-video">
                            Video stream not available.
                        </video>
                        <div class="new-form__camera__tools">
                            <select id="camera-select"></select>
                        </div>
                        <canvas id="camera-canvas"></canvas>
                        <button id="take-photo-button" class="btn" type="button">Ambil Gambar</button>
                    </div>
                    <ul id="taken-photos-list"></ul>
                </div>

                <div class="form-control">
                    <label>Lokasi Catatan</label>
                    <div id="map" style="height: 300px;"></div>
                    <p id="selected-location">Tidak ada lokasi dipilih</p>
                </div>

                <div class="form-buttons">
                    <button class="btn" type="submit">Simpan Catatan</button>
                    <a href="#/" class="btn btn-outline">Batal</a>
                </div>
                </form>
            </section>
        `;
    }

    showError(message) {
    const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;

    document.getElementById('stories-form').appendChild(errorElement);
    }

    async afterRender() {
        this.#presenter = new AddPresenter({ view: this, model: appstoryAPI });
        this.#takenPhotos = [];
        this.#setupForm();
        await this.#setupMap();
    }

    #setupForm() {
        this.#form = document.getElementById('stories-form');
        this.#form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const lat = parseFloat(this.#latitude);
            const lon = parseFloat(this.#longitude);

            if (isNaN(lat) || isNaN(lon)) {
                this.showError('Anda belum memilih lokasi.');
                return;
            }

            if (!this.#takenPhotos[0]?.blob) {
                this.showError('Tambahkan foto sebelum menyimpan catatan.');
                return;
            }            

            const data = {
                description: this.#form.content.value,
                photo: this.#takenPhotos[0]?.blob,
                latitude: lat,
                longitude: lon,
            };

            await this.#presenter.submitNewStory(data);
            this.#camera?.stop();
        });

        document.getElementById('photos-input').addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            for (const file of files) {
                await this.#addPhoto(file);
            }
            this.#renderPhotos();
        });

        const fileInput = this.#form.querySelector('#photos-input');
        document.getElementById('photos-input-button').addEventListener('click', () => {
            fileInput.click();
        });


        const cameraButton = document.getElementById('open-camera-button');
        const cameraContainer = document.getElementById('camera-container');
        cameraButton.addEventListener('click', async () => {
            cameraContainer.classList.toggle('open');
            this.#isCameraOpen = cameraContainer.classList.contains('open');

            if (this.#isCameraOpen) {
                this.#setupCamera();
                await this.#camera.launch();
                cameraButton.textContent = 'Tutup Kamera';
            } else {
                this.#camera.stop();
                cameraButton.textContent = 'Buka Kamera';
            }
        });

        document.getElementById('take-photo-button').addEventListener('click', async () => {
            const image = await this.#camera.takePicture();
            await this.#addPhoto(image);
            this.#renderPhotos();
        });
    }

    async #setupMap() {
        this.#mapInstance = await Map.build('#map', { locate: true, zoom: 13 });

        const center = this.#mapInstance.getCenter();
        this.#latitude = center.latitude;
        this.#longitude = center.longitude;

        this.#mapMarker = this.#mapInstance.addMarker([center.latitude, center.longitude], {}, {
            content: `Lokasi saat ini: ${center.latitude.toFixed(5)}, ${center.longitude.toFixed(5)}`
        });

        document.getElementById('selected-location').textContent =
            `Lokasi saat ini: ${center.latitude.toFixed(5)}, ${center.longitude.toFixed(5)}`;

        this.#mapInstance.addMapEventListener('click', async (e) => {
            const { lat, lng } = e.latlng;
            this.#latitude = lat;
            this.#longitude = lng;

            if (this.#mapMarker) {
                this.#mapMarker.setLatLng([lat, lng]);
                this.#mapMarker.bindPopup(`Lokasi dipilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            }

            document.getElementById('selected-location').textContent = 
                `Lokasi dipilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        });
    }

    async #addPhoto(image) {
        let blob = image;
        if (typeof image === 'string') {
            blob = await convertBase64ToBlob(image, 'image/png');
        }

        this.#takenPhotos.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            blob,
        });
    } 

    #renderPhotos() {
        const container = document.getElementById('taken-photos-list');
        container.innerHTML = this.#takenPhotos.map((photo, i) => {
            const url = URL.createObjectURL(photo.blob);
            return `
                <li>
                    <img src="${url}" alt="Foto ${i + 1}" style="max-width: 100px;">
                </li>
            `;
        }).join('');
    }

    #setupCamera() {
        if (!this.#camera) {
            this.#camera = new Camera({
                video: document.getElementById('camera-video'),
                canvas: document.getElementById('camera-canvas'),
                cameraSelect: document.getElementById('camera-select'),
            });
        }
    }

    storeSuccessfully(message) {
        alert(message);
        location.hash = '/';
    }

    storeFailed(message) {
        alert(`Gagal menyimpan catatan: ${message}`);
    }

    showLoading() {
        document.getElementById('selected-location').insertAdjacentHTML(
            'afterend',
            '<div id="form-loading" class="loader">Waiting...</div>'
        );
    }

    hideLoading() {
        const loader = document.getElementById('form-loading');
        if (loader) loader.remove();
    }

    clearForm() {
        this.#form.reset();
        this.#takenPhotos = [];
        document.getElementById('taken-photos-list').innerHTML = '';
        document.getElementById('selected-location').textContent = 'Tidak ada lokasi dipilih';
        this.#latitude = null;
        this.#longitude = null;
    
        if (this.#mapMarker) {
            this.#mapInstance.getMap().removeLayer(this.#mapMarker);
            this.#mapMarker = null;
        }
    }

    destroy() {
        this.#camera?.stop();
    }
        
}