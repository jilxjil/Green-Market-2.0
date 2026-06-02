"use client";

import { useEffect, useState } from "react";

function getCountdownLabel(target: Date) {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return "Starts now";
  }

  const minutes = Math.ceil(diff / 60000);

  if (minutes < 60) {
    return `Starts in ${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.ceil(minutes / 60);

  if (hours < 48) {
    return `Starts in ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const days = Math.ceil(hours / 24);
  return `Starts in ${days} day${days === 1 ? "" : "s"}`;
}

export default function ConsultationCountdown({ scheduledFor }: { scheduledFor: string }) {
  const [label, setLabel] = useState(() => getCountdownLabel(new Date(scheduledFor)));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLabel(getCountdownLabel(new Date(scheduledFor)));
    }, 60000);

    return () => window.clearInterval(interval);
  }, [scheduledFor]);

  return <span>{label}</span>;
}
