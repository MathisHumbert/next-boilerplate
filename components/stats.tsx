"use client";

import { useEffect, useRef } from "react";
import _Stats from "stats.js";
import { useTempus } from "tempus/react";

export function Stats() {
  const statsRef = useRef<_Stats | null>(null);

  useEffect(() => {
    const stats = new _Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    statsRef.current = stats;

    return () => {
      stats.dom.remove();
      statsRef.current = null;
    };
  }, []);

  useTempus(
    () => {
      if (statsRef.current) {
        statsRef.current.begin();
      }
    },
    {
      priority: Number.NEGATIVE_INFINITY,
    }
  );

  useTempus(
    () => {
      if (statsRef.current) {
        statsRef.current.end();
      }
    },
    {
      priority: Number.POSITIVE_INFINITY,
    }
  );

  return null;
}
