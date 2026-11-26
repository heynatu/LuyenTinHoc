/**
 * Dựng cây HTML (hast) cho plugin Markdown lúc build, không qua chuỗi HTML.
 * Icon Phosphor được render thành SVG rồi tách path, nên giống hệt icon trong component.
 */
import type { Icon as PhosphorIcon, IconWeight } from '@phosphor-icons/react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export type HastText = { type: 'text'; value: string };
export type HastElement = {
  type: 'element';
  tagName: string;
  properties: Record<string, unknown>;
  children: HastNode[];
};
export type HastNode = HastElement | HastText | { type: string; [key: string]: unknown };

export const h = (
  tagName: string,
  properties: Record<string, unknown> = {},
  children: HastNode[] = [],
): HastElement => ({ type: 'element', tagName, properties, children });

export const text = (value: string): HastText => ({ type: 'text', value });

/** Tách class thành mảng cho thuộc tính className của hast. */
export const cls = (value: string) => value.split(/\s+/).filter(Boolean);

export function iconHast(
  Icon: PhosphorIcon,
  size: number,
  weight: IconWeight = 'regular',
): HastElement {
  const markup = renderToStaticMarkup(createElement(Icon, { size, weight, 'aria-hidden': true }));
  const viewBox = /viewBox="([^"]+)"/.exec(markup)?.[1] ?? '0 0 256 256';
  const paths = [...markup.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  return h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox,
      fill: 'currentColor',
      ariaHidden: 'true',
    },
    paths.map((d) => h('path', { d })),
  );
}

/** Ghép mọi text con của một nút hast. */
export function toText(node: HastNode): string {
  if (node.type === 'text') return (node as HastText).value;
  const children = (node as HastElement).children;
  return Array.isArray(children) ? children.map(toText).join('') : '';
}
