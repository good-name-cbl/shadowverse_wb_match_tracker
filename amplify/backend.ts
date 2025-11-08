import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { aggregateStats } from './functions/aggregate-stats/resource.js';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  aggregateStats,
});

// DynamoDBテーブルへのアクセス権限をLambda関数に付与
const lambdaFunction = backend.aggregateStats.resources.lambda;
const dataResources = backend.data.resources;

// DynamoDBテーブル名を環境変数として Lambda 関数に設定
backend.aggregateStats.addEnvironment('MATCH_RECORD_TABLE_NAME', dataResources.tables['MatchRecord'].tableName);
backend.aggregateStats.addEnvironment('DECK_TABLE_NAME', dataResources.tables['Deck'].tableName);
backend.aggregateStats.addEnvironment('AGGREGATED_STATS_TABLE_NAME', dataResources.tables['AggregatedStats'].tableName);

// すべてのDynamoDBテーブルに対するScan/GetItem/PutItem/BatchWriteItem権限を付与
lambdaFunction.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'dynamodb:Scan',
      'dynamodb:GetItem',
      'dynamodb:PutItem',
      'dynamodb:BatchWriteItem',
      'dynamodb:Query',
    ],
    resources: ['*'], // すべてのDynamoDBテーブルにアクセス
  })
);

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
