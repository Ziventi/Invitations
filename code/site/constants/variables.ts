import { StripeElementsOptions } from '@stripe/stripe-js';

/** The default filename template for generated files. */
export const DEFAULT_FILENAME_TEMPLATE = 'Invitation for [name]';

/** The draggable padding in pixels. */
export const DRAGGABLE_PADDING = 12;

/** The host path for Google Web Font queries. */
export const GOOGLE_FONT_HOST =
  'https://google-webfonts-helper.herokuapp.com/api/fonts';

/** The options for StripeElements. */
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
