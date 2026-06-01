export const consultationRequestStatuses = [
  "pending",
  "accepted",
  "rejected",
  "scheduled",
  "completed",
  "cancelled",
] as const;

export type ConsultationRequestStatus =
  (typeof consultationRequestStatuses)[number];

export function isConsultationRequestStatus(
  status: string
): status is ConsultationRequestStatus {
  return consultationRequestStatuses.includes(
    status as ConsultationRequestStatus
  );
}

export function canTransitionConsultationRequestStatus(
  currentStatus: string,
  nextStatus: ConsultationRequestStatus
) {
  if (currentStatus === "pending") {
    return (
      nextStatus === "accepted" ||
      nextStatus === "rejected" ||
      nextStatus === "cancelled"
    );
  }

  if (currentStatus === "accepted") {
    return nextStatus === "scheduled" || nextStatus === "cancelled";
  }

  if (currentStatus === "scheduled") {
    return nextStatus === "completed" || nextStatus === "cancelled";
  }

  return false;
}

export function isExpertNextStatus(status: ConsultationRequestStatus) {
  return (
    status === "accepted" ||
    status === "rejected" ||
    status === "scheduled" ||
    status === "completed"
  );
}

