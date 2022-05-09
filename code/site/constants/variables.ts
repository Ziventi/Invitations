import { StripeElementsOptions } from '@stripe/stripe-js';

/** The default filename template for generated files. */
export const DEFAULT_FILENAME_TEMPLATE = 'Invitation for [name]';

/** The draggable padding in pixels. */
export const DRAGGABLE_PADDING = 12;

/** The host path for Google Web Font queries. */
export const GOOGLE_FONT_HOST =
  'https://google-webfonts-helper.herokuapp.com/api/fonts';

/** Map of font varaints to user-friendly aliases. */
export const FONT_VARIANTS = <const>{
  '100': 'Thin',
  '100italic': 'Thin Italic',
  '200': 'Extra-Light',
  '200italic': 'Extra-Light Italic',
  '300': 'Light',
  '300italic': 'Light Italic',
  'regular': 'Regular',
  'italic': 'Regular Italic',
  '500': 'Medium',
  '500italic': 'Medium Italic',
  '600': 'Semi-Bold',
  '600italic': 'Semi-Bold Italic',
  '700': 'Bold',
  '700italic': 'Bold Italic',
  '800': 'Extra-Bold',
  '800italic': 'Extra-Bold Italic',
  '900': 'Black',
  '900italic': 'Black Italic',
};

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
