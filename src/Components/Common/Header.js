import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../../Assets/Images/logo.svg';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  createAccount,
  handleFacebookBusinessCallback,
  handleFacebookCallback,
  handleFacebookLogin,
  handleGoogleCallback,
  handleGoogleLogin,
  logOut,
  login,
} from '../../Services/AuthService';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Google from '../../Assets/Images/google.svg';
import Facebook from '../../Assets/Images/facebook.svg';
import UserImoji from '../../Assets/Images/User-imoji.svg';
import DownArrow from '../../Assets/Images/down-arrow.svg';
import EN from '../../Assets/Images/usa.png';
import ES from '../../Assets/Images/es.png';
import FR from '../../Assets/Images/fr.png';
import PT from '../../Assets/Images/pt.png';
import { Dropdown, Modal, Space } from 'antd';
import { Input } from 'antd';
import { useFormik } from 'formik';
import { loginSchema, signupSchema } from '../../Schema/AuthSchema';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setIsUserLoggedIn } from '../../Store/Reducers/AuthSlice';
import Cookies from 'js-cookie';
import { CloseOutlined } from '@ant-design/icons';
import { changeLanguage } from '../../Services/CommonService';

const googleTranslateElementInit = () => {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'en,es,pt,fr',
      autoDisplay: false,
    },
    window.innerWidth <= 1200
      ? 'google_translate_element_mobile'
      : 'google_translate_element',
  );
};

let loginValues = {
  email: '',
  password: '',
  remember_me: false,
};

let registerValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  remember_me: true,
};

