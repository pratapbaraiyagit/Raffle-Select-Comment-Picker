import { Modal } from 'antd';
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { setIsUserInput } from '../../Store/Reducers/CommonSlice';
import { useDispatch } from 'react-redux';
import { handleInstaLogin } from '../../Services/AuthService';

/**
 * @ desc Memoized component
 */
const ReauthorizeModal = memo(({ show, setShow }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reauthorizeAccount = useCallback(() => {
    handleInstaLogin();
  }, []);

  return (
    <>
      <Modal
        title="⁉ We couldn't find your account"
        onCancel={() => {
          setShow(false);
        }}
        open={show}
        footer={
          <div className="d-flex align-items-center flex-column justify-content-between mt-5">
            <button
              className="btn_primary mb-3 w-100"
              onClick={reauthorizeAccount}
            >
              Reauthorize Raffle Select
              <span className="material-symbols-outlined arrw_icon">
                arrow_right_alt
              </span>
            </button>
            <button
              className="btn_primary w-100"
              onClick={() => {
                dispatch(setIsUserInput(true));
                navigate('/instagram');
              }}
            >
              or Enter URL{' '}
              <span className="material-symbols-outlined arrw_icon">
                arrow_right_alt
              </span>
            </button>
          </div>
        }
        className="custom_delete_popup"
      >
        <div className="delete_content text-center mt-3">
          <p>
            Seems like the Facebook profile you connected does not have any
            Instagram business or creator accounts.
          </p>
          <p>
            If you have a business account,{' '}
            <span className="fw-bold">reauthorize</span> and make sure to accept
            required permissions, or{' '}
            <span className="fw-bold">enter the url</span> of your post below.
            If you want to make sure that your Instagram
          </p>
        </div>
      </Modal>
    </>
  );
});

export default ReauthorizeModal;
