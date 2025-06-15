import Row from 'react-bootstrap/Row';
import { Input } from 'antd';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Google from '../../Assets/Images/google.svg';
import Facebook from '../../Assets/Images/facebook.svg';

export default function Login() {
  return (
    <div className="inner_main">
      <div className="login_main_wrap">
        <div className="container">
          <div className="login_inner_wrap max_600 mx-auto">
            <h2 className="mb-3 text-center">👋🏻 Join the Fun!!</h2>
            <p className="text-center small mb-4">
              Login for Your Shot at Random Wins!!
            </p>
            <div className="login_form_wrap">
              <Row>
                <Col sm={12}>
                  <div className="form_group">
                    <label htmlFor="Email">Email</label>
                    <Input
                      id="Email"
                      placeholder="Enter your email"
                      name="email"
                    />
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="form_group mb-5">
                    <label htmlFor="email">Password</label>
                    <Input.Password
                      placeholder="input password"
                      name="password"
                      className="mb-2"
                    />
                    <Link
                      to="/forgot-Password"
                      className="text_primary d-block text-end"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="form_group">
                    <button className="btn_primary w-100">Login</button>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group">
                    <button className="btn_grey_border w-100">
                      <img src={Google} alt="GoogleIcon" className="me-2" />
                      Sign in with Google
                    </button>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form_group">
                    <button className="btn_grey_border w-100">
                      <img src={Facebook} alt="FacebookIcon" className="me-2" />
                      Sign in with Facebook
                    </button>
                  </div>
                </Col>
                <p className="text-center m-0">
                  Don’t have an account?
                  <Link className="fw_700 text-decoration-underline text_primary ms-2">
                    Create an Account
                  </Link>
                </p>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
