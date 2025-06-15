import UserProfile from '../../Assets/Images/Profile-Img.png';
import { Link } from 'react-router-dom';
import MusicBar from './MusicBar';
import { memo } from 'react';
import ETACountdown from './ETA';
import { useSelector } from 'react-redux';

const Loader = memo(() => {
  const { isUserInput } = useSelector(({ common }) => common);
  const { ETALoading } = useSelector(({ social }) => social);

  console.log('ETALoading', ETALoading);
  let app = localStorage.getItem('app');
  if (app) app = JSON.parse(app);

  console.log('app', app);
  return (
    <div className="inner_main loader_main_wrapper">
      <div className="container h-100">
        <div className="Loader_main_wrapper">
          <div className="loader_text">
            <h2 className="text-center">Loading...</h2>
            <MusicBar />
          </div>
          <div className="loader_second_text text-center">
            {app === 'Instagram' && <ETACountdown />}
          </div>
          <div className="loader_second_text">
            <h6 className="text-center">Do not reload the page</h6>
          </div>
          <div className="follow_us">
            <h5>
              Follow us on Instagram and tag us when you announce the winners
            </h5>
            <div className="card_white">
              <div className="loading_user_wrapper d-flex align-items-center justify-content-between">
                <div className="loadin_user_left d-flex align-items-center">
                  <div className="loading_user_img">
                    <img src={UserProfile} />
                  </div>
                  <div className="loading_user_name ms-2">
                    <h5 className="text-start">dual_wire</h5>
                    <h6>329k followers</h6>
                  </div>
                </div>
                <div className="loadin_user_right">
                  <Link to="/">follow</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Loader;
