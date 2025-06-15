import { Input } from 'antd';
import { toast } from 'react-toastify';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MusicBar from '../../Components/Common/MusicBar';
import Loader from '../../Components/Common/Loader';
import { getInfoYTVideo } from '../../Services/SocialService';
import { setVideoUrl } from '../../Store/Reducers/CommonSlice';
import { setVideoUrlAfter } from '../../Store/Reducers/SocialSlice';
import BannerImg from '../../Assets/Images/youtubeImg.png';
import VideoPlay from '../../Assets/Images/play-video.svg';
import VideoText from '../../Assets/Images/video-text.svg';

export default function YouTube() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { socialLoading } = useSelector(({ social }) => social);
  const { videoUrl } = useSelector(({ common }) => common);

  const submitHandle = useCallback(async () => {
    if (!videoUrl) {
      toast.error('Video url is required !');
      return;
    }
    const res = await dispatch(getInfoYTVideo({ video_url: videoUrl }));
    if (res) {
      navigate(`/comment-picker`);
      localStorage.setItem('videoUrl', videoUrl);
      dispatch(setVideoUrlAfter(videoUrl));
      dispatch(setVideoUrl(''));
    }
  }, [dispatch, videoUrl]);

  return (
    <>
      {socialLoading && <Loader />}
      <div
        className="home_wrap"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitHandle();
          }
        }}
      >
        <div className="container">
          <div className="banner_main_wrap">
            <div className="banner_left_wrap">
              <div className="banner_img_wrap text-end">
                <img src={BannerImg} alt="BannerImg" />
              </div>
              <div className="video_wrap">
                <div className="video_inner_wrap">
                  <img
                    src={VideoText}
                    alt="VideoTextImg"
                    className="video_text"
                  />
                  <img
                    src={VideoPlay}
                    alt="VideoPlayImg"
                    className="video_play"
                  />
                </div>
              </div>
            </div>
            <div className="banner_right_wrap">
              <div className="banner_right_inner">
                <div className="banner_title">
                  <span className="banner_up_title">
                    YouTube Comment Picker
                  </span>
                  <h1>
                    <span>Your Comment, Our Pick</span>
                    <div className="d-lg-inline-block d-block">
                      <MusicBar />
                    </div>
                  </h1>
                </div>
                <p className="mb-4">
                  Unlock the excitement as every single comment gets its chance
                  to shine and claim victory, Try it today and witness the magic
                  unfold as comments turn into coveted wins!"
                </p>
                <div className="video_url_wrap mb-2">
                  <Input
                    placeholder="Enter a Youtube Video URL"
                    value={videoUrl}
                    onChange={e => dispatch(setVideoUrl(e.target.value))}
                  />
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
                <p className="small">
                  🔗 Pick random comments from Youtube videos with this Youtube
                  Giveaway picker.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
