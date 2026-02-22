<section class="ds-card ds-stack-3 ds-anim-fade-in">
  <h2 class="ds-h4">Form Inputs</h2>
  <div class="ds-grid-2">
    <div class="ds-field">
      <label class="ds-label" for="input-first-name">First name</label>
      <input class="ds-input" id="input-first-name" placeholder="Jane" />
      <span class="ds-helper">Required</span>
    </div>
    <div class="ds-field">
      <label class="ds-label" for="input-last-name">Last name</label>
      <input class="ds-input" id="input-last-name" placeholder="Doe" />
    </div>
  </div>
  <div class="ds-field">
    <label class="ds-label" for="input-email">Email</label>
    <div class="ds-input-group">
      <input class="ds-input" id="input-email" placeholder="you@domain.com" />
      <button class="ds-btn ds-btn--secondary ds-btn--md" type="button">Verify</button>
    </div>
    <span class="ds-error">Invalid email</span>
  </div>
  <div class="ds-field">
    <label class="ds-label" for="input-password">Password</label>
    <div class="ds-input-group relative">
      <input
        class="ds-input pr-10"
        id="input-password"
        type="password"
        placeholder="Create a password"
        autocomplete="new-password"
        data-js="password-input"
      />
      <button
        class="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        type="button"
        data-js="password-toggle"
        aria-label="Show password"
        title="Show password"
      >
        <svg
          data-js="password-icon-show"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg
          data-js="password-icon-hide"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          hidden
        >
          <path d="M3 3l18 18" />
          <path d="M10.7 10.7a3 3 0 0 0 4.24 4.24" />
          <path d="M9.88 4.73A9.96 9.96 0 0 1 12 4.5c6 0 9.5 7 9.5 7a18.4 18.4 0 0 1-4.27 5.12" />
          <path d="M6.11 6.11A18.4 18.4 0 0 0 2.5 11.5s3.5 7 9.5 7a9.96 9.96 0 0 0 5.16-1.45" />
        </svg>
      </button>
    </div>
    <span class="ds-helper">Use at least 8 characters.</span>
  </div>
  <div class="ds-grid-2">
    <div class="ds-field">
      <label class="ds-label" for="input-phone">Phone number</label>
      <div class="ds-input-group">
        <div class="ds-select-menu ds-phone-select" data-placeholder="Code" data-options='["+1","+33","+44","+49","+65","+81","+84"]' data-js="phone-select">
          <button class="ds-select-trigger" type="button">
            <span class="ds-select-trigger__label">+1</span>
            <span class="ds-select-trigger__icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </button>
        </div>
        <input class="ds-input" id="input-phone" inputmode="tel" placeholder="(555) 123-4567" data-js="phone-input" />
      </div>
      <span class="ds-helper">Select country code</span>
    </div>
    <div class="ds-field">
      <label class="ds-label" for="input-card">Credit card</label>
      <div class="ds-input-group">
        <input class="ds-input" id="input-card" inputmode="numeric" placeholder="1234 5678 9012 3456" data-js="card-input" />
        <span class="ds-input-suffix">VISA</span>
      </div>
      <span class="ds-helper">Auto formatted</span>
    </div>
  </div>
  <div class="ds-grid-3">
    <div class="ds-field" style="grid-column: span 2">
      <label class="ds-label" for="input-card-name">Card details</label>
      <input class="ds-input" id="input-card-name" placeholder="Name on card" />
    </div>
    <div class="ds-field">
      <label class="ds-label" for="input-cvc">CVC</label>
      <input class="ds-input" id="input-cvc" inputmode="numeric" placeholder="123" data-js="cvc-input" />
      <span class="ds-helper">3–4 digits</span>
    </div>
  </div>
  <div class="ds-grid-2">
    <div class="ds-field">
      <label class="ds-label" for="input-quantity">Quantity</label>
      <div class="ds-input-group">
        <button class="ds-btn ds-btn--ghost ds-btn--sm" type="button" data-js="quantity-dec">−</button>
        <input class="ds-input" id="input-quantity" inputmode="numeric" data-js="quantity-input" />
        <button class="ds-btn ds-btn--ghost ds-btn--sm" type="button" data-js="quantity-inc">+</button>
      </div>
      <span class="ds-helper">Stepper input</span>
    </div>
    <div class="ds-field">
      <label class="ds-label" for="input-amount">Amount</label>
      <div class="ds-input-group">
        <div class="ds-select-menu ds-currency-select" data-placeholder="USD" data-options='["USD","EUR","VND","JPY","SGD"]' data-js="currency-select">
          <button class="ds-select-trigger" type="button">
            <span class="ds-select-trigger__label">USD</span>
            <span class="ds-select-trigger__icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </button>
        </div>
        <input class="ds-input" id="input-amount" inputmode="decimal" placeholder="0.00" data-js="currency-input" />
        <span class="ds-input-suffix">.00</span>
      </div>
      <span class="ds-helper">Currency input</span>
    </div>
  </div>
  <div class="ds-inline-4">
    <label class="ds-inline-2">
      <input class="ds-checkbox" type="checkbox" />
      <span class="ds-body2">Remember me</span>
    </label>
    <label class="ds-inline-2">
      <input class="ds-radio" type="radio" name="opt" />
      <span class="ds-body2">Option A</span>
    </label>
    <label class="ds-switch-field">
      <input class="ds-switch-input" type="checkbox" />
      <span class="ds-switch-control"></span>
      <span class="ds-body2">Notifications</span>
    </label>
  </div>
  <textarea class="ds-textarea" placeholder="Message"></textarea>
  <div class="ds-select-menu" data-placeholder="Choose an option" data-options='["Option 1","Option 2","Option 3"]' data-js="select-menu">
    <button class="ds-select-trigger" type="button">
      <span class="ds-select-trigger__label">Choose an option</span>
      <span class="ds-select-trigger__icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
    </button>
  </div>
  <div class="ds-select-menu" data-placeholder="Select tags" data-multiple="true" data-options='["Design","Product","Engineering","Ops","Research"]' data-value='["Design","Product"]' data-js="select-menu-multi">
    <button class="ds-select-trigger" type="button">
      <span class="ds-select-trigger__label">Select tags</span>
      <span class="ds-select-trigger__icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
    </button>
  </div>
</section>
