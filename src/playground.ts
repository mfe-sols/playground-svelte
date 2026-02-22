import { el } from './components/dom';
import {
  initTooltip,
  initTreeView,
  mountEditor,
  sanitizeInlineHtml,
  initDatepicker as dsInitDatepicker,
  initDatepickerDropdown as dsInitDatepickerDropdown,
  initDateRangeCalendar as dsInitDateRangeCalendar,
  initDateRangeDropdown as dsInitDateRangeDropdown,
  initDateTimeDropdown as dsInitDateTimeDropdown,
} from '@mfe-sols/ui-kit';
import { getStoredLocale, setLocale, t } from '@mfe-sols/i18n';

type SelectMenuChange = (value: string[] | string) => void;
type SelectMenuOptions = {
  onChange?: SelectMenuChange;
};

export const bindPlayground = (root: ParentNode | null): (() => void) => {
  if (!root) return () => {};

  const apiBaseEl = root.querySelector<HTMLElement>('[data-js="api-base"]');
  const apiStatusEl = root.querySelector<HTMLElement>('[data-js="api-status"]');
  const sharedEl = root.querySelector<HTMLElement>('[data-js="shared-message"]');
  const updateSharedBtn = root.querySelector<HTMLElement>('[data-js="update-shared"]');
  const localeBadge = root.querySelector<HTMLElement>('[data-js="locale-badge"]');

  const getSharedValue = () => {
    try {
      return window.localStorage.getItem('shared:message') || '';
    } catch {
      return '';
    }
  };

  const setSharedValue = (value: string) => {
    try {
      window.localStorage.setItem('shared:message', value);
    } catch {
      return;
    }
  };

  const updateSharedText = () => {
    if (sharedEl) {
      sharedEl.textContent = `Shared message: ${getSharedValue()}`;
    }
  };

  const applyLocale = (next: string) => {
    const value = next === 'vi' ? 'vi' : 'en';
    setLocale(value);
    if (localeBadge) {
      localeBadge.textContent = `${t('localeLabel')}: ${value}`;
    }
    document.documentElement.setAttribute('lang', value);
  };
  const onLocaleChange = (event: Event) => {
    const detail = (event as CustomEvent<{ locale?: string }>).detail;
    if (detail?.locale) applyLocale(detail.locale);
  };
  const onLocaleStorage = (event: StorageEvent) => {
    if (event.key === 'app-locale') {
      applyLocale(getStoredLocale());
    }
  };

  if (apiBaseEl) {
    const base = window.API_BASE_URL || '';
    apiBaseEl.textContent = `API_BASE_URL: ${base}`;
    if (apiStatusEl) {
      apiStatusEl.textContent = 'API /health: idle';
    }
    if (base && apiStatusEl) {
      fetch(`${base.replace(/\/$/, '')}/health`)
        .then((res) => {
          apiStatusEl.textContent = `API /health: ${res.ok ? 'ok' : 'error'}`;
        })
        .catch(() => {
          apiStatusEl.textContent = 'API /health: error';
        });
    }
  }

  updateSharedText();
  applyLocale(getStoredLocale());
  window.addEventListener('app-locale-change', onLocaleChange);
  window.addEventListener('storage', onLocaleStorage);
  if (updateSharedBtn) {
    updateSharedBtn.addEventListener('click', () => {
      const next = `Svelte updated ${new Date().toISOString()}`;
      setSharedValue(next);
      updateSharedText();
    });
  }

  const toastButtons = root.querySelectorAll<HTMLElement>('[data-js="show-toast"]');
  const getToastHost = () => {
    let host = document.querySelector<HTMLDivElement>('.ds-toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'ds-toast-host';
      document.body.appendChild(host);
    }
    return host;
  };
  const showToast = () => {
    const toast = el('div', {
      className: 'ds-toast ds-toast--success',
      text: 'Your changes were saved.',
    });
    toast.setAttribute('role', 'status');
    const host = getToastHost();
    host.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  };
  toastButtons.forEach((btn) => btn.addEventListener('click', showToast));

  const dialog = root.querySelector<HTMLElement>('[data-js="dialog"]');
  const backdrop = root.querySelector<HTMLElement>('[data-js="dialog-backdrop"]');
  const openDialogBtn = root.querySelector<HTMLElement>('[data-js="open-dialog"]');
  const cancelBtn = root.querySelector<HTMLElement>('[data-js="dialog-cancel"]');
  const confirmBtn = root.querySelector<HTMLElement>('[data-js="dialog-confirm"]');
  const closeDialog = () => {
    dialog?.setAttribute('hidden', '');
    backdrop?.setAttribute('hidden', '');
  };
  const openDialog = () => {
    dialog?.removeAttribute('hidden');
    backdrop?.removeAttribute('hidden');
  };
  openDialogBtn?.addEventListener('click', openDialog);
  cancelBtn?.addEventListener('click', closeDialog);
  confirmBtn?.addEventListener('click', closeDialog);
  backdrop?.addEventListener('click', closeDialog);

  const tooltipTrigger = root.querySelector<HTMLElement>('[data-js="tooltip-trigger"]');
  const tooltip = root.querySelector<HTMLElement>('[data-js="tooltip"]');
  const disposeTooltip =
    tooltipTrigger && tooltip ? initTooltip(tooltipTrigger, tooltip) : () => {};
  const treeRoot = root.querySelector<HTMLElement>('[data-js="tree"]');
  const disposeTree = treeRoot ? initTreeView(treeRoot) : () => {};

  const dropdownTrigger = root.querySelector<HTMLElement>('[data-js="dropdown-trigger"]');
  const dropdownContent = root.querySelector<HTMLElement>('[data-js="dropdown-content"]');
  const toggleDropdown = () => {
    if (!dropdownContent) return;
    if (dropdownContent.hasAttribute('hidden')) {
      dropdownContent.removeAttribute('hidden');
    } else {
      dropdownContent.setAttribute('hidden', '');
    }
  };
  dropdownTrigger?.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    toggleDropdown();
  });
  document.addEventListener('click', (event: MouseEvent) => {
    if (!dropdownContent || dropdownContent.hasAttribute('hidden')) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (dropdownContent.contains(target) || dropdownTrigger?.contains(target)) return;
    dropdownContent.setAttribute('hidden', '');
  });

  const tabs = root.querySelector<HTMLElement>('[data-js="tabs"]');
  if (tabs) {
    const moveIndicator = (trigger: HTMLElement | null) => {
      if (!trigger) return;
      const indicator = tabs.querySelector<HTMLElement>('[data-ds-tab-indicator]');
      if (!indicator) return;
      indicator.style.left = `${trigger.offsetLeft}px`;
      indicator.style.top = `${trigger.offsetTop}px`;
      indicator.style.width = `${trigger.offsetWidth}px`;
      indicator.style.height = `${trigger.offsetHeight}px`;
    };

    const panelsRoot =
      tabs.closest('[data-ds-tabs-root]') ??
      tabs.parentElement ??
      tabs;
    const triggers = Array.from(tabs.querySelectorAll<HTMLElement>('[data-ds-tab-trigger]'));
    const panels = Array.from(panelsRoot.querySelectorAll<HTMLElement>('[data-ds-tab-panel]'));

    const setActive = (value: string) => {
      triggers.forEach((trigger) => {
        const isActive = trigger.dataset['dsValue'] === value;
        trigger.dataset['state'] = isActive ? 'active' : 'inactive';
        trigger.setAttribute('aria-selected', isActive ? 'true' : 'false');
        trigger.setAttribute('tabindex', isActive ? '0' : '-1');
        if (isActive) moveIndicator(trigger);
      });
      panels.forEach((panel) => {
        const isActive = panel.dataset['dsValue'] === value;
        panel.hidden = !isActive;
        panel.setAttribute('data-state', isActive ? 'active' : 'inactive');
      });
    };

    triggers.forEach((trigger) => {
      trigger.setAttribute('role', 'tab');
      const value = trigger.dataset['dsValue'];
      if (!value) return;
      const panel = panels.find((p) => p.dataset['dsValue'] === value);
      if (panel) {
        const panelId = panel.id || `ds-tab-panel-${value}`;
        panel.id = panelId;
        if (!trigger.id) {
          trigger.id = `ds-tab-${value}`;
        }
        trigger.setAttribute('aria-controls', panelId);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', trigger.id);
      }
    });
    tabs.setAttribute('role', 'tablist');

    const initial =
      triggers.find((t) => t.dataset['state'] === 'active')?.dataset['dsValue'] ||
      triggers[0]?.dataset['dsValue'] ||
      '';
    if (initial) setActive(initial);

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest<HTMLElement>('[data-ds-tab-trigger]');
      if (!trigger || !tabs.contains(trigger)) return;
      const value = trigger.dataset['dsValue'];
      if (!value) return;
      setActive(value);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || !tabs.contains(target)) return;
      const current = target.closest<HTMLElement>('[data-ds-tab-trigger]');
      if (!current) return;
      const currentIndex = triggers.indexOf(current);
      if (currentIndex === -1) return;
      const goTo = (index: number) => {
        const next = triggers[index];
        if (!next) return;
        next.focus();
        const value = next.dataset['dsValue'];
        if (!value) return;
        setActive(value);
      };
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          goTo((currentIndex + 1) % triggers.length);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goTo((currentIndex - 1 + triggers.length) % triggers.length);
          break;
        case 'Home':
          event.preventDefault();
          goTo(0);
          break;
        case 'End':
          event.preventDefault();
          goTo(triggers.length - 1);
          break;
        default:
          break;
      }
    };

    tabs.addEventListener('click', onClick);
    tabs.addEventListener('keydown', onKeyDown);
    const onResize = () => {
      const active = tabs.querySelector<HTMLElement>('[data-ds-tab-trigger][data-state="active"]');
      moveIndicator(active);
    };
    window.addEventListener('resize', onResize);
  }

  const autocomplete = root.querySelector<HTMLElement>('[data-js="autocomplete"]');
  if (autocomplete) {
    const input = autocomplete.querySelector<HTMLInputElement>('[data-ds-autocomplete-input]');
    const list = autocomplete.querySelector<HTMLElement>('[data-ds-autocomplete-list]');
    if (!input || !list) return () => {};
    const items = Array.from(
      list.querySelectorAll<HTMLElement>('[data-ds-autocomplete-item]')
    );
    let closeTimer: number | null = null;

    if (!list.id) {
      list.id = `ds-autocomplete-${Math.random().toString(36).slice(2, 8)}`;
    }
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'false');
    list.setAttribute('role', 'listbox');
    items.forEach((item) => item.setAttribute('role', 'option'));

    const show = () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      list.hidden = false;
      list.dataset['state'] = 'open';
      input.setAttribute('aria-expanded', 'true');
    };
    const hide = () => {
      list.dataset['state'] = 'closed';
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        list.hidden = true;
        input.setAttribute('aria-expanded', 'false');
      }, 160);
    };

    const filter = () => {
      const q = input.value.toLowerCase();
      items.forEach((item) => {
        const text = (item.textContent || '').toLowerCase();
        item.hidden = q ? !text.includes(q) : false;
      });
    };

    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (autocomplete.contains(target)) return;
      hide();
    };

    const onItemClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const item = target?.closest<HTMLElement>('[data-ds-autocomplete-item]');
      if (!item) return;
      const value = item.textContent?.trim() || '';
      input.value = value;
      hide();
    };

    input.addEventListener('focus', show);
    input.addEventListener('input', () => {
      filter();
      show();
    });
    list.addEventListener('click', onItemClick);
    document.addEventListener('click', onDocClick);
    list.hidden = true;
    list.dataset['state'] = 'closed';
  }

  const quantityInput = root.querySelector<HTMLInputElement>('[data-js="quantity-input"]');
  const quantityDec = root.querySelector<HTMLElement>('[data-js="quantity-dec"]');
  const quantityInc = root.querySelector<HTMLElement>('[data-js="quantity-inc"]');
  let quantity = 1;
  const renderQuantity = () => {
    if (quantityInput) quantityInput.value = String(quantity);
  };
  renderQuantity();
  quantityDec?.addEventListener('click', () => {
    quantity = Math.max(0, quantity - 1);
    renderQuantity();
  });
  quantityInc?.addEventListener('click', () => {
    quantity += 1;
    renderQuantity();
  });
  quantityInput?.addEventListener('input', (event: Event) => {
    const target = event.target instanceof HTMLInputElement ? event.target : null;
    const next = Number(String(target?.value || '').replace(/\D/g, ''));
    quantity = Number.isNaN(next) ? 0 : next;
    renderQuantity();
  });

  const phoneInput = root.querySelector<HTMLInputElement>('[data-js="phone-input"]');
  const cardInput = root.querySelector<HTMLInputElement>('[data-js="card-input"]');
  const cvcInput = root.querySelector<HTMLInputElement>('[data-js="cvc-input"]');
  const currencyInput = root.querySelector<HTMLInputElement>('[data-js="currency-input"]');
  const passwordInput = root.querySelector<HTMLInputElement>('[data-js="password-input"]');
  const passwordToggle = root.querySelector<HTMLButtonElement>('[data-js="password-toggle"]');
  const passwordIconShow = root.querySelector<HTMLElement>('[data-js="password-icon-show"]');
  const passwordIconHide = root.querySelector<HTMLElement>('[data-js="password-icon-hide"]');

  const initSelectMenu = (menu: HTMLElement | null, { onChange }: SelectMenuOptions = {}) => {
    if (!menu) return () => {};
    const trigger = menu.querySelector<HTMLElement>('.ds-select-trigger');
    const label = menu.querySelector<HTMLElement>('.ds-select-trigger__label');
    const isMultiple = menu.getAttribute('data-multiple') === 'true';
    let selected: string[] = [];
    try {
      const initial = menu.getAttribute('data-value');
      if (initial) selected = JSON.parse(initial);
    } catch {
      selected = [];
    }
    const optionsRaw = menu.getAttribute('data-options') || '[]';
    let options: string[] = [];
    try {
      options = JSON.parse(optionsRaw);
    } catch {
      options = [];
    }

    const list = el('div', { className: 'ds-select-list', attrs: { 'data-state': 'closed', hidden: '' } });
    const listInner = el('div', { className: 'ds-select-list__scroll' });
    options.forEach((opt) => {
      const item = el('button', {
        className: 'ds-select-item',
        text: String(opt),
        attrs: { type: 'button' },
      });
      item.addEventListener('click', () => {
        if (isMultiple) {
          if (selected.includes(opt)) {
            selected = selected.filter((value) => value !== opt);
          } else {
            selected = [...selected, opt];
          }
          if (label) {
            label.textContent =
              selected.length ? selected.join(', ') : menu.getAttribute('data-placeholder') || '';
          }
          onChange?.(selected);
        } else {
          selected = [opt];
          if (label) label.textContent = String(opt);
          onChange?.(opt);
          close();
        }
      });
      listInner.appendChild(item);
    });
    list.appendChild(listInner);
    menu.appendChild(list);

    const updateLabel = () => {
      if (!label) return;
      if (isMultiple) {
        label.textContent = selected.length ? selected.join(', ') : menu.getAttribute('data-placeholder') || '';
      } else {
        label.textContent = selected[0] ? String(selected[0]) : menu.getAttribute('data-placeholder') || '';
      }
    };

    const open = () => {
      list.removeAttribute('hidden');
      list.setAttribute('data-state', 'open');
      trigger?.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      list.setAttribute('data-state', 'closed');
      list.setAttribute('hidden', '');
      trigger?.setAttribute('aria-expanded', 'false');
    };

    updateLabel();

    const onTrigger = (event: MouseEvent) => {
      event.preventDefault();
      if (list.getAttribute('data-state') === 'open') close();
      else open();
    };
    trigger?.addEventListener('click', onTrigger);

    const onDocClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menu.contains(target)) {
        close();
      }
    };
    document.addEventListener('click', onDocClick);

    return () => {
      trigger?.removeEventListener('click', onTrigger);
      document.removeEventListener('click', onDocClick);
      list.remove();
    };
  };

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const initSlider = (
    sliderRoot: HTMLElement | null,
    { value = 40 }: { value?: number } = {}
  ) => {
    if (!sliderRoot) return () => {};
    const range = sliderRoot.querySelector<HTMLElement>('[data-ds-slider-range]');
    const thumb = sliderRoot.querySelector<HTMLElement>('[data-ds-slider-thumb]');
    const tooltip = sliderRoot.querySelector<HTMLElement>('[data-ds-slider-tooltip]');
    let current = clamp(value, 0, 100);
    const setActive = (active: boolean) => {
      sliderRoot.dataset['state'] = active ? 'active' : 'idle';
    };

    const update = () => {
      if (range) range.style.width = `${current}%`;
      if (thumb) thumb.style.left = `${current}%`;
      if (tooltip) {
        tooltip.textContent = `${current}`;
        tooltip.style.left = `${current}%`;
      }
    };

    const onPointer = (event: PointerEvent) => {
      const rect = sliderRoot.getBoundingClientRect();
      const percent = ((event.clientX - rect.left) / rect.width) * 100;
      current = clamp(Math.round(percent), 0, 100);
      update();
    };

    const onDown = (event: PointerEvent) => {
      event.preventDefault();
      setActive(true);
      onPointer(event);
      const move = (e: PointerEvent) => onPointer(e);
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        setActive(false);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    };

    const onMouseEnter = () => setActive(true);
    const onMouseLeave = () => setActive(false);
    sliderRoot.addEventListener('pointerdown', onDown);
    sliderRoot.addEventListener('mouseenter', onMouseEnter);
    sliderRoot.addEventListener('mouseleave', onMouseLeave);
    setActive(false);
    update();

    return () => {
      sliderRoot.removeEventListener('pointerdown', onDown);
      sliderRoot.removeEventListener('mouseenter', onMouseEnter);
      sliderRoot.removeEventListener('mouseleave', onMouseLeave);
    };
  };

  const initRangeSlider = (
    sliderRoot: HTMLElement | null,
    { minValue = 25, maxValue = 70 }: { minValue?: number; maxValue?: number } = {}
  ) => {
    if (!sliderRoot) return () => {};
    const range = sliderRoot.querySelector<HTMLElement>('[data-ds-slider-range]');
    const startThumb = sliderRoot.querySelector<HTMLElement>('[data-ds-slider-thumb-start]');
    const endThumb = sliderRoot.querySelector<HTMLElement>('[data-ds-slider-thumb-end]');
    const startTooltip = sliderRoot.querySelector<HTMLElement>('[data-ds-slider-tooltip-start]');
    const endTooltip = sliderRoot.querySelector<HTMLElement>('[data-ds-slider-tooltip-end]');
    let start = clamp(minValue, 0, 100);
    let end = clamp(maxValue, 0, 100);
    if (start > end) [start, end] = [end, start];
    const setActive = (active: boolean) => {
      sliderRoot.dataset['state'] = active ? 'active' : 'idle';
    };

    const update = () => {
      if (range) {
        range.style.left = `${start}%`;
        range.style.width = `${end - start}%`;
      }
      if (startThumb) startThumb.style.left = `${start}%`;
      if (endThumb) endThumb.style.left = `${end}%`;
      if (startTooltip) {
        startTooltip.textContent = `${start}`;
        startTooltip.style.left = `${start}%`;
      }
      if (endTooltip) {
        endTooltip.textContent = `${end}`;
        endTooltip.style.left = `${end}%`;
      }
    };

    const setFromPointer = (event: PointerEvent, target: 'start' | 'end') => {
      const rect = sliderRoot.getBoundingClientRect();
      const percent = ((event.clientX - rect.left) / rect.width) * 100;
      const next = clamp(Math.round(percent), 0, 100);
      if (target === 'start') start = Math.min(next, end);
      else end = Math.max(next, start);
      update();
    };

    const onDown = (event: PointerEvent) => {
      event.preventDefault();
      setActive(true);
      const rect = sliderRoot.getBoundingClientRect();
      const percent = ((event.clientX - rect.left) / rect.width) * 100;
      const distStart = Math.abs(percent - start);
      const distEnd = Math.abs(percent - end);
      const target = distStart <= distEnd ? 'start' : 'end';
      setFromPointer(event, target);
      const move = (e: PointerEvent) => setFromPointer(e, target);
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        setActive(false);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    };

    const onMouseEnter = () => setActive(true);
    const onMouseLeave = () => setActive(false);
    sliderRoot.addEventListener('pointerdown', onDown);
    sliderRoot.addEventListener('mouseenter', onMouseEnter);
    sliderRoot.addEventListener('mouseleave', onMouseLeave);
    setActive(false);
    update();

    return () => {
      sliderRoot.removeEventListener('pointerdown', onDown);
      sliderRoot.removeEventListener('mouseenter', onMouseEnter);
      sliderRoot.removeEventListener('mouseleave', onMouseLeave);
    };
  };

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const parseTime = (value: string, base: Date) => {
    const [h, m] = value.split(':').map((part) => Number(part));
    if (Number.isNaN(h) || Number.isNaN(m)) return base;
    const next = new Date(base);
    next.setHours(h, m, 0, 0);
    return next;
  };

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  const isBetween = (target: Date, start: Date, end: Date) => {
    const t = target.getTime();
    const s = start.getTime();
    const e = end.getTime();
    return t > s && t < e;
  };

  const renderCalendar = (
    container: HTMLElement,
    current: Date,
    selected: Date,
    onSelect: (date: Date) => void,
    onPrev: () => void,
    onNext: () => void
  ) => {
    container.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'ds-datepicker__header';
    const title = document.createElement('div');
    title.textContent = current.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });
    const controls = document.createElement('div');
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'ds-btn ds-btn--ghost ds-btn--sm';
    prev.textContent = '‹';
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'ds-btn ds-btn--ghost ds-btn--sm';
    next.textContent = '›';
    controls.appendChild(prev);
    controls.appendChild(next);
    header.appendChild(title);
    header.appendChild(controls);

    const grid = document.createElement('div');
    grid.className = 'ds-datepicker__grid';
    days.forEach((d) => {
      const el = document.createElement('div');
      el.className = 'ds-datepicker__day';
      el.textContent = d;
      grid.appendChild(el);
    });

    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const offset = start.getDay();
    for (let i = 0; i < offset; i += 1) {
      const empty = document.createElement('div');
      grid.appendChild(empty);
    }
    for (let d = 1; d <= end.getDate(); d += 1) {
      const date = new Date(current.getFullYear(), current.getMonth(), d);
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'ds-datepicker__date';
      cell.textContent = String(d);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selected.toDateString();
      if (isToday) cell.dataset['state'] = 'today';
      if (isSelected) cell.dataset['state'] = 'selected';
      cell.addEventListener('click', () => {
        onSelect(date);
      });
      grid.appendChild(cell);
    }

    prev.addEventListener('click', onPrev);
    next.addEventListener('click', onNext);

    container.appendChild(header);
    container.appendChild(grid);
  };

  const initDatepickerInline = (rootEl: HTMLElement | null, options: { initialDate?: Date; onSelect?: (date: Date) => void } = {}) => {
    if (!rootEl) return () => {};
    let current = options.initialDate ?? new Date();
    let selected = options.initialDate ?? new Date();

    const render = () => {
      renderCalendar(
        rootEl,
        current,
        selected,
        (date) => {
          selected = date;
          options.onSelect?.(date);
          render();
        },
        () => {
          current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
          render();
        },
        () => {
          current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
          render();
        }
      );
    };

    render();
    return () => {};
  };

  const initDateRangeCalendar = (
    rootEl: HTMLElement | null,
    options: { initialStart?: Date; initialEnd?: Date; onSelect?: (start: Date | null, end: Date | null) => void } = {}
  ) => {
    if (!rootEl) return () => {};
    let current = options.initialStart ?? options.initialEnd ?? new Date();
    let start: Date | null = options.initialStart ?? null;
    let end: Date | null = options.initialEnd ?? null;

    const onSelect = (date: Date) => {
      if (!start || (start && end)) {
        start = date;
        end = null;
      } else if (start && !end) {
        if (date.getTime() < start.getTime()) {
          start = date;
          end = null;
        } else {
          end = date;
        }
      }
      options.onSelect?.(start, end);
      render();
    };

    const render = () => {
      rootEl.innerHTML = '';
      const header = document.createElement('div');
      header.className = 'ds-datepicker__header';
      const title = document.createElement('div');
      title.textContent = current.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      });
      const controls = document.createElement('div');
      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'ds-btn ds-btn--ghost ds-btn--sm';
      prev.textContent = '‹';
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'ds-btn ds-btn--ghost ds-btn--sm';
      next.textContent = '›';
      controls.appendChild(prev);
      controls.appendChild(next);
      header.appendChild(title);
      header.appendChild(controls);

      const grid = document.createElement('div');
      grid.className = 'ds-datepicker__grid';
      days.forEach((d) => {
        const el = document.createElement('div');
        el.className = 'ds-datepicker__day';
        el.textContent = d;
        grid.appendChild(el);
      });

      const startOf = startOfMonth(current);
      const endOf = endOfMonth(current);
      const offset = startOf.getDay();
      for (let i = 0; i < offset; i += 1) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
      }
      for (let d = 1; d <= endOf.getDate(); d += 1) {
        const date = new Date(current.getFullYear(), current.getMonth(), d);
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'ds-datepicker__date';
        cell.textContent = String(d);
        if (start && isSameDay(date, start)) cell.dataset['state'] = 'range-start';
        if (end && isSameDay(date, end)) cell.dataset['state'] = 'range-end';
        if (start && end && isBetween(date, start, end)) {
          cell.dataset['state'] = 'in-range';
        }
        cell.addEventListener('click', () => onSelect(date));
        grid.appendChild(cell);
      }

      prev.addEventListener('click', () => {
        current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
        render();
      });
      next.addEventListener('click', () => {
        current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        render();
      });

      rootEl.appendChild(header);
      rootEl.appendChild(grid);
    };

    render();
    return () => {};
  };

  const initDatepickerDropdown = (rootEl: HTMLElement | null, options: { initialDate?: Date; onSelect?: (date: Date) => void } = {}) => {
    if (!rootEl) return () => {};
    const input = rootEl.querySelector<HTMLInputElement>('[data-ds-datepicker-input]');
    const panel = rootEl.querySelector<HTMLElement>('[data-ds-datepicker-panel]');
    if (!input || !panel) return () => {};
    let current = options.initialDate ?? new Date();
    let selected = options.initialDate ?? new Date();
    let closeTimer: number | null = null;
    let isOpen = false;
    let resizeObserver: ResizeObserver | null = null;

    const setInput = () => {
      input.value = formatDate(selected);
    };

    const updateSize = () => {
      panel.style.minWidth = `${input.offsetWidth}px`;
    };

    const close = () => {
      isOpen = false;
      panel.dataset['state'] = 'closed';
      input.setAttribute('aria-expanded', 'false');
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        panel.hidden = true;
      }, 160);
    };

    const open = () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      isOpen = true;
      panel.hidden = false;
      panel.dataset['state'] = 'open';
      updateSize();
      input.setAttribute('aria-expanded', 'true');
      render();
    };

    const toggle = () => {
      if (isOpen) close();
      else open();
    };

    const onSelect = (date: Date) => {
      selected = date;
      setInput();
      options.onSelect?.(date);
      close();
    };

    const render = () => {
      renderCalendar(
        panel,
        current,
        selected,
        onSelect,
        () => {
          current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
          render();
        },
        () => {
          current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
          render();
        }
      );
    };

    const onDocClick = (event: MouseEvent) => {
      const path = event.composedPath?.() ?? [];
      if (path.includes(rootEl)) return;
      const target = event.target as Node | null;
      if (target && rootEl.contains(target)) return;
      close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    input.setAttribute('readonly', 'true');
    input.setAttribute('aria-haspopup', 'dialog');
    input.setAttribute('aria-expanded', 'false');
    setInput();
    panel.hidden = true;
    panel.dataset['state'] = 'closed';
    input.addEventListener('click', toggle);
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', updateSize);
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(input);
    }

    return () => {
      input.removeEventListener('click', toggle);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', updateSize);
      resizeObserver?.disconnect();
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  };

  const initDateRangeDropdown = (
    rootEl: HTMLElement | null,
    options: { initialStart?: Date; initialEnd?: Date; onSelect?: (start: Date | null, end: Date | null) => void } = {}
  ) => {
    if (!rootEl) return () => {};
    const input = rootEl.querySelector<HTMLInputElement>('[data-ds-datepicker-input]');
    const panel = rootEl.querySelector<HTMLElement>('[data-ds-datepicker-panel]');
    if (!input || !panel) return () => {};
    let current = options.initialStart ?? options.initialEnd ?? new Date();
    let start: Date | null = options.initialStart ?? null;
    let end: Date | null = options.initialEnd ?? null;
    let closeTimer: number | null = null;
    let isOpen = false;
    let resizeObserver: ResizeObserver | null = null;

    const setInput = () => {
      if (!start && !end) {
        input.value = '';
        return;
      }
      if (start && !end) {
        input.value = `${formatDate(start)} –`;
        return;
      }
      if (start && end) {
        input.value = `${formatDate(start)} – ${formatDate(end)}`;
      }
    };

    const updateSize = () => {
      panel.style.minWidth = `${input.offsetWidth}px`;
    };

    const close = () => {
      isOpen = false;
      panel.dataset['state'] = 'closed';
      input.setAttribute('aria-expanded', 'false');
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        panel.hidden = true;
      }, 160);
    };

    const open = () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      isOpen = true;
      panel.hidden = false;
      panel.dataset['state'] = 'open';
      updateSize();
      input.setAttribute('aria-expanded', 'true');
      render();
    };

    const toggle = () => {
      if (isOpen) close();
      else open();
    };

    const onSelect = (date: Date) => {
      if (!start || (start && end)) {
        start = date;
        end = null;
      } else if (start && !end) {
        if (date.getTime() < start.getTime()) {
          start = date;
          end = null;
        } else {
          end = date;
        }
      }
      setInput();
      options.onSelect?.(start, end);
      render();
      if (start && end) close();
    };

    const render = () => {
      panel.innerHTML = '';
      const header = document.createElement('div');
      header.className = 'ds-datepicker__header';
      const title = document.createElement('div');
      title.textContent = current.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      });
      const controls = document.createElement('div');
      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'ds-btn ds-btn--ghost ds-btn--sm';
      prev.textContent = '‹';
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'ds-btn ds-btn--ghost ds-btn--sm';
      next.textContent = '›';
      controls.appendChild(prev);
      controls.appendChild(next);
      header.appendChild(title);
      header.appendChild(controls);

      const grid = document.createElement('div');
      grid.className = 'ds-datepicker__grid';
      days.forEach((d) => {
        const el = document.createElement('div');
        el.className = 'ds-datepicker__day';
        el.textContent = d;
        grid.appendChild(el);
      });

      const startOf = startOfMonth(current);
      const endOf = endOfMonth(current);
      const offset = startOf.getDay();
      for (let i = 0; i < offset; i += 1) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
      }
      for (let d = 1; d <= endOf.getDate(); d += 1) {
        const date = new Date(current.getFullYear(), current.getMonth(), d);
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'ds-datepicker__date';
        cell.textContent = String(d);
        if (start && isSameDay(date, start)) cell.dataset['state'] = 'range-start';
        if (end && isSameDay(date, end)) cell.dataset['state'] = 'range-end';
        if (start && end && isBetween(date, start, end)) {
          cell.dataset['state'] = 'in-range';
        }
        cell.addEventListener('click', () => onSelect(date));
        grid.appendChild(cell);
      }

      prev.addEventListener('click', () => {
        current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
        render();
      });
      next.addEventListener('click', () => {
        current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        render();
      });

      panel.appendChild(header);
      panel.appendChild(grid);
    };

    const onDocClick = (event: MouseEvent) => {
      const path = event.composedPath?.() ?? [];
      if (path.includes(rootEl)) return;
      const target = event.target as Node | null;
      if (target && rootEl.contains(target)) return;
      close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    input.setAttribute('readonly', 'true');
    input.setAttribute('aria-haspopup', 'dialog');
    input.setAttribute('aria-expanded', 'false');
    setInput();
    panel.hidden = true;
    panel.dataset['state'] = 'closed';
    input.addEventListener('click', toggle);
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', updateSize);
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(input);
    }

    return () => {
      input.removeEventListener('click', toggle);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', updateSize);
      resizeObserver?.disconnect();
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  };

  const initDateTimeDropdown = (
    rootEl: HTMLElement | null,
    options: { initialDate?: Date; onSelect?: (date: Date) => void } = {}
  ) => {
    if (!rootEl) return () => {};
    const input = rootEl.querySelector<HTMLInputElement>('[data-ds-datepicker-input]');
    const panel = rootEl.querySelector<HTMLElement>('[data-ds-datepicker-panel]');
    const timeInput = rootEl.querySelector<HTMLInputElement>('[data-ds-datetime-time]');
    const timePicker = rootEl.querySelector<HTMLElement>('[data-ds-datetime-picker]');
    const hourMenu = rootEl.querySelector<HTMLElement>('[data-ds-time-hour]');
    const minuteMenu = rootEl.querySelector<HTMLElement>('[data-ds-time-minute]');
    if (!input || !panel || (!timeInput && !timePicker)) return () => {};
    let current = options.initialDate ?? new Date();
    let selected = options.initialDate ?? new Date();
    let closeTimer: number | null = null;
    let isOpen = false;
    let resizeObserver: ResizeObserver | null = null;
    const timeDisposers: Array<() => void> = [];
    let onTimeChange: (() => void) | null = null;

    const setInput = () => {
      input.value = `${formatDate(selected)} ${formatTime(selected)}`;
    };

    const updateSize = () => {
      panel.style.minWidth = `${input.offsetWidth}px`;
    };

    const close = () => {
      isOpen = false;
      panel.dataset['state'] = 'closed';
      input.setAttribute('aria-expanded', 'false');
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        panel.hidden = true;
      }, 160);
    };

    const open = () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      isOpen = true;
      panel.hidden = false;
      panel.dataset['state'] = 'open';
      updateSize();
      input.setAttribute('aria-expanded', 'true');
      render();
    };

    const toggle = () => {
      if (isOpen) close();
      else open();
    };

    const onSelect = (date: Date) => {
      selected = new Date(date.getTime());
      selected.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setInput();
      options.onSelect?.(selected);
      render();
    };

    const render = () => {
      let calendar = panel.querySelector<HTMLElement>('[data-ds-datepicker-calendar]');
      if (!calendar) {
        calendar = document.createElement('div');
        calendar.setAttribute('data-ds-datepicker-calendar', 'true');
        panel.prepend(calendar);
      }
      renderCalendar(
        calendar,
        current,
        selected,
        (date) => {
          const merged = new Date(date);
          merged.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
          onSelect(merged);
        },
        () => {
          current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
          render();
        },
        () => {
          current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
          render();
        }
      );
    };

    const onDocClick = (event: MouseEvent) => {
      const path = event.composedPath?.() ?? [];
      if (path.includes(rootEl)) return;
      const target = event.target as Node | null;
      if (target && rootEl.contains(target)) return;
      close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    input.setAttribute('readonly', 'true');
    input.setAttribute('aria-haspopup', 'dialog');
    input.setAttribute('aria-expanded', 'false');
    if (timeInput) {
      timeInput.value = formatTime(selected);
      onTimeChange = () => {
        selected = parseTime(timeInput.value, selected);
        setInput();
        options.onSelect?.(selected);
      };
      timeInput.addEventListener('input', onTimeChange);
    }
    if (timePicker && hourMenu && minuteMenu) {
      hourMenu.dataset['value'] = String(selected.getHours()).padStart(2, '0');
      minuteMenu.dataset['value'] = String(selected.getMinutes()).padStart(2, '0');
      timeDisposers.push(
        initSelectMenu(hourMenu, {
          onChange: (value) => {
            const hour = Number(value);
            if (Number.isNaN(hour)) return;
            selected.setHours(hour, selected.getMinutes(), 0, 0);
            setInput();
            options.onSelect?.(selected);
          },
        })
      );
      timeDisposers.push(
        initSelectMenu(minuteMenu, {
          onChange: (value) => {
            const minute = Number(value);
            if (Number.isNaN(minute)) return;
            selected.setHours(selected.getHours(), minute, 0, 0);
            setInput();
            options.onSelect?.(selected);
          },
        })
      );
    }
    setInput();
    panel.hidden = true;
    panel.dataset['state'] = 'closed';
    input.addEventListener('click', toggle);
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', updateSize);
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(input);
    }

    return () => {
      input.removeEventListener('click', toggle);
      if (timeInput && onTimeChange) {
        timeInput.removeEventListener('input', onTimeChange);
      }
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', updateSize);
      resizeObserver?.disconnect();
      timeDisposers.forEach((dispose) => dispose());
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  };

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 10);
    if (digits.length <= 3) return p1;
    if (digits.length <= 6) return `(${p1}) ${p2}`;
    return `(${p1}) ${p2}-${p3}`;
  };

  const formatCard = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const formatCurrency = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    const whole = (parts[0] || '').slice(0, 9);
    const fraction = (parts[1] || '').slice(0, 2);
    return fraction.length ? `${whole}.${fraction}` : whole;
  };


  phoneInput?.addEventListener('input', (event: Event) => {
    const target = event.target instanceof HTMLInputElement ? event.target : null;
    if (!target) return;
    target.value = formatPhone(target.value || '');
  });
  cardInput?.addEventListener('input', (event: Event) => {
    const target = event.target instanceof HTMLInputElement ? event.target : null;
    if (!target) return;
    target.value = formatCard(target.value || '');
  });
  cvcInput?.addEventListener('input', (event: Event) => {
    const target = event.target instanceof HTMLInputElement ? event.target : null;
    if (!target) return;
    target.value = String(target.value || '').replace(/\D/g, '').slice(0, 4);
  });
  currencyInput?.addEventListener('input', (event: Event) => {
    const target = event.target instanceof HTMLInputElement ? event.target : null;
    if (!target) return;
    target.value = formatCurrency(target.value || '');
  });
  const setPasswordToggleUi = (isVisible: boolean) => {
    if (passwordIconShow) passwordIconShow.hidden = isVisible;
    if (passwordIconHide) passwordIconHide.hidden = !isVisible;
    if (passwordToggle) {
      passwordToggle.setAttribute('aria-label', isVisible ? 'Hide password' : 'Show password');
      passwordToggle.setAttribute('title', isVisible ? 'Hide password' : 'Show password');
    }
  };
  const onPasswordToggle = () => {
    if (!passwordInput || !passwordToggle) return;
    const isVisible = passwordInput.type === 'password';
    passwordInput.type = isVisible ? 'text' : 'password';
    setPasswordToggleUi(isVisible);
  };
  setPasswordToggleUi(false);
  if (passwordToggle) {
    passwordToggle.addEventListener('click', onPasswordToggle);
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === 'shared:message') {
      updateSharedText();
    }
  };
  window.addEventListener('storage', onStorage);

  const disposeSelectMenu = initSelectMenu(root.querySelector('[data-js="select-menu"]'));
  const disposeSelectMenuMulti = initSelectMenu(root.querySelector('[data-js="select-menu-multi"]'));
  const disposePhoneSelect = initSelectMenu(root.querySelector('[data-js="phone-select"]'));
  const disposeCurrencySelect = initSelectMenu(root.querySelector('[data-js="currency-select"]'));
  const disposeSlider = initSlider(root.querySelector('.ds-slider[data-ds-slider]:not(.ds-slider--range)'), { value: 40 });
  const disposeRangeSlider = initRangeSlider(root.querySelector('.ds-slider--range[data-ds-slider]'), {
    minValue: 25,
    maxValue: 70,
  });
  const disposeCalendar = dsInitDatepicker(root.querySelector('[data-js="datepicker-inline"]') as HTMLElement | null, {
    showMonthYearDropdown: true,
    monthFormat: 'short',
    locale: 'en-US',
  });
  const disposeRangeCalendar = dsInitDateRangeCalendar(root.querySelector('[data-js="datepicker-range-inline"]') as HTMLElement | null, {
    showMonthYearDropdown: true,
    monthFormat: 'short',
    locale: 'en-US',
    initialStart: new Date(),
    initialEnd: new Date(new Date().setDate(new Date().getDate() + 4)),
  });
  const disposeDatepickerDropdown = dsInitDatepickerDropdown(root.querySelector('[data-js="datepicker-dropdown"]') as HTMLElement | null, {
    locale: 'en-US',
  });
  const disposeDateRangeDropdown = dsInitDateRangeDropdown(root.querySelector('[data-js="date-range-dropdown"]') as HTMLElement | null, {
    showMonthYearDropdown: true,
    monthFormat: 'short',
    enableTimeRange: true,
    timeStepMinutes: 15,
    locale: 'en-US',
  });
  const disposeDateTimeDropdown = dsInitDateTimeDropdown(root.querySelector('[data-js="date-time-dropdown"]') as HTMLElement | null, {
    disabledWeekdays: [0, 6],
    locale: 'en-US',
  });
  const editorShell = root.querySelector<HTMLElement>('[data-js="playground-editor"]');
  const editorSaveButton = root.querySelector<HTMLButtonElement>('[data-js="editor-save"]');
  const editorSavedLabel = root.querySelector<HTMLElement>('[data-js="editor-saved"]');
  let editorValue = '';
  const disposeEditor = editorShell
    ? mountEditor(editorShell, {
        label: 'Content',
        helper: 'Rich text editor with typography, color, and layout controls.',
        placeholder: 'Write something... (Markdown not required)',
        characterLimit: 800,
        toolbar: {
          variant: 'full',
          items: [
            'undo',
            'redo',
            'bold',
            'italic',
            'underline',
            'link',
            'image',
            'imageUrl',
            'videoUrl',
            'fontSize',
            'highlight',
            'textColor',
            'quote',
            'code',
            'clear'
          ]
        },
        showGrid: true,
        showStatus: true,
        onChange: ({ html, markdown, text }) => {
          editorValue = html;
          console.log('[editor html]', html);
          console.log('[editor markdown]', markdown);
          console.log('[editor text]', text);
        }
      })
    : () => {};
  const onEditorSave = () => {
    const safeHtml = sanitizeInlineHtml(editorValue || '');
    console.log('[editor save sanitized]', safeHtml);
    if (editorSavedLabel) {
      editorSavedLabel.textContent = `Saved ${new Date().toISOString()}`;
    }
  };
  if (editorSaveButton) {
    editorSaveButton.addEventListener('click', onEditorSave);
  }

  const inlineEditorHost = root.querySelector<HTMLElement>('[data-js="inline-editor"]');
  const inlineEditorSave = root.querySelector<HTMLButtonElement>('[data-js="inline-editor-save"]');
  const inlineEditorCancel = root.querySelector<HTMLButtonElement>('[data-js="inline-editor-cancel"]');
  const inlineTargets = Array.from(root.querySelectorAll<HTMLElement>('[data-ds-inline-edit]'));
  let inlineEditorOpen = false;
  let inlineEditorValue = '';
  let inlineEditorTarget: HTMLElement | null = null;
  let inlineEditorDispose: (() => void) | null = null;
  let inlineEditorHover = false;
  let inlineEditorHideTimer: number | null = null;
  let inlineEditorMountRetries = 0;
  let inlineEditorPointerDown = false;
  let inlineEditorLastHover = 0;
  let inlineEditorFocus = false;
  let inlineEditorLastPointerX = 0;
  let inlineEditorLastPointerY = 0;
  let inlineEditorSelectionActive = false;

  const clearInlineEditorTimer = () => {
    if (inlineEditorHideTimer !== null) {
      window.clearTimeout(inlineEditorHideTimer);
      inlineEditorHideTimer = null;
    }
  };

  const scheduleInlineEditorHide = () => {
    if (inlineEditorHover || inlineEditorPointerDown || inlineEditorFocus || inlineEditorSelectionActive) return;
    clearInlineEditorTimer();
    inlineEditorHideTimer = window.setTimeout(() => {
      if (!inlineEditorHover && !inlineEditorPointerDown && !inlineEditorFocus && !inlineEditorSelectionActive) {
        inlineEditorDispose?.();
        inlineEditorDispose = null;
        inlineEditorOpen = false;
        inlineEditorTarget = null;
        inlineEditorHost?.setAttribute('hidden', '');
      }
    }, 120);
  };

  const ensureInlineEditorMounted = (focus: boolean) => {
    if (!inlineEditorOpen) return;
    const host = document.getElementById('inline-richtext-editor');
    if (!host) {
      if (inlineEditorMountRetries < 5) {
        inlineEditorMountRetries += 1;
        requestAnimationFrame(() => ensureInlineEditorMounted(focus));
      }
      return;
    }
    if (inlineEditorDispose) {
      inlineEditorDispose();
      inlineEditorDispose = null;
    }
    inlineEditorDispose = mountEditor(host, {
      placeholder: 'Edit text...',
      characterLimit: 400,
      toolbar: {
        variant: 'full',
        items: ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'clear']
      },
      showGrid: false,
      showStatus: false,
      onChange: ({ html }) => {
        inlineEditorValue = html;
      }
    });
    queueMicrotask(() => {
      const content = host.querySelector<HTMLElement>('[data-ds-editor-content]');
      if (!content) return;
      content.innerHTML = inlineEditorValue || '';
      if (!focus) return;
      content.focus();
      requestAnimationFrame(() => {
        const selection = window.getSelection();
        if (selection && content.firstChild) {
          const range = document.createRange();
          range.selectNodeContents(content);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      });
    });
  };

  const openInlineEditor = (target: HTMLElement, focus: boolean) => {
    inlineEditorTarget = target;
    inlineEditorValue = sanitizeInlineHtml(target.innerHTML || '');
    const rect = target.getBoundingClientRect();
    const left = Math.min(Math.max(16, rect.left + window.scrollX), window.innerWidth - 360);
    const top = rect.bottom + window.scrollY + 8;
    if (inlineEditorHost) {
      inlineEditorHost.style.left = `${left}px`;
      inlineEditorHost.style.top = `${top}px`;
      inlineEditorHost.removeAttribute('hidden');
    }
    inlineEditorOpen = true;
    inlineEditorMountRetries = 0;
    clearInlineEditorTimer();
    queueMicrotask(() => ensureInlineEditorMounted(focus));
  };

  const onInlineEditorEnter = () => {
    inlineEditorLastHover = Date.now();
    inlineEditorHover = true;
    clearInlineEditorTimer();
  };

  const onInlineEditorLeave = () => {
    if (inlineEditorPointerDown || inlineEditorSelectionActive) return;
    inlineEditorHover = false;
    scheduleInlineEditorHide();
  };

  const onInlineEditorPointerDown = () => {
    inlineEditorPointerDown = true;
    inlineEditorHover = true;
    inlineEditorSelectionActive = true;
    clearInlineEditorTimer();
    const onPointerUp = () => {
      inlineEditorPointerDown = false;
      const editor = document.querySelector('.ds-inline-editor [data-ds-editor-content]');
      if (editor) {
        const selection = window.getSelection();
        inlineEditorSelectionActive = (selection && selection.toString().length > 0) || false;
      }
      window.removeEventListener('pointerup', onPointerUp);
      const host = document.querySelector('.ds-inline-editor');
      const el = document.elementFromPoint(inlineEditorLastPointerX, inlineEditorLastPointerY);
      if (host && el && host.contains(el)) {
        inlineEditorHover = true;
      } else {
        const now = Date.now();
        inlineEditorHover = now - inlineEditorLastHover < 250;
      }
      if (!inlineEditorSelectionActive) {
        scheduleInlineEditorHide();
      }
    };
    window.addEventListener('pointerup', onPointerUp, { once: true });
  };

  const onInlineEditorPointerMove = (event: PointerEvent) => {
    inlineEditorLastPointerX = event.clientX;
    inlineEditorLastPointerY = event.clientY;
  };

  const onInlineEditorFocusIn = () => {
    inlineEditorFocus = true;
    clearInlineEditorTimer();
  };

  const onInlineEditorFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next) {
      const host = document.querySelector('.ds-inline-editor');
      if (host && host.contains(next)) {
        return;
      }
    }
    inlineEditorFocus = false;
    inlineEditorSelectionActive = false;
    scheduleInlineEditorHide();
  };

  const saveInlineEditor = () => {
    const host = document.getElementById('inline-richtext-editor');
    const content = host?.querySelector<HTMLElement>('[data-ds-editor-content]');
    const updatedHtml = content?.innerHTML ?? inlineEditorValue;
    const safeHtml = sanitizeInlineHtml(updatedHtml);
    if (inlineEditorTarget) {
      inlineEditorTarget.innerHTML = safeHtml;
    }
    inlineEditorDispose?.();
    inlineEditorDispose = null;
    inlineEditorOpen = false;
    inlineEditorTarget = null;
    inlineEditorSelectionActive = false;
    inlineEditorHost?.setAttribute('hidden', '');
  };

  const cancelInlineEditor = () => {
    inlineEditorDispose?.();
    inlineEditorDispose = null;
    inlineEditorOpen = false;
    inlineEditorTarget = null;
    inlineEditorSelectionActive = false;
    inlineEditorHost?.setAttribute('hidden', '');
  };

  const inlineEditorDisposers: Array<() => void> = [];
  if (inlineEditorHost) {
    inlineEditorHost.addEventListener('mouseenter', onInlineEditorEnter);
    inlineEditorHost.addEventListener('mouseleave', onInlineEditorLeave);
    inlineEditorHost.addEventListener('pointerdown', onInlineEditorPointerDown);
    inlineEditorHost.addEventListener('pointermove', onInlineEditorPointerMove);
    inlineEditorHost.addEventListener('focusin', onInlineEditorFocusIn);
    inlineEditorHost.addEventListener('focusout', onInlineEditorFocusOut);
    inlineEditorDisposers.push(() => {
      inlineEditorHost.removeEventListener('mouseenter', onInlineEditorEnter);
      inlineEditorHost.removeEventListener('mouseleave', onInlineEditorLeave);
      inlineEditorHost.removeEventListener('pointerdown', onInlineEditorPointerDown);
      inlineEditorHost.removeEventListener('pointermove', onInlineEditorPointerMove);
      inlineEditorHost.removeEventListener('focusin', onInlineEditorFocusIn);
      inlineEditorHost.removeEventListener('focusout', onInlineEditorFocusOut);
    });
  }

  if (inlineEditorSave) {
    inlineEditorSave.addEventListener('click', saveInlineEditor);
    inlineEditorDisposers.push(() => inlineEditorSave.removeEventListener('click', saveInlineEditor));
  }
  if (inlineEditorCancel) {
    inlineEditorCancel.addEventListener('click', cancelInlineEditor);
    inlineEditorDisposers.push(() => inlineEditorCancel.removeEventListener('click', cancelInlineEditor));
  }
  inlineTargets.forEach((el) => {
    const onEnter = () => {
      if (inlineEditorOpen && inlineEditorTarget === el) return;
      openInlineEditor(el, false);
    };
    const onLeave = () => {
      scheduleInlineEditorHide();
    };
    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      openInlineEditor(el, true);
    };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('click', onClick);
    inlineEditorDisposers.push(() => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('click', onClick);
    });
  });

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('app-locale-change', onLocaleChange);
    window.removeEventListener('storage', onLocaleStorage);
    disposeSelectMenu();
    disposeSelectMenuMulti();
    disposePhoneSelect();
    disposeCurrencySelect();
    disposeSlider();
    disposeRangeSlider();
    disposeCalendar();
    disposeRangeCalendar();
    disposeDateRangeDropdown();
    disposeDateTimeDropdown();
    disposeDatepickerDropdown();
    disposeTooltip();
    disposeTree();
    disposeEditor();
    if (editorSaveButton) {
      editorSaveButton.removeEventListener('click', onEditorSave);
    }
    if (passwordToggle) {
      passwordToggle.removeEventListener('click', onPasswordToggle);
    }
    inlineEditorDispose?.();
    inlineEditorDisposers.forEach((dispose) => dispose());
    clearInlineEditorTimer();
  };
};
