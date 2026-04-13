export const PASSWORD_RULE_TEXT =
  "Use 8+ characters with uppercase, lowercase, number, and special character.";

export const USERNAME_RULE_TEXT =
  "Username must be 3-20 characters and use only letters, numbers, spaces, or underscores.";

export const EMAIL_RULE_TEXT = "Enter a valid email address.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_ ]{3,20}$/;

export function sanitizeUsername(value) {
  return value.trim().replace(/\s+/g, " ");
}

export function sanitizeEmail(value) {
  return value.trim().toLowerCase();
}

export function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function validateUsername(username) {
  if (!USERNAME_PATTERN.test(username)) {
    return USERNAME_RULE_TEXT;
  }

  return "";
}

export function validateEmail(email) {
  if (!EMAIL_PATTERN.test(email)) {
    return EMAIL_RULE_TEXT;
  }

  return "";
}

export function validatePassword(password) {
  if (!isStrongPassword(password)) {
    return PASSWORD_RULE_TEXT;
  }

  return "";
}
