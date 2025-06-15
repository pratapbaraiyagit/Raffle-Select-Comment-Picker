import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getCommentsYTVideo,
  getFilteredComment,
  getWinners,
} from '../../Services/SocialService';
import {
  setBrandImage,
  setSettings,
  setColorClass,
} from '../../Store/Reducers/SocialSlice';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Question from '../../Assets/Images/question.svg';
import whiteQuestion from '../../Assets/Images/white-question.svg';
import Refresh from '../../Assets/Images/refresh.svg';
import WhiteRefresh from '../../Assets/Images/white_refresh.svg';
import defaultImage from '../../Assets/Images/brand-Img.svg';
import Participants from '../../Assets/Images/participats.png';
import { Button, Input, InputNumber, Modal, Select, Space, Switch } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Collapse } from 'antd';
import Loader from '../../Components/Common/Loader';
import { uploadFile } from '../../Services/CommonService';
import { toast } from 'react-toastify';
import { ColorPicker } from 'antd';

const items = [
  {
    key: '1',
    label: 'Number of Winners',
    children: (
      <p className="text_small m-0">
        The number of winners you want to obtain. From 1 to 99.
      </p>
    ),
  },
  {
    key: '2',
    label: 'Number of Substitutes',
    children: (
      <p className="text_small m-0">
        The number of substitutes you want to obtain. From 1 to 99.
      </p>
    ),
  },
  {
    key: '3',
    label: 'Exclude Duplicates',
    children: (
      <p className="text_small m-0">
        This filter should be applied when you want all participants to have the
        same chance of winning without taking into account the number of times
        they comment on your post.
      </p>
    ),
  },
  {
    key: '4',
    label: 'Extra Chances',
    children: (
      <p className="text_small m-0">
        Manually enter new participants or extra chances by Stories. You can add
        emails, names, or usernames, whatever allow you to identify the entrant
        in case of win.
      </p>
    ),
  },
  {
    key: '5',
    label: 'Block List',
    children: (
      <p className="text_small m-0">
        Exclude users from the list of comments / participants.
      </p>
    ),
  },
  {
    key: '6',
    label: 'Branding',
    children: (
      <p className="text_small m-0">
        Use the Logo Upload and background colors to showcase your brand
        identity.
      </p>
    ),
  },
  // {
  //   key: '3',
  //   label: '＃ Number of Mentions',
  //   children: (
  //     <p className="text_small m-0">
  //       This filter should be applied when you ask those participating in your
  //       giveaway to tag their friends or Instagram contacts. You can set the
  //       number of tags required and make sure the winner fulfills this
  //       condition.
  //     </p>
  //   ),
  // },
  // {
  //   key: '4',
  //   label: 'Filtering by #hashtag',
  //   children: (
  //     <p className="text_small m-0">
  //       You should apply this filter when one of your contest’s conditions is to
  //       type a #hashtag on the comment section.
  //     </p>
  //   ),
  // },
  // {
  //   key: '5',
  //   label: 'Filtering by @tags',
  //   children: (
  //     <p className="text_small m-0">
  //       This filter is useful when you ask those taking part in your contest to
  //       @Tag a specific account. You can automatically dismiss all participants
  //       that don’t meet this requirement.
  //     </p>
  //   ),
  // },
  {
    key: '7',
    label: 'Countdown',
    children: (
      <p className="text_small m-0">
        The number (in seconds) to display the winners on the screen.
      </p>
    ),
  },
];

