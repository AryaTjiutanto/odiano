import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createIDBPersister } from './libs/persister.ts'
import SocketProvider from './providers/SocketProvider.tsx'
import { queryClient } from './libs/react-query/queryClient.ts'
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleOneTap from './components/auth/GoogleOneTap.tsx'
import { ConfirmationModalProvider } from './providers/ConfirmationModalProvider.tsx'
import { ImageEditorProvider } from './providers/ImageEditorProvider.tsx'
import AppRoutes from './routes/AppRoutes.tsx'
import AppLayout from './layouts/AppLayout.tsx'
import { StackProvider } from './providers/StackProvider.tsx'
const IDBPersister = createIDBPersister();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{
        persister: IDBPersister,
        maxAge: 5 * 24 * 60 * 60 * 1000,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const key = query.queryKey[0];
            return typeof key == "string" && ["post", "user", "notification"].includes(key);
          }
        }
      }}>
        <SocketProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <ConfirmationModalProvider>
              <ImageEditorProvider>
                <BrowserRouter>
                  <GoogleOneTap />
                  <StackProvider>
                    <AppLayout>
                      <AppRoutes />
                    </AppLayout>
                  </StackProvider>
                </BrowserRouter>
              </ImageEditorProvider>
            </ConfirmationModalProvider>
          </GoogleOAuthProvider>
        </SocketProvider>
      </PersistQueryClientProvider>
    </Provider>
  </StrictMode >,
)
