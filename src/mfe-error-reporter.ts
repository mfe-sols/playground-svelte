export type MfeErrorLevel = "error" | "warn" | "info";

type MfeErrorPayload = {
  type: "mfe-error";
  module: string;
  level: MfeErrorLevel;
  message: string;
  detail?: string;
  url?: string;
  messageKey?: string;
};

const MAX_DETAIL = 800;
const DEDUPE_WINDOW_MS = 3000;

const getParentOrigin = (): string | null => {
  try {
    if (typeof document !== "undefined" && document.referrer) {
      return new URL(document.referrer).origin;
    }
  } catch {
    return null;
  }
  return null;
};

const isBridgeMode = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("mfe-bridge") === "1";
  } catch {
    return false;
  }
};

export const initMfeErrorReporter = (moduleName: string) => {
  if (typeof window === "undefined") {
    return { report: () => undefined };
  }
  const parentOrigin = isBridgeMode() ? getParentOrigin() : null;
  if (!parentOrigin || window.parent === window) {
    return { report: () => undefined };
  }

  const recent = new Map<string, number>();

  const post = (payload: MfeErrorPayload) => {
    window.parent.postMessage(payload, parentOrigin);
  };

  const report = (
    level: MfeErrorLevel,
    message: string,
    detail?: string,
    extra?: Partial<MfeErrorPayload>
  ) => {
    const safeMessage = message || "Module error";
    const safeDetail = detail ? String(detail).slice(0, MAX_DETAIL) : undefined;
    const key = `${level}:${safeMessage}:${safeDetail ?? ""}`;
    const now = Date.now();
    const last = recent.get(key);
    if (last && now - last < DEDUPE_WINDOW_MS) return;
    recent.set(key, now);
    post({
      type: "mfe-error",
      module: moduleName,
      level,
      message: safeMessage,
      detail: safeDetail,
      url: window.location.href,
      ...(extra || {}),
    });
  };

  window.addEventListener("error", (event) => {
    report(
      "error",
      event.message || "Runtime error",
      event.error?.stack || event.error?.message
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    report(
      "error",
      "Unhandled promise rejection",
      event.reason?.stack || event.reason?.message || String(event.reason || "")
    );
  });

  return { report };
};

export type MfeErrorReporter = ReturnType<typeof initMfeErrorReporter>;
