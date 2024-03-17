import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.scss'

import { ConfigProvider, ThemeConfig, theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm, getDesignToken  } = theme;

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

const isDark = false;

const DarkToken = getDesignToken(DarkTheme);

const LightToken = getDesignToken(LightTheme);

const TokenSelected = isDark ? DarkToken : LightToken;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <ConfigProvider theme={{
      algorithm: isDark ? darkAlgorithm : defaultAlgorithm
    }}> 
      <div style={{
        color: TokenSelected.colorText,
        background: TokenSelected.colorBgBase
      }}> <App /> </div>
    </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
