export const contentTypes = {
  knowledge: {
    label: '知識點',
    paths: ['M12 7v14', 'M3 3h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3z'],
  },
  exercise: {
    label: '練習題',
    paths: ['M9 5H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4', 'M9 3h6v4H9z', 'm8 14 2 2 5-5'],
  },
  game: {
    label: '互動小遊戲',
    paths: ['M6 8h12a3 3 0 0 1 3 2.6l1 7a2 2 0 0 1-3.4 1.7L16 17H8l-2.6 2.3A2 2 0 0 1 2 17.6l1-7A3 3 0 0 1 6 8Z', 'M7 11v5M4.5 13.5h5M16 12h.01M19 15h.01'],
  },
  interactive: {
    label: '互動教材',
    paths: ['M12 7v14', 'M3 3h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v10', 'M3 3v16h5a4 4 0 0 1 4 2', 'm16 14 6 3-3 1-1 3-2-7Z'],
  },
} as const;

export type ContentType = keyof typeof contentTypes;

export function contentTypeIcon(type: ContentType) {
  return `<svg class="content-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${contentTypes[type].paths.map(path => `<path d="${path}" />`).join('')}</svg>`;
}
