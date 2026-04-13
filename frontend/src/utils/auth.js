export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function validateUsername(username) {
  const cleanedUsername = username.trim();
  return (
    cleanedUsername.length >= 3 &&
    cleanedUsername.length <= 20 &&
    /^[A-Za-z0-9 _-]+$/.test(cleanedUsername)
  );
}

export function validateStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