export default function Settings() {
  const myElementRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { TextArea } = Input;

  const [helpModal, setHelpModal] = useState(false);
  const [activeColor, setActiveColor] = useState('');

  const {
    socialLoading,
    participantsLoading,
    YTData,
    YTCommentsList,
    setting,
    brandImage,
    colorClass,
    allCommentersList,
  } = useSelector(({ social }) => social);
  const { loading } = useSelector(({ common }) => common);
  const { currentUser } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (!YTData?.title) navigate('/');
  }, [YTData]);

  useEffect(() => {
    return () =>
      dispatch(
        setColorClass({
          r: 255,
          g: 255,
          b: 255,
        }),
      );
  }, []);

  const onChange = useCallback(
    (key, val) => {
      let updated = { ...JSON.parse(JSON.stringify(setting)) };
      if (key === 'bonusExtraChances' && val === false) {
        updated['extraChances'] = [];
      } else if (key === 'blockList' && val === false) {
        updated['blockListNames'] = [];
      }
      updated[key] = val;
      dispatch(setSettings(updated));
    },
    [setting, dispatch],
  );

  const imageUpload = useCallback(
    async e => {
      if (
        currentUser?.current_plan?.name === 'Silver' ||
        currentUser?.current_plan?.name === 'Free'
      ) {
        toast.info('Upgrade your plan to use this feature!');
        return;
      }
      const file = e.target.files[0];
      const res = await dispatch(uploadFile(file, YTData?.id));
      if (res) dispatch(setBrandImage(res));
    },
    [setting, dispatch, YTData, currentUser],
  );

  const handleRefresh = useCallback(() => {
    dispatch(
      getCommentsYTVideo({
        video_id: YTData?.id,
      }),
    );
  }, [YTData, dispatch]);

  const handleFilter = useCallback(async () => {
    const payload = {
      video_id: YTData?.id,
      exclude_duplicate: setting?.excludeDuplicates,
      filter_hastag: setting?.hashTags?.match(/#[a-z]+|\@[a-z]+/gi) || [],
      extra_chance: setting?.extraChances || [],
      block_user: setting?.blockListNames || [],
    };

    const res = await dispatch(getFilteredComment(payload));
    if (res) {
    }
  }, [dispatch, setting, brandImage, colorClass, YTData]);

  const handleConfirm = useCallback(async () => {
    if (YTCommentsList?.length < 2) {
      toast.error('Very few comments !');
      return;
    }
    if (
      currentUser?.current_plan?.name === 'Free' ||
      currentUser?.current_plan?.name === 'Silver'
    ) {
      if (
        colorClass?.r !== 255 &&
        colorClass?.g !== 255 &&
        colorClass?.b !== 255 &&
        colorClass?.r !== 0 &&
        colorClass?.g !== 0 &&
        colorClass?.b !== 0
      ) {
        toast.info('Upgrade your plan to use branding feature!');
        dispatch(
          setColorClass({
            r: 255,
            g: 255,
            b: 255,
          }),
        );
        return;
      }
      if (setting?.countDown !== 5) {
        toast.info('Upgrade your plan to use branding feature!');
        // onChange('countDown', 5);
        return;
      }
    }
    const payload = {
      title: setting?.title || YTData?.title,
      video_id: YTData?.id,
      winner: setting?.winnerCount,
      substitute: setting?.substitudesCount,
      exclude_duplicate: setting?.excludeDuplicates,
      filter_hastag: setting?.hashTags?.match(/#[a-z]+/gi) || [],
      extra_chance: setting?.extraChances || [],
      block_user: setting?.blockListNames || [],
      count: setting?.countDown,
      custome_video_logo: brandImage,
      color: colorClass,
    };

    const res = await dispatch(getWinners(payload));
    if (res) {
      dispatch(setBrandImage(''));
      navigate('/winner');
    }
  }, [dispatch, setting, brandImage, currentUser, colorClass, YTCommentsList]);

  return (
    <>
      {(socialLoading || participantsLoading) && <Loader />}
      <div className="inner_main">
        <div className="settings_main_wrap">
          <div className="container">
            <Row>
              <Col xl={4} sm={12}>
                <div className="setting_left">
                  <div className="setting_box">
                    <div
                      className={
                        colorClass?.r <= 90
                          ? 'card_white max_600 black_Shade'
                          : 'card_white max_600 light_shade' + ` ${activeColor}`
                      }
                      style={{
                        backgroundColor: `rgb(${colorClass?.r}, ${colorClass?.g}, ${colorClass?.b})`,
                        color: colorClass?.r <= 90 ? 'white' : 'black',
                      }}
                    >
                      <div className="card_header d-flex justify-content-between align-items-center">
                        <div className="card_header_img d-flex align-items-center">
                          {loading ? (
                            <div className="spinner-border ms-2" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          ) : (
                            <img src={brandImage || defaultImage} alt="" />
                          )}
                        </div>
                        <h3 className="m-0">Settings ⚙️</h3>
                        <Button className="btn_transparent">
                          <img
                            id="QuestionIcon"
                            src={colorClass?.r <= 90 ? whiteQuestion : Question}
                            alt="QuestionIcon"
                            onClick={() => setHelpModal(true)}
                          />
                        </Button>
                      </div>
                      <div className="card_content">
                        <div className="form_group">
                          <label htmlFor="Title">Title</label>
                          <Input
                            id="Title"
                            placeholder="2021 April Jon Shawn MVU v1"
                            value={setting?.title || ''}
                            onChange={e => onChange('title', e.target.value)}
                          />
                        </div>
                        <div className="custom_ul_wrap">
                          <ul>
                            <li>
                              <div className="custom_left">
                                <label># Winners</label>
                              </div>
                              <div className="custom_right">
                                <InputNumber
                                  min={1}
                                  type="number"
                                  max={99}
                                  defaultValue={1}
                                  value={setting?.winnerCount || ''}
                                  onChange={val => onChange('winnerCount', val)}
                                  onKeyDown={e =>
                                    onChange('winnerCount', e.target.value)
                                  }
                                  style={{ color: 'white' }}
                                  className="input_number"
                                />
                              </div>
                            </li>
                            <li>
                              <div className="custom_left">
                                <label># Substitutes</label>
                              </div>
                              <div className="custom_right">
                                <InputNumber
                                  min={0}
                                  max={99}
                                  defaultValue={0}
                                  onChange={val =>
                                    onChange('substitudesCount', val)
                                  }
                                  onKeyDown={e =>
                                    onChange('substitudesCount', e.target.value)
                                  }
                                  className="input_number"
                                />
                              </div>
                            </li>
                            <li>
                              <div className="custom_left">
                                <label>Exclude Duplicates</label>
                              </div>
                              <div className="custom_right">
                                <div className="custom_switch">
                                  <Switch
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                    defaultChecked
                                    checked={
                                      setting?.excludeDuplicates === true
                                    }
                                    onChange={e =>
                                      onChange('excludeDuplicates', e)
                                    }
                                  />
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="custom_left">
                                <label>Filter by #Hashtag</label>
                              </div>
                              <div className="custom_right">
                                <div className="custom_switch">
                                  <Switch
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                    defaultChecked
                                    checked={setting?.filterByHashTag === true}
                                    onChange={e =>
                                      onChange('filterByHashTag', e)
                                    }
                                  />
                                </div>
                              </div>
                              {setting?.filterByHashTag === true && (
                                <div className="hashtag_input_Wrap">
                                  <TextArea
                                    rows={1}
                                    placeholder="Write a #hashtag"
                                    value={setting?.hashTags}
                                    onChange={e =>
                                      onChange('hashTags', e.target.value)
                                    }
                                  />
                                </div>
                              )}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} md={6}>
                <div className="setting_center">
                  <div className="setting_box mb-3 mx-auto">
                    <div
                      className={
                        colorClass?.r <= 90
                          ? 'card_white max_600 black_Shade'
                          : 'card_white max_600 light_shade' + ` ${activeColor}`
                      }
                      style={{
                        backgroundColor: `rgb(${colorClass?.r}, ${colorClass?.g}, ${colorClass?.b})`,
                        color: colorClass?.r <= 90 ? 'white' : 'black',
                      }}
                    >
                      <div className="card_header">
                        <h4 className="m-0">Select PRO 🤑</h4>
                      </div>
                      <div className="card_content">
                        <div className="custom_ul_wrap">
                          <ul>
                            <li>
                              <div className="custom_left">
                                <label>Extra Chances</label>
                              </div>
                              <div className="custom_right">
                                <div className="custom_switch">
                                  <Switch
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                    defaultChecked
                                    checked={
                                      setting?.bonusExtraChances === true
                                    }
                                    onChange={e => {
                                      if (
                                        currentUser?.current_plan?.name ===
                                        'Free'
                                      ) {
                                        toast.info(
                                          'Upgrade your plan to use this bonus feature!',
                                        );
                                        return;
                                      }
                                      onChange('bonusExtraChances', e);
                                    }}
                                  />
                                </div>
                              </div>
                              {setting?.bonusExtraChances === true && (
                                <div className="hashtag_input_Wrap">
                                  <Select
                                    mode="multiple"
                                    placeholder="Select a users"
                                    value={setting?.extraChances || []}
                                    onChange={e => onChange('extraChances', e)}
                                    optionLabelProp="label"
                                  >
                                    {allCommentersList?.map((x, i) => {
                                      return (
                                        <Select.Option
                                          value={x?.name}
                                          label={x?.name}
                                          key={i}
                                        >
                                          <Space>
                                            <span
                                              role="img"
                                              aria-label={x?.name}
                                            >
                                              <img
                                                src={x?.img}
                                                alt=""
                                                style={{
                                                  width: '35px',
                                                  borderRadius: '50%',
                                                }}
                                              />
                                            </span>
                                            {x?.name}
                                          </Space>
                                        </Select.Option>
                                      );
                                    })}
                                  </Select>
                                  <small className="text_very_small">
                                    Select from the dropdown
                                  </small>
                                </div>
                              )}
                            </li>
                            <li>
                              <div className="custom_left">
                                <label>Block List</label>
                              </div>
                              <div className="custom_right">
                                <div className="custom_switch">
                                  <Switch
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                    defaultChecked
                                    checked={setting?.blockList === true}
                                    onChange={e => {
                                      if (
                                        currentUser?.current_plan?.name ===
                                        'Free'
                                      ) {
                                        toast.info(
                                          'Upgrade your plan to use this block user feature!',
                                        );
                                        return;
                                      }
                                      onChange('blockList', e);
                                    }}
                                  />
                                </div>
                              </div>

                              {setting?.blockList === true && (
                                <div className="hashtag_input_Wrap">
                                  <Select
                                    mode="multiple"
                                    placeholder="Select a users"
                                    value={setting?.blockListNames || []}
                                    onChange={e =>
                                      onChange('blockListNames', e)
                                    }
                                    optionLabelProp="label"
                                  >
                                    {allCommentersList?.map((x, i) => {
                                      return (
                                        <Select.Option
                                          value={x?.name}
                                          label={x?.name}
                                          key={i}
                                        >
                                          <Space>
                                            <span
                                              role="img"
                                              aria-label={x?.name}
                                            >
                                              <img
                                                src={x?.img}
                                                alt=""
                                                style={{
                                                  width: '35px',
                                                  borderRadius: '50%',
                                                }}
                                              />
                                            </span>
                                            {x?.name}
                                          </Space>
                                        </Select.Option>
                                      );
                                    })}
                                  </Select>
                                  <small className="text_very_small">
                                    Exclude users from the list of comments /
                                    participants
                                  </small>
                                </div>
                              )}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting_box mx-auto mb-5">
                    <div
                      className={
                        colorClass?.r <= 90
                          ? 'card_white max_600 black_Shade'
                          : 'card_white max_600 light_shade' + ` ${activeColor}`
                      }
                      style={{
                        backgroundColor: `rgb(${colorClass?.r}, ${colorClass?.g}, ${colorClass?.b})`,
                        color: colorClass?.r <= 90 ? 'white' : 'black',
                      }}
                    >
                      <div className="card_header">
                        <h4 className="m-0">Live Streamer PRO 🎨</h4>
                      </div>
                      <div className="card_content">
                        <div className="custom_ul_wrap">
                          <ul>
                            <li>
                              <div className="custom_left">
                                <label>
                                  <h6 className="mb-1">Upload logo / Image</h6>
                                  <span className="d-block text_very_small">
                                    Recommended size : 180 px x 50 px
                                  </span>
                                </label>
                              </div>
                              <div className="custom_right">
                                <div className="upload_wrap">
                                  <label htmlFor="upload">Upload</label>
                                  <Input
                                    type="file"
                                    id="upload"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={imageUpload}
                                  />
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="custom_left">
                                <h6>
                                  <label>Countdown</label>
                                </h6>
                              </div>
                              <div className="custom_right">
                                <InputNumber
                                  min={1}
                                  style={{
                                    width: '100px',
                                  }}
                                  defaultValue={3}
                                  value={setting?.countDown}
                                  onChange={e => {
                                    onChange('countDown', e);
                                  }}
                                  onKeyDown={e => {
                                    onChange('countDown', e.target.value);
                                  }}
                                  className={`input_number ${
                                    (currentUser?.current_plan?.name ===
                                      'Free' ||
                                      currentUser?.current_plan?.name ===
                                        'Silver') &&
                                    setting?.countDown !== 5
                                      ? 'error'
                                      : ''
                                  }`}
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="main_color_wrap">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6>Color</h6>
                            <div className="color_picker_wrap">
                              <ColorPicker
                                value={`rgb(
                                ${colorClass?.r},
                                ${colorClass?.g},
                                ${colorClass?.b},
                              )`}
                                onChange={colors => {
                                  setActiveColor('');
                                  dispatch(
                                    setColorClass({
                                      r: colors?.metaColor?.r,
                                      g: colors?.metaColor?.g,
                                      b: colors?.metaColor?.b,
                                    }),
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <ul>
                            <li>
                              <button
                                name="color_primary"
                                className={
                                  activeColor === 'color_primary'
                                    ? 'color_box color_primary active'
                                    : 'color_box color_primary'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 0,
                                      g: 0,
                                      b: 0,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                            <li>
                              <button
                                name="color_green"
                                className={
                                  activeColor === 'color_green'
                                    ? 'color_box color_green active'
                                    : 'color_box color_green'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 90,
                                      g: 102,
                                      b: 62,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                            <li>
                              <button
                                name="color_lightgreen"
                                className={
                                  activeColor === 'color_lightgreen'
                                    ? 'color_box color_lightgreen active'
                                    : 'color_box color_lightgreen'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 121,
                                      g: 137,
                                      b: 82,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                            <li>
                              <button
                                name="color_orange"
                                className={
                                  activeColor === 'color_orange'
                                    ? 'color_box color_orange active'
                                    : 'color_box color_orange'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 251,
                                      g: 144,
                                      b: 92,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                            <li>
                              <button
                                name="color_lightorange"
                                className={
                                  activeColor === 'color_lightorange'
                                    ? 'color_box color_lightorange active'
                                    : 'color_box color_lightorange'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 254,
                                      g: 183,
                                      b: 97,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                            <li>
                              <button
                                name="color_grey"
                                className={
                                  activeColor === 'color_grey'
                                    ? 'color_box color_grey active'
                                    : 'color_box color_grey'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 166,
                                      g: 191,
                                      b: 185,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                            <li>
                              <button
                                name="color_yellow"
                                className={
                                  activeColor === 'color_yellow'
                                    ? 'color_box color_yellow active'
                                    : 'color_box color_yellow'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 247,
                                      g: 229,
                                      b: 128,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                            <li>
                              <button
                                name="color_cyan"
                                className={
                                  activeColor === 'color_cyan'
                                    ? 'color_box color_cyan active'
                                    : 'color_box color_cyan'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 19,
                                      g: 233,
                                      b: 248,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                            <li>
                              <button
                                name="color_water"
                                className={
                                  activeColor === 'color_water'
                                    ? 'color_box color_water active'
                                    : 'color_box color_water'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 197,
                                      g: 214,
                                      b: 241,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                            <li>
                              <button
                                name="color_white"
                                className={
                                  activeColor === 'color_white'
                                    ? 'color_box color_white active'
                                    : 'color_box color_white'
                                }
                                onClick={e => {
                                  setActiveColor(e.target.name);
                                  dispatch(
                                    setColorClass({
                                      r: 255,
                                      g: 255,
                                      b: 255,
                                    }),
                                  );
                                }}
                              ></button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} md={6}>
                <div className="setting_right">
                  <div className="setting_box mb-5 ms-auto">
                    <div
                      className={
                        colorClass?.r <= 90
                          ? 'card_white max_600 black_Shade'
                          : 'card_white max_600 light_shade' + ` ${activeColor}`
                      }
                      style={{
                        backgroundColor: `rgb(${colorClass?.r}, ${colorClass?.g}, ${colorClass?.b})`,
                        color: colorClass?.r <= 90 ? 'white' : 'black',
                      }}
                    >
                      <div className="card_header d-flex align-items-center justify-content-between">
                        <h4 className="m-0 d-flex align-items-center">
                          Participants 🧍
                          <span className="ms-2 text_very_small">
                            (Total {YTCommentsList?.length})
                          </span>
                        </h4>
                        <button
                          className="btn_transparent"
                          onClick={handleRefresh}
                        >
                          <img
                            src={colorClass?.r <= 90 ? WhiteRefresh : Refresh}
                            alt="RefreshIcon"
                          />
                        </button>
                      </div>
                      <div className="card_content">
                        {YTCommentsList?.length === 0 ? (
                          <div className="d-flex justify-content-center">
                            <img src={Participants} alt="Participants" />
                          </div>
                        ) : (
                          <div className="participants_list" ref={myElementRef}>
                            <ul>
                              {YTCommentsList?.map((x, i) => {
                                return (
                                  <li key={i}>
                                    <div className="participants_box">
                                      <div className="participants_left">
                                        <img
                                          src={x?.authorProfileImageUrl}
                                          alt=""
                                          className="rounded-circle"
                                        />
                                      </div>
                                      <div className="participants_right">
                                        <h6>{x?.authorDisplayName}</h6>
                                        <p>{x?.textOriginal}</p>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <div className="confirm_btn_wrap text-center">
              <button
                className="btn_primary notranslate me-3"
                onClick={handleFilter}
              >
                Apply Settings
                <span className="material-symbols-outlined arrw_icon">
                  arrow_right_alt
                </span>
              </button>
              <button
                className="btn_primary notranslate"
                onClick={handleConfirm}
              >
                Confirm
                <span className="material-symbols-outlined arrw_icon">
                  arrow_right_alt
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="🙌🏻 Help"
        centered
        open={helpModal}
        onCancel={() => setHelpModal(false)}
        footer={false}
        className="help_modal"
      >
        <div className="help_accordian_wrapper">
          <Collapse defaultActiveKey={['1']} accordion items={items} />
        </div>
      </Modal>
    </>
  );
}
