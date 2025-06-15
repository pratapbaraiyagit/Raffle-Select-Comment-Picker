import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const saveToken = user_data => {
  const settings = {
    ...user_data,
  };
  setAuthToken(user_data?.token);
  localStorage.setItem('UserPreferences', btoa(JSON.stringify(settings)));
};

export const setupToken = () => {
  let token;
  const UserPreferences = localStorage.getItem('UserPreferences');
  if (UserPreferences) token = JSON.parse(atob(UserPreferences));
  if (token) {
    const decoded = jwtDecode(token?.token);
    const currentTime = parseInt(Date.now() / 1000);
    if (decoded.exp > currentTime) {
      setAuthToken(token?.token);
      return token;
    }
  }
  return false;
};

// Header Methods
export const setAuthToken = access_Token => {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ` + access_Token;
  } catch (e) {
    console.log('Error while setup token', e);
  }
};

export const clearToken = () => {
  localStorage.clear();
  sessionStorage.clear();
  clearAuthToken();
};

const clearAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};
