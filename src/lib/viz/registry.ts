/** Danh mục thuật toán mô phỏng, theo thứ tự hiển thị. */
import { DP } from './algorithms/dp';
import { GRAPH } from './algorithms/graph';
import { NUMBER } from './algorithms/number';
import { RECURSION } from './algorithms/recursion';
import { SEARCHING } from './algorithms/searching';
import { SORTING } from './algorithms/sorting';
import type { AlgorithmDef, Category } from './types';

export const ALGORITHMS: AlgorithmDef[] = [
  ...SEARCHING,
  ...SORTING,
  ...NUMBER,
  ...RECURSION,
  ...DP,
  ...GRAPH,
];

export const CATEGORY_LABELS: Record<Category, { title: string; summary: string }> = {
  'co-ban': {
    title: 'Cơ bản',
    summary: 'THCS lớp 6, 7 và THPT lớp 10: tìm kiếm, sắp xếp đơn giản, số học.',
  },
  'van-dung': {
    title: 'Vận dụng',
    summary: 'THPT lớp 11 và HSG THCS: sắp xếp nhanh, đệ quy, kỹ thuật trên mảng.',
  },
  'chuyen-sau': {
    title: 'Chuyên sâu',
    summary: 'HSG tỉnh THPT: quy hoạch động, đồ thị, quay lui.',
  },
};

export const getAlgorithm = (slug: string) => ALGORITHMS.find((a) => a.slug === slug);
