import { renderMsg } from '../Helper/Common';
import { setLoading, setUserActivityId } from '../Store/Reducers/CommonSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc  Upload File
 */
export const uploadFile = (file, video_id) => async dispatch => {
  try {
    if (file && video_id) {
      dispatch(setLoading(true));

      let body = new FormData();
      body.append('logo', file);
      body.append('video_id', video_id);
      const headers = { 'Content-Type': 'multipart/form-data' };
      const response = await axios.post(`/custome_video_logo`, body, {
        headers: headers,
      });
      const { data } = response.data;
      if (data) return data?.custome_video_logo;
      else return false;
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * @desc  Download Video
 */
export const downloadVideo = (c_id, w_id, s) => async dispatch => {
  try {
    if (c_id && w_id && s) {
      dispatch(setLoading(true));

      const response = await axios.get(
        `/certificate_video_url?certificate_id=${c_id}&winner_id=${w_id}&second=${s}`,
      );
      const { data } = response.data;
      if (data?.video_url) return data?.video_url;
      else return false;
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * @desc  Change Language
 */
export const changeLanguage =
  (lang = 'en') =>
  async dispatch => {
    try {
      if (lang) {
        let UserPreferences = localStorage.getItem('UserPreferences');
        if (UserPreferences)
          UserPreferences = JSON.parse(atob(UserPreferences));
        if (UserPreferences?.token) {
          dispatch(setLoading(true));

          const response = await axios.post(`/change_language`, {
            language: lang,
          });
          const { success, data, message } = response.data;
          if (success) {
            toast.success(message);
            return true;
          } else {
            toast.error(message);
            return false;
          }
        }
      }
    } catch (e) {
      toast.error(renderMsg(e));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * @desc  getUserData
 * @alias thirdparty api to track user's activity
 */
export const getUserData = url => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));

    let data = await fetch(url).then(res => res.json());
    if (data) {
      const { auth } = getState();
      const { currentUser } = auth;
      if (Object.entries(currentUser)?.length > 0)
        data.user_id = currentUser?.id;
      else {
        let UserPreferences = localStorage.getItem('UserPreferences');
        if (UserPreferences) {
          UserPreferences = JSON.parse(atob(UserPreferences));
          data.user_id = UserPreferences?.id;
        }
      }
      data.logon_time = new Date().toISOString();
      data.ip_address = data?.IPv4 || data?.ip;
      const res = await dispatch(sendUserActivity(data));
      return data;
    } else return false;
  } catch (e) {
    console.log('Error', e);
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * @desc  Send User Activity
 * @payload (UserData)
 */
export const sendUserActivity = userData => async (dispatch, getState) => {
  try {
    if (userData) {
      dispatch(setLoading(true));

      const payload =
        typeof userData === 'number' ? { activity_id: userData } : userData;
      const response = await axios.post(`/activity`, payload);
      const { success, data, message } = response.data;
      if (success) {
        dispatch(setUserActivityId(data?.id || data?.activity_id));
        return true;
      } else {
        console.log('message', message);
        return false;
      }
    }
  } catch (e) {
    console.error('Error', e);
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};
