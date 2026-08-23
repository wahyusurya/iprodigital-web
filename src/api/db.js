// Owned data layer replacing the platform-injected client.
// Same { auth, entities, integrations } interface; talks to our backend.
const BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "access_token";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

class ApiError extends Error {
  constructor(status, message, data) {
    super(message || `Request failed (${status})`);
    this.status = status;
    this.data = data;
  }
}

function normalize(data) {
  if (Array.isArray(data)) return data.map(normalize);
  if (data && typeof data === "object") {
    if (data._id) data.id = String(data._id);
    if (data.createdAt && !data.created_date) data.created_date = data.createdAt;
    if (data.updatedAt && !data.updated_date) data.updated_date = data.updatedAt;
  }
  return data;
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(res.status, data?.message || data?.error, data);
  return normalize(data);
}

// Collection path rule: naive lowercase + 's' — identical on the backend
// (SiteSettings -> sitesettingss, Gallery -> gallerys, News -> newss).
const collectionPath = (name) => `/${String(name).toLowerCase()}s`;

function assertId(id) {
  if (!id || id === "undefined") throw new ApiError(0, "Missing entity id");
}

function makeEntity(name) {
  const root = collectionPath(name);
  return {
    list: (sort = "-created_date", limit = 100) =>
      request(`${root}?sort=${encodeURIComponent(sort)}&limit=${limit}`),
    filter: (query = {}, sort = "-created_date", limit = 100) =>
      request(`${root}/filter?sort=${encodeURIComponent(sort)}&limit=${limit}`, { method: "POST", body: query }),
    get: (id) => { assertId(id); return request(`${root}/${id}`); },
    create: (data) => request(root, { method: "POST", body: data }),
    update: (id, data) => { assertId(id); return request(`${root}/${id}`, { method: "PATCH", body: data }); },
    delete: (id) => { assertId(id); return request(`${root}/${id}`, { method: "DELETE" }); },
  };
}

const entityProxy = new Proxy({}, { get: (_t, name) => makeEntity(name) });

export const db = {
  auth: {
    isAuthenticated: async () => !!getToken(),
    me: () => request("/auth/me"),
    loginViaEmailPassword: async (email, password) => {
      const r = await request("/auth/login", { method: "POST", body: { email, password } });
      if (r?.access_token) setToken(r.access_token);
      return r;
    },
    register: (data) => request("/auth/register", { method: "POST", body: data }),
    verifyOtp: async ({ email, otpCode }) => {
      const r = await request("/auth/verify-otp", { method: "POST", body: { email, otp: otpCode } });
      if (r?.access_token) setToken(r.access_token);
      return r;
    },
    resendOtp: (email) => request("/auth/resend-otp", { method: "POST", body: { email } }),
    resetPasswordRequest: (email) => request("/auth/reset-password/request", { method: "POST", body: { email } }),
    resetPassword: ({ resetToken, newPassword }) =>
      request("/auth/reset-password/confirm", { method: "POST", body: { token: resetToken, new_password: newPassword } }),
    loginWithProvider: (provider, redirect = "/") => {
      window.location.href = `${BASE}/auth/${provider}?redirect=${encodeURIComponent(redirect)}`;
    },
    redirectToLogin: (returnUrl) => {
      window.location.href = `/login${returnUrl ? `?from=${encodeURIComponent(returnUrl)}` : ""}`;
    },
    setToken,
    logout: (redirect) => {
      setToken(null);
      if (redirect) window.location.href = redirect === true ? "/" : redirect;
    },
  },
  entities: entityProxy,
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const fd = new FormData();
        fd.append("file", file);
        return request("/upload", { method: "POST", body: fd });
      },
    },
  },
};

export default db;
