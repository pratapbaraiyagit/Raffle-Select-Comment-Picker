import { Tabs } from 'antd';
import Preferences from './Preferences';
import Billing from './Billing';
import Help from './Help';

export default function Index() {
  const onChange = key => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: 'Preferences',
      children: <Preferences />,
    },
    {
      key: '2',
      label: 'Billing',
      children: <Billing />,
    },
    {
      key: '3',
      label: 'Help',
      children: <Help />,
    },
  ];

  return (
    <div className="myaccount_main_wrap d-block">
      <div className="container">
        <div className="tab_wrap">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
