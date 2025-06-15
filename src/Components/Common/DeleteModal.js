import { Modal } from 'antd';
import { memo } from 'react';

/**
 * @ desc Memoized component
 */
const DeleteModal = memo(
  ({ deleteModal, setDeleteModal, onDelete, setAgree, agree }) => {
    return (
      <>
        <Modal
          title="⁉️ Delete"
          onCancel={() => {
            setDeleteModal(false);
          }}
          open={deleteModal}
          footer={
            <div className="d-flex align-items-center justify-content-between mt-5">
              <button className="btn_primary" onClick={onDelete}>
                Delete{' '}
                <span className="material-symbols-outlined arrw_icon">
                  arrow_right_alt
                </span>
              </button>
              <button
                className="btn_border"
                onClick={() => {
                  setDeleteModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          }
          className="custom_delete_popup"
        >
          <div className="delete_content text-center mt-3">
            <p>
              Do you really want to delete this Giveaway?
              <br /> This action cannot be undone.
            </p>
            <div className="form_group d-flex align-items-center justify-content-center">
              <input
                id="agree"
                type="checkbox"
                className="ps-2 m-2 remember_me"
                style={{
                  borderRadius: '0!important',
                  height: '20px',
                  width: '20px',
                }}
                onChange={e => setAgree(e.target.checked)}
                checked={!!agree}
              />
              <label htmlFor="agree" className="m-0">
                I agree to permanently delete
              </label>
            </div>
          </div>
        </Modal>
      </>
    );
  },
);

export default DeleteModal;
