import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InstaIcon from '../../Assets/Images/app-insta.svg';
import InstaIconFill from '../../Assets/Images/app-insta-fill.svg';
import FacebookIcon from '../../Assets/Images/app-facebook.svg';
import FacebookIconFill from '../../Assets/Images/app-facebook-fill.svg';
import YoutubeIcon from '../../Assets/Images/app-youtube.svg';
import YoutubeIconFill from '../../Assets/Images/app-youtube-fill.svg';
import TikTokIcon from '../../Assets/Images/app-tiktok.svg';
import TikTokIconFill from '../../Assets/Images/app-tiktok-fill.svg';
import TwitterIcon from '../../Assets/Images/app-twitter.svg';
import TwitterIconFill from '../../Assets/Images/app-twittr-fill.svg';
import CircleArrow from '../../Assets/Images/right-arrow.svg';
import { setAppCssTheme } from '../../Store/Reducers/CommonSlice';
import { useDispatch } from 'react-redux';

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChangeTheme = useCallback(value => {
    localStorage.setItem('app', JSON.stringify(value));
    dispatch(setAppCssTheme(value));
  }, []);

  return (
    <div className="all_application_wrapper inner_page_wrapper">
      <div className="container">
        <div className="app_title">
          <h1>
            Start creating your <span>Giveaway</span> today.
          </h1>
          <p>
            Please make your selection from the available contests that you'd
            like to host.
          </p>
        </div>
        <div className="application_box_wrapper">
          <ul>
            <li
              className="instagram"
              onClick={() => onChangeTheme('Instagram')}
            >
              <div onClick={() => navigate('/instagram')}>
                <div className="app_box_wrap">
                  <div className="app_icon">
                    <img src={InstaIcon} className="outline_icon" alt="" />
                    <img src={InstaIconFill} className="fill_icon" alt="" />
                  </div>
                  <h5>Instagram Giveaway</h5>
                  <p>Select a winner at random from your photos or videos.</p>
                  <div className="read_more_btn">
                    <Link to="/instagram">
                      <img src={CircleArrow} alt="" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            <li className="facebook" onClick={() => onChangeTheme('Facebook')}>
              <div onClick={() => navigate('/facebook')}>
                <div className="app_box_wrap">
                  <div className="app_icon">
                    <img src={FacebookIcon} className="outline_icon" alt="" />
                    <img src={FacebookIconFill} className="fill_icon" alt="" />
                  </div>
                  <h5>Facebook Giveaway</h5>
                  <p>Select a winner at random from your posts.</p>
                  <div className="read_more_btn">
                    <Link to="/facebook">
                      <img src={CircleArrow} alt="" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            <li className="youtube" onClick={() => onChangeTheme('Youtube')}>
              <div onClick={() => navigate('/youtube')}>
                <div className="app_box_wrap">
                  <div className="app_icon">
                    <img src={YoutubeIcon} className="outline_icon" alt="" />
                    <img src={YoutubeIconFill} className="fill_icon" alt="" />
                  </div>
                  <h5>Youtube Giveaway</h5>
                  <p>Select a winner at random from your videos.</p>
                  <div className="read_more_btn">
                    <Link to="/youtube">
                      <img src={CircleArrow} alt="" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            <li className="tiktok" onClick={() => onChangeTheme('Tiktok')}>
              <div onClick={() => navigate('/tiktok')}>
                <div className="app_box_wrap">
                  <div className="app_icon">
                    <img src={TikTokIcon} className="outline_icon" alt="" />
                    <img src={TikTokIconFill} className="fill_icon" alt="" />
                  </div>
                  <h5>Tiktok Giveaway</h5>
                  <p>
                    Select a winner at random from your Tiktok video comments.
                  </p>
                  <div className="read_more_btn">
                    <Link to="/tiktok">
                      <img src={CircleArrow} alt="" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            <li className="twitter" onClick={() => onChangeTheme('Twitter')}>
              <div onClick={() => navigate('/twitter')}>
                <div className="app_box_wrap">
                  <div className="app_icon">
                    <img src={TwitterIcon} className="outline_icon" alt="" />
                    <img src={TwitterIconFill} className="fill_icon" alt="" />
                  </div>
                  <h5>Twitter Giveaway</h5>
                  <p>
                    Select a winner at random from your tweet and followers.
                  </p>
                  <div className="read_more_btn">
                    <Link to="/twitter">
                      <img src={CircleArrow} alt="" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
