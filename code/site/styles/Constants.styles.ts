import { transparentize } from 'polished';

export const COLOR = {
  PRIMARY_1_LIGHT: '#f9f3f0',
  PRIMARY_1_NEUTRAL: '#F6E5DF',
  PRIMARY_1_DARK: '#E2C2B6',
  PRIMARY_2_LIGHT: '#e5bbb3',
  PRIMARY_2_NEUTRAL: '#da9f93',
  PRIMARY_2_DARK: '#d08576',
  PRIMARY_3_LIGHT: '#c66c80',
  PRIMARY_3_NEUTRAL: '#b6465f',
  PRIMARY_3_DARK: '#8e2138',
  PRIMARY_4_LIGHT: '#b00729',
  PRIMARY_4_NEUTRAL: '#890620',
  PRIMARY_4_DARK: '#620417',
  PRIMARY_5_LIGHT: '#5f1007',
  PRIMARY_5_NEUTRAL: '#2c0703',
  PRIMARY_5_DARK: '#1f0401',
  PRIMARY_5_DARKER: '#130301',
  SECONDARY_1: '#281a1a',
  SECONDARY_2: '#250d15',
  SECONDARY_3: '#37272d',

  BLACK: '#000000',
  WHITE: '#ffffff',
  DEFAULT: '#cccccc',

  HERO: 'rgba(67, 58, 55, 0.8)',
  WORKFLOW: 'rgba(40, 26, 26, 0.97)',
};

export const THEME = {
  setupSectionNamesList: transparentize(0.06, COLOR.SECONDARY_1),
  setupSectionImageSelect: transparentize(0.08, COLOR.SECONDARY_2),
};

export const FONT = {
  PRIMARY: "'Rubik', sans-serif",
};
