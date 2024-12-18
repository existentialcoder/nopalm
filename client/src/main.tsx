import React, { useEffect, useState } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import App from './App.tsx';

import './index.scss';

import { ConfigProvider, Skeleton, theme, ThemeConfig } from 'antd';

const { defaultAlgorithm, darkAlgorithm, getDesignToken } = theme;

import { AppDispatch, RootState } from './store/store.ts';

import { fetchAndSetGlobalSettings } from './store/slices/app.ts';

import { NotificationProvider } from './components/NotificationContext';

const Main: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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

  const [tokenSelected, setTokenSelected] = useState<typeof LightToken>(LightToken);

  useEffect(() => {
    dispatch(fetchAndSetGlobalSettings())
  }, []);

  useEffect(() => {
    setTokenSelected(isDark ? DarkToken : LightToken);
  }, [isDark]);

  return (
    <React.StrictMode>
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
          <NotificationProvider>
            <div style={{
              color: tokenSelected.colorText,
              background: tokenSelected.colorBgBase
            }}>

              <Skeleton loading={isMainLoading}>
                <App />
              </Skeleton>
            </div>
          </NotificationProvider>
        </ConfigProvider>
      </BrowserRouter>
    </React.StrictMode >
  )
};

export default Main;
