/**
 * Khung code dùng chung cho component CodeBlock, PseudoBlock và khối code trong Markdown.
 * Trả về cây hast; component Astro và plugin rehype cùng dùng nên giao diện luôn giống nhau.
 */
import { CaretRightIcon, CheckIcon, CopyIcon } from '@phosphor-icons/react/ssr';
import { highlightLines, normalizeCode, type CodeLang, type Line } from '../highlight';
import { tokenizePseudocode } from '../pseudocode';
import { cls, h, iconHast, text, type HastElement } from './hast';

export type FrameLang = CodeLang | 'pseudo';

export const LANG_LABEL: Record<FrameLang, string> = {
  python: 'Python',
  sql: 'SQL',
  text: 'Văn bản',
  pseudo: 'Giả mã',
};

export type FrameOptions = {
  code: string;
  lang: FrameLang;
  title?: string;
  highlight?: number[];
  lineNumbers?: boolean;
  copy?: boolean;
};

export function linesFor(code: string, lang: FrameLang): Line[] {
  return lang === 'pseudo' ? tokenizePseudocode(code) : highlightLines(code, lang);
}

const ICON_BUTTON =
  'inline-flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-full text-icon-secondary transition duration-300 ease-base hover:bg-surface-primary-hover hover:text-icon-default active:scale-98 active:bg-surface-secondary';

/** Phân tích meta của khối code Markdown: title="DOANCON.PY" {3,5-7} */
export function parseMeta(meta: string | undefined): { title?: string; highlight: number[] } {
  const value = meta ?? '';
  const title = /title="([^"]*)"/.exec(value)?.[1];
  const highlight: number[] = [];
  const range = /\{([\d,\s-]+)\}/.exec(value)?.[1];
  if (range) {
    for (const part of range.split(',')) {
      const [a, b] = part.split('-').map((x) => Number(x.trim()));
      if (!a) continue;
      for (let n = a; n <= (b || a); n += 1) highlight.push(n);
    }
  }
  return { title, highlight };
}

export function codeFrameHast({
  code,
  lang,
  title,
  highlight = [],
  lineNumbers = true,
  copy = true,
}: FrameOptions): HastElement {
  const raw = normalizeCode(code);
  const lines = linesFor(code, lang);
  const active = new Set(highlight);
  const label = title ? `${LANG_LABEL[lang]} ${title}` : LANG_LABEL[lang];

  const caption = h(
    'figcaption',
    {
      className: cls(
        'flex min-h-touch items-center justify-between gap-100 bg-surface-secondary py-25 pr-50 pl-200',
      ),
    },
    [
      h('span', { className: cls('flex min-w-0 items-center gap-100') }, [
        ...(title
          ? [
              h('span', { className: cls('body-5 truncate font-mono text-text-primary') }, [
                text(title),
              ]),
            ]
          : []),
        h('span', { className: cls('caption-4 text-text-tertiary') }, [text(LANG_LABEL[lang])]),
      ]),
      ...(copy
        ? [
            h(
              'button',
              {
                type: 'button',
                className: cls(ICON_BUTTON),
                ariaLabel: 'Sao chép code',
                title: 'Sao chép code',
                dataCopyCode: '',
              },
              [
                h('span', { dataCopyIcon: 'idle', className: cls('inline-flex') }, [
                  iconHast(CopyIcon, 20),
                ]),
                h('span', { dataCopyIcon: 'done', className: cls('hidden') }, [
                  iconHast(CheckIcon, 20),
                ]),
              ],
            ),
          ]
        : []),
    ],
  );

  const lineNodes = lines.map((line, index) => {
    const n = index + 1;
    const on = active.has(n);
    const gutter = lineNumbers
      ? [
          h(
            'span',
            {
              ariaHidden: 'true',
              className: cls(
                `inline-flex w-600 shrink-0 items-center justify-end gap-25 pr-200 select-none ${on ? 'text-text-info' : 'text-text-tertiary'}`,
              ),
            },
            [...(on ? [iconHast(CaretRightIcon, 12, 'bold')] : []), text(String(n))],
          ),
        ]
      : [];
    const body = h(
      'span',
      { className: cls(`flex-1 ${lineNumbers ? '' : 'pl-200'}`) },
      line.map((seg) =>
        h('span', { className: [...seg.classes, 'whitespace-pre'] }, [text(seg.text)]),
      ),
    );
    return h(
      'span',
      {
        className: cls(`flex min-h-200 pr-300 ${on ? 'bg-surface-primary-hover' : ''}`),
        dataLine: String(n),
        ...(on ? { dataActive: 'true' } : {}),
      },
      [...gutter, body],
    );
  });

  return h(
    'figure',
    {
      className: cls(
        'ui-code-frame overflow-hidden rounded-12 border border-border-primary bg-surface-primary-subtle',
      ),
      dataCodeFrame: '',
    },
    [
      caption,
      h(
        'div',
        {
          className: cls('overflow-x-auto'),
          role: 'region',
          ariaLabel: `Code ${label}`,
          tabIndex: 0,
        },
        [
          h(
            'pre',
            { className: cls('ui-code body-6 min-w-max py-100 font-mono whitespace-normal') },
            [h('code', { dataRaw: raw, className: cls('flex flex-col') }, lineNodes)],
          ),
        ],
      ),
    ],
  );
}
