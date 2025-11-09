import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
// 一時的にLambda関数を削除してSeasonモデルの認証設定をデプロイ
// import { aggregateStats } from './functions/aggregate-stats/resource.js';
// import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
// import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
// import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

const backend = defineBackend({
  auth,
  data,
  // aggregateStats, // 一時的にコメントアウト
});

// DynamoDBテーブル名を取得
// const matchRecordTable = backend.data.resources.tables['MatchRecord'];
// const seasonTable = backend.data.resources.tables['Season'];
// const aggregatedStatsTable = backend.data.resources.tables['AggregatedStats'];

// Lambda関数にEnvironment変数を追加
// backend.aggregateStats.addEnvironment('MATCH_RECORD_TABLE', matchRecordTable.tableName);
// backend.aggregateStats.addEnvironment('SEASON_TABLE', seasonTable.tableName);
// backend.aggregateStats.addEnvironment('AGGREGATED_STATS_TABLE', aggregatedStatsTable.tableName);

// Lambda関数にDynamoDBアクセス権限を付与
// backend.aggregateStats.resources.lambda.addToRolePolicy(
//   new PolicyStatement({
//     actions: [
//       'dynamodb:Scan',
//       'dynamodb:GetItem',
//       'dynamodb:PutItem',
//       'dynamodb:UpdateItem',
//       'dynamodb:DeleteItem',
//     ],
//     resources: [
//       matchRecordTable.tableArn,
//       seasonTable.tableArn,
//       aggregatedStatsTable.tableArn,
//     ],
//   })
// );

// EventBridgeで毎日UTC 0時（日本時間9時）に実行
// const eventRule = new Rule(backend.aggregateStats.resources.lambda.stack, 'AggregateStatsSchedule', {
//   schedule: Schedule.cron({ minute: '0', hour: '0' }),
// });

// eventRule.addTarget(new LambdaFunction(backend.aggregateStats.resources.lambda));
