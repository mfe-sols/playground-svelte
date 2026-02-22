<section class="ds-card ds-stack-3 ds-anim-fade-in">
  <h2 class="ds-h4">TreeView</h2>
  <div class="ds-tree mfe-tree" data-js="tree" id="demo-tree">
    <div class="ds-tree__item" data-ds-tree-item data-ds-id="root" data-state="open">
      <button class="ds-tree__toggle" type="button" data-ds-tree-toggle>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </button>
      <span class="mfe-tree__node-icon" aria-hidden="true">WS</span>
      <span class="mfe-tree__content">
        <span class="ds-tree__label mfe-tree__label">Workspace</span>
        <span class="mfe-tree__meta">Unified platform modules</span>
      </span>
      <span class="mfe-tree__pill">Live</span>
      <div class="ds-tree__children" data-ds-tree-children data-state="open">
        <div class="ds-tree__item" data-ds-tree-item data-ds-id="projects" data-state="open">
          <button class="ds-tree__toggle" type="button" data-ds-tree-toggle>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <span class="mfe-tree__node-icon" aria-hidden="true">PJ</span>
          <span class="mfe-tree__content">
            <span class="ds-tree__label mfe-tree__label">Projects</span>
            <span class="mfe-tree__meta">Production applications</span>
          </span>
          <span class="mfe-tree__pill">3</span>
          <div class="ds-tree__children" data-ds-tree-children data-state="open">
            <div class="ds-tree__item" data-ds-tree-item data-ds-id="project-a">
              <span class="mfe-tree__spacer" aria-hidden="true"></span>
              <span class="mfe-tree__node-icon mfe-tree__node-icon--leaf" aria-hidden="true">A</span>
              <span class="mfe-tree__content">
                <span class="ds-tree__label mfe-tree__label">Project Alpha</span>
                <span class="mfe-tree__meta">Core commerce shell</span>
              </span>
            </div>
            <div class="ds-tree__item" data-ds-tree-item data-ds-id="project-b">
              <span class="mfe-tree__spacer" aria-hidden="true"></span>
              <span class="mfe-tree__node-icon mfe-tree__node-icon--leaf" aria-hidden="true">B</span>
              <span class="mfe-tree__content">
                <span class="ds-tree__label mfe-tree__label">Project Beta</span>
                <span class="mfe-tree__meta">Analytics workspace</span>
              </span>
            </div>
          </div>
        </div>
        <div class="ds-tree__item" data-ds-tree-item data-ds-id="teams" data-state="closed">
          <button class="ds-tree__toggle" type="button" data-ds-tree-toggle>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <span class="mfe-tree__node-icon" aria-hidden="true">TM</span>
          <span class="mfe-tree__content">
            <span class="ds-tree__label mfe-tree__label">Teams</span>
            <span class="mfe-tree__meta">Organization units</span>
          </span>
          <span class="mfe-tree__pill">2</span>
          <div class="ds-tree__children" data-ds-tree-children data-state="closed" hidden>
            <div class="ds-tree__item" data-ds-tree-item data-ds-id="team-a">
              <span class="mfe-tree__spacer" aria-hidden="true"></span>
              <span class="mfe-tree__node-icon mfe-tree__node-icon--leaf" aria-hidden="true">DS</span>
              <span class="mfe-tree__content">
                <span class="ds-tree__label mfe-tree__label">Design</span>
                <span class="mfe-tree__meta">UX and visual language</span>
              </span>
            </div>
            <div class="ds-tree__item" data-ds-tree-item data-ds-id="team-b">
              <span class="mfe-tree__spacer" aria-hidden="true"></span>
              <span class="mfe-tree__node-icon mfe-tree__node-icon--leaf" aria-hidden="true">EN</span>
              <span class="mfe-tree__content">
                <span class="ds-tree__label mfe-tree__label">Engineering</span>
                <span class="mfe-tree__meta">Platform and delivery</span>
              </span>
            </div>
          </div>
        </div>
        <div class="ds-tree__item" data-ds-tree-item data-ds-id="archives" data-state="closed">
          <button class="ds-tree__toggle" type="button" data-ds-tree-toggle>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <span class="mfe-tree__node-icon" aria-hidden="true">AR</span>
          <span class="mfe-tree__content">
            <span class="ds-tree__label mfe-tree__label">Archives</span>
            <span class="mfe-tree__meta">Historical snapshots</span>
          </span>
          <span class="mfe-tree__pill">2</span>
          <div class="ds-tree__children" data-ds-tree-children data-state="closed" hidden>
            <div class="ds-tree__item" data-ds-tree-item data-ds-id="2023">
              <span class="mfe-tree__spacer" aria-hidden="true"></span>
              <span class="mfe-tree__node-icon mfe-tree__node-icon--leaf" aria-hidden="true">23</span>
              <span class="mfe-tree__content">
                <span class="ds-tree__label mfe-tree__label">2023</span>
                <span class="mfe-tree__meta">Release notes and logs</span>
              </span>
            </div>
            <div class="ds-tree__item" data-ds-tree-item data-ds-id="2022">
              <span class="mfe-tree__spacer" aria-hidden="true"></span>
              <span class="mfe-tree__node-icon mfe-tree__node-icon--leaf" aria-hidden="true">22</span>
              <span class="mfe-tree__content">
                <span class="ds-tree__label mfe-tree__label">2022</span>
                <span class="mfe-tree__meta">Baseline archive</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
