import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import GithubCorner from 'react-github-corner';

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

// import SocialMediaLinks from './components/SocialMediaLinks';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from './store/store';

import { setCurrentActiveRoute } from './store/slices/app';

import { nopalmGitHubPath } from './helpers/constants';

import Select from 'antd/es/select';

import { fetchAndSetProjectDetails, setCurrentProjectDirectoryPath } from './store/slices/project';

import { fetchAndSetInstalledPackages, setPackagesLoading } from './store/slices/packages';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const routesToPages = {
  project_details: () => <ProjectDetails />,
  packages: () => <Packages />,
  settings: () => <Settings />,
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

  const { token } = theme.useToken();

  const dispatch = useDispatch<AppDispatch>();

  const selectedPrimaryColor = useSelector((state: RootState) => state.app.selectedPrimaryColor);

  const currentActiveRoute = useSelector((state: RootState) => state.app.currentActiveRoute);

  const allProjectDirectoryPaths = useSelector((state: RootState) => state.project.allProjectDirectoryPaths);

  async function directoryPathChangeHandler(inp: string) {
    await dispatch(setCurrentProjectDirectoryPath(inp));
    // Retrieve and update project details always when directory path changes
    await dispatch(fetchAndSetProjectDetails());


    if (currentActiveRoute === 'packages') {
      // Retrieve and update installed packages only when the packages page is active
      await dispatch(setPackagesLoading(true));
      await dispatch(fetchAndSetInstalledPackages());
    }
  }

  function getCurrentDirectoryOptions() {
    return allProjectDirectoryPaths.map(dirPath => {
      const root = allProjectDirectoryPaths.find(dir => dir.root === true);

      return {
        label: dirPath.path.split(root?.path || '')[1].length > 0 ? dirPath.path.split(root?.path || '')[1] : '/',
        value: dirPath.path
      };
    });
  }

  useEffect(() => {
    const routeChangeHandler = () => {
      const currentPath = window.location.pathname.slice(1);

      const pathToSet = currentPath === '' ? 'project_details' : currentPath;

      dispatch(setCurrentActiveRoute(pathToSet));
    }
    routeChangeHandler();
  }, []);

  return (
    <Layout hasSider style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'scroll' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
        style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}>
        <Menu style={{ minHeight: '92vh' }} defaultSelectedKeys={['project_details']}
          selectedKeys={[currentActiveRoute]}
          onSelect={(item) => dispatch(setCurrentActiveRoute(item.key))}
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
          background: token.colorBgBase
        }}>
          <div className='logo-dir-container'>
            <NopalmLogo includeTitle />
            <div className='current-directory-picker'>
              <div className='current-directory'>Current project path &nbsp;: &nbsp;
                <span style={{ color: selectedPrimaryColor }}>
                  {allProjectDirectoryPaths.find(dir => dir.root === true)?.path.split('/').pop()}
                </span>
              </div>
              <div className='directory-picker'>
                <Select
                  options={getCurrentDirectoryOptions()}
                  onSelect={directoryPathChangeHandler}
                  defaultValue='/' />
              </div>
            </div>
          </div>
          <GithubCorner target='_blank' href={nopalmGitHubPath} bannerColor={selectedPrimaryColor} />
        </Header>
        <Content style={{ margin: '0 10px', padding: 0, overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              borderRadius: token.borderRadiusLG,
            }}
          >
            {routesToPages[currentActiveRoute]()}
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
