import { memo, useCallback, useEffect, useState } from 'react';
import { formatTime } from '../../Helper/Common';

const ETACountdown = memo(() => {
  const [countdown, setCountdown] = useState(30); // Countdown timer
  const [loading, setLoading] = useState(true); // Countdown timer

  const getData = useCallback(() => {
    setCountdown(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    const time = Math.round(Math.random() * 5 * 100);
    setTimeout(() => {
      getData();
    }, time * 100);
  }, []);

  useEffect(() => {
    if (loading) {
      const t = countdown - 1;
      if (t < 9) {
        setCountdown(Math.round(Math.random() * 100));
        return;
      }
      const interval = setTimeout(() => {
        setCountdown(t);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, countdown]);

  return (
    <div>
      {countdown !== null && (
        <p>Time left: - {formatTime(countdown)} seconds</p>
      )}
    </div>
  );
});

export default ETACountdown;
