export interface CurrentlyStatement {
  statement: string;
  updatedAt: string;
  link?: string;
}

export const currently: CurrentlyStatement = {
  statement: 'Currently shipping CapitolLens',
  updatedAt: '2026-05-09',
};
