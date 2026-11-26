/**
 * Plugin Markdown cho bài học, đề bài, cẩm nang (chạy lúc build):
 *
 * remarkCallouts: trích dẫn bắt đầu bằng [!MEO], [!BAY], [!LUU-Y], [!VI-DU] thành hộp Callout.
 *   > [!BAY] round() làm tròn kiểu ngân hàng
 *   > Trong Python, round(2.5) bằng 2.
 *
 * rehypeCodeFrame: khối ```python, ```sql, ```pseudo, ```text thành khung code (số dòng, tô màu,
 *   tô sáng dòng, nút sao chép). Meta: ```python title="BAI1.PY" {3,5-7}
 */
import {
  LightbulbIcon,
  PencilSimpleLineIcon,
  WarningIcon,
  WarningOctagonIcon,
} from '@phosphor-icons/react/ssr';
import { TONE_BORDER, TONE_SOFT, type Tone } from '../../components/ui/recipes';
import { codeFrameHast, parseMeta, type FrameLang } from './code-frame';
import { cls, iconHast, toText, type HastElement, type HastNode } from './hast';

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
};

const CALLOUTS = {
  MEO: { tone: 'info', label: 'Mẹo', icon: LightbulbIcon },
  BAY: { tone: 'error', label: 'Bẫy', icon: WarningOctagonIcon },
  'LUU-Y': { tone: 'warning', label: 'Lưu ý', icon: WarningIcon },
  'VI-DU': { tone: 'neutral', label: 'Ví dụ', icon: PencilSimpleLineIcon },
} as const satisfies Record<string, { tone: Tone; label: string; icon: unknown }>;

const MARKER = /^\[!(MEO|BAY|LUU-Y|VI-DU)\][ \t]*([^\n]*)\n?/;

function walk(node: MdNode, visit: (node: MdNode) => void) {
  visit(node);
  node.children?.forEach((child) => walk(child, visit));
}

export function remarkCallouts() {
  return (tree: MdNode) => {
    walk(tree, (node) => {
      if (node.type !== 'blockquote') return;
      const paragraph = node.children?.[0];
      const first = paragraph?.type === 'paragraph' ? paragraph.children?.[0] : undefined;
      if (!first || first.type !== 'text' || !first.value) return;
      const match = MARKER.exec(first.value);
      if (!match) return;
      const kind = match[1] as keyof typeof CALLOUTS;
      const title = match[2]?.trim();
      const { tone, label, icon } = CALLOUTS[kind];
      const heading = title ? `${label}: ${title}` : label;

      first.value = first.value.slice(match[0].length);
      if (paragraph && first.value === '' && paragraph.children?.length === 1)
        node.children?.shift();

      const body: MdNode = {
        type: 'calloutBody',
        data: { hName: 'div', hProperties: { className: cls('body-6 flex flex-col gap-75') } },
        children: node.children ?? [],
      };
      const content: MdNode = {
        type: 'calloutContent',
        data: { hName: 'div', hProperties: { className: cls('flex min-w-0 flex-col gap-50') } },
        children: [
          {
            type: 'calloutTitle',
            data: { hName: 'p', hProperties: { className: cls('body-4') } },
            children: [{ type: 'text', value: heading }],
          },
          body,
        ],
      };
      const iconNode: MdNode = {
        type: 'calloutIcon',
        data: {
          hName: 'span',
          hProperties: { className: cls('inline-flex shrink-0 pt-25') },
          hChildren: [iconHast(icon, 20)],
        },
      };
      node.children = [iconNode, content];
      node.data = {
        hName: 'aside',
        hProperties: {
          className: cls(
            `ui-callout flex gap-100 rounded-12 border p-200 ${TONE_SOFT[tone]} ${TONE_BORDER[tone]}`,
          ),
          ariaLabel: heading,
        },
      };
    });
  };
}

const LANGS = new Set<FrameLang>(['python', 'sql', 'pseudo', 'text']);
const ALIASES: Record<string, FrameLang> = {
  py: 'python',
  plain: 'text',
  txt: 'text',
  'gia-ma': 'pseudo',
};

function replaceCodeBlocks(node: HastNode) {
  const element = node as HastElement;
  if (!Array.isArray(element.children)) return;
  element.children = element.children.map((child) => {
    const el = child as HastElement;
    if (el.type === 'element' && el.tagName === 'table') {
      // Bảng rộng cuộn ngang trong khung, trang không tràn ở 390px.
      return {
        type: 'element',
        tagName: 'div',
        properties: {
          className: cls('ui-table-wrap overflow-x-auto'),
          role: 'region',
          ariaLabel: 'Bảng',
          tabIndex: 0,
        },
        children: [el],
      } as HastElement;
    }
    if (el.type === 'element' && el.tagName === 'pre') {
      const code = el.children.find((c) => (c as HastElement).tagName === 'code') as
        HastElement | undefined;
      if (code) {
        const classes = (code.properties.className as string[] | undefined) ?? [];
        const raw =
          classes.find((c) => c.startsWith('language-'))?.slice('language-'.length) ?? 'text';
        const lang = ALIASES[raw] ?? (LANGS.has(raw as FrameLang) ? (raw as FrameLang) : 'text');
        const meta = (code as unknown as { data?: { meta?: string } }).data?.meta;
        const { title, highlight } = parseMeta(meta);
        return codeFrameHast({ code: toText(code), lang, title, highlight });
      }
    }
    replaceCodeBlocks(child);
    return child;
  });
}

export function rehypeCodeFrame() {
  return (tree: HastNode) => replaceCodeBlocks(tree);
}
