import React, { useState, createContext } from 'react';

// tslint:disable-next-line: no-object-literal-type-assertion
export const AssetContext = createContext({} as any);

export const AssetProvider = (props: { children: any }) => {
  const [cacheUri, setCacheUri] = useState({});

  return <AssetContext.Provider value={{ cacheUri, setCacheUri }}>{props.children}</AssetContext.Provider>;
};
