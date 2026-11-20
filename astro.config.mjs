// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  i18n: {
        defaultLocale: 'en',
      locales: ['en', 'es'],
      routing: {
            prefixDefaultLocale: false
      }
  },

  adapter: cloudflare()
});