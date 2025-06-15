import { useEffect, useRef, useState } from 'react';
import Edit from '../../Assets/Images/edit.svg';
import Delete from '../../Assets/Images/delete.svg';
import youtube from '../../Assets/Images/youtube.svg';
import Camera from '../../Assets/Images/camera.svg';
import Video from '../../Assets/Images/video.svg';
import Copy from '../../Assets/Images/copy.svg';
import YouTube from '../../Assets/Images/youtube.svg';
import Send from '../../Assets/Images/send.svg';
import Comment from '../../Assets/Images/comment.svg';
import Replace from '../../Assets/Images/replace.svg';
import AnimationImg from '../../Assets/Images/animation-img.jpg';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { Tooltip, Modal, Carousel, Select, Input } from 'antd';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import copy from 'copy-to-clipboard';
import {
  formattedDate,
  getShortNumber,
  toastCongig,
} from '../../Helper/Common';
import { useSelector } from 'react-redux';
import { toJpeg } from 'html-to-image';
import Loader from '../../Components/Common/Loader';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch } from 'react-redux';
import {
  changeTitleOfCertificate,
  deleteCertificate,
  getCertificate,
  replaceWinner,
} from '../../Services/SocialService';
import video from '../../Assets/Images/CertiVideo.gif';
import round from '../../Assets/Images/round.png';
import '../../Assets/testing_loder/css/style.css';
import { downloadVideo } from '../../Services/CommonService';
import DeleteModal from '../../Components/Common/DeleteModal';
import { setCertificateData } from '../../Store/Reducers/SocialSlice';
// import Insta from '../../Assets/Images/insta.svg';
// import AnuimationGif from '../../Assets/Images/animation-certificate.gif';
// import UserImg from '../../Assets/Images/cng-img.jpg';

const commentStr =
  '--- GIVEAWAY ENDED --- The winners are: \n1. ChinaBatMan\nCertified by @Raffle Select (Code ENGKO8)';
