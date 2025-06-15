import { getShortNumber, renderMsg } from '../Helper/Common';
import { setLoading } from '../Store/Reducers/CommonSlice';
import {
  setAllCertificateList,
  setAllCommentersList,
  setCertificateData,
  setParticipantsLoading,
  setReplaceLoading,
  setSettings,
  setSocialLoading,
  setWinnersList,
  setYTCommentsList,
  setYTData,
} from '../Store/Reducers/SocialSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc Get Data From Youtube link
 * @param payload (youtube url)
 */
export const getInfoYTVideo = payload => async dispatch => {
  try {
    if (payload) {
      dispatch(setSocialLoading(true));
      const response = await axios.post(`/youtube_video_info`, payload);

      const { success, message, data } = response.data;
      if (success) {
        const updated = {
          ...data,
          statisticsOrg: {
            ...data?.statistics,
          },
          statistics: {
            ...data?.statistics,
            commentCount: getShortNumber(
              Number(data?.statistics?.commentCount),
            ),
            likeCount: getShortNumber(Number(data?.statistics?.likeCount)),
            viewCount: getShortNumber(Number(data?.statistics?.viewCount)),
            favoriteCount: getShortNumber(
              Number(data?.statistics?.favoriteCount),
            ),
          },
        };
        const setting = {
          title: data?.title,
          brandImage: '',
          winnerCount: 1,
          substitudesCount: 0,
          excludeDuplicates: false,
          filterByHashTag: false,
          bonusExtraChances: false,
          blockList: false,
          countDown: 5,
        };

        dispatch(setYTData(updated));
        dispatch(setSettings(setting));
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
    dispatch(setSocialLoading(false));
  }
};

/**
 * @desc Get Comments From Youtube link
 * @param payload (video_id, nextPageToken)
 */
export const getCommentsYTVideo = payload => async (dispatch, getState) => {
  try {
    if (payload) {
      dispatch(setSocialLoading(true));
      const response = await axios.post(`/youtube_video_comment`, payload);
      const { success, message, data } = response.data;
      if (success) {
        const list = data?.map(x => {
          return {
            img: x?.authorProfileImageUrl,
            name: x?.authorDisplayName,
          };
        });
        dispatch(setAllCommentersList(list));
        dispatch(setYTCommentsList(data));
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
    dispatch(setSocialLoading(false));
  }
};

/**
 * @desc Get Filtered Comment
 * @param payload (settings)
 */
export const getFilteredComment = payload => async (dispatch, getState) => {
  try {
    if (payload) {
      dispatch(setSocialLoading(true));
      const response = await axios.post(`/filter_comment`, payload);
      const { success, message, data } = response.data;
      if (success) {
        dispatch(setYTCommentsList(data));
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
    dispatch(setSocialLoading(false));
  }
};

/**
 * @desc Get Winners
 * @param payload (settings)
 */
export const getWinners = payload => async (dispatch, getState) => {
  try {
    if (payload) {
      dispatch(setSocialLoading(true));
      const response = await axios.post(`/generate_winner`, payload);
      const { success, message, data } = response.data;
      if (success) {
        dispatch(setWinnersList(data));
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
    dispatch(setSocialLoading(false));
  }
};

/**
 * @desc Replace Winner
 * @param payload
 */
export const replaceWinner = payload => async (dispatch, getState) => {
  try {
    if (payload) {
      dispatch(setReplaceLoading(true));
      const response = await axios.post(`/replace_winner`, payload);
      const { success, message, data } = response.data;
      if (success) {
        dispatch(setWinnersList(data));
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
    dispatch(setReplaceLoading(false));
  }
};

/**
 * @desc Get Certificate
 * @param payload
 */
export const getCertificate =
  (certificate_id, certificate_code) => async (dispatch, getState) => {
    try {
      if (certificate_id || certificate_code) {
        dispatch(setSocialLoading(true));
        let response;
        if (certificate_id)
          response = await axios.get(
            `/get_certificate?certificate_id=${certificate_id}`,
          );
        else {
          response = await axios.get(
            `/get_certificate?certificate_code=${certificate_code}`,
          );
        }
        const { success, message, data } = response.data;
        if (success) {
          dispatch(setCertificateData(data));
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
      dispatch(setSocialLoading(false));
    }
  };

/**
 * @desc Change Title Of Certificate
 * @param payload
 */
export const changeTitleOfCertificate =
  payload => async (dispatch, getState) => {
    try {
      if (payload) {
        dispatch(setLoading(true));
        const response = await axios.post(`/change_title`, payload);

        const { success, message, data } = response.data;
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
      dispatch(setLoading(false));
    }
  };

/**
 * @desc Get All Certificate List
 * @param page number
 */
export const getAllCertificateList =
  (page = 1, month = '') =>
  async (dispatch, getState) => {
    try {
      if (page) {
        dispatch(setSocialLoading(true));
        const response = await axios.get(
          `/get_certificate_list?page=${page}&sort=${month}`,
        );

        const { success, message, data } = response.data;
        if (success) {
          const { social } = getState();
          const { allCertificateList } = social;
          const updated = {
            ...data,
            records:
              allCertificateList?.records?.length > 0
                ? [...data?.records, ...allCertificateList?.records]
                : [...data?.records],
          };
          dispatch(setAllCertificateList(updated));
          return true;
        } else {
          toast.error(message);
        }
      }
    } catch (e) {
      toast.error(renderMsg(e));
      return false;
    } finally {
      dispatch(setSocialLoading(false));
    }
  };

/**
 * @desc Delete Certificate
 * @param Certificate id
 */
export const deleteCertificate = cid => async (dispatch, getState) => {
  try {
    if (cid) {
      dispatch(setSocialLoading(true));
      const response = await axios.post(`/delete_certificate`, {
        certificate_id: cid,
      });

      const { success, message } = response.data;
      if (success) {
        toast.success(message);
        return true;
      } else {
        toast.error(message);
      }
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setSocialLoading(false));
  }
};
