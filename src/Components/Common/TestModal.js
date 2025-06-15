/**
 * @ desc Memoized component
 */
const TestModal = memo(({ testModal, setTestModal, onDelete }) => {
  return (
    <>
      <Modal
        title="This is a test ⁉"
        onCancel={() => {
          setTestModal(false);
        }}
        open={testModal}
        footer={
          <div className="d-flex align-items-center justify-content-between mt-5">
            <button className="btn_primary" onClick={onDelete}>
              Start{' '}
              <span className="material-symbols-outlined arrw_icon">
                arrow_right_alt
              </span>
            </button>
            <button
              className="btn_border"
              onClick={() => {
                setTestModal(false);
              }}
            >
              Run a test
            </button>
          </div>
        }
        className="custom_delete_popup"
      >
        <div className="delete_content text-center mt-3">
          <p>
            If you want to make sure that your Instagram
            <br /> giveaway is set up correctly, run a test first.
          </p>
        </div>
      </Modal>
    </>
  );
});

export default TestModal;
