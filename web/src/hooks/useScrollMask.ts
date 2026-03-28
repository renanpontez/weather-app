import { useRef, useState, useCallback, useMemo } from "react";

export function useScrollMask() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  const maskImage = useMemo(() => {
    if (canScrollLeft && canScrollRight) {
      return "linear-gradient(to right, transparent 0%, black 15%, black 80%, transparent 100%)";
    } else if (canScrollLeft) {
      return "linear-gradient(to right, transparent 0%, black 15%)";
    } else if (canScrollRight) {
      return "linear-gradient(to right, black 80%, transparent 100%)";
    }
    return "none";
  }, [canScrollLeft, canScrollRight]);

  return { scrollRef, maskImage, onScroll };
}
