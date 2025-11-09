import { defineBackend } from '@aws-amplify/backend';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { aggregateStats } from './functions/aggregate-stats/resource.js';

const backend = defineBackend({
  auth,
  data,
  aggregateStats,
});

// DynamoDBテーブル名を取得
const matchRecordTable = backend.data.resources.tables['MatchRecord'];
const seasonTable = backend.data.resources.tables['Season'];
const aggregatedStatsTable = backend.data.resources.tables['AggregatedStats'];

// Lambda関数に環境変数を設定
backend.aggregateStats.resources.lambda.addEnvironment(
  'MATCH_RECORD_TABLE',
  matchRecordTable.tableName
);
backend.aggregateStats.resources.lambda.addEnvironment(
  'SEASON_TABLE',
  seasonTable.tableName
);
backend.aggregateStats.resources.lambda.addEnvironment(
  'AGGREGATED_STATS_TABLE',
  aggregatedStatsTable.tableName
);

// Lambda関数にDynamoDBアクセス権限を付与
backend.aggregateStats.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'dynamodb:Scan',
      'dynamodb:GetItem',
      'dynamodb:PutItem',
      'dynamodb:UpdateItem',
      'dynamodb:DeleteItem',
    ],
    resources: [
      matchRecordTable.tableArn,
      seasonTable.tableArn,
      aggregatedStatsTable.tableArn,
    ],
  })
);

// EventBridgeで毎日UTC 0時（日本時間9時）に実行
const rule = new Rule(backend.aggregateStats.resources.lambda.stack, 'AggregateStatsSchedule', {
  schedule: Schedule.cron({ minute: '0', hour: '0' }), // 毎日UTC 0時
});

rule.addTarget(new LambdaFunction(backend.aggregateStats.resources.lambda));
