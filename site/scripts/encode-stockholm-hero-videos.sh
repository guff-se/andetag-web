#!/usr/bin/env bash
# Re-encode Swedish full hero loop (H.264 MP4, faststart) from a high-bitrate master.
# Requires: ffmpeg with libx264. Run from any cwd.
# Example: ./scripts/encode-stockholm-hero-videos.sh ~/Movies/Desktop-master.mp4
set -euo pipefail
MASTER="${1:?Usage: $0 path/to/source-hero.mp4}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/../public/wp-content/uploads/2024/12"
mkdir -p "$OUT_DIR"

ffmpeg -y -i "$MASTER" -an -c:v libx264 -preset medium -crf 26 -maxrate 3.5M -bufsize 7M \
  -movflags +faststart -pix_fmt yuv420p "$OUT_DIR/stockholm-hero-desktop.mp4"
ffmpeg -y -i "$MASTER" -an -vf "scale=-2:540:flags=lanczos" -c:v libx264 -preset medium -crf 28 \
  -maxrate 1.6M -bufsize 3.2M -movflags +faststart -pix_fmt yuv420p "$OUT_DIR/stockholm-hero-mobile.mp4"
ls -la "$OUT_DIR/stockholm-hero-desktop.mp4" "$OUT_DIR/stockholm-hero-mobile.mp4"
