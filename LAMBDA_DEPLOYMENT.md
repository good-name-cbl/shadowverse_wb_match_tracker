# Lambda関数デプロイ記録

**デプロイ日**: 2025-11-09
**デプロイ方法**: AWS CLI直接デプロイ

---

## デプロイされたリソース

### 1. Lambda関数
- **関数名**: `shadowverse-aggregate-stats`
- **ARN**: `arn:aws:lambda:ap-northeast-1:683213565262:function:shadowverse-aggregate-stats`
- **ランタイム**: Node.js 18.x
- **メモリ**: 512 MB
- **タイムアウト**: 300秒（5分）
- **コードサイズ**: 130 KB

**環境変数**:
```
MATCH_RECORD_TABLE_NAME=MatchRecord-o2gjs6tev5edffdehy4gzte2mq-NONE
DECK_TABLE_NAME=Deck-o2gjs6tev5edffdehy4gzte2mq-NONE
AGGREGATED_STATS_TABLE_NAME=AggregatedStats-o2gjs6tev5edffdehy4gzte2mq-NONE
```

### 2. IAMロール
- **ロール名**: `ShadowverseAggregateStatsRole`
- **ARN**: `arn:aws:iam::683213565262:role/ShadowverseAggregateStatsRole`

**アタッチされたポリシー**:
- DynamoDB Scan/GetItem/PutItem/BatchWriteItem権限
- CloudWatch Logs書き込み権限

### 3. EventBridgeルール
- **ルール名**: `shadowverse-daily-aggregation`
- **ARN**: `arn:aws:events:ap-northeast-1:683213565262:rule/shadowverse-daily-aggregation`
- **スケジュール**: `cron(0 0 * * ? *)` - 毎日UTC 0時（JST 9時）
- **ターゲット**: `shadowverse-aggregate-stats` Lambda関数

---

## 初回実行結果

**実行日時**: 2025-11-09T00:56:38Z

**ログ出力**:
```
集計処理を開始します...
MatchRecordを取得中...
MatchRecord: 4件取得
Deckを取得中...
Deck: 2件取得
集計結果: 12件のデータを保存します
集計処理が完了しました
```

**実行統計**:
- Duration: 273.76 ms
- Billed Duration: 604 ms
- Memory Used: 79 MB / 512 MB
- Init Duration: 330.21 ms

**集計結果**:
```json
{
  "totalMatchRecords": 4,
  "classStats": 4,
  "deckStats": 2,
  "matchupStats": 4,
  "turnOrderStats": 2
}
```

---

## 運用方法

### 手動で集計を実行する

```bash
aws lambda invoke \
  --function-name shadowverse-aggregate-stats \
  --region ap-northeast-1 \
  --log-type Tail \
  --output json \
  response.json
```

### ログを確認する

```bash
aws logs tail /aws/lambda/shadowverse-aggregate-stats --region ap-northeast-1 --follow
```

### EventBridgeルールを無効化する

```bash
aws events disable-rule \
  --name shadowverse-daily-aggregation \
  --region ap-northeast-1
```

### EventBridgeルールを有効化する

```bash
aws events enable-rule \
  --name shadowverse-daily-aggregation \
  --region ap-northeast-1
```

---

## トラブルシューティング

### Lambda関数が失敗する場合

1. CloudWatch Logsを確認:
   ```bash
   aws logs tail /aws/lambda/shadowverse-aggregate-stats --region ap-northeast-1
   ```

2. DynamoDBテーブル名が正しいか確認:
   ```bash
   aws lambda get-function-configuration \
     --function-name shadowverse-aggregate-stats \
     --region ap-northeast-1 \
     --query 'Environment.Variables'
   ```

3. IAM権限を確認:
   ```bash
   aws iam get-role-policy \
     --role-name ShadowverseAggregateStatsRole \
     --policy-name DynamoDBAccessPolicy
   ```

### EventBridgeが実行されない場合

1. ルールの状態を確認:
   ```bash
   aws events describe-rule \
     --name shadowverse-daily-aggregation \
     --region ap-northeast-1
   ```

2. ターゲットを確認:
   ```bash
   aws events list-targets-by-rule \
     --rule shadowverse-daily-aggregation \
     --region ap-northeast-1
   ```

---

## 更新方法

### Lambda関数のコードを更新

1. lambda-deployディレクトリに移動してコードを変更
2. ビルド:
   ```bash
   cd lambda-deploy
   npm install
   node build.js
   python3 -c "import zipfile; z = zipfile.ZipFile('function.zip', 'w', zipfile.ZIP_DEFLATED); z.write('index.js'); z.close()"
   ```

3. デプロイ:
   ```bash
   aws lambda update-function-code \
     --function-name shadowverse-aggregate-stats \
     --zip-file fileb://function.zip \
     --region ap-northeast-1
   ```

### 環境変数を更新

```bash
aws lambda update-function-configuration \
  --function-name shadowverse-aggregate-stats \
  --environment 'Variables={MATCH_RECORD_TABLE_NAME=新しいテーブル名,...}' \
  --region ap-northeast-1
```

---

## 削除方法（必要な場合）

```bash
# EventBridgeターゲットを削除
aws events remove-targets \
  --rule shadowverse-daily-aggregation \
  --ids "1" \
  --region ap-northeast-1

# EventBridgeルールを削除
aws events delete-rule \
  --name shadowverse-daily-aggregation \
  --region ap-northeast-1

# Lambda関数を削除
aws lambda delete-function \
  --function-name shadowverse-aggregate-stats \
  --region ap-northeast-1

# IAMロールポリシーを削除
aws iam delete-role-policy \
  --role-name ShadowverseAggregateStatsRole \
  --policy-name DynamoDBAccessPolicy

# IAMロールを削除
aws iam delete-role \
  --role-name ShadowverseAggregateStatsRole
```
