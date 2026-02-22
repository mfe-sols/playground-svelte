<section class="ds-card ds-stack-3 ds-anim-fade-in z-10">
  <h2 class="ds-h4">Inline Text Editor</h2>
  <p class="ds-body1 ds-inline-edit" data-ds-inline-edit="headline">
    Build delightful experiences with a unified design system.
  </p>
  <p class="ds-body2 ds-inline-edit" data-ds-inline-edit="subhead">
    Hover or click to edit inline. Changes save to the text immediately.
  </p>
  <div class="ds-inline-editor ds-anim-fade-in" data-js="inline-editor" hidden>
    <div class="ds-stack-2">
      <div class="ds-label" id="inline-editor-label">Edit text</div>
      <div
        id="inline-richtext-editor"
        data-ds-editor-shell
        role="textbox"
        aria-labelledby="inline-editor-label"
      ></div>
      <div class="ds-inline-3">
        <button class="ds-btn ds-btn--primary ds-btn--sm" type="button" data-js="inline-editor-save">Save</button>
        <button class="ds-btn ds-btn--secondary ds-btn--sm" type="button" data-js="inline-editor-cancel">
          Cancel
        </button>
      </div>
    </div>
  </div>
</section>
