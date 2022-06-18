import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import FirstPage from './pages/1.page';
import SecondPage from './pages/2.page';
import ThirdPage from './pages/3.page';
import FourthPage from './pages/4.page';
import FifthPage from './pages/5.page';
import * as I from './styles/_App.styles';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);
root.render(
  <BrowserRouter>
    <I.GlobalStyle />
    <ThemeProvider theme={I.theme}>
      {[FirstPage, SecondPage, ThirdPage, FourthPage, FifthPage].map(
        (Content, key, pages) => {
          const isEven = (key + 1) % 2 === 0;
          const shouldFlowerBeSmall = key > 0 && key < pages.length - 1;
          return (
            <I.Page inverse={isEven} key={key}>
              <I.Background />
              <I.Container inverse={isEven}>
                <I.Flower position={'top'} small={shouldFlowerBeSmall} />
                <Content />
                <I.Flower position={'bottom'} small={shouldFlowerBeSmall} />
              </I.Container>
            </I.Page>
          );
        },
      )}
    </ThemeProvider>
  </BrowserRouter>,
);
