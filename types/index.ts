export type ClassType =
  | 'エルフ'
  | 'ロイヤル'
  | 'ウィッチ'
  | 'ドラゴン'
  | 'ナイトメア'
  | 'ビショップ'
  | 'ネメシス';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Deck {
  id: string;
  userId: string;
  className: ClassType;
  deckName: string;
  createdAt: string;
}

export interface MatchRecord {
  id: string;
  userId: string;
  myDeckId: string;
  opponentClass: ClassType;
  opponentDeckType: string;
  isFirstPlayer: boolean;
  isWin: boolean;
  recordedAt: string;
}

export interface MatchStatistics {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface ClassStatistics extends MatchStatistics {
  className: ClassType;
}

export interface DeckTypeStatistics extends MatchStatistics {
  deckType: string;
  firstPlayerStats: MatchStatistics;
  secondPlayerStats: MatchStatistics;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };
