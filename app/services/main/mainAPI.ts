import apiServices from "../apiServices";
import { validateOrThrowApiResponse } from "../response-validator";
import type { PublicWebsiteContent } from "@/app/types/content";

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type FailedResult = {
  status: "failed";
  errMessage: string;
  error: unknown;
};

export type WebsiteContentResult =
  | ApiEnvelope<PublicWebsiteContent>
  | FailedResult;

export type VisitTrackResult =
  | ApiEnvelope<{ visit_date: string; visit_count: number }>
  | FailedResult;

function failedResult(err: unknown, fallback: string): FailedResult {
  const candidate = err as { message?: string; errMessage?: string } | null;
  return {
    status: "failed",
    errMessage:
      candidate?.message ||
      candidate?.errMessage ||
      (typeof err === "string" ? err : null) ||
      fallback,
    error: err,
  };
}

const mainAPI = {
  /**
   * Whole landing payload in one request. The API omits any section whose
   * `site_settings.show_*` flag is false.
   *
   * The timeout is shorter than the axios default because this call runs during
   * server rendering and would otherwise hold the response open.
   */
  getPublicWebsiteContent() {
    return apiServices
      .get(`public/content`, {
        timeout: 12000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => validateOrThrowApiResponse<ApiEnvelope<PublicWebsiteContent>>(res))
      .catch((err): FailedResult => {
        const failed = failedResult(
          err,
          "Failed to fetch public website content"
        );
        console.error("getPublicWebsiteContent failed:", failed.errMessage);
        return failed;
      });
  },

  /** Increments today's visit counter. Public endpoint, no admin token. */
  trackWebsiteVisit(amount = 1) {
    return apiServices
      .post(
        `website-visits/track`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) =>
        validateOrThrowApiResponse<
          ApiEnvelope<{ visit_date: string; visit_count: number }>
        >(res)
      )
      .catch((err): FailedResult => {
        const failed = failedResult(err, "Failed to track website visit");
        console.error("trackWebsiteVisit failed:", failed.errMessage);
        return failed;
      });
  },
};

export default mainAPI;
