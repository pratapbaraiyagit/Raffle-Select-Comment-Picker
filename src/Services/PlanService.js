import { renderMsg } from '../Helper/Common';
import { setPlanList, setPlanLoading } from '../Store/Reducers/PlanSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * @desc  Change Language
 * @payload duration
 */
export const getPlanList =
  (duration = 'month') =>
  async dispatch => {
    try {
      dispatch(setPlanLoading(true));

      const response = await axios.get(`/get_plan?duration=${duration}`);
      const { success, data, message } = response.data;
      if (success) {
        const updated = data?.map(x => {
          let metaData = Object.keys(x?.metadata)?.map(y => ({
            social_name: y,
            is_true: x?.metadata[y],
          }));
          return {
            ...x,
            metaArr: metaData,
          };
        });
        dispatch(setPlanList(updated));
        return true;
      } else {
        toast.error(message);
        return false;
      }
    } catch (e) {
      toast.error(renderMsg(e));
      return false;
    } finally {
      dispatch(setPlanLoading(false));
    }
  };

/**
 * @desc  Subscribe Plan
 * @payload price_id
 */
export const subscribePlan = price_id => async dispatch => {
  try {
    if (price_id) {
      dispatch(setPlanLoading(true));
      const response = await axios.post(`/subscribe`, {
        price_id,
      });

      const { success, data, message } = response.data;
      if (success) {
        return data?.url;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (e) {
    toast.error(renderMsg(e));
    return false;
  } finally {
    dispatch(setPlanLoading(false));
  }
};
