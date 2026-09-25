import {getRequestConfig} from 'next-intl/server';

export const locales = ['id', 'en'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({locale}) => {
  const safeLocale = (locale || 'id') as Locale;
  try {
    return {
      locale: safeLocale,
      messages: (await import(`../messages/${safeLocale}.json`)).default,
      timeZone: 'Asia/Jakarta'
    };
  } catch (error) {
    console.error(`Failed to load locale ${safeLocale}:`, error);
    // Fallback to Indonesian
    return {
      locale: 'id',
      messages: (await import(`../messages/id.json`)).default,
      timeZone: 'Asia/Jakarta'
    };
  }
});




