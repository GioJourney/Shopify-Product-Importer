import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Deep-navy dark theme with Ocean Cyan as the primary accent and a navy/charcoal
// surface ramp (Abyss Navy ground, Charcoal Blue panels, Deep Sea / Petrol highs).
const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e0f7fd',
      100: '#b3ebf9',
      200: '#80def5',
      300: '#4dd0f0',
      400: '#26c6ed',
      500: '#00a6d6', // Ocean Cyan — CTA / link
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
          50: '#f7fafc', // Text Light
          100: '#c7e8f3', // Ice Blue
          200: '#b9cad4', // Muted Text
          300: '#8fa8b5',
          400: '#5f7d8d',
          500: '#3c5a6b',
          600: '#234152',
          700: '#0b3d4a', // Petrol Blue
          800: '#082742', // Deep Sea Blue
          900: '#111c26', // Charcoal Blue — cards/panels
          950: '#061826', // Abyss Navy — ground
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
