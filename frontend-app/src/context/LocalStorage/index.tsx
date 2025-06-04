import React, { useState, createContext } from 'react';

// tslint:disable-next-line: no-object-literal-type-assertion
export const LocalStorageContext = createContext({} as any);
const TENANT_CONTEXT_KEY = 'tenant_context';

export const LocalStorageProvider = (props: { children: any }) => {
  const [tenantToken, setTenantToken] = useState(localStorage.getItem(TENANT_CONTEXT_KEY));

  return (
    <LocalStorageContext.Provider
      value={{
        tenantToken,
        setTenantToken: (token: string) => {
          if (token) {
            localStorage.setItem(TENANT_CONTEXT_KEY, token);
            setTenantToken(token);
          }
        },
      }}
    >
      {props.children}
    </LocalStorageContext.Provider>
  );
};

export const removeTenantContext = () => {
  localStorage.removeItem(TENANT_CONTEXT_KEY);
};
