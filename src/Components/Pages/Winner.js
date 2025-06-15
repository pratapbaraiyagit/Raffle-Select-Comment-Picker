import { useCallback, useEffect, useRef, useState } from 'react';
// import CountDown from '../../Assets/Images/count-down.gif';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Carousel, Modal } from 'antd';
import LinkIcon from '../../Assets/Images/link.svg';
import TextArea from 'antd/es/input/TextArea';
import Loader from '../../Components/Common/Loader';
import MusicBar from '../../Components/Common/MusicBar';
import round from '../../Assets/Images/round.png';
import '../../Assets/testing_loder/css/style.css';
import { getCertificate, replaceWinner } from '../../Services/SocialService';
import leftArr from '../../Assets/Images/c-left-arrow.svg';
import rightArr from '../../Assets/Images/c-right-arrow.svg';

export default function Winner() {
  const winnerRef = useRef();
  const substituteRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDivHide, isSetDivHide] = useState(true);

  const [winneerModal, setWinneerModal] = useState(false);
  const [replaceModal, setReplaceModal] = useState(false);
  const [selectedCommentor, setSelectedCommentor] = useState({});
  const [reason, setReason] = useState();
  const [isSubstitute, setIsSubstitute] = useState(false);
  const [selectedReplacer, setSelectedReplacer] = useState('');
  const [substituteList, setSubstituteList] = useState([
    { label: 'Select alternate', value: '' },
  ]);
  const [currentWinner, setCurrentWinner] = useState(1);
  const [currentSubstitute, setCurrentSubstitute] = useState(1);

  const {
    socialLoading,
    winnerList,
    videoUrlAfter,
    YTData,
    replaceLoading,
    setting,
    certificateData,
  } = useSelector(({ social }) => social);

  useEffect(() => {
    const timeCount = setting?.countDown;
    let timing = timeCount;
    let root = document.documentElement;
    let interval = null;

    const numberText = document.getElementById('numberText');
    const roundImg = document.getElementById('round_img');
    const tfw = document.getElementById('tfw');
    root.style.setProperty('--count-animate', timeCount);
    if (numberText && roundImg && tfw) {
      numberText.innerText = setting?.countDown;

      interval = setInterval(() => {
        timing--;
        numberText.innerText = `${timing}`;
        if (timing < 1) {
          clearInterval(interval);
          hide();
        }
      }, 1000);

      function hide() {
        isSetDivHide(false);
        numberText.style.display = 'none';
        roundImg.style.display = 'none';
        tfw.style.opacity = '1';
      }
    }
  }, [setting]);

  useEffect(() => {
    if (!winnerList?.certificate_id) {
      navigate('/');
    } else if (winnerList?.substitute?.length > 0)
      setSubstituteList([
        {
          label: 'Select alternate',
          value: '',
        },
        ...winnerList?.substitute?.map(x => ({
          label: x?.authorDisplayName,
          value: x?.id,
        })),
      ]);
  }, [winnerList?.certificate_id, winnerList?.substitute]);

  const onGetCertificate = useCallback(async () => {
    const res = await dispatch(getCertificate(winnerList?.certificate_id, ''));
    if (res) navigate('/generate-certificate');
  }, [winnerList]);

  const onReplaceWinner = useCallback(async () => {
    if (!selectedCommentor?.id && !YTData?.id) return;
    const payload = isSubstitute
      ? {
          substitute_id: selectedCommentor?.id,
          reason: reason,
          certificate_id: winnerList?.certificate_id,
        }
      : {
          winner_id: selectedCommentor?.id,
          reason: reason,
          certificate_id: winnerList?.certificate_id,
        };
    const res = await dispatch(replaceWinner(payload));
    if (res) {
      setReason('');
      setReplaceModal(false);
      setSelectedReplacer('');
      setWinneerModal(false);
    }
  }, [
    selectedReplacer,
    isSubstitute,
    reason,
    selectedCommentor,
    YTData,
    winnerList,
  ]);

  const handleNext = useCallback(
    type => {
      if (type === 'w') winnerRef.current?.next();
      else substituteRef.current?.next();
    },
    [winnerRef, substituteRef],
  );

  const handlePrev = useCallback(
    type => {
      if (type === 'w') winnerRef.current?.prev();
      else substituteRef.current?.prev();
    },
    [winnerRef, substituteRef],
  );

  return (
    <>
      {socialLoading && <Loader />}
      <div className="inner_main">
        {isDivHide && (
          <div className="countDown_img">
            <div id="number">
              {/* <img src={round} id="round_img" alt="" /> */}
              <div id="round_img">
                <span></span>
              </div>
              <span id="numberText">100</span>
            </div>
          </div>
        )}
        <div id="tfw">
          {!isDivHide && (
            <div
              className={`congratulations_wrap ${!isDivHide ? 'active' : ''}`}
            >
              <div className="container">
                <div className="congratulations_inner_wrap text-center">
                  <h2 className="mb-2">🥳Congratulations!!</h2>
                  <h6 className="mb-3">{setting?.title}</h6>
                  <MusicBar />
                  <div className="row mb-3">
                    <div
                      className={
                        winnerList?.substitute ? `col-md-6` : `col-md-12`
                      }
                    >
                      <div className="winner_wrapper">
                        <h3 className="mb-3">Winners</h3>

                        <Carousel
                          ref={winnerRef}
                          dots={false}
                          beforeChange={(current, next) => {
                            setCurrentWinner(next + 1);
                          }}
                          Carousel={true}
                        >
                          {winnerList?.winner?.map((x, i) => {
                            return (
                              <div className="winner_wrapper_innner" key={i}>
                                <div className="cng_img_wrap">
                                  <img src={x?.authorProfileImageUrl} alt="" />
                                </div>
                                <h3 className="mb-3">
                                  {x?.authorDisplayName}{' '}
                                  <Button
                                    className="btn_transparent"
                                    onClick={() => {
                                      setIsSubstitute(false);
                                      setSelectedCommentor(x);
                                      setWinneerModal(true);
                                    }}
                                  >
                                    <img src={LinkIcon} alt="" />
                                  </Button>
                                </h3>
                                <p>{x?.textOriginal}</p>
                                <ul className="hastag_wrap">
                                  {x?.textOriginal
                                    ?.match(/#[a-z]+/gi)
                                    ?.map((x, i) => (
                                      <li key={i}>{x}</li>
                                    ))}
                                </ul>
                              </div>
                            );
                          })}
                        </Carousel>
                        <button onClick={() => handlePrev('w')}>
                          <img
                            src={leftArr}
                            alt=""
                            className="left_arrow slider_arrow"
                          />
                        </button>
                        {currentWinner}
                        <button onClick={() => handleNext('w')}>
                          <img
                            src={rightArr}
                            alt=""
                            className="slider_arrow right_arrow"
                          />
                        </button>
                      </div>
                    </div>
                    {winnerList?.substitute?.length > 0 && (
                      <div className="col-md-6">
                        <div className="winner_wrapper">
                          <h3 className="mb-3">Substitutes</h3>
                          <Carousel
                            dots={false}
                            beforeChange={(current, next) => {
                              setCurrentSubstitute(next + 1);
                            }}
                            ref={substituteRef}
                          >
                            {winnerList?.substitute?.map((x, i) => {
                              return (
                                <div className="winner_wrapper_innner" key={i}>
                                  <div className="cng_img_wrap">
                                    <img
                                      src={x?.authorProfileImageUrl}
                                      alt=""
                                    />
                                  </div>
                                  <h3 className="mb-3">
                                    {x?.authorDisplayName}{' '}
                                    <Button
                                      className="btn_transparent"
                                      onClick={() => {
                                        setIsSubstitute(true);
                                        setSelectedCommentor(x);
                                        setWinneerModal(true);
                                      }}
                                    >
                                      <img src={LinkIcon} alt="" />
                                    </Button>
                                  </h3>
                                  <p>{x?.textOriginal}</p>
                                  <ul className="hastag_wrap">
                                    {x?.textOriginal
                                      ?.match(/#[a-z]+/gi)
                                      ?.map((x, i) => (
                                        <li key={i}>{x}</li>
                                      ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </Carousel>
                          <button onClick={() => handlePrev('s')}>
                            <img
                              src={leftArr}
                              alt=""
                              className="left_arrow slider_arrow"
                            />
                          </button>
                          {currentSubstitute}
                          <button
                            onClick={() => handleNext('s')}
                            className="right_arrow slider_arrow"
                          >
                            <img src={rightArr} alt="" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className="btn_primary notranslate mb-4"
                    onClick={onGetCertificate}
                  >
                    Get Certificate
                    <span className="material-symbols-outlined arrw_icon">
                      arrow_right_alt
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal
          title=""
          centered
          open={winneerModal}
          onCancel={() => setWinneerModal(false)}
          footer={false}
          className="winner_popup"
        >
          <div className="winner_wrapper_innner text-center">
            <div className="cng_img_wrap">
              <img src={selectedCommentor?.authorProfileImageUrl} alt="" />
            </div>
            <h3 className="mb-3">{selectedCommentor?.authorDisplayName}</h3>
            <p>{selectedCommentor?.textOriginal}</p>
            <ul className="hastag_wrap">
              {selectedCommentor?.textOriginal
                ?.match(/#[a-z]+/gi)
                ?.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
            </ul>
            <a
              href={`https://www.youtube.com/channel/${selectedCommentor?.authorChannelId}`}
              target="blank"
              className="btn_primary notranslate mb-3 w-100 notranslate"
            >
              Go to Profile
              <span className="material-symbols-outlined arrw_icon">
                arrow_right_alt
              </span>
            </a>
            <a
              className="btn_primary notranslate mb-3 w-100 notranslate"
              href={`${videoUrlAfter}`}
              target="blank"
            >
              Go to Comment
              <span className="material-symbols-outlined arrw_icon">
                arrow_right_alt
              </span>
            </a>
            <div className="text-center">
              <Button
                className="btn_transparent btn_replace"
                onClick={() => {
                  setReplaceModal(true);
                  setWinneerModal(false);
                }}
              >
                Replace
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          title={`🎖 Replace ${isSubstitute ? 'Substitute' : 'Winner'}!!`}
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
              <label>Reason</label>
              <TextArea
                rows={4}
                placeholder="Substitution reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
              <small>It will be visible in the certificate of validity.</small>
            </div>
            <div className="button_group d-flex justify-content-between align-content-center">
              <button
                className="btn_primary notranslate"
                onClick={onReplaceWinner}
              >
                {isSubstitute ? 'Delete' : 'Replace'}
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
                  setSelectedCommentor({});
                  setReplaceModal();
                  setSelectedReplacer('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
