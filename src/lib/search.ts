/** Tìm kiếm toàn trang bằng MiniSearch, không phân biệt dấu (logic thuần, có unit test). */
import MiniSearch from 'minisearch';
import { foldVi } from './text';

export type SearchDoc = { id: number; title: string; url: string; kind: string; text: string };

export function buildIndex(docs: SearchDoc[]): MiniSearch<SearchDoc> {
  const index = new MiniSearch<SearchDoc>({
    fields: ['title', 'text', 'kind'],
    storeFields: ['title', 'url', 'kind'],
    processTerm: (term) => foldVi(term) || null,
    searchOptions: { boost: { title: 3 }, prefix: true, fuzzy: 0.15, combineWith: 'AND' },
  });
  index.addAll(docs);
  return index;
}

export type SearchHit = { title: string; url: string; kind: string };

export function searchDocs(index: MiniSearch<SearchDoc>, query: string, limit = 12): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  return index
    .search(q)
    .slice(0, limit)
    .map((r) => ({ title: String(r.title), url: String(r.url), kind: String(r.kind) }));
}
