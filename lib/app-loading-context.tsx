'use client';

import { createContext, useContext, useCallback, useState, useRef, useEffect, type ReactNode } from 'react';

interface AppLoadingContextType {
  registerLoading: (name: string) => () => void;
  pageReady: boolean;
}

const AppLoadingContext = createContext<AppLoadingContextType>({
  registerLoading: () => () => {},
  pageReady: false,
});

export function AppLoadingProvider({ children }: { children: ReactNode }) {
  const [pageReady, setPageReady] = useState(false);
  const loadingCount = useRef(0);

  const registerLoading = useCallback((name: string) => {
    loadingCount.current += 1;
    return () => {
      loadingCount.current -= 1;
      if (loadingCount.current <= 0) {
        setTimeout(() => setPageReady(true), 500);
      }
    };
  }, []);

  return (
    <AppLoadingContext.Provider value={{ registerLoading, pageReady }}>
      {children}
    </AppLoadingContext.Provider>
  );
}

export function useAppLoading() {
  return useContext(AppLoadingContext);
}
