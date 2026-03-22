type UnderstoryLanguage = "sv" | "en" | "de";

export function getUnderstoryWidgetConfig(companyId: string, language: UnderstoryLanguage) {
  return {
    scriptSrc: "https://widgets.understory.io/widgets/understory-booking-widget.js",
    className: "understory-booking-widget",
    companyId,
    language,
  };
}
