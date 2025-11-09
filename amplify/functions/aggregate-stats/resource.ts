import { defineFunction } from '@aws-amplify/backend';

export const aggregateStats = defineFunction({
  name: 'aggregate-stats',
  entry: './handler.ts',
  timeoutSeconds: 300, // 5分
  memoryMB: 512,
  bundling: {
    nodeModules: ['@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb'],
  },
});
