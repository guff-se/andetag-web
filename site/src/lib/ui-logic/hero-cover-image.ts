/** `HeroSection` cover: single URL or responsive WebP + JPEG fallback (parallax targets inner `img`). */
export type HeroCoverImage =
  | string
  | {
      jpeg960: string;
      webp640: string;
      webp960: string;
    };

export function isHeroCoverResponsive(
  value: HeroCoverImage | undefined,
): value is { jpeg960: string; webp640: string; webp960: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "jpeg960" in value &&
    "webp640" in value &&
    "webp960" in value
  );
}
