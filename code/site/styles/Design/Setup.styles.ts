import styled from 'styled-components';

import { Button, COLOR } from 'styles/Library';

export default {
  Main: styled.main`
    background-color: ${COLOR.PRIMARY_1_DARK};
    color: ${COLOR.WHITE};
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  `,
  Container: styled.div`
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: repeat(2, 50%);
  `,
  Section: styled.section`
    background-color: #8e7066;
    border-radius: 10px;
    box-shadow: 0 0 5px 0 ${COLOR.BLACK};
    margin: 2em;
    padding: 2em;
  `,
  NameListInput: styled.textarea`
    border-radius: 10px;
    border-style: none;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    font-size: 20px;
    line-height: 1.5;
    padding: 0.5em;
    width: 100%;
  `,
  Text: styled.p`
    line-height: 150%;
  `,
  Footer: styled.footer`
    display: flex;
    flex: 0 0 70px;
    justify-content: space-between;
    padding: 0 1.5em 1em;
  `,
  FooterButton: styled(Button).attrs({ bgColor: COLOR.PRIMARY_4 })`
    box-shadow: 0 0 3px 0 ${COLOR.BLACK};
    font-size: 20px;
    min-width: 200px;
    padding: 0.5em;
  `,
  FileSelector: styled.div`
    margin: 1.5em 0;
  `,
  ImagePreview: styled.figure`
    height: 100%;
    max-height: 450px;
    padding: 2em;
    position: relative;
    width: 100%;
  `,
};
