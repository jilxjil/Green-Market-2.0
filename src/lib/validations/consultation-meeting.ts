import { z } from "zod";

const meetingProviders = ["google_meet", "zoom", "teams", "phone", "other"] as const;

function inferMeetingProvider(url: string) {
  const host = new URL(url).hostname.replace(/^www\./, "");

  if (host === "meet.google.com") {
    return "google_meet";
  }

  if (host === "zoom.us" || host.endsWith(".zoom.us")) {
    return "zoom";
  }

  if (host === "teams.microsoft.com") {
    return "teams";
  }

  return "other";
}

export const consultationScheduleSchema = z.object({
  scheduledFor: z.coerce
    .date()
    .refine((value) => value.getTime() > Date.now(), "Pick a future date and time."),
  meetingUrl: z
    .string()
    .trim()
    .url("Enter a valid meeting link.")
    .refine((value) => {
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    }, "Meeting links must start with https://."),
  meetingNotes: z
    .string()
    .trim()
    .max(1000, "Meeting notes must be 1000 characters or fewer.")
    .optional()
    .nullable(),
  meetingProvider: z.enum(meetingProviders).optional().nullable(),
});

export function normalizeScheduleInput(input: unknown) {
  const parsed = consultationScheduleSchema.parse(input);

  return {
    ...parsed,
    meetingNotes: parsed.meetingNotes || null,
    meetingProvider: parsed.meetingProvider || inferMeetingProvider(parsed.meetingUrl),
  };
}
