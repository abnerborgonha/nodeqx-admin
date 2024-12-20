/* eslint-disable import/no-extraneous-dependencies */
import 'src/global.css';

import { SnackbarProvider } from 'notistack';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

// ----------------------------------------------------------------------


export default function App() {
  const queryClient = new QueryClient()
  useScrollToTop();


  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider maxSnack={3}>
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
