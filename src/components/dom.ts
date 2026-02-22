export type AttrValue = string | number | boolean;
export type Child = Node | string | null | undefined | false;
export type ElementOptions = {
  className?: string;
  text?: string;
  attrs?: Record<string, AttrValue | null | undefined>;
  dataset?: Record<string, AttrValue | null | undefined>;
};
export type SvgOptions = Record<string, AttrValue | null | undefined>;

export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text) node.textContent = options.text;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      node.setAttribute(key, String(value));
    });
  }
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      node.dataset[key] = String(value);
    });
  }
  const flatChildren = children.flat() as Child[];
  flatChildren.forEach((child) => {
    if (!child) return;
    if (typeof child === 'string') {
      node.appendChild(document.createTextNode(child));
    } else {
      node.appendChild(child);
    }
  });
  return node;
};

export const svg = (attrs: SvgOptions = {}, ...children: Array<Child | null | undefined>) => {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, String(value));
  });
  const flatChildren = children.flat() as Array<Child | null | undefined>;
  flatChildren.forEach((child) => {
    if (!child) return;
    if (child instanceof Node) {
      node.appendChild(child);
    }
  });
  return node;
};

export const svgPath = (attrs: SvgOptions = {}) => {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, String(value));
  });
  return node;
};
