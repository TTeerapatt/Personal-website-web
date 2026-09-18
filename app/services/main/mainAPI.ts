import apiServices from "../apiServices";
import { validateOrThrowApiResponse } from "../response-validator";

function failedResult(err: unknown, fallback: string) {
  return {
    status: "failed" as const,
    errMessage:
      (err as { message?: string; errMessage?: string })?.message ||
      (err as { errMessage?: string })?.errMessage ||
      (typeof err === "string" ? err : null) ||
      fallback,
  };
}

const mainAPI = {
  getPublicWebsiteContent() {
    return apiServices
      .get(`public/content`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => validateOrThrowApiResponse(res))
      .catch((err) => {
        console.log("Error getPublicWebsiteContent:", err);
        return failedResult(err, "Failed to fetch public website content");
      });
  },

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
      .then((res) => validateOrThrowApiResponse(res))
      .catch((err) => {
        console.log("Error trackWebsiteVisit:", err);
        return failedResult(err, "Failed to track website visit");
      });
  },
};

export default mainAPI;
