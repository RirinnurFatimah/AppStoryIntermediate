import { convertBase64ToUint8Array } from './index'; // Fungsi konversi base64 ke Uint8Array
import { VAPID_PUBLIC_KEY } from '../config'; // VAPID key publik
import { subscribePushNotification, unsubscribePushNotification } from '../data/api'; // API backend

// Cek apakah Notification API didukung
export function isNotificationAvailable() {
  return 'Notification' in window;
}

// Cek apakah permission sudah granted
export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

// Minta izin notifikasi ke user
export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API tidak didukung.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }

  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

// Ambil push subscription dari service worker
export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return null;
  return await registration.pushManager.getSubscription();
}

// Cek apakah sudah subscribe push notification
export async function isCurrentPushSubscriptionAvailable() {
  const subscription = await getPushSubscription();
  return !!subscription;
}

// Opsi subscribe push notification dengan VAPID key
export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

// Subscribe push notification
export async function subscribe() {
  if (!(await requestNotificationPermission())) return;

  if (await isCurrentPushSubscriptionAvailable()) {
    alert('Sudah berlangganan push notification.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      alert('Service Worker belum terdaftar.');
      return;
    }

    const pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = pushSubscription.toJSON();

    const response = await subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      alert('Gagal mengaktifkan push notification.');
      await pushSubscription.unsubscribe();
      return;
    }

    alert('Push notification berhasil diaktifkan.');
  } catch (error) {
    console.error(error);
    alert('Gagal mengaktifkan push notification.');
  }
}

// Unsubscribe push notification
export async function unsubscribe() {
  try {
    const pushSubscription = await getPushSubscription();

    if (!pushSubscription) {
      alert('Belum berlangganan push notification.');
      return;
    }

    const { endpoint } = pushSubscription.toJSON();

    const response = await unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      alert('Gagal menonaktifkan push notification.');
      return;
    }

    const unsubscribed = await pushSubscription.unsubscribe();

    if (!unsubscribed) {
      alert('Gagal menonaktifkan push notification.');
      // Coba subscribe ulang ke backend agar konsisten
      await subscribePushNotification({ endpoint });
      return;
    }

    alert('Push notification berhasil dinonaktifkan.');
  } catch (error) {
    console.error(error);
    alert('Gagal menonaktifkan push notification.');
  }
}
