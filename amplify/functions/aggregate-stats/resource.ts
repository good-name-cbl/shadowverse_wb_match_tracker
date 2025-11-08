import { defineFunction } from '@aws-amplify/backend';

export const aggregateStats = defineFunction({
  name: 'aggregate-stats',
  entry: './handler.ts',
  timeoutSeconds: 300, // 5分
  memoryMB: 512,
  // package.jsonに定義された依存関係は自動的にバンドルされる
});
