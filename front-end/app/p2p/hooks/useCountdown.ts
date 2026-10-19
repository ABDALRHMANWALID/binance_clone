import { useEffect, useState } from "react";

export function useCountdown(target?: string | null) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const compute = () =>
      target
        ? Math.max(
            0,
            Math.floor((new Date(target).getTime() - Date.now()) / 1000),
          )
        : 0;

    setSeconds(compute());
    if (!target) return;

    const id = setInterval(() => setSeconds(compute()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return { seconds, label: `${mm}:${ss}`, expired: seconds === 0 };
}
