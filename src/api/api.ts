import axios, { InternalAxiosRequestConfig } from 'axios';

/**
 * A lightweight Axios wrapper configured for the admin panel.  The base URL
 * should be provided via the Vite environment variable `VITE_API_BASE_URL` at
 * build time.  You can define this variable in a `.env` file at the root of
 * your project.  For example:
 *
 * ```
 * VITE_API_BASE_URL=https://example.com/api
 * ```
 *
 * The interceptor attaches authentication and multi‑tenant headers to every
 * outgoing request.  These values are persisted in localStorage after
 * successful login.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

// On every request include the authentication token and contextual IDs if
// present in localStorage.  The server expects these headers to determine
// authorization and tenant context.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  const companyId = localStorage.getItem('company_id');
  const branchId = localStorage.getItem('branch_id');
  const tenantId = localStorage.getItem('tenant_id');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (branchId) {
    config.headers = config.headers || {};
    config.headers.BranchId = branchId;
  }
  if (companyId) {
    config.headers = config.headers || {};
    config.headers.CompanyID = companyId;
  }
  if (tenantId) {
    config.headers = config.headers || {};
    config.headers.TenantId = tenantId;
  }
  return config;
});

export const setAuthInfo = (
  token: string,
  companyId: string,
  branchId: string,
  tenantId: string,
) => {
  localStorage.setItem('access_token', token);
  localStorage.setItem('company_id', companyId);
  localStorage.setItem('branch_id', branchId);
  localStorage.setItem('tenant_id', tenantId);
};

export const clearAuthInfo = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('company_id');
  localStorage.removeItem('branch_id');
  localStorage.removeItem('tenant_id');
};

export default api;