import { keyframes } from 'styled-components';

export const FadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1
  }
`;

export const BorderRotate = keyframes`
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: -5000;
  }
`;
