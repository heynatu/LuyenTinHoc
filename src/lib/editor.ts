/**
 * Trình soạn code CodeMirror 6 dùng chung (Python, SQL). Màu cú pháp lấy từ token text-* nên
 * đúng ở cả hai mode và đã kiểm tương phản. Tab để thụt lề; Esc rồi Tab để rời ô code
 * (tránh bẫy bàn phím, WCAG 2.1.2). CodeMirror dùng adoptedStyleSheets nên hợp CSP.
 */
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import {
  bracketMatching,
  HighlightStyle,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from '@codemirror/language';
import { EditorState, Prec, type Extension } from '@codemirror/state';
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  placeholder as placeholderExt,
} from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

const highlight = HighlightStyle.define([
  {
    tag: [
      t.keyword,
      t.controlKeyword,
      t.definitionKeyword,
      t.operatorKeyword,
      t.moduleKeyword,
      t.bool,
      t.null,
      t.self,
    ],
    color: 'var(--text-info)',
  },
  { tag: [t.string, t.special(t.string), t.character], color: 'var(--text-success)' },
  { tag: [t.number, t.integer, t.float], color: 'var(--text-warning)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--text-tertiary)' },
  { tag: [t.operator, t.punctuation, t.bracket, t.separator], color: 'var(--text-secondary)' },
  {
    tag: [t.function(t.variableName), t.definition(t.function(t.variableName))],
    color: 'var(--text-primary)',
  },
  { tag: [t.typeName, t.className, t.standard(t.variableName)], color: 'var(--text-info)' },
]);

const theme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--surface-primary-subtle)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    height: '100%',
  },
  '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.25rem', overflow: 'auto' },
  '.cm-content': { caretColor: 'var(--text-primary)', padding: 'var(--spacing-100) 0' },
  '.cm-gutters': {
    backgroundColor: 'var(--surface-primary-subtle)',
    color: 'var(--text-tertiary)',
    border: 'none',
  },
  '.cm-activeLine': { backgroundColor: 'var(--surface-primary-hover)' },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--surface-primary-hover)',
    color: 'var(--text-info)',
  },
  '&.cm-focused': { outline: '2px solid var(--border-action-primary)', outlineOffset: '2px' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--text-primary)' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'var(--surface-info-subtle)',
  },
  '.cm-matchingBracket': { backgroundColor: 'var(--surface-secondary-hover)', color: 'inherit' },
  '.cm-placeholder': { color: 'var(--text-tertiary)' },
});

export type EditorOptions = {
  parent: HTMLElement;
  doc: string;
  lang: 'python' | 'sql';
  label: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
};

export type CodeEditor = {
  view: EditorView;
  getValue(): string;
  setValue(value: string): void;
  focus(): void;
  destroy(): void;
};

export function createEditor(options: EditorOptions): CodeEditor {
  const extensions: Extension[] = [
    lineNumbers(),
    highlightActiveLineGutter(),
    history(),
    drawSelection(),
    indentOnInput(),
    bracketMatching(),
    highlightActiveLine(),
    indentUnit.of('    '),
    EditorState.tabSize.of(4),
    options.lang === 'python' ? python() : sql(),
    syntaxHighlighting(highlight),
    theme,
    EditorView.contentAttributes.of({ 'aria-label': options.label, spellcheck: 'false' }),
    Prec.high(
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            options.onRun?.();
            return true;
          },
        },
      ]),
    ),
    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) options.onChange?.(update.state.doc.toString());
    }),
  ];
  if (options.placeholder) extensions.push(placeholderExt(options.placeholder));
  if (options.readOnly) extensions.push(EditorState.readOnly.of(true));

  // Đặt trình soạn trong shadow root: CodeMirror khi đó nạp CSS bằng adoptedStyleSheets (CSSOM),
  // không chèn thẻ <style> vào trang nên không vướng CSP bằng hash. Biến CSS (token) vẫn kế thừa.
  const host = document.createElement('div');
  host.style.height = '100%';
  options.parent.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const mount = document.createElement('div');
  mount.style.height = '100%';
  shadow.append(mount);

  const view = new EditorView({
    parent: mount,
    root: shadow,
    state: EditorState.create({ doc: options.doc, extensions }),
  });

  return {
    view,
    getValue: () => view.state.doc.toString(),
    setValue: (value) =>
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } }),
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  };
}
