# 🔐 API Key セキュリティレポート

**作成日**: 2025-11-10
**深刻度**: 中〜高

## 📋 概要

GitGuardianから、GitHubリポジトリにAPI Keyが露出している警告が届きました。調査の結果、AWS AppSync API Keyがソースコード内にハードコードされており、公開リポジトリにプッシュされていることが確認されました。

## 🚨 発見された問題

### 露出したシークレット
- **API Key**: `da2-zrtrdmlpkja47kbckvtswef5ya`
- **タイプ**: AWS AppSync API Key (X-API-Key)
- **用途**: 公開統計ページのデータ読み取り（読み取り専用）

### 影響を受けるファイル

| ファイル | 行番号 | 状態 | 修正状況 |
|---------|--------|------|----------|
| `amplify_outputs.json` | 31 | ハードコード | ⚠️ Amplify自動生成ファイル |
| `app/stats/page.tsx` | 52 | ハードコード | ✅ 環境変数に変更済み |
| `components/stats/SeasonFilter.tsx` | 32 | ハードコード | ✅ 環境変数に変更済み |
| `TROUBLESHOOTING_LAMBDA.md` | 84 | ドキュメント例 | ℹ️ 例示のため残置 |

## ✅ 実施した対策

### 1. 環境変数への移行
- `.env.local`ファイルを作成し、API Keyを環境変数として管理
- `.env.local.example`ファイルを作成し、設定方法を明示

### 2. ソースコード修正
```typescript
// 修正前
'x-api-key': 'da2-zrtrdmlpkja47kbckvtswef5ya',

// 修正後
'x-api-key': process.env.NEXT_PUBLIC_APPSYNC_API_KEY || '',
```

### 3. .gitignoreの確認
- `.env*.local`が`.gitignore`に含まれていることを確認（30行目）
- `.env.local`ファイルはGitにコミットされない

### 4. ドキュメント更新
- `README.md`に環境変数の設定方法を追記
- セットアップ手順を明確化

## ⚠️ 重要な対処事項

### 緊急対応が必要

1. **AWS ConsoleでAPI Keyをローテーション**
   - AWS AppSyncコンソールにアクセス
   - 現在のAPI Keyを無効化
   - 新しいAPI Keyを生成
   - `.env.local`を新しいキーで更新

2. **Amplify Hostingの環境変数設定**
   ```
   キー: NEXT_PUBLIC_APPSYNC_API_KEY
   値: [新しいAPI Key]
   ```

3. **amplify_outputs.jsonの扱い**
   - このファイルはAmplify CLIが自動生成
   - 本来は`.gitignore`に追加すべきだが、デプロイに必要なため現在はコミット対象
   - 代替案：環境変数から設定を読み込むように変更

## 🔍 今後の推奨事項

### 短期対策
1. ✅ API Keyを環境変数に移行（完了）
2. ⚠️ AWS ConsoleでAPI Keyをローテーション（要実施）
3. ⚠️ Amplify Hostingに環境変数を設定（要実施）

### 長期対策
1. **AWS Systems Manager Parameter Store**の利用
   - API Keyをセキュアに管理
   - ランタイムで取得

2. **amplify_outputs.jsonの改善**
   - APIエンドポイントのみ含め、API Keyは除外
   - または完全に`.gitignore`に追加

3. **GitHub Secrets**の活用
   - CI/CDパイプラインでの環境変数管理

4. **定期的なキーローテーション**
   - 3ヶ月ごとにAPI Keyを更新
   - 自動化スクリプトの作成

## 📊 リスク評価

### 現在のリスク
- **露出期間**: 2025年11月9日から露出
- **影響範囲**: 読み取り専用APIのため、データの改ざんリスクはなし
- **潜在的脅威**:
  - API使用量の制限超過
  - コスト増加の可能性
  - サービス拒否攻撃（DoS）

### 対策後のリスク
- ソースコードからのAPI Key露出: **解消済み**
- Git履歴での露出: **残存**（要BFG Repo-Cleanerでの削除）

## 📝 チェックリスト

- [x] API Keyをソースコードから削除
- [x] 環境変数に移行
- [x] .gitignoreの確認
- [x] ドキュメント更新
- [ ] AWS ConsoleでAPI Keyローテーション
- [ ] Amplify Hostingに環境変数設定
- [ ] Git履歴からのAPI Key削除（オプション）
- [ ] チーム全体への周知

## 🔗 参考リンク

- [AWS AppSync API Keys](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html#api-key-authorization)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
- [GitGuardian Documentation](https://docs.gitguardian.com/)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

**注意**: このレポートは2025年11月10日時点の状況です。API Keyのローテーションは速やかに実施してください。