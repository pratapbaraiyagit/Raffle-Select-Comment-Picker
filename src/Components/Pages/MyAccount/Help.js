import { Input } from 'antd';
import { Col, Row } from 'react-bootstrap';
import { Collapse } from 'antd';

const text = `
All our applications have a free option,
 which allows you to try DualWire with the limitations indicated in the free plan.
  If you opt for a paid plan,
 you get access to premium features of our application.
  If you wish, you can check what you get from DualWire in its free option and in our recommended,
   Premium options. View Plans & Pricing
`;

const items = [
  {
    key: '1',
    label: 'Are all the apps Free?',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'Can I add contest conditions and filters?',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'Can I run a giveaway with multiples Instagram posts?',
    children: <p>{text}</p>,
  },
];

export default function Help() {
  const onChange = key => {
    console.log(key);
  };

  return (
    <div className="help_wrap">
      <Row className="justify-content-center">
        <Col lg={6}>
          <div className="help_title text-center mb-md-5 mb-3">
            <h2>🙌🏻 Help Center</h2>
            <p className="mb-4">What can we help you with?</p>
            <div className="search_input_wrap">
              <Input
                id="Title"
                placeholder="dw_25f45sdf4e5bfd158asd1dsg45asde8411cdb"
              />
            </div>
          </div>
          <div className="help_accrodian_wrap">
            <Collapse
              items={items}
              defaultActiveKey={['1']}
              onChange={onChange}
            />
          </div>
          <div className="text-center">
            <button className="btn_primary mx-auto d-block mb-3">
              Contact Us
              <span className="material-symbols-outlined arrw_icon"></span>
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
