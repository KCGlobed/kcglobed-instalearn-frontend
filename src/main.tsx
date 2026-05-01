import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/typography.css'
import './styles/global.css'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from "./store/store";
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './hooks/ScrollToTop.tsx'
import { ModalProvider } from "./components/Modals/ModalContext";

createRoot(document.getElementById('root')!).render(

  <Provider store={store}>
    <BrowserRouter>
      <ModalProvider>
        <App />
        <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { fontSize: "12px" } }} />
        <ScrollToTop />
      </ModalProvider>
    </BrowserRouter>
  </Provider>
  ,
)
