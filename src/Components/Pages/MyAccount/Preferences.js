import { useCallback, useEffect, useState } from 'react';
import { Input } from 'antd';
import { Col, Row } from 'react-bootstrap';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import {
  changePassword,
  deleteAccount,
  getProfile,
  updateProfile,
} from '../../../Services/AuthService';
import { useSelector } from 'react-redux';
import Loader from '../../../Components/Common/Loader';
import { setCurrentUser } from '../../../Store/Reducers/AuthSlice';
import { changePasswordSchema, userSchema } from '../../../Schema/AuthSchema';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import UserImoji from '../../../Assets/Images/User-imoji.svg';

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const passwordValues = { currentPassword: '', newPassword: '' };

export default function Preferences({ setIsLoginModalOpen, isLoginModalOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [agree, setAgree] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { authLoading, currentUser } = useSelector(({ auth }) => auth);
  const { loading } = useSelector(({ common }) => common);

  const handlePreview = useCallback(async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    );
  }, []);

  const handleSelectChange = useCallback(value => {
    console.log(`selected ${value}`);
  }, []);

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onChange = useCallback(
    (key, val) => {
      let user = { ...currentUser };
      user[key] = val;
      dispatch(setCurrentUser(user));
    },
    [currentUser],
  );

  useEffect(() => {
    if (currentUser?.profile_image)
      setFileList([
        {
          uid: '-1',
          name: 'Profile Image.png',
          status: 'done',
          url: currentUser?.profile_image,
        },
      ]);
  }, [currentUser]);

  const onDeleteAccount = useCallback(async () => {
    const res = await dispatch(deleteAccount());
    if (res) {
      navigate('/');
    }
  }, []);

  const onUpdatePassword = useCallback(async values => {
    const payload = {
      current_password: values?.currentPassword,
      new_password: values?.newPassword,
    };
    const res = await dispatch(changePassword(payload));
    if (res) {
    }
  }, []);

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
    initialValues: passwordValues,
    validationSchema: changePasswordSchema,
    onSubmit: onUpdatePassword,
  });

  const onUpdateProfile = useCallback(
    async values => {
      const payload = {
        first_name: values?.first_name,
        last_name: values?.last_name,
        email: values?.email,
        language: values?.language || 'en',
        profile_image: fileList?.[0]?.originFileObj,
      };
      const res = await dispatch(updateProfile(payload));
      if (res) {
        await dispatch(getProfile());
      }
    },
    [fileList],
  );

  const userFormik = useFormik({
    enableReinitialize: true,
    initialValues: currentUser,
    validationSchema: userSchema,
    onSubmit: onUpdateProfile,
  });

  return (
    <>
      {authLoading && <Loader />}
      <div className="preferences_wrap">
        <Row>
          <Col lg={6} md={8} className="mx-md-auto">
            <div className="preferences_left">
              <div className="card_white color_white mb-5">
                <div className="card_header">
                  <h4>My Profile 👤</h4>
                </div>
                <div className="card_content">
                  <div className="input_box">
                    <ul>
                      <li>
                        <label htmlFor="">First Name</label>
                        <div className="input_box_right">
                          <Input
                            id="Title"
                            placeholder="First Name"
                            name="first_name"
                            value={userFormik?.values?.first_name}
                            onChange={userFormik?.handleChange}
                            onBlur={userFormik?.handleBlur}
                          />
                          {userFormik?.touched?.first_name &&
                            userFormik?.errors?.first_name && (
                              <p className="text-danger form-error">
                                {userFormik?.errors?.first_name}
                              </p>
                            )}
                        </div>
                      </li>
                      <li>
                        <label htmlFor="">Last Name</label>
                        <div className="input_box_right">
                          <Input
                            id="Title"
                            placeholder="Last Name"
                            value={userFormik?.values?.last_name}
                            name="last_name"
                            onChange={userFormik?.handleChange}
                            onBlur={userFormik?.handleBlur}
                          />
                          {userFormik?.touched?.last_name &&
                            userFormik?.errors?.last_name && (
                              <p className="text-danger form-error">
                                {userFormik?.errors?.last_name}
                              </p>
                            )}
                        </div>
                      </li>
                      <li>
                        <label htmlFor="">Email address</label>
                        <div className="input_box_right">
                          <Input
                            id="Title"
                            placeholder="user.dualwire@gmail.com"
                            value={userFormik?.values?.email}
                            name="email"
                            onChange={userFormik?.handleChange}
                            onBlur={userFormik?.handleBlur}
                          />
                          {userFormik?.touched?.email &&
                            userFormik?.errors?.email && (
                              <p className="text-danger form-error">
                                {userFormik?.errors?.email}
                              </p>
                            )}
                        </div>
                      </li>
                      {/* <li>
                        <label htmlFor="">Language</label>
                        <div className="input_box_right">
                          <Select
                            defaultValue="en"
                            style={{
                              width: 120,
                            }}
                            onChange={handleSelectChange}
                            options={[
                              {
                                value: 'en',
                                label: 'English',
                              },
                              {
                                value: 'Hindi',
                                label: 'Hindi',
                              },
                              {
                                value: 'Gujrati',
                                label: 'Gujrati',
                              },
                            ]}
                          />
                        </div>
                      </li> */}
                      {/* <li>
                        <label htmlFor="">Language</label>
                        <div className="input_box_right">
                          <div id="google_translate_element"></div>
                        </div>
                      </li> */}
                      <li>
                        <label htmlFor="">Profile Picture</label>
                        <div className="input_box_right">
                          <div className="d-flex justify-content-between">
                            <div>
                              <Upload
                                fileList={fileList || [UserImoji]}
                                listType="picture-circle"
                                accept="image/png, image/jpeg"
                                maxCount={1}
                                onPreview={handlePreview}
                                onChange={handleImageChange}
                              >
                                <div>
                                  <PlusOutlined />
                                  <div
                                    style={{
                                      marginTop: 8,
                                    }}
                                  >
                                    Change
                                  </div>
                                </div>
                              </Upload>
                              <Modal
                                open={previewOpen}
                                title={previewTitle}
                                footer={null}
                                onCancel={() => setPreviewOpen(false)}
                              >
                                <img
                                  alt="example"
                                  style={{
                                    width: '100%',
                                  }}
                                  src={previewImage}
                                />
                              </Modal>
                            </div>
                            <button
                              className="text-decoration-underline"
                              onClick={() => setDeleteModal(true)}
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6} md={8} className="mx-md-auto">
            <div className="preferences_right">
              <div className="card_white color_white mb-5">
                <div className="card_header">
                  <h4>Change Password 🔐</h4>
                </div>
                <div className="card_content">
                  <div className="input_box">
                    <ul>
                      <li>
                        <label htmlFor="currentPassword">
                          Current Password
                        </label>
                        <div className="input_box_right">
                          <Input
                            id="currentPassword"
                            type="password"
                            name="currentPassword"
                            placeholder="**********"
                            value={values?.currentPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {touched?.currentPassword &&
                            errors?.currentPassword && (
                              <p className="text-danger form-error">
                                {errors?.currentPassword}
                              </p>
                            )}
                        </div>
                      </li>
                      <li>
                        <label htmlFor="newPassword">New Password</label>
                        <div className="input_box_right">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            placeholder="**********"
                            type="password"
                            value={values?.newPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {touched?.newPassword && errors?.newPassword && (
                            <p className="text-danger form-error">
                              {errors?.newPassword}
                            </p>
                          )}
                        </div>
                      </li>
                      <div className="text-end">
                        <button
                          className="text-decoration-underline"
                          onClick={() => {
                            navigate('/forgot-password');
                          }}
                        >
                          Forgot Password
                        </button>
                      </div>
                      <li>
                        <button
                          type="submit"
                          className="btn_primary change-password"
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          Update
                          {loading ? (
                            <>
                              <div
                                className="spinner-border ms-2"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
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
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div className="text-center">
          <button
            className="btn_primary"
            onClick={userFormik?.handleSubmit}
            disabled={loading}
          >
            Update
            {loading ? (
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
      </div>
      <Modal
        title="⁉️ Delete"
        onCancel={() => {
          setDeleteModal(false);
        }}
        open={deleteModal}
        footer={
          <div className="d-flex align-items-center justify-content-between mt-5">
            <button className="btn_primary" onClick={onDeleteAccount}>
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
            Do you really want to delete this Account?
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
}
