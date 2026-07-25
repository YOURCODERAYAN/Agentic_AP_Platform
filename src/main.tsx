import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import {ThemeProvider} from './components/ThemeProvider.tsx'
import {Toaster} from 'sonner'



const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider  defaultTheme="light" storageKey="ap-platfrom-theme">
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
