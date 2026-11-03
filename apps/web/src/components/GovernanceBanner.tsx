"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SESSION_KEY = "governance-banner-dismissed";

interface GovernanceBannerProps {
  /** Number of currently active governance proposals */
  activeProposalCount: number;
}

/**
 * GovernanceBanner
 *
 * Displays a dismissible announcement at the top of the feed when there are
 * active governance proposals. Dismissal is stored in sessionStorage so the
 * banner reappears on the next browser session.
 *
 * Accessibility: uses role="complementary" and aria-label so screen readers
 * announce the banner without treating it as the primary page landmark.
 */
export function GovernanceBanner({ activeProposalCount }: GovernanceBannerProps) {
  const [dismissed, setDismissed] = useState(true); // start hidden until we check storage

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem(SESSION_KEY) === "true";
      setDismissed(isDismissed);
    } catch {
      // sessionStorage unavailable (e.g. SSR guard) — default to not dismissed
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // ignore storage errors
    }
    setDismissed(true);
  };

  if (dismissed || activeProposalCount === 0) {
    return null;
  }

  const proposalLabel =
    activeProposalCount === 1 ? "1 active governance proposal" : `${activeProposalCount} active governance proposals`;

  return (
    <div
      role="complementary"
      aria-label="Active governance proposals"
      className="relative flex items-center justify-between gap-3 rounded-xl border border-violet-500/40 bg-gradient-to-r from-violet-900/60 to-indigo-900/60 px-4 py-3 text-sm shadow-md mb-4"
    >
      {/* Icon + message */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg shrink-0" aria-hidden="true">
          🗳️
        </span>
        <p className="text-violet-200 font-medium truncate">
          {proposalLabel} — your vote matters
        </p>
      </div>

      {/* CTA + dismiss */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/governance"
          className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
          aria-label="Go to governance page to vote"
        >
          Vote now →
        </Link>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss governance announcement"
          className="flex h-6 w-6 items-center justify-center rounded-full text-violet-400 hover:bg-violet-800/60 hover:text-violet-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
        >
          ×
        </button>
      </div>
    </div>
  );
}
