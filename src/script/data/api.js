import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  MY_USER_INFO: `${BASE_URL}/users/me`,
  STORIES_LIST: `${BASE_URL}/stories`,
  STORY_DETAIL: id => `${BASE_URL}/stories/${id}`,
  STORE_NEW_STORY: `${BASE_URL}/stories`,
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
};

export async function registered({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await response.json();
  return { ...result, ok: response.ok };
}

export async function getLogin({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  return { ...result, ok: response.ok };
}

export async function getMyUserInfo() {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.MY_USER_INFO, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  return { ...result, ok: response.ok };
}

export async function getAllStories() {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.STORIES_LIST, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  return { ...result, ok: response.ok };
}

export async function getStoryById(id) {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  return { ...result, ok: response.ok };
}

export async function storeNewStory({ description, photo, latitude, longitude }) {
  const token = getAccessToken();
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    throw new Error('Latitude and Longitude must be valid numbers');
  }

  const formData = new FormData();
  formData.set('description', description);
  formData.set('lat', lat);
  formData.set('lon', lon);
  formData.set('photo', photo);

  const response = await fetch(ENDPOINTS.STORE_NEW_STORY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  return { ...result, ok: response.ok };
}

export async function subscribePushNotification({ endpoint, keys }) {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint, keys }),
  });
  const result = await response.json();
  return { ...result, ok: response.ok };
}

export async function unsubscribePushNotification({ endpoint }) {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint }),
  });
  const result = await response.json();
  return { ...result, ok: response.ok };
}
