export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const unauthorizedListeners = new Set();

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class AuthError extends ApiError {
  constructor(message = "Session expired. Please log in again.", data) {
    super(message, 401, data);
    this.name = "AuthError";
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
}

function notifyUnauthorized(error) {
  unauthorizedListeners.forEach((listener) => {
    listener(error);
  });
}

export function subscribeToUnauthorized(listener) {
  unauthorizedListeners.add(listener);

  return () => {
    unauthorizedListeners.delete(listener);
  };
}

export async function apiRequest(
  path,
  {
    method = "GET",
    body,
    headers = {},
    credentials = "include",
    authFailureBehavior = "notify",
  } = {}
) {
  const requestHeaders = { ...headers };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    credentials,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      const authError = new AuthError(data.detail || data.message, data);

      if (authFailureBehavior === "notify") {
        notifyUnauthorized(authError);
      }

      throw authError;
    }

    throw new ApiError(
      data.detail || data.message || "Request failed",
      response.status,
      data
    );
  }

  return data;
}

export async function logoutUser() {
  await apiRequest("/logout", {
    method: "POST",
    authFailureBehavior: "ignore",
  });
}
