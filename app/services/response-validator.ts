export interface ApiResponse<T = unknown> {
  status: number;
  statusText?: string;
  data?: T;
}

/**
 * Unwraps an axios response, throwing on non-2xx so the caller's `.catch`
 * can normalize it into the shared failed-result shape.
 */
export function validateOrThrowApiResponse<T = unknown>(
  responseObj: ApiResponse<T> | null | undefined
): T {
  if (!responseObj) {
    throw new Error("No response from server");
  }

  const isInvalid = responseObj.status < 200 || responseObj.status > 299;

  if (isInvalid) {
    let errorMessage = "Error";
    if (responseObj.status === 500) {
      errorMessage = "Server error";
    } else if (responseObj.statusText) {
      errorMessage = responseObj.statusText;
    }
    throw new Error(errorMessage);
  }

  return responseObj.data as T;
}