const Header = memo(({ isLoginModalOpen, setIsLoginModalOpen }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);
  const [flagImage, setFlagImage] = useState(EN);
  const googtrans = Cookies.get('googtrans');

  const { currentUser, authLoading } = useSelector(({ auth }) => auth);
  const { videoUrlAfter } = useSelector(({ social }) => social);

  useEffect(() => {
    try {
      let addScript = document.createElement('script');
      addScript.setAttribute(
        'src',
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit',
      );

      addScript.onerror = () => {
        // You can handle the error here, e.g., show an error message to the user
        console.error('Error loading Google Translate script.');
      };

      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
    } catch (e) {
      console.log('e', e);
    }
  }, []);

  useEffect(() => {
    const lang = googtrans?.split('/')?.[2];
    if (lang === 'en') setFlagImage(EN);
    else if (lang === 'es') setFlagImage(ES);
    else if (lang === 'pt') setFlagImage(PT);
    else if (lang === 'fr') setFlagImage(FR);
  }, [googtrans]);

  useEffect(() => {
    setTimeout(() => {
      const lang = document.getElementsByClassName('goog-te-combo')?.[0];
      if (lang)
        lang.addEventListener('change', e => {
          const lang = e.target.value;
          if (lang === 'en') setFlagImage(EN);
          else if (lang === 'es') setFlagImage(ES);
          else if (lang === 'pt') setFlagImage(PT);
          else if (lang === 'fr') setFlagImage(FR);
          dispatch(changeLanguage(lang));
        });
    }, 1500);
  }, []);

  const loadData = useCallback(async () => {
    if (pathname === '/auth/google/callback') {
      const res = await dispatch(handleGoogleCallback());
      if (res) navigate(res);
      else navigate('/');
    } else if (pathname === '/auth/facebook/callback') {
      const res = await dispatch(handleFacebookCallback());
      if (res) navigate(res);
      else navigate('/');
    } else if (pathname === '/auth/facebookBusiness/callback') {
      const res = await dispatch(handleFacebookBusinessCallback());
      if (res) navigate('/instagram');
    }
    setIsSignUpModalOpen(false);
  }, [pathname]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loginSubmit = useCallback(
    async values => {
      const res = await dispatch(login(values));
      if (res) {
        setIsLoginModalOpen(false);
        dispatch(setIsUserLoggedIn(true));
      }
    },
    [dispatch],
  );

  const submitHandle = useCallback(
    async values => {
      const res = await dispatch(createAccount(values));
      if (res) {
        setIsWelcomeModalOpen(true);
        setIsSignUpModalOpen(false);
        dispatch(setIsUserLoggedIn(true));
        resetForm();
      }
    },
    [dispatch],
  );

  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: loginValues,
    validationSchema: loginSchema,
    onSubmit: loginSubmit,
  });

  const signUpFormik = useFormik({
    enableReinitialize: true,
    initialValues: registerValues,
    validationSchema: signupSchema,
    onSubmit: submitHandle,
  });

  const handleLogOut = useCallback(async () => {
    const res = await dispatch(logOut());
    if (res) navigate('/');
  }, []);

  const items = useMemo(
    () => [
      {
        key: '4',
        label: (
          <a
            rel="noopener noreferrer"
            href="#!"
            onClick={e => {
              e.preventDefault();
              handleLogOut();
            }}
          >
            Logout
          </a>
        ),
      },
    ],
    [handleLogOut],
  );

  return (
    <header className="main_header_wrap">
      <div className="top_header_wrap">
        <p className="small">
          ✨ Unlock the Excitement: Win Big with Our
          <span className="text_gradiant">Raffles & Giveaways!!</span>
        </p>
      </div>
      <div className="header_wrap">
        <Navbar expand="xl" expanded={showNavModal}>
          <Container>
            <div
              className={`header_left${
                window.location.pathname === '/youtube'
                  ? ' home_header_left'
                  : ''
              }`}
            >
              <NavLink to="/">
                <img src={Logo} alt="logoImage" className="logo_img" />
              </NavLink>
            </div>
            <div className="header_right">
              <Navbar.Toggle onClick={() => setShowNavModal(true)} />
              <Navbar.Collapse
                id="navbarScroll"
                className="justify-content-between"
              >
                <Nav>
                  <button
                    onClick={() => navigate('/')}
                    className={
                      pathname === '/' ||
                      pathname === '/settings' ||
                      pathname === '/comment-picker' ||
                      pathname === '/certificate' ||
                      pathname === '/winner' ||
                      pathname === '/generate-certificate' ||
                      pathname === '/generate-certificate/:c_id'
                        ? 'nav-link active'
                        : 'nav-link'
                    }
                  >
                    Home
                  </button>
                  <NavLink to="/shop" className="nav-link">
                    Shop
                  </NavLink>

                  {Object.keys(currentUser)?.length !== 0 && (
                    <>
                      <NavLink to="/dashboard" className="nav-link">
                        Dashboard
                      </NavLink>
                      <NavLink to="/my-account" className="nav-link">
                        My Account
                      </NavLink>
                    </>
                  )}

                  <li className="language_select d-flex align-items-center">
                    <img src={flagImage || EN} alt="" className="profile-img" />
                    <div id="google_translate_element_mobile"></div>
                  </li>
                </Nav>
                <div
                  className="close_btn"
                  role="button"
                  onClick={() => setShowNavModal(false)}
                >
                  <CloseOutlined />
                </div>
              </Navbar.Collapse>
              <ul className="header_right_btn d-flex align-items-center">
                <li className="desktop_lenguage d-flex">
                  <img src={flagImage || EN} alt="" className="profile-img" />
                  <div id="google_translate_element"></div>
                </li>
                <li className="user_dropdown">
                  {currentUser?.email ? (
                    <>
                      <Dropdown menu={{ items }} placement="bottomRight">
                        <a onClick={e => e.preventDefault()}>
                          <Space>
                            <img
                              src={currentUser?.profile_image || UserImoji}
                              alt=""
                              className="profile-img"
                            />
                            <img src={DownArrow} alt="" />
                          </Space>
                        </a>
                      </Dropdown>
                    </>
                  ) : (
                    <button
                      className="btn_primary notranslate"
                      onClick={() => setIsLoginModalOpen(true)}
                    >
                      Login
                      <span className="material-symbols-outlined arrw_icon">
                        arrow_right_alt
                      </span>
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </Container>
        </Navbar>
      </div>

      {/* SignUp */}
      <Modal
        title="👋🏻 Join the Fun!!"
        centered
        open={isSignUpModalOpen}
        onCancel={() => {
          setIsSignUpModalOpen(false);
          signUpFormik?.resetForm();
          dispatch(setIsUserLoggedIn(false));
        }}
        footer={false}
        className="login_popup"
      >
        <p className="small subtitle">Sign Up for Your Shot at Random Wins!!</p>
        <Row>
          <Col sm={6}>
            <div className="form_group">
              <label htmlFor="FirstName">First Name</label>
              <Input
                id="FirstName"
                placeholder="Enter First Name"
                name="first_name"
                value={signUpFormik?.values?.first_name}
                onChange={signUpFormik?.handleChange}
                onBlur={signUpFormik?.handleBlur}
              />
              {signUpFormik?.touched?.first_name &&
                signUpFormik?.errors?.first_name && (
                  <p className="text-danger form-error">
                    {signUpFormik?.errors?.first_name}
                  </p>
                )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group">
              <label htmlFor="LastName">Last Name</label>
              <Input
                id="LastName"
                placeholder="Enter Last Name"
                name="last_name"
                value={signUpFormik?.values?.last_name}
                onChange={signUpFormik?.handleChange}
                onBlur={signUpFormik?.handleBlur}
              />
              {signUpFormik?.touched?.last_name &&
                signUpFormik?.errors?.last_name && (
                  <p className="text-danger form-error">
                    {signUpFormik?.errors?.last_name}
                  </p>
                )}
            </div>
          </Col>
          <Col sm={12}>
            <div className="form_group">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                placeholder="Enter Email"
                name="email"
                value={signUpFormik?.values?.email}
                onChange={signUpFormik?.handleChange}
                onBlur={signUpFormik?.handleBlur}
              />
              {signUpFormik?.touched?.email && signUpFormik?.errors?.email && (
                <p className="text-danger form-error">
                  {signUpFormik?.errors?.email}
                </p>
              )}
            </div>
          </Col>
          <Col sm={12}>
            <div className="form_group">
              <label htmlFor="email">Password</label>
              <Input.Password
                placeholder="input password"
                name="password"
                value={signUpFormik?.values?.password}
                onChange={signUpFormik?.handleChange}
                onBlur={signUpFormik?.handleBlur}
              />
              {signUpFormik?.touched?.password &&
                signUpFormik?.errors?.password && (
                  <p className="text-danger form-error">
                    {signUpFormik?.errors?.password}
                  </p>
                )}
            </div>
          </Col>
          <Col sm={12}>
            <div className="form_group">
              <button
                className="btn_primary notranslate w-100"
                onClick={signUpFormik?.handleSubmit}
                disabled={authLoading}
              >
                Create Account
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
          <Col sm={6}>
            <div className="form_group">
              <button
                className="btn_grey_border w-100"
                onClick={() => handleGoogleLogin(pathname, videoUrlAfter)}
              >
                <img src={Google} alt="GoogleIcon" className="me-2" />
                Sign up with Google
              </button>
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group">
              <button
                className="btn_grey_border w-100"
                onClick={() => handleFacebookLogin(pathname, videoUrlAfter)}
              >
                <img src={Facebook} alt="FacebookIcon" className="me-2" />
                Sign up with Facebook
              </button>
            </div>
          </Col>
          <p className="text-center m-0">
            Already have an account?{' '}
            <button
              className="btn_transparent fw_700 text-decoration-underline"
              onClick={() => {
                setIsSignUpModalOpen(false);
                setIsLoginModalOpen(true);
              }}
            >
              Login
            </button>
          </p>
        </Row>
        {/* SignIn */}
      </Modal>
      <Modal
        title="👋🏻 Join the Fun!!"
        centered
        open={isLoginModalOpen}
        onCancel={() => {
          setIsLoginModalOpen(false);
          dispatch(setIsUserLoggedIn(false));
          resetForm();
        }}
        footer={false}
        className="login_popup"
      >
        <p className="small subtitle">Sign Up for Your Shot at Random Wins!!</p>
        <Row>
          <Col sm={12}>
            <div className="form_group">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                placeholder="Enter Email"
                required
                name="email"
                value={values?.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched?.email && errors?.email && (
                <p className="text-danger form-error">{errors?.email}</p>
              )}
            </div>
          </Col>
          <Col sm={12}>
            <div className="form_group">
              <label htmlFor="email">Password</label>
              <Input.Password
                placeholder="input password"
                name="password"
                value={values?.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />{' '}
              {touched?.password && errors?.password && (
                <p className="text-danger form-error">{errors?.password}</p>
              )}
            </div>
          </Col>
          <Col sm={12}>
            <div className="form_group d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  name="remember_me"
                  className="ps-2 m-2 remember_me"
                  value={values?.remember_me}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    borderRadius: '0!important',
                    height: '20px',
                    width: '20px',
                  }}
                />{' '}
                <label htmlFor="remember_me" className="m-0">
                  Remember Me
                </label>
              </div>
              <button
                className="text-decoration-underline"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  navigate('/forgot-password');
                }}
              >
                Forgot Password
              </button>
            </div>
          </Col>
          <Col sm={12}>
            <div className="form_group">
              <button
                className="btn_primary notranslate w-100"
                onClick={handleSubmit}
                disabled={authLoading}
              >
                Login
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
          <Col sm={6}>
            <div className="form_group">
              <button
                className="btn_grey_border w-100"
                onClick={() => handleGoogleLogin(pathname, videoUrlAfter)}
              >
                <img src={Google} alt="GoogleIcon" className="me-2" />
                Sign in with Google
              </button>
            </div>
          </Col>
          <Col sm={6}>
            <div className="form_group">
              <button
                className="btn_grey_border w-100"
                onClick={() => handleFacebookLogin(pathname, videoUrlAfter)}
              >
                <img src={Facebook} alt="FacebookIcon" className="me-2" />
                Sign in with Facebook
              </button>
            </div>
          </Col>
          <p className="text-center m-0">
            Do not have an account?{' '}
            <button
              className="btn_transparent fw_700 text-decoration-underline"
              onClick={() => {
                setIsSignUpModalOpen(true);
                setIsLoginModalOpen(false);
              }}
            >
              Sign Up
            </button>
          </p>
        </Row>
      </Modal>
      {/* Welcome */}
      <Modal
        title="💫 Welcome!!"
        centered
        open={isWelcomeModalOpen}
        onCancel={() => setIsWelcomeModalOpen(false)}
        footer={false}
        className="welcome_popup"
      >
        <p className="small subtitle">
          your account has been successfully created.
        </p>
        <div className="text-center">
          <button
            className="btn_primary notranslate"
            onClick={() => setIsWelcomeModalOpen(false)}
          >
            Continue
            <span className="material-symbols-outlined arrw_icon">
              arrow_right_alt
            </span>
          </button>
        </div>
      </Modal>
    </header>
  );
});

export default Header;
