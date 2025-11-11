# 統合テストについて

## 現在の状態

このディレクトリには認証コンテキストの統合テストファイルが含まれていますが、**現在は実行から除外されています**（`jest.config.js`で設定）。

### 作成済みのテストファイル

**`AuthContext.test.tsx`**
- 認証状態の管理
- ログイン/ログアウト機能
- サインアップフロー
- LocalStorageとの連携

## 除外されている理由

1. **AWS Amplify Authのモック複雑性**
   - `aws-amplify/auth`の各関数が複雑な戻り値を持つ
   - 認証フローが非同期で多段階になっている

2. **Cognitoとの統合**
   - 実際のCognito動作をモックするのが複雑
   - テスト環境と実環境での動作の違い

3. **現在のAuthContext実装との整合性**
   - モックの想定と実装の詳細が完全には一致していない可能性

## 代替アプローチ

認証機能については、以下の方法でテストすることを推奨します：

### 1. 手動テスト
実際のAWS環境で以下をテスト：
- ユーザー登録
- ログイン
- パスワードリセット
- セッション管理

### 2. E2Eテスト（推奨）
Playwrightなどで実際のブラウザ操作をテスト：

```typescript
test('ユーザーがログインできる', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.fill('input[type="password"]', 'password123')
  await page.click('button:has-text("ログイン")')
  await expect(page).toHaveURL('/dashboard')
})
```

### 3. AWS Amplifyのテスト環境
Amplify Sandboxを使用した統合テスト：

```bash
npx ampx sandbox
# テスト実行
npm test -- --testEnvironment=node
```

## 再有効化する方法

統合テストを有効化したい場合：

### 1. jest.config.jsを編集

```javascript
testPathIgnorePatterns: [
  '/node_modules/',
  '/.next/',
  '/amplify/',
  // '/contexts/', // この行をコメントアウトまたは削除
],
```

### 2. Amplifyモックを強化

`jest.setup.js`または専用のモックファイルで：

```javascript
jest.mock('aws-amplify/auth', () => ({
  signIn: jest.fn(async ({ username, password }) => ({
    isSignedIn: true,
    nextStep: { signInStep: 'DONE' },
  })),
  signOut: jest.fn(async () => ({})),
  getCurrentUser: jest.fn(async () => ({
    userId: 'test-user-id',
    username: 'test@example.com',
  })),
  // ... その他の関数
}))
```

### 3. テストケースの調整

実際のAuthContext実装に合わせて：
- 期待される状態遷移を確認
- エラーハンドリングのテスト
- エッジケースの追加

## 現在の推奨事項

1. **ビジネスロジックのテストを優先**
   - 統計計算などのコアロジック（✅ 実装済み）

2. **認証機能は手動テスト**
   - デプロイ後の実環境で確認
   - チェックリストを作成して系統的にテスト

3. **将来的にE2Eテストで補完**
   - ユーザーフロー全体をカバー
   - より実際の使用に近い形でテスト

## 参考資料

- [AWS Amplify Auth Testing](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#testing)
- [Jest Mocking Guide](https://jestjs.io/docs/mock-functions)
- [Testing Asynchronous Code](https://jestjs.io/docs/asynchronous)

---

**注意**: このテストファイルは将来の参考用として保持されています。実際に使用する際は、AuthContextの実装とAmplifyのバージョンに合わせた調整が必要です。