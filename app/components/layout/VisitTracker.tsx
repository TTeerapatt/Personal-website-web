"use client";

import { useEffect } from "react";
import mainAPI from "@/app/services/main/mainAPI";

const SESSION_KEY = "personal_website_visit_tracked";

/**
 * Records one visit per browser session against the public
 * `POST /website-visits/track` endpoint.
 *
 * The session flag is written before the request so React Strict Mode's double
 * effect invocation in development cannot double-count. Failures are ignored —
 * analytics must never break the page.
 */
export default function VisitTracker() {
  useEffect(() => {
    let alreadyTracked = false;

    try {
      alreadyTracked = window.sessionStorage.getItem(SESSION_KEY) === "1";
      if (!alreadyTracked) window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage can be unavailable (private mode); fall through and track once.
    }

    if (alreadyTracked) return;
    void mainAPI.trackWebsiteVisit(1);
  }, []);

  return null;
}
