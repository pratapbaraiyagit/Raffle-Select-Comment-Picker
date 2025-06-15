import { useNavigate, useParams } from 'react-router-dom';

const PaymentStatus = () => {
  const params = useParams();
  const navigate = useNavigate();

  console.log('params', params);
  return (
    <>
      <div className="inner_main">
        <div className="payment_main_wrap">
          <div className="container">
            <div className="payment_inner_wrap max_600 mx-auto">
              <h2 className="mb-3 text-center">🥳 Payment Successful</h2>
              <p className="text-center small mb-5">
                Your payment has been processed and your account is now active.
                Thank you for choosing us!
              </p>
              <div className="form_group mb-5 d-flex justify-content-center">
                <button className="btn_primary" onClick={() => navigate(-1)}>
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentStatus;
