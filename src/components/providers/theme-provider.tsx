'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function ThemeProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <NextThemeProvider
      disableTransitionOnChange
      attribute="class"
      enableSystem={false}
      defaultTheme="light"
    >
      {children}
    </NextThemeProvider>
  );
}
