import { Input } from 'antd';
import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InstaImg from '../../../Assets/Images/insta-img.png';
import PlayIcon from '../../../Assets/Images/Play.svg';
import LikeAnimation from '../../../Assets/Images/likeAnimation.gif';
import StartIcon from '../../../Assets/Images/start.svg';
import TitleIcon1 from '../../../Assets/Images/titleIcon1.svg';
import TitleIcon2 from '../../../Assets/Images/titleIcon2.svg';
import MusicBar from '../../../Components/Common/MusicBar';
import {
  setIsUserInput,
  setVideoUrl,
} from '../../../Store/Reducers/CommonSlice';
import { setVideoUrlAfter } from '../../../Store/Reducers/SocialSlice';
import { getInfoYTVideo } from '../../../Services/SocialService';
import Loader from '../../../Components/Common/Loader';

export default function Instagram() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');

  const { socialLoading } = useSelector(({ social }) => social);
  const { videoUrl, isUserInput } = useSelector(({ common }) => common);

  const submitHandle = useCallback(async () => {
    if (isUserInput) {
      if (!videoUrl) {
        toast.error('Video url is required !');
        return;
      }
      const res = await dispatch(getInfoYTVideo({ video_url: videoUrl }));
      if (res) {
        localStorage.setItem('videoUrl', videoUrl);
        dispatch(setVideoUrlAfter(videoUrl));
        dispatch(setVideoUrl(''));
      }
    } else {
      if (!userName) {
        toast.error('User Name is required !');
        return;
      }
      // const res = await dispatch(getInfoYTVideo({ video_url: videoUrl }));
      // if (res) {
      //   navigate(`/post-list`);
      //   localStorage.setItem('videoUrl', videoUrl);
      //   dispatch(setVideoUrlAfter(videoUrl));
      //   dispatch(setVideoUrl(''));
      // }
    }
  }, [dispatch, userName, videoUrl]);

  return (
    <>
      {socialLoading && <Loader />}
      <div
        className="instagram_wrapper"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitHandle();
          }
        }}
      >
        <div className="container">
          <div className="insta_main_Wrapper">
            <div className="insta_left_wrapper">
              <div className="insta_img_wrap">
                <img src={InstaImg} alt="" />
                <div className="play_button">
                  <img src={PlayIcon} alt="" />
                </div>
              </div>
              <div className="left_musicbar_Wrap">
                <div className="LikeAnimation">
                  <img src={LikeAnimation} alt="" />
                </div>
                <div className="mucisbar_inner_wrap">
                  <span className="playButton">
                    <img src={StartIcon} alt="" />
                  </span>
                  <MusicBar />
                </div>
              </div>
            </div>
            <div className="insta_right_wrapper">
              <div className="banner_right_inner">
                <div className="banner_title">
                  <span className="banner_up_title">
                    Instagram Comment Picker
                  </span>
                  <h1>
                    <span>
                      Our choice, <img src={TitleIcon1} alt="" />
                    </span>
                    <div className="d-lg-inline-block d-block">
                      <img src={TitleIcon2} alt="" /> Your words
                    </div>
                  </h1>
                </div>
                <p className="mb-4">
                  So, why wait? Join us in this journey where comments become
                  stars and where every voice has its chance to shine and claim
                  victory.
                </p>
                <div className="video_url_wrap_main">
                  <div className="video_url_wrap">
                    {isUserInput ? (
                      <Input
                        placeholder="Enter a Instagram Photo/Video URL"
                        value={videoUrl}
                        onChange={e => dispatch(setVideoUrl(e.target.value))}
                      />
                    ) : (
                      <Input
                        placeholder="Enter a Username"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                      />
                    )}
                    <button
                      className="btn_primary notranslate"
                      onClick={submitHandle}
                      disabled={!videoUrl}
                    >
                      Start
                      <span className="material-symbols-outlined arrw_icon">
                        arrow_right_alt
                      </span>
                    </button>
                  </div>
                  {isUserInput ? (
                    <p
                      className="enter_user m-0"
                      onClick={() => dispatch(setIsUserInput(!isUserInput))}
                    >
                      or Enter Username
                    </p>
                  ) : (
                    <p
                      className="enter_user m-0"
                      onClick={() => dispatch(setIsUserInput(!isUserInput))}
                    >
                      or Enter URL
                    </p>
                  )}
                </div>
                <p className="small">
                  🔗 Utilize this Instagram Giveaway picker to randomly choose
                  comments from Instagram photos and videos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
