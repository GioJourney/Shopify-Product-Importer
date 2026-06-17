import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e0f7fd',
      100: '#b3ebf9',
      200: '#80def5',
      300: '#4dd0f0',
      400: '#26c6ed',
      500: '#00a6d6',
      600: '#0091bd',
      700: '#007799',
      800: '#005d77',
      900: '#004052',
      950: '#002b38',
    },
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f7fafc',
          100: '#c7e8f3',
          200: '#b9cad4',
          300: '#8fa8b5',
          400: '#5f7d8d',
          500: '#3c5a6b',
          600: '#234152',
          700: '#0b3d4a',
          800: '#082742',
          900: '#111c26',
          950: '#061826',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
    }),
    MessageService,
  ],
};
