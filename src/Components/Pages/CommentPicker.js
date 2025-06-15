import UserImge from '../../Assets/Images/user1.jpg';
import YTImage from '../../Assets/Images/yt-img.jpg';
import Comment from '../../Assets/Images/comment.svg';
import Eyes from '../../Assets/Images/eyes.svg';
import Like from '../../Assets/Images/like.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { getCommentsYTVideo } from '../../Services/SocialService';
import { useDispatch } from 'react-redux';
import Loader from '../../Components/Common/Loader';
import { setVideoUrl } from '../../Store/Reducers/CommonSlice';
import MusicBar from '../../Components/Common/MusicBar';
import { toast } from 'react-toastify';
import ReauthorizeModal from '../Common/ReauthorizeModal';

export default function CommentPicker({
  isLoginModalOpen,
  setIsLoginModalOpen,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const { loading, currentUser } = useSelector(({ auth }) => auth);
  const { socialLoading, YTData } = useSelector(({ social }) => social);

  let isUser = localStorage.getItem('UserPreferences');
  let app = localStorage.getItem('app');
  let fbBusiness = localStorage.getItem('fbBusiness');
  if (app) app = JSON.parse(app);
  if (fbBusiness) fbBusiness = JSON.parse(atob(fbBusiness));
  if (isUser) isUser = JSON.parse(atob(isUser));

  useEffect(() => {
    if (!YTData?.title) navigate('/');
  }, [YTData]);

  const getComments = useCallback(async () => {
    if (!isUser) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!fbBusiness && app === 'Instagram') {
      setShow(true);
      return;
    }
    if (
      currentUser?.current_plan?.name === 'Free' &&
      Number(YTData?.statisticsOrg?.commentCount) > 600
    ) {
      toast?.info(
        'You have reached the comment limit (more then 600 Comments), Go to the shop page to upgrade your plan!',
      );
      return;
    } else if (
      currentUser?.current_plan?.name === 'Silver' &&
      Number(YTData?.statisticsOrg?.commentCount) > 2000
    ) {
      toast.info(
        'You have reached the comment limit (more then 2000 Comments), Go to the shop page to upgrade your plan!',
      );
      return;
    } else if (
      currentUser?.current_plan?.name === 'Gold' &&
      Number(YTData?.statisticsOrg?.commentCount) > 5000
    ) {
      toast.info(
        'You have reached the comment limit (more than 5,000 comments). Go to the Shop page to upgrade your plan!',
      );
      return;
    } else if (Number(YTData?.statisticsOrg?.commentCount) === 0) {
      toast.info('There are no comments!');
      return;
      // } else if (Number(YTData?.statisticsOrg?.commentCount) < 10) {
      //   toast.info('Very few comments!');
      //   return;
    }
    const res = await dispatch(getCommentsYTVideo({ video_id: YTData?.id }));
    if (res) navigate('/settings');
  }, [YTData, dispatch, fbBusiness, isUser, currentUser]);

  return (
    <>
      {(socialLoading || loading) && <Loader />}
      <div className="inner_main">
        <div className="comment_picker_wrap">
          <div className="container">
            <div className="comment_picker_inner_wrap">
              <MusicBar />
              <h2 className="mb-3 text-center">{app} Comment Picker</h2>
              <div className="comment_box">
                <div className="card_white max_600 mx-auto">
                  <div className="card_header d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="card_header_img">
                        <img
                          src={YTData?.channel_thumbnails || UserImge}
                          alt="UserImg"
                        />
                      </div>
                      <h6 className="m-0 ms-2">{YTData?.channelTitle}</h6>
                    </div>
                    <Link
                      to="/"
                      className="text-decoration-underline text_primary fw_600"
                      onClick={() => dispatch(setVideoUrl(''))}
                    >
                      Modify
                    </Link>
                  </div>
                  <div className="card_content">
                    <div className="comment_img mb-2">
                      <img
                        src={YTData?.video_thumbnails || YTImage}
                        alt="YTImage"
                        className="img-fluid"
                      />
                    </div>
                    <ul className="comment_social">
                      <li>
                        <img src={Comment} alt="CommentIcon" />
                        <span>{YTData?.statistics?.commentCount}</span>
                      </li>
                      <li>
                        <img src={Eyes} alt="EyesIcon" />
                        <span>{YTData?.statistics?.viewCount}</span>
                      </li>
                      <li>
                        <img src={Like} alt="LikeIcon" />
                        <span>{YTData?.statistics?.likeCount}</span>
                      </li>
                    </ul>
                    <div className="btn_group">
                      <ul className="d-flex justify-content-end align-items-center">
                        <li className="me-4">
                          <button
                            className="btn_transparent text-decoration-underline"
                            onClick={() => {
                              navigate('/');
                              dispatch(setVideoUrl(''));
                            }}
                          >
                            Back
                          </button>
                        </li>
                        <li>
                          {app === 'Instagram' && (
                            <button
                              className="btn_primary notranslate"
                              onClick={getComments}
                              // onClick={() => navigate('/eta')}
                            >
                              Connect with Instagram
                              <span className="material-symbols-outlined arrw_icon">
                                arrow_right_alt
                              </span>
                            </button>
                          )}
                          {app === 'Youtube' && (
                            <button
                              className="btn_primary notranslate"
                              onClick={getComments}
                            >
                              {/* {app === 'Instagram'
                              ? 'Connect with Instagram'
                              : 'Comments'} */}
                              Comments
                              <span className="material-symbols-outlined arrw_icon">
                                arrow_right_alt
                              </span>
                            </button>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReauthorizeModal show={show} setShow={setShow} />
    </>
  );
}
