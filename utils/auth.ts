/**
 * 管理者判定ユーティリティ
 */

/**
 * 指定されたメールアドレスが管理者かどうかを判定
 * @param email ユーザーのメールアドレス
 * @returns 管理者の場合true
 */
export const isAdmin = (email: string | undefined | null): boolean => {
  if (!email) return false;

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  return adminEmails.includes(email);
};
