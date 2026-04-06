import type { Language } from "../chrome/types";

export function getUnderstoryWidgetConfig(companyId: string, language: Language) {
  return {
    scriptSrc: "https://widgets.understory.io/widgets/understory-booking-widget.js",
    className: "understory-booking-widget",
    companyId,
    language,
  };
}
