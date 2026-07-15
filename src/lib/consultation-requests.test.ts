import { describe, expect, it } from "vitest";
import { canTransitionConsultationRequestStatus } from "./consultation-requests";

describe("consultation lifecycle", () => {
  it("follows the accepted and scheduled flow", () => {
    expect(canTransitionConsultationRequestStatus("pending", "accepted")).toBe(true);
    expect(canTransitionConsultationRequestStatus("accepted", "scheduled")).toBe(true);
    expect(canTransitionConsultationRequestStatus("scheduled", "completed")).toBe(true);
  });
  it("does not reopen terminal requests", () => {
    expect(canTransitionConsultationRequestStatus("completed", "accepted")).toBe(false);
    expect(canTransitionConsultationRequestStatus("cancelled", "scheduled")).toBe(false);
  });
});