export default function GenerateCertificate() {
  const { c_id } = useParams();
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isDivHide, isSetDivHide] = useState(true);
  const [commentModal, setCommentModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [replaceModal, setReplaceModal] = useState(false);
  const [activeClass, setActiveClass] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [imageWinner, setImageWinner] = useState(null);
  const [selectedCommentor, setSelectedCommentor] = useState({});
  const [selectedReplacer, setSelectedReplacer] = useState('');
  const [substituteList, setSubstituteList] = useState([]);
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState(commentStr);
  const [title, setTitle] = useState('');

  const {
    socialLoading,
    setting,
    certificateData,
    YTData,
    winnerList,
    replaceLoading,
  } = useSelector(({ social }) => social);

  const { loading } = useSelector(({ common }) => common);

  useEffect(() => {
    dispatch(getCertificate(c_id, ''));
  }, [c_id]);

  useEffect(() => {
    const winners = certificateData?.winner?.map(x => x?.authorDisplayName);

    if (winners?.length > 0) {
      let wStr = '';

      for (let i = 0; i < winners?.length; i++) {
        wStr += `${i + 1}. ${winners?.[i]}\n`;
      }

      const str = `--- GIVEAWAY ENDED --- The winners are: \n${wStr}Certified by @Raffle Select (Code ${certificateData?.certificate?.certificate_code})`;
      setComment(str);
    }
  }, [certificateData]);

  useEffect(() => {
    if (!certificateData?.video?.channelId && !c_id) {
      navigate('/');
    } else {
      if (certificateData && certificateData?.substitute?.length > 0) {
        setSubstituteList([
          { label: 'Select alternate', value: '' },
          ...certificateData?.substitute?.map(x => ({
            label: x?.authorDisplayName,
            value: x?.id,
          })),
        ]);
        setSelectedWinner(certificateData?.winner[0]?.id);
      }
    }
  }, [certificateData, c_id]);

  const onDownloadVideo = useCallback(async () => {
    const url = await dispatch(
      downloadVideo(
        certificateData?.certificate?.certificate_id,
        selectedWinner || certificateData?.winner?.[0]?.id,
        certificateData?.certificate?.filter?.count,
      ),
    );
    if (url) window.location.href = url;
  }, [selectedWinner, certificateData]);

  const onDownloadImage = useCallback(() => {
    if (imageRef.current === null) return;

    toJpeg(imageRef.current, { cacheBust: true })
      .then(dataUrl => {
        let link = document.createElement('a');
        link.download = 'Winner.jpg';
        link.href = dataUrl;
        link.crossorigin = 'anonymous';
        link.click();
      })
      .catch(err => {
        console.log(err);
        toast.error('Unable to download image, please try again later');
      });
  }, [imageRef]);

  const onChangeTitle = useCallback(async () => {
    const payload = {
      certificate_id: winnerList?.certificate_id || c_id,
      title: title,
    };
    const res = await dispatch(changeTitleOfCertificate(payload));
    if (res) {
      setEditModal(false);
      let data = { ...JSON.parse(JSON.stringify(certificateData)) };
      data.certificate.title = title;
      data.video.title = title;
      dispatch(setCertificateData(data));
    }
  }, [winnerList, title, certificateData, c_id]);

  const onDelete = useCallback(async () => {
    if (certificateData?.certificate?.certificate_id) {
      if (agree) {
        const res = await dispatch(
          deleteCertificate(certificateData?.certificate?.certificate_id),
        );
        if (res) {
          setDeleteModal(false);
          setAgree(false);
          navigate('/');
        }
      } else {
        toast.error('You must agree to delete!');
      }
    }
  }, [certificateData, agree]);

  const onCopy = useCallback(text => {
    const res = copy(text, {
      debug: false,
      message: 'Tap to copy',
    });
    if (res) toast('Text copied to clipboard', toastCongig);
    else toast.error('Failed to copy Text', toastCongig);
  }, []);

  const onReplaceWinner = useCallback(async () => {
    if (!selectedCommentor?.id && !YTData?.id) return;
    const payload = {
      winner_id: selectedCommentor?.id,
      substitute_id: selectedReplacer,
      certificate_id: winnerList?.certificate_id,
    };
    const res = await dispatch(replaceWinner(payload));
    if (res) {
      setReason('');
      setReplaceModal(false);
      setSelectedReplacer('');
      await dispatch(getCertificate(winnerList?.certificate_id, ''));
    }
  }, [selectedReplacer, selectedCommentor, YTData, winnerList]);

  useEffect(() => {
    const numberTextElements = document.querySelectorAll('.numberText');
    const roundImgElements = document.querySelectorAll(
      '.certificate-title .roundImg',
    );
    const tfwElements = document.querySelectorAll('.certificate-title .tfw');

    // Ensure that you have the expected number of elements
    const timeCount =
      setting?.countDown || certificateData?.certificate?.filter?.count;
    let timing = timeCount;
    let root = document.documentElement;
    let interval = null;

    root.style.setProperty('--count-animate', timeCount);

    numberTextElements.forEach(element => {
      element.innerText = setting?.countDown;
    });

    interval = setInterval(() => {
      timing--;
      numberTextElements.forEach(element => {
        element.innerText = timing;
      });

      if (timing < 1) {
        clearInterval(interval);
        hide();
      }
    }, 1000);

    function hide() {
      isSetDivHide(false);
      setTimeout(() => {
        setActiveClass(true);
      }, 5000);
      numberTextElements.forEach(element => {
        element.style.display = 'none';
      });
      roundImgElements.forEach(element => {
        element.style.display = 'none';
      });
      tfwElements.forEach(element => {
        element.style.opacity = '1';
      });
    }
  }, [setting, certificateData]);

  return (
    <>
      {socialLoading && <Loader />}
      <div className="inner_main certificate_main_wrap">
        <div className="certificate_wrap">
          <div className="container">
            <Row className="justify-content-center">
              <Col xxl={10} xl={12} lg={8} md={10}>
                <Row>
                  <Col xl={6} lg={12}>
                    <div className="certificate_left mb-3">
                      <div className="card_white">
                        <div className="card_header d-flex justify-content-between align-items-center">
                          <h5 className="youtube_title">
                            {certificateData?.certificate?.title ||
                              certificateData?.video?.title}
                          </h5>
                          <ul className="d-flex" style={{ minWidth: '55px' }}>
                            <li>
                              <button
                                className="btn_transparent"
                                onClick={() => {
                                  setEditModal(true);
                                  setTitle(
                                    certificateData?.certificate?.title ||
                                      certificateData?.video?.title,
                                  );
                                }}
                              >
                                <img src={Edit} alt="EditIcon" />
                              </button>
                            </li>
                            <li className="ms-2">
                              <button
                                className="btn_transparent"
                                onClick={() => setDeleteModal(true)}
                              >
                                <img src={Delete} alt="DeleteIcon" />
                              </button>
                            </li>
                          </ul>
                        </div>
                        <div className="card_header">
                          <h4 className="m-0">Announce the winners 🎊</h4>
                        </div>
                        <div className="card_content">
                          <div className="comment_wrap">
                            <div className="insta_comment_title d-flex align-items-start">
                              <img
                                src={youtube}
                                alt="InstaIcon"
                                className="me-2"
                              />
                              <div className="comment_title mb-2">
                                <h6 className="m-0">Post a comment</h6>
                                <p className="text_small">
                                  Comment on the giveaway post mentioning the
                                  winners
                                </p>
                              </div>
                            </div>
                            <button
                              className="btn_primary ms-auto d-flex notranslate"
                              onClick={() => setCommentModal(true)}
                            >
                              Comments
                              <span className="material-symbols-outlined arrw_icon">
                                arrow_right_alt
                              </span>
                            </button>
                          </div>

                          <div className="animation_wrap">
                            <div className="row gx-md-5 gx-4">
                              {/* <div className="row"> */}
                              <div className="col-sm-6 col-12">
                                <div className="animation_inner_wrap">
                                  <div className="d-flex align-items-center mb-3">
                                    <img
                                      src={Camera}
                                      alt="CameraIcon"
                                      className="me-2"
                                    />
                                    <div className="animation_title">
                                      <h6 className="m-0">
                                        Story Certificate (.jpg)
                                      </h6>
                                      <button
                                        className="border border-0 bg-white p-0 text-decoration-underline text_blue"
                                        onClick={onDownloadImage}
                                      >
                                        Download Image
                                      </button>
                                    </div>
                                  </div>
                                  <Carousel
                                    arrows
                                    afterChange={num => {
                                      setImageWinner(
                                        certificateData?.winner?.[num]?.id,
                                      );
                                    }}
                                  >
                                    {certificateData?.winner?.map((x, i) => {
                                      return (
                                        <div
                                          key={i}
                                          className="animation_image_wrapper"
                                          ref={
                                            imageWinner === x?.id ||
                                            certificateData?.winner?.[0]?.id ===
                                              x?.id
                                              ? imageRef
                                              : undefined
                                          }
                                        >
                                          <img src={AnimationImg} alt="" />
                                          <div className="winner_detail_wrapper active">
                                            <div className="winner_img">
                                              <img
                                                src={x?.authorProfileImageUrl}
                                                alt="UserImg"
                                              />
                                            </div>
                                            <h4>{x?.authorDisplayName}</h4>
                                            <p className="comment_text">
                                              {x?.textOriginal}
                                            </p>
                                            <p className="m-0">
                                              <i>
                                                @
                                                {
                                                  certificateData?.video
                                                    ?.channelTitle
                                                }
                                              </i>
                                            </p>
                                            <Link to="/">dualwire.com</Link>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </Carousel>
                                </div>
                              </div>
                              <div className="col-sm-6 col-12">
                                <div className="animation_inner_wrap">
                                  <div className="d-flex align-items-center mb-3">
                                    <img
                                      src={Video}
                                      alt="VideoIcon"
                                      className="me-2"
                                    />
                                    <div className="animation_title">
                                      <h6 className="m-0">
                                        Story Animation (.mp4)
                                      </h6>
                                      <button
                                        className="text-decoration-underline text_blue"
                                        onClick={onDownloadVideo}
                                        role="link"
                                        style={{
                                          border: 'none',
                                          backgroundColor: 'transparent',
                                        }}
                                      >
                                        Download Video
                                      </button>
                                    </div>
                                  </div>
                                  <Carousel
                                    arrows
                                    afterChange={num => {
                                      setSelectedWinner(
                                        certificateData?.winner?.[num]?.id,
                                      );
                                    }}
                                  >
                                    {certificateData?.winner?.map((x, i) => {
                                      return (
                                        <div
                                          className="animation_video_wrapper"
                                          key={i}
                                        >
                                          {isDivHide ? (
                                            <div className="countDown_img">
                                              <div id="number">
                                                <img
                                                  src={round}
                                                  id="round_img"
                                                  alt=""
                                                />
                                                {/* <div id='round_img'><span></span></div> */}
                                                <span className={`numberText`}>
                                                  3
                                                </span>
                                              </div>
                                            </div>
                                          ) : (
                                            <>
                                              <img
                                                src={video}
                                                alt=""
                                                id="winner-card"
                                              />
                                              <div
                                                className={`winner_detail_wrapper ${
                                                  activeClass ? 'active' : ''
                                                }`}
                                              >
                                                <div className="winner_img">
                                                  <img
                                                    src={
                                                      x?.authorProfileImageUrl
                                                    }
                                                    alt="UserImg"
                                                  />
                                                </div>
                                                <h4>{x?.authorDisplayName}</h4>
                                                <p className="comment_text">
                                                  {x?.textOriginal}
                                                </p>
                                                <p className="m-0">
                                                  <i>
                                                    @
                                                    {
                                                      certificateData?.video
                                                        ?.channelTitle
                                                    }
                                                  </i>
                                                </p>
                                                <Link to="/">dualwire.com</Link>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </Carousel>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xl={6} lg={12}>
                    <div className="certificate_right mb-3">
                      {/* Certificate of validity */}
                      {/* <div className="validity_wrap mb-3">
                        <div className="card_white">
                          <div className="card_header">
                            <h5 className="m-0">Certificate of Validity 🎖</h5>
                            <p className="text_small m-0">
                              Share the following link with your followers to
                              check the certificate public page.
                            </p>
                          </div>
                          <div className="card_content">
                            <h6>Certificate Page</h6>
                            <Link
                              to={`/w/${certificateData?.certificate?.certificate_code}`}
                              className="text_blue"
                            >
                              <span className="me-2 text-decoration-underline">
                                dualwire.com/w/
                                {certificateData?.certificate?.certificate_code}
                              </span>
                            </Link>
                            <img
                              src={Copy}
                              role="button"
                              alt="CopyIcon"
                              onClick={() =>
                                onCopy(
                                  `dualwire.com/w/${certificateData?.certificate?.certificate_code}`,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div> */}
                      <div className="giveway_wrap">
                        <div className="card_white">
                          <div className="card_header">
                            <h5 className="m-0">Giveaway Details 📜</h5>
                          </div>
                          <div className="card_content">
                            <div className="youtube_detail_wrap">
                              <Row className="g-3">
                                <Col md={6}>
                                  <label>Type</label>
                                  <div className="youtube_img">
                                    <img
                                      src={YouTube}
                                      alt="YoutubeIocn"
                                      className="me-2"
                                    />
                                    Youtube Giveaway
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <label>Author</label>
                                  <a
                                    href={`https://www.youtube.com/channel/${certificateData?.video?.channelId}`}
                                    target="blank"
                                    className="text-decoration-underline text_blue"
                                  >
                                    {certificateData?.video?.channelTitle}
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
                                    target="blank"
                                    href={`https://www.youtube.com/watch?v=${certificateData?.video?.video_id}`}
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
                                              <ul>
                                                <li>
                                                  <Tooltip
                                                    placement="bottomLeft"
                                                    title="Replace"
                                                    onClick={() => {
                                                      setReplaceModal(true);
                                                      setSelectedCommentor(x);
                                                    }}
                                                  >
                                                    <button className="btn_transparent">
                                                      <img
                                                        src={Replace}
                                                        alt="SendIcon"
                                                      />
                                                    </button>
                                                  </Tooltip>
                                                </li>
                                                <li>
                                                  <Tooltip
                                                    placement="bottomLeft"
                                                    title={x?.textOriginal}
                                                  >
                                                    <button className="btn_transparent">
                                                      <img
                                                        src={Comment}
                                                        alt="SendIcon"
                                                        className="ms-2"
                                                      />
                                                    </button>
                                                  </Tooltip>
                                                </li>
                                                <li>
                                                  <Tooltip
                                                    placement="bottomLeft"
                                                    title={`youtube.com/channel/${x?.authorChannelId}`}
                                                  >
                                                    <a
                                                      className="btn_transparent"
                                                      href={`https://www.youtube.com/channel/${x?.authorChannelId}`}
                                                      target="blank"
                                                    >
                                                      <img
                                                        src={Send}
                                                        alt="SendIcon"
                                                        className="ms-2"
                                                      />
                                                    </a>
                                                  </Tooltip>
                                                </li>
                                              </ul>
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
                                      {certificateData?.substitute?.map(
                                        (x, i) => {
                                          return (
                                            <li key={i}>
                                              <div className="winners_profile_wrapper">
                                                <div className="winner_picture">
                                                  <img
                                                    className="rounded-circle"
                                                    src={
                                                      x?.authorProfileImageUrl
                                                    }
                                                  />
                                                </div>
                                                <div className="winner_name">
                                                  <h6>
                                                    {x?.authorDisplayName}
                                                  </h6>
                                                  <ul>
                                                    <li>
                                                      <Tooltip
                                                        placement="bottomLeft"
                                                        title={x?.textOriginal}
                                                      >
                                                        <button className="btn_transparent">
                                                          <img
                                                            src={Comment}
                                                            alt="SendIcon"
                                                            className="ms-2"
                                                          />
                                                        </button>
                                                      </Tooltip>
                                                    </li>
                                                    <li>
                                                      <Tooltip
                                                        placement="bottomLeft"
                                                        title={`youtube.com/channel/${x?.authorChannelId}`}
                                                      >
                                                        <a
                                                          className="btn_transparent"
                                                          href={`https://www.youtube.com/channel/${x?.authorChannelId}`}
                                                          target="blank"
                                                        >
                                                          <img
                                                            src={Send}
                                                            alt="SendIcon"
                                                            className="ms-2"
                                                          />
                                                        </a>
                                                      </Tooltip>
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            </li>
                                          );
                                        },
                                      )}
                                    </ul>
                                  </div>
                                </Col>
                              )}
                            </Row>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Modal
        title={`💖 Communicate the winners`}
        centered
        open={commentModal}
        onCancel={() => {
          setCommentModal(false);
          setComment(commentStr);
        }}
        footer={false}
        className="replace_popup"
      >
        <div className="replace_modal_Wrapper">
          <p className="text-center">
            Copy and paste the comment on your social networks{' '}
          </p>
          <div className="form_group">
            <TextArea
              rows={4}
              placeholder="--- GIVEAWAY ENDED --- The winners are: 
                           1. ChinaBatMan
                           Certified by @Raffle Select (Code ENGKO8)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <div className="button_group d-flex justify-content-center align-content-center">
            <button
              className="btn_primary notranslate post-comment"
              onClick={() => onCopy(comment)}
            >
              <img src={Copy} alt="CopyIcon" className="pe-2" />
              Copy
              <span className="material-symbols-outlined arrw_icon">
                arrow_right_alt
              </span>
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        title={`🎖 Replace`}
        centered
        open={replaceModal}
        onCancel={() => {
          setReplaceModal(false);
          setSelectedCommentor({});
          setReason('');
        }}
        footer={false}
        className="replace_popup"
      >
        <div className="replace_modal_Wrapper">
          <p className="text-center">
            Do you want to replace the winner{' '}
            <b>{selectedCommentor?.authorDisplayName}</b> with an alternate?
          </p>
          <div className="form_group">
            <label>Replace with</label>
            <Select
              value={selectedReplacer}
              options={substituteList}
              onChange={setSelectedReplacer}
            />
          </div>
          <div className="form_group">
            <label>Reason</label>
            <TextArea
              rows={4}
              placeholder="Substitution reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
          <div className="button_group d-flex justify-content-between align-content-center">
            <button
              className="btn_primary notranslate"
              onClick={onReplaceWinner}
            >
              Replace
              {replaceLoading ? (
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
            <button
              className="btn_border"
              onClick={() => {
                setReason('');
                setReplaceModal(false);
                setSelectedCommentor({});
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <DeleteModal
        setAgree={setAgree}
        agree={agree}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        onDelete={onDelete}
      />
      <Modal
        title="✍ Edit"
        centered
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={false}
        className="help_modal"
      >
        <div className="form_group">
          <label>Title</label>
          <Input
            placeholder="Substitution reason"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="btn_group">
          <ul className="d-flex justify-content-between align-items-center p-3">
            <li className="me-4">
              <button
                className="btn_border notranslate"
                style={{ fontSize: '16px' }}
                onClick={() => {
                  setEditModal(false);
                  setTitle('');
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </li>
            <li>
              <button
                className="btn_primary notranslate"
                onClick={onChangeTitle}
                disabled={loading}
              >
                Save Changes{' '}
                {loading ? (
                  <div className="spinner-border ms-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <span className="material-symbols-outlined arrw_icon">
                    arrow_right_alt
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
}
