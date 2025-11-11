#!/usr/bin/env node

/**
 * テストユーザーの勝敗データ削除スクリプト（API Key版）
 *
 * このスクリプトは、指定されたメールアドレスのユーザーの
 * 勝敗データ（デッキと対戦記録）をDynamoDBから削除します。
 * ※ユーザーアカウント自体は削除しません
 *
 * 使用方法:
 * node scripts/delete-match-data-with-apikey.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';
import readline from 'readline';

// ESModuleでの__dirnameの代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.localファイルを読み込み
dotenv.config({ path: '.env.local' });

// amplify_outputs.jsonを読み込み
const amplifyOutputs = JSON.parse(readFileSync(join(__dirname, '../amplify_outputs.json'), 'utf8'));

// API設定
const API_URL = amplifyOutputs.data.url;
const API_KEY = process.env.NEXT_PUBLIC_APPSYNC_API_KEY || amplifyOutputs.data.api_key;

// 削除対象のメールアドレス
const TARGET_EMAIL = 'makkan0424@gmail.com';

/**
 * GraphQLクエリを実行
 */
async function executeGraphQL(query, variables = {}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(JSON.stringify(result.errors));
  }
  return result.data;
}

/**
 * ユーザー入力を待つ
 */
async function askConfirmation(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * メインの削除処理
 */
async function deleteTestMatchData() {
  console.log(`\n🔍 対象ユーザー: ${TARGET_EMAIL} の勝敗データを検索中...`);

  try {
    // 1. ユーザーを検索
    console.log('\n📌 Step 1: ユーザー情報を検索...');
    const listUsersQuery = `
      query ListUsers($email: String!) {
        listUsers(filter: { email: { eq: $email } }) {
          items {
            id
            email
            displayName
            createdAt
            updatedAt
          }
        }
      }
    `;

    const usersData = await executeGraphQL(listUsersQuery, { email: TARGET_EMAIL });
    const users = usersData.listUsers.items;

    if (!users || users.length === 0) {
      console.log('❌ ユーザーが見つかりませんでした。');
      return;
    }

    const user = users[0];
    console.log(`✅ ユーザーを発見: ID = ${user.id}`);
    console.log(`   表示名: ${user.displayName || '(未設定)'}`);
    console.log(`   作成日: ${user.createdAt}`);

    // 2. ユーザーのデッキを取得
    console.log('\n📌 Step 2: デッキを検索...');
    const listDecksQuery = `
      query ListDecks($userId: ID!) {
        listDecks(filter: { userId: { eq: $userId } }) {
          items {
            id
            deckName
            className
            createdAt
          }
        }
      }
    `;

    const decksData = await executeGraphQL(listDecksQuery, { userId: user.id });
    const decks = decksData.listDecks.items;

    console.log(`✅ ${decks?.length || 0}個のデッキを発見`);
    if (decks && decks.length > 0) {
      decks.forEach((deck) => {
        console.log(`   - ${deck.deckName} (${deck.className})`);
      });
    }

    // 3. ユーザーの対戦記録を取得
    console.log('\n📌 Step 3: 対戦記録を検索...');
    const listMatchRecordsQuery = `
      query ListMatchRecords($userId: ID!) {
        listMatchRecords(filter: { userId: { eq: $userId } }) {
          items {
            id
            result
            myClass
            opponentClass
            opponentDeckType
            goFirst
            createdAt
          }
        }
      }
    `;

    const recordsData = await executeGraphQL(listMatchRecordsQuery, { userId: user.id });
    const records = recordsData.listMatchRecords.items;

    console.log(`✅ ${records?.length || 0}個の対戦記録を発見`);

    // 削除確認
    console.log('\n⚠️  削除対象サマリー（勝敗データのみ）:');
    console.log(`   - ユーザーアカウント: 削除しません`);
    console.log(`   - デッキ: ${decks?.length || 0}個`);
    console.log(`   - 対戦記録: ${records?.length || 0}個`);

    const answer = await askConfirmation('\n❓ 本当に削除しますか？ (yes/no): ');

    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ 削除をキャンセルしました。');
      return;
    }

    // 4. 削除処理開始
    console.log('\n🗑️  勝敗データの削除処理を開始します...');

    // 対戦記録を削除
    if (records && records.length > 0) {
      console.log('\n📌 Step 4: 対戦記録を削除中...');
      const deleteMatchRecordMutation = `
        mutation DeleteMatchRecord($id: ID!) {
          deleteMatchRecord(input: { id: $id }) {
            id
          }
        }
      `;

      for (const record of records) {
        await executeGraphQL(deleteMatchRecordMutation, { id: record.id });
        console.log(`   ✅ 対戦記録削除: ${record.id}`);
      }
      console.log(`✅ ${records.length}個の対戦記録を削除しました`);
    }

    // デッキを削除
    if (decks && decks.length > 0) {
      console.log('\n📌 Step 5: デッキを削除中...');
      const deleteDeckMutation = `
        mutation DeleteDeck($id: ID!) {
          deleteDeck(input: { id: $id }) {
            id
          }
        }
      `;

      for (const deck of decks) {
        await executeGraphQL(deleteDeckMutation, { id: deck.id });
        console.log(`   ✅ デッキ削除: ${deck.deckName}`);
      }
      console.log(`✅ ${decks.length}個のデッキを削除しました`);
    }

    console.log('\n✨ 勝敗データ（デッキと対戦記録）を正常に削除しました！');
    console.log(`ℹ️  ユーザーアカウント（${TARGET_EMAIL}）は保持されています。`);

    // 5. AggregatedStatsの再集計が必要なことを通知
    console.log('\n📊 注意: AggregatedStats（集計統計）は自動更新されません。');
    console.log('   Lambda関数の次回実行時（毎日UTC 0時）に自動的に再集計されます。');
    console.log('   すぐに更新したい場合は、AWS Lambdaコンソールから手動実行してください。');
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    console.error('詳細:', error.message);
    process.exit(1);
  }
}

// スクリプトの説明を表示
console.log('================================================================');
console.log('📋 勝敗データ削除スクリプト（API Key版）');
console.log('================================================================');
console.log('このスクリプトは以下のデータを削除します：');
console.log('  ✅ デッキ情報（Deck）');
console.log('  ✅ 対戦記録（MatchRecord）');
console.log('');
console.log('以下は削除しません：');
console.log('  ❌ ユーザーアカウント（User）');
console.log('  ❌ Cognitoアカウント');
console.log('');
console.log(`対象ユーザー: ${TARGET_EMAIL}`);
console.log('================================================================\n');

// メイン処理を実行
deleteTestMatchData().catch(console.error);