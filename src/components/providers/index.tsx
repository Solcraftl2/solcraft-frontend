import { Suspense } from 'react';

import DrawersContainer from '@/components/drawer-views/container';
import ModalsContainer from '@/components/modal-views/container';
import SettingsButton from '@/components/settings/settings-button';
import SettingsDrawer from '@/components/settings/settings-drawer';

import { QueryProvider } from './query-client-provider';
import { JotaiProvider } from './jotai-provider';
import WalletProvider from './wallet-provider';
import { ThemeProvider } from './theme-provider';

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <QueryProvider>
        <ThemeProvider>
          <JotaiProvider>
            <SettingsButton />
            <SettingsDrawer />
            {children}
            <Suspense fallback={null}>
              <ModalsContainer />
              <DrawersContainer />
            </Suspense>
          </JotaiProvider>
        </ThemeProvider>
      </QueryProvider>
    </WalletProvider>
  );
}
