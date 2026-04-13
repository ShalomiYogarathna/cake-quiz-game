const TOKEN_KEY = "cake_quiz_token";
const USERNAME_KEY = "cake_quiz_username";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUsername() {
  return localStorage.getItem(USERNAME_KEY) || "Player";
}

export function setAuthSession(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
