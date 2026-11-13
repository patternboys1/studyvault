import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()

  const reloadKey = 'studyvault:asset-refresh-at'
  const now = Date.now()
  let shouldReload = false

  try {
    const lastRefresh = Number(sessionStorage.getItem(reloadKey) || 0)
    if (now - lastRefresh > 60_000) {
      sessionStorage.setItem(reloadKey, String(now))
      shouldReload = true
    }
  } catch {
    shouldReload = false
  }

  if (shouldReload) {
    window.location.reload()
    return
  }

  const root = document.getElementById('root')
  if (!root) return

  const notice = document.createElement('main')
  notice.className = 'mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center'
  const heading = document.createElement('h1')
  heading.className = 'text-2xl font-black text-slate-900'
  heading.textContent = 'A new version of Study Vault is ready'
  const description = document.createElement('p')
  description.className = 'mt-3 text-sm leading-6 text-slate-600'
  description.textContent = 'Refresh the page to continue with the latest version.'
  const refreshButton = document.createElement('button')
  refreshButton.className = 'mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800'
  refreshButton.textContent = 'Refresh page'
  refreshButton.addEventListener('click', () => window.location.reload())
  notice.append(heading, description, refreshButton)
  root.replaceChildren(notice)
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
