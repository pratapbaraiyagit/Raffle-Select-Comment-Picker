import { Col, Row } from 'react-bootstrap';
import YouTube from '../../Assets/Images/youtube.svg';
import { useLocation } from 'react-router-dom';
import Logo from '../../Assets/Images/logo.svg';
import Sticker from '../../Assets/Images/sticker.png';
import DualText from '../../Assets/Images/dual-wire-text.svg';
import YouTubeBlack from '../../Assets/Images/youtube-black.svg';
import { useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCertificate } from '../../Services/SocialService';
import Loader from '../../Components/Common/Loader';
import { formattedDate, getShortNumber } from '../../Helper/Common';

export default function Certificate() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const { socialLoading, YTData, certificateData } = useSelector(
    ({ social }) => social,
  );

  const loadData = useCallback(async () => {
    const cid = pathname?.split('/')?.[2];
    await dispatch(getCertificate('', cid));
  }, [pathname]);

  useEffect(() => {
    if (pathname) loadData();
  }, [pathname]);

  return (
    <>
      {socialLoading && <Loader />}
      <div className="inner_main">
        <div className="certificate_wrap">
          <div className="container">
            <Row className="justify-content-center">
              <Col xl={6} lg={10}>
                <div className="giveway_wrap">
                  <div className="card_white">
                    <div className="card_header text-center">
                      <h5 className="m-0">Certificate of Giveaway 🎊</h5>
                    </div>
                    <div className="card_content p-0">
                      <div className="p-3 border_bottom">
                        <h5 className="fw_400 m-0">
                          {certificateData?.video?.title}
                        </h5>
                      </div>
                      <div className="youtube_detail_wrap p-3 mb-0">
                        <Row className="g-3">
                          <Col md={6}>
                            <label>Type</label>
                            <p className="text_small m-0">
                              <img
                                src={YouTube}
                                alt="YoutubeIocn"
                                className="me-2"
                              />
                              Youtube Giveaway
                            </p>
                          </Col>
                          <Col md={3}>
                            <label>Author</label>
                            <a
                              href=""
                              target="blank"
                              className="text-decoration-underline text_blue"
                            >
                              {YTData?.channelTitle}
                            </a>
                          </Col>
                          <Col md={3}>
                            <label>Participants</label>
                            <span>
                              {getShortNumber(
                                certificateData?.video?.statistics
                                  ?.commentCount,
                              )}
                            </span>
                          </Col>
                          <Col md={6}>
                            <label>Post</label>
                            <a
                              href={`https://www.youtube.com/watch?v=${certificateData?.video?.video_id}`}
                              target="blank"
                              className="text-decoration-underline text_blue"
                            >
                              youtu.be/
                              {certificateData?.video?.channelId}
                            </a>
                          </Col>
                          <Col md={6}>
                            <label>Date</label>
                            <span>
                              {formattedDate(
                                certificateData?.video?.created_at,
                              )}
                            </span>
                          </Col>
                        </Row>
                      </div>
                      <div
                        className={`youtube_user_wrap certificate_user_wrapper bg_light p-3 d-block  ${
                          typeof certificateData?.certificate?.filter?.color ===
                          'string'
                            ? certificateData?.certificate?.filter?.color
                            : ''
                        }`}
                        style={{
                          backgroundColor:
                            typeof certificateData?.certificate?.filter
                              ?.color === 'object' &&
                            `rgb(${certificateData?.certificate?.filter?.color?.r}, ${certificateData?.certificate?.filter?.color?.g}, ${certificateData?.certificate?.filter?.color?.b})`,
                        }}
                      >
                        <Row>
                          <Col lg={6}>
                            <div className="winners_main_div">
                              <div className="winner_header">
                                <h5 className="m-0">Winners 🏆</h5>
                              </div>
                              <ul>
                                {certificateData?.winner?.map((x, i) => {
                                  return (
                                    <li key={i}>
                                      <div className="winners_profile_wrapper">
                                        <div className="winner_picture">
                                          <img
                                            className="rounded-circle"
                                            src={x?.authorProfileImageUrl}
                                          />
                                        </div>
                                        <div className="winner_name">
                                          <h6>{x?.authorDisplayName}</h6>
                                        </div>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </Col>
                          {certificateData?.substitute?.length > 0 && (
                            <Col lg={6}>
                              <div className="winners_main_div">
                                <div className="winner_header">
                                  <h5 className="m-0">Alternates 🎖</h5>
                                </div>
                                <ul>
                                  {certificateData?.substitute?.map((x, i) => {
                                    return (
                                      <li key={i}>
                                        <div className="winners_profile_wrapper">
                                          <div className="winner_picture">
                                            <img
                                              className="rounded-circle"
                                              src={x?.authorProfileImageUrl}
                                            />
                                          </div>
                                          <div className="winner_name">
                                            <h6>{x?.authorDisplayName}</h6>
                                          </div>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </Col>
                          )}
                        </Row>
                        <div className="giveaway_bedge">
                          <img src={Sticker} className="sticker" alt="" />
                          <img src={DualText} className="dual_text" alt="" />
                          <img
                            src={YouTubeBlack}
                            className="yourtube_icon"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="copyright_wrap">
                        <Row className="align-items-center">
                          <Col sm={5}>
                            <div className="bottom_logo">
                              <img src={Logo} alt="" />
                            </div>
                          </Col>
                          <Col sm={7}>
                            <p className="small m-0">
                              Certified by dualwire.com
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
