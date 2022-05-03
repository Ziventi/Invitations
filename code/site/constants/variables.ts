import { StripeElementsOptions } from '@stripe/stripe-js';

export const DEFAULT_FILENAME_TEMPLATE = 'Invitation for [name]';
export const DRAGGABLE_PADDING = 12;
export const GOOGLE_FONT_HOST =
  'https://google-webfonts-helper.herokuapp.com/api/fonts';

export const STRIPE_ELEMENTS_OPTIONS: StripeElementsOptions = {
  appearance: {
    labels: 'floating',
    theme: 'none',
    rules: {
      '.Input': {
        padding: '1em',
      },
      '.Input:focus': {
        outline: '2px solid #da9f93',
      },
    },
    variables: {
      borderRadius: '15px',
      fontFamily: 'Rubik',
    },
  },
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css2?family=Rubik&display=swap',
    },
  ],
};
