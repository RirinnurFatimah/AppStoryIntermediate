import { getActiveRoute } from '../routes/url-parser';
import { ACCESS_TOKEN_KEY } from '../config';

// Mengambil token dari localStorage
export function getAccessToken() {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    // Jika token null atau undefined (dalam bentuk string), kembalikan null
    if (accessToken === 'null' || accessToken === 'undefined') {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('getAccessToken: error:', error);
    return null;
  }
}

// Menyimpan token ke localStorage
export function putAccessToken(token) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('putAccessToken: error:', error);
    return false;
  }
}

// Menghapus token dari localStorage
export function removeAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('removeAccessToken: error:', error);
    return false;
  }
}

// Daftar halaman yang hanya boleh diakses jika belum login
const unauthenticatedRoutesOnly = ['/login', '/register'];

// Cek akses halaman hanya untuk user yang belum login
export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();

  // Jika user sudah login dan mencoba mengakses halaman login/register
  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = '#/';
    return null;
  }

  return page;
}

// Cek akses halaman hanya untuk user yang sudah login
export function checkAuthenticatedRoute(page) {
  const isLogin = !!getAccessToken();
  if (!isLogin) {
    location.hash = '#/login';
    return null;
  }

  return page;
}

// Fungsi logout: hapus token
export function getLogout() {
  removeAccessToken();
}
