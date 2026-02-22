<section class="ds-card ds-stack-3 ds-anim-fade-in">
  <h2 class="ds-h4">DataGrid + DatePicker</h2>
  <div class="ds-datagrid">
    <table class="ds-datagrid__table" data-js="datagrid">
      <thead class="ds-datagrid__head">
        <tr>
          <th class="ds-datagrid__th" data-ds-sortable data-ds-field="name">Name</th>
          <th class="ds-datagrid__th" data-ds-sortable data-ds-field="status">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="ds-datagrid__td" data-ds-field="name">Project A</td>
          <td class="ds-datagrid__td" data-ds-field="status">Active</td>
        </tr>
        <tr>
          <td class="ds-datagrid__td" data-ds-field="name">Project B</td>
          <td class="ds-datagrid__td" data-ds-field="status">Paused</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="ds-datepicker" data-js="datepicker-inline"></div>
  <div class="ds-datepicker" data-js="datepicker-range-inline"></div>

  <div class="ds-datepicker-menu" data-js="datepicker-dropdown">
    <div class="ds-datepicker-trigger">
      <input class="ds-input ds-datepicker-input" data-ds-datepicker-input placeholder="Pick a date" readonly>
      <span class="ds-datepicker-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6.5 3.5V5.5M13.5 3.5V5.5M4.5 7.5H15.5M5.5 6.5H14.5C15.0523 6.5 15.5 6.94772 15.5 7.5V15.5C15.5 16.0523 15.0523 16.5 14.5 16.5H5.5C4.94772 16.5 4.5 16.0523 4.5 15.5V7.5C4.5 6.94772 4.94772 6.5 5.5 6.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
    </div>
    <div class="ds-datepicker-panel" data-ds-datepicker-panel hidden></div>
  </div>

  <div class="ds-datepicker-menu" data-js="date-range-dropdown">
    <div class="ds-datepicker-trigger">
      <input class="ds-input ds-datepicker-input" data-ds-datepicker-input placeholder="Select range" readonly>
      <span class="ds-datepicker-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6.5 3.5V5.5M13.5 3.5V5.5M4.5 7.5H15.5M5.5 6.5H14.5C15.0523 6.5 15.5 6.94772 15.5 7.5V15.5C15.5 16.0523 15.0523 16.5 14.5 16.5H5.5C4.94772 16.5 4.5 16.0523 4.5 15.5V7.5C4.5 6.94772 4.94772 6.5 5.5 6.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
    </div>
    <div class="ds-datepicker-panel" data-ds-datepicker-panel hidden></div>
  </div>

  <div class="ds-datepicker-menu" data-js="date-time-dropdown">
    <div class="ds-datepicker-trigger">
      <input class="ds-input ds-datepicker-input" data-ds-datepicker-input placeholder="Pick date &amp; time" readonly>
      <span class="ds-datepicker-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6.5 3.5V5.5M13.5 3.5V5.5M4.5 7.5H15.5M5.5 6.5H14.5C15.0523 6.5 15.5 6.94772 15.5 7.5V15.5C15.5 16.0523 15.0523 16.5 14.5 16.5H5.5C4.94772 16.5 4.5 16.0523 4.5 15.5V7.5C4.5 6.94772 4.94772 6.5 5.5 6.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
    </div>
    <div class="ds-datepicker-panel" data-ds-datepicker-panel hidden>
      <div data-ds-datepicker-calendar></div>
      <div class="ds-datepicker__footer" data-ds-datepicker-footer>
        <span class="ds-datepicker__footer-label">Time</span>
        <div class="ds-time-picker" data-ds-datetime-picker>
          <div class="ds-select-menu ds-time-picker__segment" data-ds-time-hour data-placeholder="HH" data-searchable="true" data-options='["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]'>
            <button class="ds-select-trigger" type="button">
              <span class="ds-select-trigger__label">HH</span>
              <span class="ds-select-trigger__icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </button>
          </div>
          <span class="ds-time-picker__colon">:</span>
          <div class="ds-select-menu ds-time-picker__segment" data-ds-time-minute data-placeholder="MM" data-searchable="true" data-options='["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"]'>
            <button class="ds-select-trigger" type="button">
              <span class="ds-select-trigger__label">MM</span>
              <span class="ds-select-trigger__icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
