<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Presenter } from "./mvp/presenter";
  import { bindPlayground } from "./playground";
  import Header from "./partials/Header.svelte";
  import Status from "./partials/Status.svelte";
  import Typography from "./partials/Typography.svelte";
  import Grid from "./partials/Grid.svelte";
  import Timeline from "./partials/Timeline.svelte";
  import Tabs from "./partials/Tabs.svelte";
  import Datagrid from "./partials/Datagrid.svelte";
  import Tree from "./partials/Tree.svelte";
  import FeedbackOverlay from "./partials/FeedbackOverlay.svelte";
  import FormInputs from "./partials/FormInputs.svelte";
  import Editor from "./partials/Editor.svelte";
  import InlineEditor from "./partials/InlineEditor.svelte";
  import Dropdown from "./partials/Dropdown.svelte";
  import DataDisplay from "./partials/DataDisplay.svelte";
  import Navigation from "./partials/Navigation.svelte";
  import AdvancedInputs from "./partials/AdvancedInputs.svelte";
  import Feedback from "./partials/Feedback.svelte";
  import Dialog from "./partials/Dialog.svelte";

  export let presenter: Presenter;

  const { attach } = presenter;
  let cleanup: (() => void) | null = null;
  let cleanupPresenter: (() => void) | null = null;
  let appEl: HTMLElement | null = null;

  onMount(async () => {
    cleanupPresenter = attach();
    cleanup = bindPlayground(appEl);
  });

  onDestroy(() => {
    cleanupPresenter?.();
    cleanup?.();
  });
</script>

<main class="vanilla-app" bind:this={appEl}>
  <section class="ds-container ds-stack-6 px-10 py-2" data-sv-root>
    <Header />
    <Status />
    <Typography />
    <Grid />
    <Timeline />
    <Tabs />
    <Datagrid />
    <Tree />
    <FeedbackOverlay />
    <FormInputs />
    <Editor />
    <InlineEditor />
    <Dropdown />
    <DataDisplay />
    <Navigation />
    <AdvancedInputs />
    <Feedback />
    <Dialog />
  </section>
</main>
