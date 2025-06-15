import Loader from '../../../Components/Common/Loader';
import { useSelector } from 'react-redux';
import MusicBar from '../../../Components/Common/MusicBar';
import InstaUser from '../../../Assets/Images/insta-user.png';
import YTImage from '../../../Assets/Images/yt-img.jpg';
import Comment from '../../../Assets/Images/comment.svg';
import Heart from '../../../Assets/Images/heart.svg';
import Share from '../../../Assets/Images/share.svg';
import { useNavigate } from 'react-router-dom';

export default function PostList() {
  const navigate = useNavigate();
  const { loading, currentUser } = useSelector(({ auth }) => auth);
  return (
    <>
      {loading && <Loader />}
      <div className="inner_main instagram_account_post_list">
        <div className="comment_picker_wrap">
          <div className="container">
            <div className="comment_picker_inner_wrap">
              <MusicBar />
              <h2 className="mb-3 text-center">
                <img src={InstaUser} alt="" /> Hello, art_illustrator{' '}
              </h2>
              <p className="text-center">Please, select a post</p>
            </div>
            <div className="insta_post_wrappper">
              <div className="row g-4">
                <div
                  className="col-lg-3 col-md-4 col-sm-6"
                  onClick={() => navigate('/comment-picker')}
                >
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="comment_box">
                    <div className="card_content">
                      <div className="comment_img">
                        <img
                          src={YTImage}
                          alt="YTImage"
                          className="img-fluid"
                        />
                      </div>
                      <ul className="comment_social">
                        <li>
                          <img src={Heart} alt="EyesIcon" />
                          <span>05</span>
                        </li>
                        <li>
                          <img src={Comment} alt="CommentIcon" />
                          <span>10</span>
                        </li>
                        <li>
                          <img src={Share} alt="LikeIcon" />
                          <span>30</span>
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
    </>
  );
}
