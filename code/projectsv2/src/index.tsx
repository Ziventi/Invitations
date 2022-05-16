import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';

import App from './app';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'Exo 2', sans-serif;
  }

  html, body {
    margin: 6px;
    padding: 0;
  }

div#root {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
`;

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <>
    <GlobalStyle />
    <App />
  </>,
);
