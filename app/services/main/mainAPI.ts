import apiServices from "../apiServices";
import { validateOrThrowApiResponse } from "../response-validator";

const mainAPI = {

    getPublicWebsiteContent() {
        return apiServices
            .get(
                `public/content`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            )
            .then((res) => validateOrThrowApiResponse(res))
            .catch((err) => {
                console.log("Error getPublicWebsiteContent:", err);
                return {
                    status: "failed",
                    errMessage:
                        err?.message ||
                        err?.errMessage ||
                        (typeof err === "string" ? err : null) ||
                        "Failed to fetch public website content",
                    error: err,
                };
            });
    },

}

export default mainAPI;