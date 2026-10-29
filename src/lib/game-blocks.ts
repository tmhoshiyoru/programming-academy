const blockNames = ['game-html', 'game-css', 'game-js'] as const;
export type GameBlocks = Record<(typeof blockNames)[number], string>;

export function extractGameBlocks(body: string): GameBlocks {
  const blocks = {} as GameBlocks;
  for (const name of blockNames) {
    const match = body.match(new RegExp('```' + name + '[ \\t]*\\r?\\n([\\s\\S]*?)\\r?\\n```', 'm'));
    blocks[name] = match?.[1] ?? '';
  }
  return blocks;
}

export function removeGameBlocks(body: string) {
  return blockNames.reduce((content, name) => content.replace(new RegExp('```' + name + '[ \\t]*\\r?\\n[\\s\\S]*?\\r?\\n```', 'm'), ''), body);
}
