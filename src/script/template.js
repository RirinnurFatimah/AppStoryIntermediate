// Mengimpor fungsi utilitas untuk memformat tanggal
import { showFormattedDate } from "./utils";

// Menampilkan template loader biasa (indikator loading)
export function generateLoaderTemplate() {
    return `
        <div class="loader"></div>
    `;
}

// Menampilkan template loader yang posisinya absolute (untuk penempatan spesifik)
export function generateLoaderAbsoluteTemplate() {
    return `
        <div class="loader loader-absolute"></div>
    `;
}

// Menampilkan navigasi utama untuk semua pengguna
export function generateMainNavigationListTemplate() {
    return `
        <li><a id="story-list-button" class="story-list-button" href="#/">Stories</a></li>
        <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Cerita Tersimpan</a></li>
    `;
}

// Menampilkan navigasi untuk pengguna yang belum login
export function generateUnauthenticatedNavigationListTemplate() {
    return `
        <li id="push-notification-tools" class="push-notification-tools"></li>
        <li><a id="login-button" href="#/login">Login</a></li>
        <li><a id="register-button" href="#/register">Register</a></li>
    `;
}

// Menampilkan navigasi untuk pengguna yang sudah login
export function generateAuthenticatedNavigationListTemplate() {
    return `
        <li id="push-notification-tools" class="push-notification-tools"></li>
        <li><a id="add-story-button" class="btn add-story-button" href="#/add">Add Story</a></li>
        <li><a id="logout-button" class="logout-button" href="#/logout">Logout</a></li>
    `;
}

// Template ketika daftar cerita kosong
export function generateStoriesListEmptyTemplate() {
    return `
        <div id="stories-list-empty" class="stories-list-empty">
            <p>Tidak ada cerita yang tersedia.</p>
        </div>
    `;
}

// Template ketika terjadi error dalam pengambilan daftar cerita
export function generateStoriesListErrorTemplate(message) {
    return `
        <div id="stories-list-error" class="stories-list-error">
            <p>Terjadi kesalahan pengambilan daftar laporan</p>
        </div>
    `;
}

// Template ketika terjadi error dalam pengambilan detail cerita
export function generateStoryDetailErrorTemplate(message) {
    return `
      <div id="stories-detail-error" class="stories-detail__error">
        <h2>Terjadi kesalahan pengambilan detail catatan</h2>
        <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
      </div>
    `;
}

// Template untuk menampilkan satu item cerita pada daftar cerita
export function generateStoryItemTemplate({
    id,
    name,
    description,
    photoUrl,
    createdAt,
    lat,
    lon,
}) {
    return `
        <div tabindex="0" class="story-item" data-storyid="${id}">
            <img class="story-item__image" src="${photoUrl}" alt="Foto oleh ${name}">
            <div class="story-item__body">
                <div class="story-item__main">
                    <h2 id="story-title" class="story-item__title">${description.slice(0, 50)}...</h2>
                    <div class="story-item__more-info">
                        <div class="story-item__date">
                            <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
                        </div>
                        <div class="story-item__location">
                            <i class="fas fa-map-marker-alt"></i> (${lat}, ${lon})
                        </div>
                    </div>
                </div>
                <div id="story-description" class="story-item__description">
                    ${description}
                </div>
                <div class="story-item__author">
                    Dibagikan oleh: ${name}
                </div>
                <a class="btn story-item__read-more" href="#/stories/${id}">
                    Selengkapnya <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
}

// Template untuk detail satu cerita lengkap
export function generateStoryDetailTemplate({
    id,
    name,
    description,
    photoUrl,
    createdAt,
    lat,
    lon,
  }) {
    return `
        <div class="story-detail">
            <h2 class="story-detail__title">${name}</h2>
            <img src="${photoUrl}" alt="Foto oleh ${name}" class="story-detail__image">
            <p><strong>Tanggal:</strong> ${showFormattedDate(createdAt, 'id-ID')}</p>
            <p><strong>Lokasi:</strong> (${lat}, ${lon})</p>
            <p class="story-detail__description">${description}</p>
            <div id="save-actions-container" class="save-actions-container"></div>
            <div id="map" class="story-detail__map"></div>
            <div id="map-loading-container"></div>
        </div>
    `;
}

// Tombol untuk subscribe push notification
export function generateSubscribeButtonTemplate() {
    return `
      <button id="subscribe-button" class="btn subscribe-button">
        Subscribe <i class="fas fa-bell"></i>
      </button>
    `;
}
  
// Tombol untuk unsubscribe push notification
export function generateUnsubscribeButtonTemplate() {
    return `
      <button id="unsubscribe-button" class="btn unsubscribe-button">
        Unsubscribe <i class="fas fa-bell-slash"></i>
      </button>
    `;
}

// Template pesan error umum
export function generateErrorTemplate(message) {
    return `
        <div class="error-message">
            <p>Terjadi kesalahan: ${message}</p>
        </div>
    `;
}

// Tombol untuk menyimpan cerita
export function generateSaveStoryButtonTemplate() {
    return `
      <button id="story-detail-save" class="btn btn-transparent">
        Simpan catatan <i class="far fa-bookmark"></i>
      </button>
    `;
}
  
// Tombol untuk menghapus cerita dari penyimpanan
export function generateRemoveStoryButtonTemplate() {
    return `
      <button id="story-detail-remove" class="btn btn-transparent">
        Buang catatan <i class="fas fa-bookmark"></i>
      </button>
    `;
}
