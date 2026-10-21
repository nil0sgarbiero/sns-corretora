import {
  PoTheme,
  PoThemeA11yEnum,
  PoThemeTokens,
  PoThemeTypeEnum,
  poThemeDefaultActions,
  poThemeDefaultActionsDark,
  poThemeDefaultDarkValues,
  poThemeDefaultFeedback,
  poThemeDefaultFeedbackDark,
  poThemeDefaultLightValues,
  poThemeDefaultNeutrals,
} from '@po-ui/ng-components';

const onRoot = {
  '--font-family-theme': 'roboto',
  '--font-family-theme-extra-light': 'Roboto-Condensed-Light',
  '--font-family-theme-bold': 'roboto-bold',
  '--color-page-background-color-page': 'var(--color-neutral-light-05)',
};

const perComponent = {
  'po-button': {
    '--font-size': 'var(--font-size-sm)',
    '--border-width': 0,
    '--outline-color-focused': 'transparent',
  },
  'po-button[p-kind="primary"]': {
    '--text-color': 'var(--color-brand-01-base)',
    '--shadow': 'var(--shadow-md)',
    '--color': 'transparent',
    '--color-hover': 'var(--color-brand-01-lightest)',
  },
  'po-menu': {
    '--background-color': 'var(--color-neutral-light-20)',
  },
  'po-toolbar': {
    '--background-color': 'var(--color-neutral-light-10)',
  },
};

const myThemeLight: PoThemeTokens = {
  color: {
    brand: {
      '01': {
        lightest: '#e0f2fe',
        lighter: '#bae6fd',
        light: '#7dd3fc',
        base: '#0369a1',
        dark: '#075985',
        darker: '#0c4a6e',
        darkest: '#082f49',
      },
      '02': { base: '#b92f72' },
      '03': { base: '#ffd464' },
    },
    action: {
      ...poThemeDefaultActions,
      disabled: 'var(--color-neutral-mid-40)',
    },
    feedback: poThemeDefaultFeedback,
    neutral: {
      ...poThemeDefaultNeutrals,
    },
  },
  onRoot: {
    ...poThemeDefaultLightValues.onRoot,
    ...onRoot,
  },
  perComponent: {
    ...poThemeDefaultLightValues.perComponent,
    ...perComponent,
  },
};

const myThemeDark: PoThemeTokens = {
  color: {
    brand: {
      '01': {
        darkest: '#e0f2fe',
        darker: '#bae6fd',
        dark: '#7dd3fc',
        base: '#0ea5e9',
        light: '#0284c7',
        lighter: '#075985',
        lightest: '#082f49',
      },
      '02': { base: '#b92f72' },
      '03': { base: '#ffd464' },
    },
    action: {
      ...poThemeDefaultActionsDark,
      disabled: 'var(--color-neutral-mid-40)',
    },
    feedback: poThemeDefaultFeedbackDark,
    neutral: {
      light: {
        '00': '#1c1c1c',
        '05': '#202020',
        '10': '#2b2b2b',
        '20': '#3b3b3b',
        '30': '#5a5a5a',
      },
      mid: {
        '40': '#7c7c7c',
        '60': '#a1a1a1',
      },
      dark: {
        '70': '#c1c1c1',
        '80': '#d9d9d9',
        '90': '#eeeeee',
        '95': '#fbfbfb',
      },
    },
  },
  onRoot: {
    ...poThemeDefaultDarkValues.onRoot,
    ...onRoot,
  },
  perComponent: {
    ...poThemeDefaultDarkValues.perComponent,
    ...perComponent,
  },
};

export const snsTheme: PoTheme = {
  name: 'sns',
  type: [
    {
      light: myThemeLight,
      dark: myThemeDark,
      a11y: PoThemeA11yEnum.AAA,
    },
    {
      light: myThemeLight,
      dark: myThemeDark,
      a11y: PoThemeA11yEnum.AA,
    },
  ],
  active: { type: PoThemeTypeEnum.light, a11y: PoThemeA11yEnum.AAA },
};