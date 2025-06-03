import { initReactI18next } from "react-i18next";

import i18n from "../i18n";
import en from "./en/TaskListPage.json";

export async function testLocaleSetup() {
  await i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    resources: {
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
  });
}
