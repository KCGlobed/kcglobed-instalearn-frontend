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
import QuickContactButton from './components/UI/QuickContactButton.tsx'
import { ModalProvider } from "./components/Modals/ModalContext";
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

createRoot(document.getElementById('root')!).render(

  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <BrowserRouter>
        <ModalProvider>
          <App />
          <Toaster position="top-right" reverseOrder={false} toastOptions={{ style: { fontSize: "12px" } }} />
          <ScrollToTop />
          <QuickContactButton />
        </ModalProvider>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
  ,
)
