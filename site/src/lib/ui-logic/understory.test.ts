import { describe, expect, it } from "vitest";
import { getUnderstoryWidgetConfig } from "./understory";

describe("understory widget config", () => {
  it("uses official widget script and data attributes", () => {
    const config = getUnderstoryWidgetConfig(
      "3b3aa7a7c2cd455b8f3a56cd81033110",
      "sv",
    );

    expect(config.scriptSrc).toBe(
      "https://widgets.understory.io/widgets/understory-booking-widget.js",
    );
    expect(config.className).toBe("understory-booking-widget");
    expect(config.companyId).toBe("3b3aa7a7c2cd455b8f3a56cd81033110");
    expect(config.language).toBe("sv");
  });
});
