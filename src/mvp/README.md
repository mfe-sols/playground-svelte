# MVP Structure

Folders:
- `model/` data contracts + defaults
- `presenter/` view-model mapping
- `usecase/` domain logic (formatting, validation, rules)
- `service/` integrations (API, storage, side effects)

Simple example:
```ts
// usecase
export const formatTitle = (title: string) => title.trim();

// presenter
const title = derived(locale, () => formatTitle(model.title));
```

Service example:
```ts
// service
export const fetchSummary = async () =>
  Promise.resolve({ title: "Hello", headings: ["One", "Two"] });

// presenter
const summary = await fetchSummary();
```

TanStack Query Core:
```ts
import { createQueryClient } from "../service";

const client = createQueryClient();
const data = await client.fetchQuery({
  queryKey: summaryQueryKey,
  queryFn: fetchSummary,
});
```
