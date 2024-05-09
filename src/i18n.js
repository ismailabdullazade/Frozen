import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    .use(resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}_v1.3.json`)))
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
//         lng: function ()  {
//             let lang = navigator.language || navigator.userLanguage;
//
//             if (lang.indexOf("-") > -1) {
//                 lang  = lang.split("-")[0];
//             }
// //i18nextLng
//             return lang;
//         }(),
        fallbackLng: {
            'ru': ['ru'],
            'default': ['ru']
        },
        // nonExplicitSupportedLngs: true,
        // cleanCode: true,
        load: 'currentOnly',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });


export default i18n;