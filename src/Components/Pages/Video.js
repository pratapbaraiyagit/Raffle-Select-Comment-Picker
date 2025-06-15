import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import round from '../../Assets/Images/round.png';
import video from '../../Assets/Images/CertiVideo.gif';
import '../../Assets/testing_loder/css/style.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getCertificate } from '../../Services/SocialService';

const Video = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [isDivHide, isSetDivHide] = useState(true);
  const [activeClass, setActiveClass] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);

  const { setting, certificateData } = useSelector(({ social }) => social);

  const access_Token = JSON.parse(
    atob(localStorage.getItem('UserPreferences')),
  )?.token;

  // useEffect(() => {
  //   const numberTextElements = document.querySelectorAll('.numberText');
  //   const roundImgElements = document.querySelectorAll(
  //     '.certificate-title .roundImg',
  //   );
  //   const tfwElements = document.querySelectorAll('.certificate-title .tfw');

  //   console.log('numberTextElements', numberTextElements);
  //   // Ensure that you have the expected number of elements
  //   const timeCount = setting?.countDown;
  //   let timing = timeCount;
  //   let root = document.documentElement;
  //   let interval = null;

  //   root.style.setProperty('--count-animate', timeCount);

  //   numberTextElements.forEach(element => {
  //     element.innerText = setting?.countDown;
  //   });

  //   interval = setInterval(() => {
  //     timing--;
  //     numberTextElements.forEach(element => {
  //       console.log('element', element);
  //       element.innerText = timing;
  //     });

  //     if (timing < 1) {
  //       clearInterval(interval);
  //       hide();
  //     }
  //   }, 1000);
  //   const header = document.getElementsByClassName('main_header_wrap');
  //   if (header) {
  //     header[0].style.display = 'none';
  //   }

  //   function hide() {
  //     isSetDivHide(false);
  //     setTimeout(() => {
  //       setActiveClass(true);
  //     }, 1000000);
  //     // }, 5000);
  //     numberTextElements.forEach(element => {
  //       element.style.display = 'none';
  //     });
  //     roundImgElements.forEach(element => {
  //       element.style.display = 'none';
  //     });
  //     tfwElements.forEach(element => {
  //       element.style.opacity = '1';
  //     });
  //   }

  //   return () => {
  //     header[0].style.display = 'block';
  //   };
  // }, [setting]);

  const timerFun = useCallback(() => {
    const numberTextElements = document.querySelectorAll('.numberText');
    const roundImgElements = document.querySelectorAll(
      '.certificate-title .roundImg',
    );
    const tfwElements = document.querySelectorAll('.certificate-title .tfw');

    // Ensure that you have the expected number of elements
    const timeCount = setting?.countDown;
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
  }, []);

  // Add an event listener for the "load" event
  window.addEventListener('load', timerFun);

  // Optionally, you can remove the event listener when your component unmounts
  useEffect(() => {
    const header = document.getElementsByClassName('main_header_wrap');
    if (header) {
      header[0].style.display = 'none';
    }
    return () => {
      window.removeEventListener('load', timerFun);
    };
  }, []);

  const loadData = useCallback(async () => {
    const cid = pathname?.split('/')?.[2];

    if (access_Token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ` + access_Token;
      await dispatch(getCertificate(cid, ''));
    }
  }, [pathname, access_Token]);

  useEffect(() => {
    if (pathname) loadData();
  }, [pathname, access_Token]);

  useEffect(() => {
    if (certificateData) {
      const [path, cid, wid] = pathname?.split('/')?.filter(x => !!x);
      if (wid) {
        const winner = certificateData?.winner?.filter(
          x => x?.id === Number(wid),
        );
        if (winner?.length > 0) setSelectedWinner(winner?.[0]);
      }
    }
  }, [certificateData, pathname]);

  const img = [
    'https://kisna.com/cdn/shop/files/W10226-Y-1_480x.jpg?v=1684906595',
    'https://kisna.com/cdn/shop/files/W50055S-Y-2_480x.jpg?v=1684406462',
    'https://kisna.com/cdn/shop/products/W20146-Y-1_480x.jpg?v=1675673100',
  ];

  return (
    <>
      {certificateData?.video?.id && selectedWinner ? (
        <div className={`animation_video_wrapper`} style={{ margin: '10px' }}>
          {isDivHide ? (
            <div className="countDown_img">
              <div id="number">
                {/* <img src={round} id="round_img" alt="" /> */}
                <div id="round_img">
                  <span></span>
                </div>
                <span className="numberText">{setting?.countDown}</span>
              </div>
            </div>
          ) : (
            <>
              <img src={video} alt="" id="winner-card" />
              <div
                className={`winner_detail_wrapper ${
                  activeClass ? 'active' : ''
                }`}
              >
                <div className="winner_img">
                  <img
                    src={selectedWinner?.authorProfileImageUrl}
                    alt="UserImg"
                  />
                </div>
                <h4>{selectedWinner?.authorDisplayName}</h4>
                <p className="comment_text">{selectedWinner?.textOriginal}</p>
                <p className="m-0">
                  <i>@{certificateData?.video?.channelTitle}</i>
                </p>
                <Link to="/">dualwire.com</Link>
              </div>
            </>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Video;

// http://localhost:3000/video/157/68397
