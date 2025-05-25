// Delay waktu dalam milidetik
export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Format tanggal menjadi string lokal
export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

// Konversi Blob/File ke Base64 string
export function convertBlobToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// Konversi Base64 string ke Blob
export function convertBase64ToBlob(base64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

// Konversi Base64 ke Uint8Array (biasanya untuk push notification key)
export function convertBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Setup untuk tombol "Skip to Content" aksesibilitas
export function setupSkipContent(element, mainContent) {
  element.addEventListener('click', () => mainContent.focus());
}

// Transisi tampilan dengan fallback jika tidak didukung
export function transitionHelper({ skipTransition = false, updateDOM }) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => undefined);

    return {
      ready: Promise.reject(Error('View transitions unsupported')),
      updateCallbackDone,
      finished: updateCallbackDone,
    };
  }

  return document.startViewTransition(updateDOM);
}

// Mengecek ketersediaan Service Worker
export function isServiceWorkerAvailable() {
  return 'serviceWorker' in navigator;
}

// Registrasi Service Worker
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.bundle.js');
      console.log('✅ Service Worker terdaftar:', registration);
    } catch (error) {
      console.error('❌ Gagal mendaftar Service Worker:', error);
    }
  }  else {
    console.warn('Service Worker tidak didukung browser ini.');
  }
}

