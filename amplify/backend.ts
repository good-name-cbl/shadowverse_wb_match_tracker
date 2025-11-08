import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { aggregateStats } from './functions/aggregate-stats/resource.js';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

const backend = defineBackend({
  auth,
  data,
  aggregateStats,
});

// Lambda関数にDynamoDBテーブルへのアクセス権を付与
const { cfnResources } = backend.data;
const { cfnFunction } = backend.aggregateStats.resources.lambda;

// DynamoDBテーブル名を環境変数として設定
backend.aggregateStats.addEnvironment('MATCH_RECORD_TABLE_NAME', cfnResources.cfnTables['MatchRecord'].tableName || '');
backend.aggregateStats.addEnvironment('DECK_TABLE_NAME', cfnResources.cfnTables['Deck'].tableName || '');
backend.aggregateStats.addEnvironment('AGGREGATED_STATS_TABLE_NAME', cfnResources.cfnTables['AggregatedStats'].tableName || '');

// DynamoDBテーブルへの読み取り・書き込み権限を付与
cfnFunction.addToRolePolicy({
  effect: 'Allow',
  actions: [
    'dynamodb:Scan',
    'dynamodb:GetItem',
    'dynamodb:PutItem',
    'dynamodb:BatchWriteItem',
  ],
  resources: [
    cfnResources.cfnTables['MatchRecord'].attrArn,
    cfnResources.cfnTables['Deck'].attrArn,
    cfnResources.cfnTables['AggregatedStats'].attrArn,
  ],
});

// EventBridge定期実行の設定（毎日UTC 0時 = JST 9時に実行）
const dailyAggregationRule = new events.Rule(
  backend.aggregateStats.resources.lambda,
  'DailyAggregationRule',
  {
    schedule: events.Schedule.cron({
      minute: '0',
      hour: '0',
      day: '*',
      month: '*',
      year: '*',
    }),
    description: 'Trigger aggregate-stats Lambda function daily at midnight UTC (9 AM JST)',
  }
);

// Lambda関数をEventBridgeのターゲットとして追加
dailyAggregationRule.addTarget(
  new targets.LambdaFunction(backend.aggregateStats.resources.lambda)
);

// CloudWatch Logsの監視
// Lambda関数のログは自動的に CloudWatch Logs に送信されます
// ロググループ: /aws/lambda/aggregate-stats-<env>
// エラー監視やアラート設定が必要な場合は、CloudWatch Alarmを追加してください
