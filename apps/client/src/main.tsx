import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup.tsx'
import Signin from './pages/Signin.tsx'
import AuthLayout from './layouts/AuthLayout.tsx'
import OnBoarding from './pages/OnBoarding.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import MainLayout from './layouts/MainLayout.tsx'
import ProfileIndex from './pages/Profile/Index.tsx'
import RequireAuth from './guard/RequireAuth.tsx'
import RequireGuest from './guard/RequireGuest.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<App />}></Route>

            {/* auth process */}
            <Route element={<RequireGuest />}>
              <Route element={<AuthLayout />}>
                <Route path='/signin' element={<Signin />}></Route>
                <Route path='/signup' element={<Signup />}></Route>
              </Route>
            </Route>

            {/* auth */}
            <Route element={<RequireAuth />}>
              {/* onboarding */}
              <Route path='/onboarding' element={<OnBoarding />}></Route>

              {/* profile */}
              <Route path='/profile' element={<ProfileIndex />}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
