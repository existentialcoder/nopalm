import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ProjectDetails, Packages, Settings
} from './pages';
import {
  ProjectOutlined,
  RedEnvelopeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';

import './App.scss';

import NopalmLogo from './logos/NopalmLogo';

import SocialMediaLinks from './components/SocialMediaLinks';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const routesToPages: any = {
  project_details: <ProjectDetails />,
  packages: <Packages />,
  settings: <Settings />,
};

function getMenuItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getMenuItem('Project Details', 'project_details', <Link to='/project_details'><ProjectOutlined /></Link>),
  getMenuItem('Packages', 'packages', <Link to='/packages'><RedEnvelopeOutlined /></Link>),
  getMenuItem('Settings', 'settings', <Link to='/settings'><SettingOutlined /></Link>),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { borderRadiusLG }
  } = theme.useToken();

  const [currentActiveRoute, setCurrentActiveRoute] = useState('project_details');

  useEffect(() => {
    const currentPath = window.location.pathname.slice(1);

    const pathToSet = currentPath === '' ? 'project_details' : currentPath;

    setCurrentActiveRoute(pathToSet);
  }, []);

  return (
    <Layout hasSider style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'scroll' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
        style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}>
        <Menu style={{ minHeight: '92vh' }} defaultSelectedKeys={['project_details']}
          selectedKeys={[currentActiveRoute]}
          onSelect={(item) => setCurrentActiveRoute(item.key)}
          items={items} />
      </Sider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
          <NopalmLogo includeTitle />
        </Header>
        <Content style={{ margin: '0 10px', padding: 0, overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            {routesToPages[currentActiveRoute]}
          </div>
        </Content>
        {/* <Footer style={{
          position: 'fixed',
          // left: 200,
          bottom: 0,
          width: '100%',
          textAlign: 'center'
        }}>
          <div className="footer-container">
            <div className='copyright'>
              ©{new Date().getFullYear()} | Created by Shravan Balasubramanian | Contact
            </div>
            <div className="contact"> <SocialMediaLinks /> </div>
          </div>
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default App;
