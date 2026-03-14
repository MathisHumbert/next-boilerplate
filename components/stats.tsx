"use client";

import { useEffect, useRef } from "react";
import _Stats from "stats.js";
import gsap from "gsap";

export function Stats() {
  const statsRef = useRef<_Stats | null>(null);

  useEffect(() => {
    const stats = new _Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    statsRef.current = stats;

    const beginTicker = () => { stats.begin(); };
    const endTicker = () => { stats.end(); };

    gsap.ticker.add(beginTicker, false, true);
    gsap.ticker.add(endTicker);

    return () => {
      gsap.ticker.remove(beginTicker);
      gsap.ticker.remove(endTicker);
      stats.dom.remove();
      statsRef.current = null;
    };
  }, []);

  return null;
}
