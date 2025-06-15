import { useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getPlanList, subscribePlan } from '../../Services/PlanService';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../Components/Common/Loader';
import { Switch, Tooltip } from 'antd';
import Close from '../../Assets/Images/close-red.svg';
import True from '../../Assets/Images/true-green.svg';
import info from '../../Assets/Images/Info.svg';

const bgColors = ['blue_bg', 'cyan_bg'];

const tooltipSelectPRO = (
  <>
    <h6>Branding</h6>
    <div>• Show off your brand colors and logo with this feature </div>
    <h6>Countdown clock</h6>
    <div>• Great for livestreaming – so suspenseful!</div>
  </>
);

const tooltipContent = (
  <>
    <h6>Bonus entries</h6>
    <div>• Include specific users to get an extra shot at winning</div>
    <h6>Block accounts</h6>
    <div>• Block specific users from winning</div>
  </>
);

export default function Shop({ setIsLoginModalOpen, isLoginModalOpen }) {
  const dispatch = useDispatch();
  const [duration, setDuration] = useState('month');

  const { planLoading, planList } = useSelector(({ plan }) => plan);
  const { currentUser } = useSelector(({ auth }) => auth);

  useEffect(() => {
    dispatch(getPlanList(duration));
  }, [duration]);

  const selectPlan = useCallback(
    async price_id => {
      if (
        typeof currentUser === 'object' &&
        Object.entries(currentUser)?.length > 0
      ) {
        const res = await dispatch(subscribePlan(price_id));

        if (res) window.location.href = res;
      } else setIsLoginModalOpen(true);
    },
    [currentUser],
  );

  return (
    <>
      {planLoading && <Loader />}
      <div className="shop_main_wrap d-block inner_page_wrapper">
        <div className="container">
          <div className="plans_pricing_wrap">
            <div className="shop_tite text-center d-flex justify-content-center flex-column align-items-center">
              <h2>🤑 Plans & Pricing </h2>
              <p>Pick the plan that’s right for you</p>
              <div className="custom_switch shop_toggle">
                <span className="me-2 d-flex align-items-center">
                  Pay monthly
                </span>
                <Switch
                  style={{ height: '30px' }}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  checked={duration === 'year'}
                  onChange={e => setDuration(e ? 'year' : 'month')}
                />
                <span className="ms-2 d-flex align-items-center">
                  Pay yearly
                </span>
              </div>
            </div>
            <div className="shop_box_wrap">
              <Row className="d-flex justify-content-center">
                {planList?.map((x, i) => {
                  return (
                    <Col xl={3} md={6} key={i}>
                      <div className="shop_box">
                        <div
                          className={`shop_box_header ${
                            x?.name === currentUser?.current_plan?.name
                              ? bgColors[1]
                              : bgColors[0]
                          }`}
                        >
                          <h3 className="m-0">{x?.name}</h3>
                          <h4 className="m-0">
                            <sup className="text_small">
                              {x?.currency === 'USD' ? '$' : '€'}
                            </sup>
                            {x?.price}
                          </h4>
                        </div>
                        <div className="shop_box_content">
                          <h6>{x?.description}</h6>
                          <ul>
                            {x?.metaArr?.map((y, j) => {
                              return (
                                <li key={j}>
                                  <span className="check_icon">
                                    {y?.is_true ? (
                                      <CheckOutlined />
                                    ) : (
                                      <CloseOutlined />
                                    )}
                                  </span>
                                  {y?.social_name}
                                </li>
                              );
                            })}
                          </ul>
                          <div className="text-center plan_btn mt-4">
                            <button
                              className="btn_primary"
                              disabled={
                                currentUser?.current_plan?.name === x?.name
                              }
                              // disabled={
                              //   currentUser?.current_plan?.name === 'Free' &&
                              //   x?.price === 0
                              // }
                              onClick={() => selectPlan(x?.id)}
                            >
                              {x?.name === currentUser?.current_plan?.name
                                ? 'Current Plan'
                                : 'Select Plan'}
                              <span className="material-symbols-outlined arrw_icon">
                                arrow_right_alt
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>
          <div className="compare_plan_wrap">
            <div className="shop_tite text-center">
              <h3>💸 Compare our plans side by side</h3>
              <p className="small">
                Effortlessly view plan options to make an informed decision
              </p>
            </div>
            <div className="table_wrapper">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Free</th>
                      <th>Silver</th>
                      <th>Gold</th>
                      <th>Platinum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Instagram Giveaway</td>
                      <td>Up to 600 Comments</td>
                      <td>Up to 2,000 Comments</td>
                      <td>Up to 5,000 Comments</td>
                      <td>Unlimited Comments</td>
                    </tr>
                    <tr>
                      <td>Youtube Giveaway</td>
                      <td>Up to 600 Comments</td>
                      <td>Up to 2,000 Comments</td>
                      <td>Up to 5,000 Comments</td>
                      <td>Unlimited Comments</td>
                    </tr>
                    <tr>
                      <td>Tiktok Giveaway</td>
                      <td>Up to 600 Comments</td>
                      <td>Up to 2,000 Comments</td>
                      <td>Up to 5,000 Comments</td>
                      <td>Unlimited Comments</td>
                    </tr>
                    <tr>
                      <td>Winners</td>
                      <td>1 - 99</td>
                      <td>1 - 99</td>
                      <td>1 - 99</td>
                      <td>1 - 99</td>
                    </tr>
                    <tr>
                      <td>Substitutes</td>
                      <td>1 - 99</td>
                      <td>1 - 99</td>
                      <td>1 - 99</td>
                      <td>1 - 99</td>
                    </tr>
                    <tr>
                      <td>Exclude Duplicates</td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Filter by Hashtag</td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>Multi-Network Giveaways</td>
                      <td>
                        <span>
                          <img src={Close} alt="closeIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={Close} alt="closeIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={Close} alt="closeIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="trueIcon" />
                        </span>
                      </td>
                    </tr>
                    <tr className="bg_color">
                      <td colSpan={5}>
                        Select PRO Features{' '}
                        <Tooltip title={tooltipContent}>
                          <img
                            src={info}
                            alt="info"
                            className="cursor-pointer"
                          />
                        </Tooltip>
                      </td>
                    </tr>
                    <tr>
                      <td>Bonus entries</td>
                      <td>
                        <span>
                          <img src={Close} alt="closeIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Block accounts</td>
                      <td>
                        <span>
                          <img src={Close} alt="closeIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                    </tr>
                    <tr className="bg_color">
                      <td colSpan={5}>
                        Live Streamer PRO Features{' '}
                        <Tooltip title={tooltipSelectPRO}>
                          <img
                            src={info}
                            alt="info"
                            className="cursor-pointer"
                          />
                        </Tooltip>
                      </td>
                    </tr>
                    <tr>
                      <td>Branding</td>
                      <td>
                        <span>
                          <img src={Close} alt="closeIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={Close} alt="closeIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Countdown clock</td>
                      <td>
                        <span>
                          <img src={Close} alt="closeIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={Close} alt="closeIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                      <td>
                        <span>
                          <img src={True} alt="TrueIcon" />
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
