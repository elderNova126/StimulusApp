const TENANT_CONTEXT_KEY = 'tenant_context';
const Storage = {
  getTenantContext(): string | null {
    return localStorage.getItem(TENANT_CONTEXT_KEY);
  },
  setTenantContext(token: string) {
    if (token) {
      localStorage.setItem(TENANT_CONTEXT_KEY, token);
      return token;
    }
  },
  removeTenantContext() {
    localStorage.removeItem(TENANT_CONTEXT_KEY);
  },
};

export default Storage;
