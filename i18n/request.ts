import {getRequestConfig} from 'next-intl/server';

export const locales = ['id', 'en'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({locale}) => {
  const safeLocale = locale || 'id';
  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default,
    timeZone: 'Asia/Jakarta'
  };
});




