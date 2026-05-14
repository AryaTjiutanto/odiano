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
import ProfileIndex from './pages/Profile/Index.tsx'
import RequireAuthGuard from './components/guard/RequireAuthGuard.tsx'
import RequireGuestGuard from './components/guard/RequireGuestGuard.tsx'
import RequireUnOnboarded from './components/guard/RequireUnOnboarded.tsx'
import Homepage from './pages/Home.tsx'
import AppLayout from './layouts/AppLayout.tsx'
import SocialLayout from './layouts/SocialLayout.tsx'

import Loading from "./components/loader/PageLoader.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route element={<SocialLayout />}>
              <Route path='/' element={<Homepage />}></Route>
            </Route>

            {/* auth process */}
            <Route element={<RequireGuestGuard />}>
              <Route element={<AuthLayout />}>
                <Route path='/signin' element={<Signin />}></Route>
                <Route path='/signup' element={<Signup />}></Route>
              </Route>
            </Route>

            {/* onboarding */}
            <Route element={<RequireUnOnboarded />}>
              <Route path='/onboarding' element={<OnBoarding />}></Route>
            </Route>

            {/* auth */}
            <Route element={<RequireAuthGuard />}>
              {/* profile */}
              <Route path='/profile' element={<ProfileIndex />}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
