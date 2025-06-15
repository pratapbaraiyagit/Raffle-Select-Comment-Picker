import { Input } from 'antd';
import { Col, Row } from 'react-bootstrap';

const { TextArea } = Input;

export default function Billing() {
  return (
    <div className="billing_wrap">
      <Row>
        <Col lg={6} md={8} className="mx-auto">
          <div className="billing_left">
            <div className="card_white color_white mb-5">
              <div className="card_header">
                <h4 className="m-0">Subscription 💰</h4>
              </div>
              <div className="card_header">
                <div className="free_plan_title d-flex flex-wrap align-items-start justify-content-between">
                  <div className="">
                    <h3>Free Plan</h3>
                    <p className="m-0 text_small">
                      Unlock all additional features with our premium plans.
                    </p>
                  </div>
                  <button className="btn_primary upgarde_plan no_translate">
                    Create
                    <span className="material-symbols-outlined arrw_icon">
                      Upgrade Plan
                    </span>
                  </button>
                </div>
              </div>
              <div className="card_content">
                <Row>
                  <Col md={6}>
                    <h5 className="mb-3">Social Media Giveaway 🙌🏻</h5>
                    <div className="giveaway_box">
                      <ul>
                        <li>
                          <span>Instagram Giveaway</span>
                          <span>
                            Up to <b>600</b> comments
                          </span>
                        </li>
                        <li>
                          <span>Facebook Giveaway</span>
                          <span>
                            Up to <b>600</b> comments
                          </span>
                        </li>
                        <li>
                          <span>Tiktok Giveaway</span>
                          <span>
                            Up to <b>600</b> comments
                          </span>
                        </li>
                        <li>
                          <span>Youtube Giveaway</span>
                          <span>
                            Up to <b>600</b> comments
                          </span>
                        </li>
                        <li>
                          <span>List Giveaway</span>
                          <span>
                            Up to <b>600</b> comments
                          </span>
                        </li>
                        <li>
                          <span>Multi-Network Giveaway</span>
                          <span>
                            Up to <b>600</b> comments
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h5 className="mb-3">Campaigns & Promotions 🏕</h5>
                    <div className="giveaway_box">
                      <ul>
                        <li>
                          <span>Wheel of Prizes</span>
                          <span>✓</span>
                        </li>
                        <li>
                          <span>Active Campaigns</span>
                          <span>1</span>
                        </li>
                        <li>
                          <span>Monthly Page Views</span>
                          <span>100</span>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>
        {/* <Col lg={6} md={8} className="mx-auto">
          <div className="billing_right">
            <div className="card_white color_white mb-5">
              <div className="card_header">
                <h4 className="m-0">Invoices 📜</h4>
              </div>
              <div className="card_content">
                <label htmlFor="">Your Dual Wire’s API Key is:</label>
                <Input
                  id="Title"
                  placeholder="dw_25f45sdf4e5bfd158asd1dsg45asde8411cdb"
                />
              </div>
            </div>
            <div className="card_white color_white mb-5">
              <div className="card_header">
                <h4 className="m-0">Billing information 🧾</h4>
              </div>
              <div className="card_content">
                <div className="input_box">
                  <ul>
                    <li>
                      <label htmlFor="">Business Name</label>
                      <div className="input_box_right">
                        <Input id="Title" placeholder="My Company, Inc." />
                      </div>
                    </li>
                    <li>
                      <label htmlFor="">Address</label>
                      <div className="input_box_right">
                        <TextArea
                          rows={2}
                          placeholder="maxLength is 6"
                          maxLength={6}
                        />
                      </div>
                    </li>
                    <li>
                      <label htmlFor="">Tax Number / ID</label>
                      <div className="input_box_right">
                        <Input id="Title" placeholder="DE123" />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Col> */}
      </Row>
      <button className="btn_primary mx-auto d-block mb-3">
        Save Changes
        <span className="material-symbols-outlined arrw_icon"></span>
      </button>
    </div>
  );
}
