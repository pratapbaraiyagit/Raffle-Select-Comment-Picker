import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import Header from '../Components/Common/Header';
import Youtube from '../Components/Pages/YouTube';
import CommentPicker from '../Components/Pages/CommentPicker';
import Settings from '../Components/Pages/Settings';
import Winner from '../Components/Pages/Winner';
import GenerateCertificate from '../Components/Pages/GenerateCertificate';
import Certificate from '../Components/Pages/Certificate';
import '../Assets/scss/Style.scss';
import ProtectedRoutes from './ProtectedRoutes';
import Loader from '../Components/Common/Loader';
import Video from '../Components/Pages/Video';
import Shop from '../Components/Pages/Shop';
import Dashboard from '../Components/Pages/Dashboard';
import MyAccount from '../Components/Pages/MyAccount/Index';
import PaymentStatus from '../Components/Pages/PaymentStatus';
// import Login from 'Components/Pages/Login';
import ForgotPassword from '../Components/Pages/ForgotPassword';
import PasswordReset from '../Components/Pages/PasswordReset';
import Home from '../Components/Pages/Home';
import { useSelector } from 'react-redux';
import Instagram from '../Components/Pages/Instagram/Instagram';
import PostList from '../Components/Pages/Instagram/PostList';

export default function Index({ isLoginModalOpen, setIsLoginModalOpen }) {
  const { appCssTheme } = useSelector(({ common }) => common);

  return (
    <>
      <div
        className={
          appCssTheme === 'Youtube'
            ? 'main_Wrapper youtube'
            : appCssTheme === 'Instagram'
            ? 'main_Wrapper instagram'
            : appCssTheme === 'Facebook'
            ? 'main_Wrapper facebook'
            : appCssTheme === 'Tiktok'
            ? 'main_Wrapper tiktok'
            : appCssTheme === 'Twitter'
            ? 'main_Wrapper twitter'
            : 'main_Wrapper'
        }
      >
        <Header
          setIsLoginModalOpen={setIsLoginModalOpen}
          isLoginModalOpen={isLoginModalOpen}
        />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/youtube" element={<Youtube />} />
            <Route
              path="/comment-picker"
              element={
                <CommentPicker
                  setIsLoginModalOpen={setIsLoginModalOpen}
                  isLoginModalOpen={isLoginModalOpen}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoutes>
                  <Settings />
                </ProtectedRoutes>
              }
            />
            <Route path="/w/:c_id" element={<Certificate />} />
            <Route
              path="/winner"
              element={
                <ProtectedRoutes>
                  <Winner />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/generate-certificate"
              element={
                <ProtectedRoutes>
                  <GenerateCertificate />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/generate-certificate/:c_id"
              element={
                <ProtectedRoutes>
                  <GenerateCertificate />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/auth/google/callback"
              element={
                <ProtectedRoutes>
                  <Loader />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/auth/facebook/callback"
              element={
                <ProtectedRoutes>
                  <Loader />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/shop"
              element={
                <Shop
                  setIsLoginModalOpen={setIsLoginModalOpen}
                  isLoginModalOpen={isLoginModalOpen}
                />
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/instagram" element={<Instagram />} />
            <Route path="/post-list" element={<PostList />} />
            <Route
              path="/my-account"
              element={
                <ProtectedRoutes>
                  <MyAccount />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoutes>
                  <PaymentStatus />
                </ProtectedRoutes>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password"
              element={
                <PasswordReset
                  setIsLoginModalOpen={setIsLoginModalOpen}
                  isLoginModalOpen={isLoginModalOpen}
                />
              }
            />
            <Route path="/*" element={<Home />} />
            <Route path="/video/:cid/:winnerid" element={<Video />} />
            {/* <Route path="/login" element={<Login />} /> */}
          </Routes>
        </Suspense>
      </div>
    </>
  );
}
