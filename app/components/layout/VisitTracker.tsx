"use client";

import { useEffect } from "react";
import mainAPI from "@/app/services/main/mainAPI";

const SESSION_KEY = "personal_website_visit_tracked";

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
