import type { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';

import ZiventiLogo from 'components/logo';
import { COLOR } from 'styles/Constants';

const ConfirmationPage: NextPage = () => {
  return (
    <CFN.Main>
      <CFN.SiteLogo>Thank you for your purchase.</CFN.SiteLogo>
      <CFN.TextBox>Thank you for your purchase.</CFN.TextBox>
    </CFN.Main>
  );
};

export default ConfirmationPage;

const CFN = {
  Main: styled.main`
    align-content: center;
    background-color: ${COLOR.PRIMARY_4_DARK};
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  `,
  SiteLogo: styled(ZiventiLogo).attrs({ color: 'white'})`
    height: 50px;
  `,
  TextBox: styled.div`
    color: ${COLOR.WHITE};
    font-size: 1.4em;
    text-align: center;
  `,
};
