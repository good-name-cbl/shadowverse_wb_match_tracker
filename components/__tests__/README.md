# コンポーネントテストについて

## 現在の状態

このディレクトリには以下のコンポーネントテストファイルが含まれていますが、**現在は実行から除外されています**（`jest.config.js`で設定）。

### 作成済みのテストファイル

1. **`deck/__tests__/DeckForm.test.tsx`**
   - デッキ登録フォームのテスト
   - フォーム入力、バリデーション、送信処理のテスト

2. **`match/__tests__/MatchForm.test.tsx`**
   - 対戦記録フォームのテスト
   - クラス選択、先攻後攻、勝敗の記録テスト

3. **`stats/__tests__/OverallStats.test.tsx`**
   - 統計表示コンポーネントのテスト
   - 勝率計算、表示内容の検証

## 除外されている理由

これらのテストは以下の理由で現在除外されています：

1. **Next.js App Routerとの統合**
   - `'use client'`ディレクティブを使用するコンポーネントのテストが複雑
   - Next.jsの特殊なコンテキストが必要

2. **実際のコンポーネント実装との整合性**
   - テストファイルは一般的なパターンで作成されているが、実際の実装と完全には一致していない可能性

3. **AWS Amplify依存関係**
   - 一部のコンポーネントがAmplifyに依存しており、モックの設定が複雑

## 再有効化する方法

コンポーネントテストを有効化したい場合：

### 1. jest.config.jsを編集

```javascript
testPathIgnorePatterns: [
  '/node_modules/',
  '/.next/',
  '/amplify/',
  // '/components/', // この行をコメントアウトまたは削除
],
```

### 2. 必要な修正を実施

各テストファイルで以下を確認・修正：

- **実際のコンポーネントのpropsインターフェースに合わせる**
- **Next.js特有の機能のモック**
  - `next/navigation`
  - `next/router`
  - Server Components vs Client Components

- **Amplifyコンポーネントのモック**
  ```typescript
  jest.mock('aws-amplify/data', () => ({
    generateClient: jest.fn(),
  }))
  ```

### 3. テストの実行

```bash
npm test -- components/
```

## 推奨アプローチ

現時点では、以下のアプローチを推奨します：

1. **ビジネスロジックのユニットテストに集中**（現在実装済み）
   - `utils/statistics.ts`
   - `utils/constants.ts`
   - `hooks/useLocalStorage.ts`

2. **将来的にE2Eテストで補完**
   - Playwright等を使用したエンドツーエンドテスト
   - 実際のブラウザでの動作確認

3. **段階的なコンポーネントテストの追加**
   - まず最もシンプルなコンポーネントから
   - 依存関係の少ないUIコンポーネントから始める

## 参考資料

- [Next.js Testing Documentation](https://nextjs.org/docs/app/building-your-application/testing)
- [Testing Library with Next.js](https://testing-library.com/docs/react-testing-library/setup#custom-render)
- [AWS Amplify Testing Guide](https://docs.amplify.aws/lib/client-configuration/testing/q/platform/js/)

---

**注意**: これらのテストファイルは将来の参考用として保持されています。実際に使用する際は、実装に合わせた調整が必要です。