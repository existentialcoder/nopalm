import React, { useState, useEffect } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { Provider, useDispatch, useSelector } from 'react-redux';

import App from './App.tsx';

import './index.scss';

import { ConfigProvider, ThemeConfig, Skeleton, theme } from 'antd';

import store from './store/store.ts';

import { AppDispatch, RootState } from './store/store.ts';

import { fetchAndSetGlobalSettings } from './store/slices/app.ts';


const { defaultAlgorithm, darkAlgorithm, getDesignToken } = theme;

const Main: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const globalSettings = useSelector((state: RootState) => state.app.globalSettings);

  const isMainLoading = useSelector((state: RootState) => state.app.isMainLoading);

  const selectedPrimaryColor = useSelector((state: RootState) => state.app.selectedPrimaryColor);

  const isDark = useSelector((state: RootState) => state.app.isDark);

  const DarkTheme: ThemeConfig = {
    algorithm: darkAlgorithm,
    token: {
      // add here custom colors
    }
  };
  const LightTheme: ThemeConfig = {
    algorithm: defaultAlgorithm,
    token: {
      // add here custom colors
    }
  };

  const DarkToken = getDesignToken(DarkTheme);

  const LightToken = getDesignToken(LightTheme);

  const [tokenSelected, setTokenSelected] = useState(LightToken);

  useEffect(() => {
    dispatch(fetchAndSetGlobalSettings())
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <ConfigProvider theme={{
            algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
            components: {
              Layout: {
                siderBg: selectedPrimaryColor,
                triggerBg: selectedPrimaryColor
              }
            },
            token: {
              colorPrimary: selectedPrimaryColor
            }
          }}>
            <div style={{
              color: tokenSelected.colorText,
              background: tokenSelected.colorBgBase
            }}>
              <Skeleton loading={isMainLoading}>
                <App settings={globalSettings} reflectUpdatedUserSettings={fetchGlobalSettings} />
              </Skeleton>
            </div>
          </ConfigProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode >
  )
};

export default Main;
