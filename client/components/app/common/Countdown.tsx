import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

const durationToString = (duration: number) => duration.toString().padStart(2, "0");

const Countdown: React.FC<CountdownProps> = React.memo(({ targetDate }) => {
  const countDownDate = useMemo(() => moment(targetDate).valueOf(), [targetDate]);
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());
  const duration = moment.duration(countDown);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return (
    <>
      {duration.days() !== 0 && `${durationToString(duration.days())}:`}
      {duration.hours() !== 0 && `${durationToString(duration.hours())}:`}
      {duration.minutes() !== 0 && `${durationToString(duration.minutes())}:`}
      {durationToString(duration.seconds())}
    </>
  );
});

Countdown.displayName = "Countdown";

export default Countdown;
