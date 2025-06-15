import Row from 'react-bootstrap/Row';
import { Input } from 'antd';
import Col from 'react-bootstrap/Col';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LeftArrow from '../../Assets/Images/left-arrow.svg';
import { resetPasswordSchema } from '../../Schema/AuthSchema';
import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { forgotPassword, resetPassword } from '../../Services/AuthService';

export default function PasswordReset({
  setIsLoginModalOpen,
  isLoginModalOpen,
}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  let email = searchParams?.get('email');
  let token = searchParams?.get('token');
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandle = useCallback(
    async values => {
      const payload = {
        token,
        email,
        password: values?.password,
        password_confirmation: values?.confirmPassword,
      };
      const res = await dispatch(resetPassword(payload));
      if (res) {
        setPassword('');
        setConfirmPassword('');
        navigate('/');
      }
    },
    [dispatch, email, token],
  );

  const { handleBlur, handleChange, errors, values, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: { confirmPassword, password },
      validationSchema: resetPasswordSchema,
      onSubmit: submitHandle,
    });

  const onForgotPassword = useCallback(
    async email => {
      const res = await dispatch(forgotPassword({ email })); //add email here
      if (res) {
      }
    },
    [dispatch],
  );

  return (
    <div className="inner_main">
      <div className="preset_main_wrap">
        <div className="container">
          <div className="preset_inner_wrap max_600 mx-auto">
            <h2 className="mb-3 text-center">🗝 Password Reset</h2>
            <p className="text-center small mb-4">
              We sent a code to <span className="fw_500">{email}</span>
            </p>
            <div className="preset_form_wrap">
              <Row>
                <Col sm={12}>
                  <div className="form_group">
                    <label htmlFor="currentpassword">New Password</label>
                    <Input.Password
                      placeholder="Password"
                      name="password"
                      className="mb-2"
                      value={values?.password || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.password && errors?.password && (
                      <p className="text-danger form-error">
                        {errors?.password}
                      </p>
                    )}
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="form_group">
                    <label htmlFor="newpassword">Confirm Password</label>
                    <Input.Password
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      className="mb-2"
                      value={values?.confirmPassword || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched?.confirmPassword && errors?.confirmPassword && (
                      <p className="text-danger form-error">
                        {errors?.confirmPassword}
                      </p>
                    )}
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="form_group mb-4 text-center">
                    <button
                      className="btn_primary"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Continue
                    </button>
                  </div>
                </Col>
                <p className="text-center m-0 mb-5">
                  Didn’t receive the email?
                  <button
                    className="fw_700 text-decoration-underline text_primary ms-2"
                    onClick={() => onForgotPassword(email)}
                  >
                    Click here
                  </button>
                </p>
                <button
                  className="text-decoration-underline text_primary m-0 d-flex align-items-center justify-content-center fw_500"
                  onClick={() => {
                    navigate('/');
                    setIsLoginModalOpen(true);
                  }}
                >
                  <img src={LeftArrow} alt="LeftArrowIcon" className="me-1" />
                  Back to login
                </button>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
