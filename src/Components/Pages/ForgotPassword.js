import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Input } from 'antd';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { forgotPassword } from '../../Services/AuthService';
import { forgotPasswordSchema } from '../../Schema/AuthSchema';
import LeftArrow from '../../Assets/Images/left-arrow.svg';

export default function ForgotPassword() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');

  const { authLoading } = useSelector(({ auth }) => auth);

  const submitHandle = useCallback(
    async values => {
      const res = await dispatch(forgotPassword(values));
      if (res) {
        setEmail('');
      }
    },
    [dispatch],
  );

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: { email },
      validationSchema: forgotPasswordSchema,
      onSubmit: submitHandle,
    });

  return (
    <div className="inner_main">
      <div className="forgot_main_wrap">
        <div className="container">
          <div className="forgot_inner_wrap max_600 mx-auto">
            <h2 className="mb-3 text-center">🔐 Forgot Password?</h2>
            <p className="text-center small mb-4">
              No worries, we’ll send you reset instructions.
            </p>
            <div className="forgot_form_wrap">
              <Row>
                <Col sm={12}>
                  <div className="form_group">
                    <label htmlFor="Email">Email</label>
                    <Input
                      id="Email"
                      placeholder="Enter your email"
                      name="email"
                      value={values?.email || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.email && errors?.email && (
                      <p className="text-danger form-error">{errors?.email}</p>
                    )}
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="form_group mb-5">
                    <button
                      className="btn_primary w-100"
                      onClick={handleSubmit}
                    >
                      Send link by email
                      {authLoading ? (
                        <>
                          <div className="spinner-border ms-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined arrw_icon">
                            arrow_right_alt
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </Col>
                <Link
                  className="text_primary m-0 d-flex align-items-center justify-content-center fw_500"
                  to={'/'}
                >
                  <img src={LeftArrow} alt="LeftArrowIcon" className="me-1" />
                  Back to home
                </Link>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
