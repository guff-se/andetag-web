import { describe, expect, it } from "vitest";
import {
  artWeekOpeningLeadAside,
  artYogaHeroCover,
  berlinAfterHoursBody,
  dejtTestimonialHeroCover,
  malinVaver2OpticalFibertextil,
  malinVaverOpticalFibertextil,
  testimonialCarouselDefaultBg,
} from "./stockholm-body-responsive-images";

describe("stockholm-body-responsive-images", () => {
  it("keeps P1 marketing paths root-relative and local", () => {
    const all = [
      testimonialCarouselDefaultBg,
      artYogaHeroCover,
      dejtTestimonialHeroCover,
      berlinAfterHoursBody,
      artWeekOpeningLeadAside,
      malinVaverOpticalFibertextil,
      malinVaver2OpticalFibertextil,
    ];
    for (const set of all) {
      Object.values(set).forEach((path) => {
        expect(path.startsWith("/wp-content/")).toBe(true);
        expect(path.includes("://")).toBe(false);
      });
    }
  });

  it("pins known testimonial default filenames", () => {
    expect(testimonialCarouselDefaultBg.jpeg960).toContain("Andetag-27-037-copy-scaled-testimonial-960w.jpg");
  });
});
