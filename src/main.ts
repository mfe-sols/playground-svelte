import "./styles.css";
import singleSpaSvelte from "single-spa-svelte";
import Root from "./Root.svelte";
import {
  defineDesignSystem,
  ensureTokens,
  ensureThemeToggle,
  initThemeMode,
} from "@mfe-sols/ui-kit";
import { getStoredLocale, initI18nFromStorage, setLocale, t } from "@mfe-sols/i18n";
import { createPresenter } from "./mvp/presenter";
import { initMfeErrorReporter } from "./mfe-error-reporter";

const presenter = createPresenter();
const resolveBundleOrigin = (): string | null => {
  try {
    if (typeof import.meta !== "undefined" && typeof import.meta.url === "string") {
      return new URL(import.meta.url).origin;
    }
  } catch {
    // ignore
  }
  return null;
};

const isRunningInsideShell = () => {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.querySelector("single-spa-router") ||
      document.querySelector('[data-app="@org/playground-svelte"]')
  );
};

const bundleOrigin = resolveBundleOrigin();
const isSameOriginBundle =
  typeof window === "undefined" || !bundleOrigin
    ? true
    : bundleOrigin === window.location.origin;
const isStandalone = !isRunningInsideShell() && isSameOriginBundle;
initMfeErrorReporter("@org/playground-svelte");

defineDesignSystem({ tailwind: true });
ensureTokens();
initI18nFromStorage();

const isTrustedOrigin = (origin: string) =>
  origin === window.location.origin ||
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

const isTrustedMessage = (event: MessageEvent) => {
  if (!isTrustedOrigin(event.origin)) return false;
  const source = event.source;
  if (source && source !== window && source !== window.parent) return false;
  return true;
};

const normalizeDisabledList = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) return null;
  return value.filter((item): item is string => typeof item === "string");
};

const lifecycles = singleSpaSvelte({
  component: Root,
  props: { presenter },
  domElementGetter: (props?: { domElement?: Element | null }) => {
    // In single-spa layout mode, mount into the container provided by the shell.
    if (props?.domElement instanceof HTMLElement) {
      return props.domElement;
    }

    let el = document.getElementById("app");
    if (!el) {
      el = document.createElement("div");
      el.id = "app";
      document.body.appendChild(el);
    }
    return el;
  },
});

const mountThemeToggle = (container?: Element | null) => {
  const target = (container as HTMLElement | null) || document.getElementById("app");
  if (!target) return null;
  const storageKey = "ds-theme:playground-svelte";
  initThemeMode(target, storageKey);
  return ensureThemeToggle(target, t("toggleTheme"), {
    target,
    storageKey,
    placement: "bottom-right",
  });
};

let themeCleanup: (() => void) | null = null;
const applyLocale = (next: string) => {
  const normalized = next === "vi" ? "vi" : "en";
  setLocale(normalized);
  document.documentElement.setAttribute("lang", normalized);
  if (themeCleanup) {
    themeCleanup();
    themeCleanup = null;
  }
  themeCleanup = mountThemeToggle(document.getElementById("app"));
};

applyLocale(getStoredLocale());

window.addEventListener("message", (event) => {
  if (!isTrustedMessage(event)) return;
  const data = event.data;
  if (!data || data.type !== "mfe-toggle") return;
  const disabled = normalizeDisabledList(data.disabled);
  if (!disabled) return;
  try {
    window.localStorage.setItem("mfe-disabled", JSON.stringify(disabled));
  } catch {
    return;
  }
  if (!window.location.search.includes("mfe-bridge=1")) {
    window.location.reload();
  }
});

window.addEventListener("app-locale-change", (event) => {
  const detail = (event as CustomEvent<{ locale?: string }>).detail;
  if (detail?.locale) {
    applyLocale(detail.locale);
  }
});
window.addEventListener("storage", (event) => {
  if (event.key === "mfe-disabled") {
    window.location.reload();
  }
  if (event.key === "app-locale") {
    applyLocale(getStoredLocale());
  }
});

// Always export lifecycle hooks for single-spa
export const bootstrap = lifecycles.bootstrap;
export const mount = (props: Record<string, unknown>) => {
  if (isStandalone) {
    let isDisabled = false;
    try {
      const raw = window.localStorage.getItem("mfe-disabled");
      if (raw) {
        const parsed = JSON.parse(raw);
        isDisabled =
          Array.isArray(parsed) && parsed.includes("@org/playground-svelte");
      }
    } catch {
      isDisabled = false;
    }

    if (isDisabled) {
      const target = document.getElementById("app");
      if (target) {
        const main = document.createElement("main");
        main.className = "app";
        const title = document.createElement("h1");
        title.textContent = "playground-svelte";
        const message = document.createElement("p");
        message.textContent = t("templateDisabledMessage");
        main.append(title, message);
        target.replaceChildren(main);
      }
      return Promise.resolve();
    }
  }
  return lifecycles.mount(props);
};
export const unmount = lifecycles.unmount;

if (isStandalone) {
  mount({}).catch((error) => {
    console.error("[playground-svelte] standalone fallback mount failed", error);
  });
}
