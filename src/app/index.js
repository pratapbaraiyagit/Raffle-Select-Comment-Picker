import { Helmet } from 'react-helmet-async';
import Routes from '../routes/index';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { REACT_APP_APIURL } from '../Helper/Environment';
import { clearToken, setupToken } from '../Helper/AuthTokenHelper';
import store from '../Store/Index';
import { getNewToken, getProfile } from '../Services/AuthService';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserData, sendUserActivity } from '../Services/CommonService';
import { useSelector } from 'react-redux';
import { setAppCssTheme } from '../Store/Reducers/CommonSlice';

axios.defaults.baseURL = REACT_APP_APIURL;
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error?.response?.status === 401) {
      window.location.href = '/';
      clearToken();
      toast.error('Access Token is not valid or has expired');
    }
    return Promise.reject(error);
  },
);

const Token = setupToken();
if (!Token) store.dispatch(getNewToken());

export function App() {
  const dispatch = useDispatch();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { userActivityId } = useSelector(({ common }) => common);

  const loadData = useCallback(async () => {
    let UserPreferences = localStorage.getItem('UserPreferences');
    if (UserPreferences) UserPreferences = JSON.parse(atob(UserPreferences));
    if (UserPreferences?.token) {
      await dispatch(getProfile());
    }
  }, []);

  const loadRequiredData = useCallback(async () => {
    let res;
    res = await dispatch(getUserData(`https://geolocation-db.com/json/`));
    if (!res) res = await dispatch(getUserData(`https://jsonip.com/`));
  }, []);

  useEffect(() => {
    loadData();
    loadRequiredData();
    const appValue = JSON.parse(localStorage.getItem('app'));
    if (appValue) {
      dispatch(setAppCssTheme(appValue));
    } else {
      localStorage.setItem('app', JSON.stringify('Youtube'));
      dispatch(setAppCssTheme('Youtube'));
    }
  }, []);

  useEffect(() => {
    const fetchData = () => {
      if (userActivityId) dispatch(sendUserActivity(userActivityId));
    };
    const myInterval = setInterval(fetchData, 180000); // 3 minutes

    // Cleanup function: clear the interval when the component unmounts
    return () => {
      clearInterval(myInterval);
    };
  }, [userActivityId]);

  return (
    <BrowserRouter>
      <Helmet titleTemplate="%s - Dual Wire" defaultTitle="Dual Wire">
        <meta name="description" content="A Dual Wire application" />
      </Helmet>
      <Routes
        setIsLoginModalOpen={setIsLoginModalOpen}
        isLoginModalOpen={isLoginModalOpen}
      />
    </BrowserRouter>
  );
}

// useEffect(() => {
//   window.fbAsyncInit = () => {
//     window.FB.init({
//       appId: 6574602375900295, // testing app
//       autoLogAppEvents: true,
//       xfbml: true,
//       version: 'v11.0',
//     });
//   };
//   (function (d, s, id) {
//     var js,
//       fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {
//       return;
//     }
//     js = d.createElement(s);
//     js.id = id;
//     js.src = 'https://connect.facebook.net/en_US/sdk.js';
//     fjs.parentNode.insertBefore(js, fjs);
//   })(document, 'script', 'facebook-jssdk');
// }, []);

// FB.getLoginStatus(function(response) {
//   statusChangeCallback(response);
// });
