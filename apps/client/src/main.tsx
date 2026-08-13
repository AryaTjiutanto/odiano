import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Auth/Signup.tsx'
import Signin from './pages/Auth/Signin.tsx'
import AuthLayout from './layouts/AuthLayout.tsx'
import OnBoarding from './pages/OnBoarding.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import RequireGuestGuard from './components/guard/RequireGuestGuard.tsx'
import RequireUnOnboarded from './components/guard/RequireUnOnboarded.tsx'
import Homepage from './pages/Social/Home.tsx'
import AppLayout from './layouts/AppLayout.tsx'
import SocialLayout from './layouts/SocialLayout.tsx'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createIDBPersister } from './libs/persister.ts'
import ShowPost from './pages/Post/ShowPost.tsx'
import NotFound from './components/error/NotFound.tsx'
import NavigationTracker from './components/common/NavigationTracker.tsx'
import PageLoader from './components/loader/PageLoader.tsx'
import Profile from './pages/Social/Profile.tsx'
import SocketProvider from './providers/SocketProvider.tsx'
import { queryClient } from './libs/react-query/queryClient.ts'
import RequireAuthGuard from './components/guard/RequireAuthGuard.tsx'
import EditProfile from './pages/Social/EditProfile.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import EmailVerification from './pages/Auth/EmailVerification.tsx'
import RequireUnVerify from './components/guard/RequireUnVerify.tsx'
import CreatePostLayout from './layouts/PostFormLayout.tsx'
import NotificationSectionLayout from './layouts/NotificationSectionLayout.tsx'
import ScrollToTop from './router/ScrollToTop.tsx'
import GoogleOneTap from './components/auth/GoogleOneTap.tsx'
import { ConfirmationModalProvider } from './providers/ConfirmationModalProvider.tsx'
import { ImageEditorProvider } from './providers/ImageEditorProvider.tsx'
import Explore from './pages/Social/Explore.tsx'
import NotFoundPage from './pages/error/NotFound.tsx'
import Search from './pages/Social/Search.tsx'
import ExploreLayout from './layouts/ExploreLayout.tsx'
import SearchLayout from './layouts/SearchLayout.tsx'

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
        },
      }}>
        <SocketProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <ConfirmationModalProvider>
              <ImageEditorProvider>
                <BrowserRouter>
                  <GoogleOneTap />
                  <ScrollToTop />
                  <NavigationTracker />
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route element={<PageLoader />}>
                        {/* social */}
                        <Route element={<CreatePostLayout />}>
                          <Route element={<NotificationSectionLayout />}>
                            <Route element={<SocialLayout />}>
                              <Route element={<SearchLayout />}>
                                <Route element={<ExploreLayout />}>
                                  <Route path='/explore' element={<Explore />} />
                                  <Route path='/search' element={<Search />} />
                                </Route>

                                <Route path='/' element={<Homepage />} />
                              </Route>

                              {/* post */}
                              <Route path='/:username/post/:postPublicId' element={<ShowPost />} />

                              {/* profile */}
                              <Route path='/profile/:username' element={<Profile />} />
                              <Route element={<RequireAuthGuard />}>
                                <Route path='/edit-profile' element={<EditProfile />} />
                              </Route>
                            </Route>
                          </Route>
                        </Route>

                        {/* auth process */}
                        <Route element={<RequireGuestGuard />}>
                          <Route element={<AuthLayout />}>
                            <Route path='/signin' element={<Signin />} />
                            <Route path='/signup' element={<Signup />} />
                          </Route>
                        </Route>

                        {/* email verification */}
                        <Route element={<RequireUnVerify />}>
                          <Route path='/email/verify' element={<EmailVerification />} />
                        </Route>

                        {/* onboarding */}
                        <Route element={<RequireUnOnboarded />}>
                          <Route path='/onboarding' element={<OnBoarding />} />
                        </Route>
                        {/* not fond */}
                        <Route path='*' element={<NotFoundPage />} />
                      </Route>
                    </Route>
                  </Routes>
                </BrowserRouter>
              </ImageEditorProvider>
            </ConfirmationModalProvider>
          </GoogleOAuthProvider>
        </SocketProvider>
      </PersistQueryClientProvider>
    </Provider>
  </StrictMode >,
)
