import {
  resetAuthSlice,
  setAuthLoading,
  setCurrentUser,
  setIsUserLoggedIn,
} from '../Store/Reducers/AuthSlice';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import {
  REACT_APP_FB_APP_ID,
  REACT_APP_FB_BUSINESS_APP_ID,
  REACT_APP_FB_BUSINESS_CONFIG_ID,
  REACT_APP_GOOGLE_CLIENT_ID,
} from '../Helper/Environment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { renderMsg } from '../Helper/Common';
import { clearToken, saveToken } from '../Helper/AuthTokenHelper';
import { resetSocialSlice } from '../Store/Reducers/SocialSlice';
import { setLoading } from '../Store/Reducers/CommonSlice';

export const handleGoogleLogin = () => {
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=${REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google/callback&scope=profile email openid&response_type=token&prompt=consent&service=lso&o2v=2&flowName=GeneralOAuthFlow`;
};

export const handleFacebookLogin = () => {
  window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${REACT_APP_FB_APP_ID}&display=popup&redirect_uri=${window.location.origin}/auth/facebook/callback&response_type=token&scope=email`;
};

//https:www.facebook.com/v16.0/dialog/oauth?client_id=726650182249383&state=01b476f12bb2e98d83a6281dd95f8dca&response_type=code&sdk=php-sdk-5.7.0&redirect_uri=https%3A%2F%2Fapp-sorteos.com%2Fauth%2Ffacebook%2Fcallback&scope=email%2Cpublic_profile%2Cpages_read_engagement%2Cpages_read_user_content%2Cinstagram_basic%2Cpages_show_list%2Cinstagram_manage_comments

export const handleInstaLogin = () => {
  window.location.href = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${REACT_APP_FB_BUSINESS_APP_ID}&response_type=token&redirect_uri=${window.location.origin}/auth/facebookBusiness/callback&scope=email,instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement&config_id=${REACT_APP_FB_BUSINESS_CONFIG_ID}`;
};

export const handleFacebookBusinessCallback = () => async dispatch => {
  try {
    // Parse the token from the URL after the user is redirected back
    const params = new URLSearchParams(window.location?.hash?.substring(1));
    const token = params.get('access_token');

    // const urlParams = new URLSearchParams(window.location.search);

    const response = await axios.get(
      `https://graph.facebook.com/v12.0/me?fields=name,email&access_token=${token}`,
    );
    // console.log('urlParams', urlParams);
    // const encryptData = CryptoJS.AES.encrypt(
    //   token,
    //   'Appsecret_proof',
    // ).toString();
    // const response =
    //   await axios.post(`https://graph.intern.facebook.com/v17.0/2738613836382965/system_user_access_tokens?appsecret_proof=${encryptData}&
    // access_token=${token}&
    // fetch_only=true`);
    const { status, data, message } = response;
    console.log('data', data);
    if (status === 200) {
      const fbBusinessId = data?.id;
      localStorage.setItem('fbBusiness', btoa(JSON.stringify(fbBusinessId)));
      const res = await dispatch(getSocialLogin(data));
      if (res) return true;
      else return false;
    } else {
      toast.error(message || 'Something went wrong, please try again later');
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};

export const handleGoogleCallback = () => async dispatch => {
  try {
    // Parse the token from the URL after the user is redirected back
    const params = new URLSearchParams(window.location?.hash?.substring(1));
    const token = params.get('access_token');

    const urlParams = new URLSearchParams(window.location.search);
    const redirectFrom = urlParams?.get('redirectfrom');

    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`,
    );
    const { status, data, message } = response;
    if (status === 200) {
      const res = await dispatch(getSocialLogin(data));
      if (res) return redirectFrom;
      else return false;
    } else {
      toast.error(message || 'Something went wrong, please try again later');
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};

export const handleFacebookCallback = () => async dispatch => {
  try {
    // Parse the token from the URL after the user is redirected back
    const token = new URLSearchParams(window.location?.hash?.substring(1))?.get(
      'access_token',
    );

    const urlParams = new URLSearchParams(window.location.search);
    const redirectFrom = urlParams?.get('redirectfrom');

    const response = await axios.get(
      `https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${token}`,
    );
    const { status, data, message } = response;
    if (status === 200) {
      const res = await dispatch(getSocialLogin(data));
      if (res) return redirectFrom;
      else return false;
    } else {
      toast.error(message || 'Something went wrong, please try again later');
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};

export const setLoginData = user_data => async (dispatch, getState) => {
  saveToken(user_data);
};

export const setUserCookies =
  (user, remember_me) => async (dispatch, getState) => {
    const encryptData = CryptoJS.AES.encrypt(user, 'UserSecrets').toString();
    if (remember_me) Cookies.set('user', encryptData);
  };

/**
 * @desc Verify Email
 * @param payload (user)
 */
export const login = user => async dispatch => {
  try {
    if (user) {
      dispatch(setAuthLoading(true));
      const response = await axios.post(`/login`, user);
      const { success, message, data } = response.data;
      if (success) {
        toast.success(message);
        dispatch(setLoginData(data));
        dispatch(setCurrentUser(data));
        dispatch(
          setUserCookies(JSON.stringify(data?.token), user?.remember_me),
        );
        dispatch(setIsUserLoggedIn(true));
        return true;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc  Create Account
 * @param payload (new User)
 */
export const createAccount = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setAuthLoading(true));

      const response = await axios.post(`/register`, payload);
      const { success, message, data } = response.data;
      if (success) {
        dispatch(setLoginData(data));
        dispatch(setCurrentUser(data));
        dispatch(
          setUserCookies(JSON.stringify(data?.token), payload?.remember_me),
        );
        dispatch(setIsUserLoggedIn(true));
        toast.success(message);
        return true;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc  Get New Token After Older One Expires
 * @param payload (existing User token)
 */
export const getNewToken = () => async dispatch => {
  try {
    dispatch(setAuthLoading(true));
    let UserPreferences = localStorage.getItem('UserPreferences');
    if (UserPreferences) {
      UserPreferences = JSON.parse(atob(UserPreferences));
      const response = await axios.post(`/new_token`, {
        refreshtoken: UserPreferences?.refresh_token,
      });
      const { success, message, data } = response.data;
      if (success) {
        toast.success(message);
        dispatch(setLoginData(data));
        dispatch(setUserCookies(JSON.stringify(data)));
        dispatch(setIsUserLoggedIn(true));
        return true;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc  login with social login
 * @param payload (userData)
 */
export const getSocialLogin = userData => async dispatch => {
  try {
    dispatch(setAuthLoading(true));
    if (userData) {
      const response = await axios.post(`/social_login`, userData);
      const { success, message, data } = response.data;
      if (success) {
        dispatch(setCurrentUser(data));
        dispatch(setLoginData(data));
        dispatch(setIsUserLoggedIn(true));
        toast.success(message);
        return true;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc  Get Profile
 */
export const getProfile = () => async dispatch => {
  try {
    dispatch(setAuthLoading(true));
    const response = await axios.get(`/profile`);

    const { success, message, data } = response.data;
    if (success) {
      dispatch(setCurrentUser(data));
      return true;
    } else {
      toast.error(message);
      return false;
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Logout
 */
export const logOut = () => async dispatch => {
  try {
    dispatch(setAuthLoading(true));
    const response = await axios.post(`/logout`);

    const { success, message } = response.data;
    if (success) {
      clearToken();
      dispatch(resetSocialSlice());
      dispatch(resetAuthSlice());
      toast.success(message || 'Logout successfully');
      return true;
    } else {
      toast.error(message);
      return false;
    }
  } catch (e) {
    toast.error(renderMsg(e) || 'Unable to logout');
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Delete Account
 */
export const deleteAccount = () => async dispatch => {
  try {
    dispatch(setAuthLoading(true));
    const response = await axios.post(`/delete_account`);

    const { success, message } = response.data;
    if (success) {
      clearToken();
      dispatch(resetSocialSlice());
      dispatch(resetAuthSlice());
      toast.success(message || 'Account deleted !');
      return true;
    } else {
      toast.error(message);
      return false;
    }
  } catch (e) {
    toast.error(renderMsg(e) || 'Unable to logout');
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Update Profile
 */
export const updateProfile = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setAuthLoading(true));
      let body = new FormData();
      body.append('profile_image', payload?.profile_image);
      body.append('first_name', payload?.first_name);
      body.append('last_name', payload?.last_name);
      body.append('email', payload?.email);
      body.append('language', payload?.language);
      const headers = { 'Content-Type': 'multipart/form-data' };
      const response = await axios.post(`/profile`, body, {
        headers: headers,
      });

      const { success, message } = response.data;
      if (success) {
        toast.success(message || 'Profile updated successfully !');
        return true;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (e) {
    toast.error(renderMsg(e) || 'Unable to logout');
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Change Password
 */
export const changePassword = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setLoading(true));
      const response = await axios.post(`/change_password`, payload);

      const { success, message } = response.data;
      if (success) {
        toast.success(message);
        return true;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (e) {
    toast.error(renderMsg(e) || 'Unable to logout');
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * @desc Forgot Password
 */
export const forgotPassword = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setAuthLoading(true));
      const response = await axios.post(`/forgot_password`, payload);

      const { success, message } = response.data;
      if (success) {
        toast.success(message);
        return true;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * @desc Reset Password
 */
export const resetPassword = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setAuthLoading(true));
      const response = await axios.post(`/reset_password`, payload);

      const { success, message } = response.data;
      if (success) {
        toast.success(message);
        return true;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setAuthLoading(false));
  }
};
