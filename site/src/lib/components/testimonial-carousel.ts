export function getWrappedIndex(index: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return ((index % total) + total) % total;
}
