import { derived, writable } from "svelte/store";
import { createModel } from "../model";
import { formatTitle } from "../usecase";
import { createQueryClient, fetchSummary, summaryQueryKey } from "../service";
import { getStoredLocale, setLocale, t, type I18nKey } from "@mfe-sols/i18n";

export type Presenter = ReturnType<typeof createPresenter>;

export const createPresenter = () => {
  const model = createModel();
  const locale = writable(getStoredLocale());

  const title = derived(locale, ($locale) => {
    setLocale($locale);
    return formatTitle(`${model.appName} ${t(model.titleSuffixKey)}`);
  });

  const headings = derived(locale, ($locale) => {
    setLocale($locale);
    return model.headingKeys.map((key: I18nKey) => t(key));
  });

  const applyLocale = (next: string) => {
    const normalized = next === "vi" ? "vi" : "en";
    setLocale(normalized);
    locale.set(normalized);
    document.documentElement.setAttribute("lang", normalized);
  };

  const onLocaleChange = (event: Event) => {
    const detail = (event as CustomEvent<{ locale?: string }>).detail;
    if (detail?.locale) {
      applyLocale(detail.locale);
    }
  };

  const onLocaleStorage = (event: StorageEvent) => {
    if (event.key === "app-locale") {
      applyLocale(getStoredLocale());
    }
  };

  const attach = () => {
    applyLocale(getStoredLocale());
    window.addEventListener("app-locale-change", onLocaleChange);
    window.addEventListener("storage", onLocaleStorage);
    return () => {
      window.removeEventListener("app-locale-change", onLocaleChange);
      window.removeEventListener("storage", onLocaleStorage);
    };
  };

  return { title, headings, attach };
};

export const fetchSummaryExample = async () => {
  const client = createQueryClient();
  return client.fetchQuery({
    queryKey: summaryQueryKey,
    queryFn: fetchSummary,
  });
};

export const loadSummary = () => {
  const client = createQueryClient();
  return client.fetchQuery({
    queryKey: summaryQueryKey,
    queryFn: fetchSummary,
  });
};
