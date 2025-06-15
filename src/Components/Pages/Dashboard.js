import { useCallback, useEffect, useRef, useState } from 'react';
import YouTube from '../../Assets/Images/youtube.svg';
import calender from '../../Assets/Images/calendar.svg';
import UserVector from '../../Assets/Images/user-vector.svg';
import Comment from '../../Assets/Images/comment.svg';
import More from '../../Assets/Images/more.svg';
import { Select } from 'antd';
import { Dropdown } from 'antd';
import { Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { useDispatch } from 'react-redux';
import {
  deleteCertificate,
  getAllCertificateList,
} from '../../Services/SocialService';
import { useSelector } from 'react-redux';
import { formatDateWithMonth } from '../../Helper/Common';
import { setAllCertificateList } from '../../Store/Reducers/SocialSlice';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../../Components/Common/DeleteModal';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myElementRef = useRef();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setpage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [month, setMonth] = useState('');
  const [agree, setAgree] = useState(false);

  const { socialLoading, allCertificateList } = useSelector(
    ({ social }) => social,
  );

  const handleChange = value => {
    console.log(`selected ${value}`);
  };

  const items = [
    {
      key: '1',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="#!"
          onClick={e => {
            e.preventDefault();
            navigate(`/generate-certificate/${selectedId}`);
          }}
        >
          Edit
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="#!"
          onClick={e => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
        >
          Delete
        </a>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getAllCertificateList(page, month));
  }, [page, month]);

  useEffect(() => {
    return () => dispatch(setAllCertificateList({}));
  }, []);

  useEffect(() => {
    const el = myElementRef.current;
    const handleScroll = () => {
      if (
        el?.scrollTop + el?.offsetHeight >= el?.scrollHeight &&
        !!allCertificateList?.current_page
      ) {
        if (
          allCertificateList?.current_page >=
          Math.ceil(allCertificateList?.total / allCertificateList?.per_page)
        ) {
          setHasMoreData(false);
        } else if (
          allCertificateList?.records?.length < allCertificateList?.total
        ) {
          setpage(page + 1);
        }
      }
    };

    el?.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      el?.removeEventListener('scroll', handleScroll);
    };
  }, [myElementRef, allCertificateList, hasMoreData, page]);

  const onDelete = useCallback(async () => {
    if (selectedId) {
      if (agree) {
        const res = await dispatch(deleteCertificate(selectedId));
        if (res) {
          setIsModalOpen(false);
          setAgree(false);
          setSelectedId('');
          dispatch(setAllCertificateList({}));
          await dispatch(getAllCertificateList(1, month));
          setpage(1);
        }
      } else {
        toast.error('You must agree to delete!');
      }
    }
  }, [agree, selectedId, page, month]);

  return (
    <>
      <div className="dashboard_main_wrap">
        <div className="container">
          <div className="dashboard_inner_wrap">
            <div className="dashboard_select_wrap">
              {!socialLoading && allCertificateList?.records?.length !== 0 && (
                <Row>
                  <Col xl={4} lg={6} sm={8}>
                    <Row>
                      <Col sm={6}>
                        <div className="form-group">
                          <label>Type</label>
                          <Select
                            defaultValue="Youtube Giveaway"
                            style={{
                              width: 120,
                            }}
                            onChange={handleChange}
                            options={[
                              {
                                value: 'All',
                                label: 'All',
                              },
                              {
                                value: 'Instagram Giveaway',
                                label: 'Instagram Giveaway',
                              },
                              {
                                value: 'Facebook Giveaway',
                                label: 'Facebook Giveaway',
                              },
                              {
                                value: 'Random Name Winner',
                                label: 'Random Name Winner',
                              },
                              {
                                value: 'Twitter Giveaway',
                                label: 'Twitter Giveaway',
                              },
                              {
                                value: 'Multi-Network Giveaway',
                                label: 'Multi-Network Giveaway',
                              },
                              {
                                value: 'Tiktok Giveaway',
                                label: 'Tiktok Giveaway',
                              },
                              {
                                value: 'Wheel Decide',
                                label: 'Wheel Decide',
                              },
                              {
                                value: 'Trivia Maker',
                                label: 'Trivia Maker',
                              },
                              {
                                value: 'Youtube Giveaway',
                                label: 'Youtube Giveaway',
                              },
                              {
                                value: 'Random Numbers',
                                label: 'Random Numbers',
                              },
                            ]}
                          />
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="form-group">
                          <label>Date</label>
                          <Select
                            value={month}
                            style={{
                              width: 120,
                            }}
                            onChange={val => {
                              setMonth(val);
                              dispatch(setAllCertificateList({}));
                            }}
                            options={[
                              {
                                value: 3,
                                label: 'Last 3 months',
                              },
                              {
                                value: 6,
                                label: 'Last 6 months',
                              },
                              {
                                value: 12,
                                label: 'Last 12 months',
                              },
                              {
                                value: '',
                                label: 'All Times',
                              },
                            ]}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="create_btn_wrapper d-flex justify-content-end">
                    <button
                      className="btn_primary create_btn"
                      onClick={() => navigate('/')}
                    >
                      Create
                      <span className="material-symbols-outlined arrw_icon">
                        arrow_right_alt
                      </span>
                    </button>
                  </Col>
                </Row>
              )}
            </div>
            <div className="youtube_box_wrap" ref={myElementRef}>
              <ul>
                {allCertificateList?.records?.length > 0
                  ? allCertificateList?.records?.map((x, i) => {
                      return (
                        <li key={i}>
                          <div className="youtube_box">
                            <div className="youtube_box_left">
                              <img
                                src={YouTube}
                                alt="YouTubeIcon"
                                className="w-100"
                              />
                            </div>
                            <div className="youtube_box_right">
                              <div className="youtube_title">
                                <h6>{x?.title}</h6>
                                <ul>
                                  <li>
                                    <img src={calender} alt="CalenderIcon" />
                                    <span>
                                      {formatDateWithMonth(x?.created_at)}
                                    </span>
                                  </li>
                                  <li>
                                    <img src={UserVector} alt="UserIcon" />
                                    <span>{x?.channelTitle}</span>
                                  </li>
                                  <li>
                                    <img src={Comment} alt="CommentIcon" />
                                    <span>{x?.comments}</span>
                                  </li>
                                </ul>
                              </div>
                              <Dropdown
                                menu={{
                                  items,
                                }}
                                trigger={'click'}
                                onOpenChange={() => setSelectedId(x?.id)}
                                placement="bottomLeft"
                                arrow
                              >
                                <a onClick={e => e.preventDefault()}>
                                  <img src={More} alt="MoreIcon" />
                                </a>
                              </Dropdown>
                            </div>
                          </div>
                        </li>
                      );
                    })
                  : !socialLoading && (
                      <div className="text-center">
                        <h3>Create your first Giveaway </h3>
                        <p>
                          Create giveaways for Instagram, Facebook, Tiktok,
                          Lists and more
                        </p>

                        <button
                          className="btn_primary create_btn"
                          onClick={() => navigate('/')}
                        >
                          Create
                          <span className="material-symbols-outlined arrw_icon">
                            arrow_right_alt
                          </span>
                        </button>
                      </div>
                    )}
              </ul>
              {socialLoading && (
                <>
                  <div className="p-4 text-center" style={{ height: '250px' }}>
                    <div className="spinner-border ms-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        setAgree={setAgree}
        agree={agree}
        deleteModal={isModalOpen}
        setDeleteModal={setIsModalOpen}
        onDelete={onDelete}
      />
    </>
  );
}
