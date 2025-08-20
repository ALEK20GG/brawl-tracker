// src/lib/types.ts
export interface Player {
  tag: string;
  name: string;
  nameColor?: string;
  icon?: { id: number };
  trophies: number;
  highestTrophies: number;
  expLevel: number;
  expPoints: number;
  isQualifiedFromChampionshipChallenge?: boolean;
  "3vs3Victories"?: number;
  soloVictories?: number;
  duoVictories?: number;
  bestRoboRumbleTime?: number;
  bestTimeAsBigBrawler?: number;
  club?: Club;
  brawlers: Brawler[];
  iconUrl: string | null;
  iconMobileSrc: string | null;
  iconPCSrc: string | null;
}

export interface Club {
  tag: string;
  name: string;
}

export interface Gear {
  id: number;
  name: string;
  level: number;
}

export interface Ability {
  id: number;
  name: string;
}

export interface Brawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
  gears?: Gear[];
  starPowers?: Ability[];
  gadgets?: Ability[];
}

// ---- Tipi aggiuntivi per le nuove rotte ----

// Battle Log
export interface BattleLogEntry {
  battleTime: string; // ISO timestamp
  event: EventInfo;
  battle: Battle[];
}

export interface EventInfo {
  id: number;
  mode: string;
  map: string;
}

export interface Battle {
  mode: string;
  type: string;
  result: 'victory' | 'defeat';
  duration: number;
  trophyChange: number;
  starPlayer?: BattlePlayer;
  teams: BattlePlayer[][];
}

export interface BattlePlayer {
  tag: string;
  name: string;
  brawler: {
    id: number;
    name: string;
    power: number;
    trophies: number;
  };
}

// Club completo
export interface ClubFull {
  tag: string;
  name: string;
  description: string;
  type: 'open' | 'inviteOnly' | 'closed';
  trophies: number;
  requiredTrophies: number;
  badgeId: number;
  members: ClubMember[];
}

export interface ClubMember {
  tag: string;
  name: string;
  nameColor?: string;
  role: 'member' | 'senior' | 'vicePresident' | 'president';
  trophies: number;
  icon?: { id: number };
}

// Brawlers statici
export interface BrawlerInfo {
  id: number;
  name: string;
  starPowers: Ability[];
  gadgets: Ability[];
}

// Event rotation
export interface EventSlot {
  startTime: string; // ISO timestamp
  endTime: string;   // ISO timestamp
  slotId: number;
  event: EventInfo;
}

// Rankings giocatori
export interface PlayerRanking {
  tag: string;
  name: string;
  nameColor?: string;
  trophies: number;
  rank: number;
  club?: { name: string };
  icon?: { id: number };
}

// Rankings club
export interface ClubRanking {
  tag: string;
  name: string;
  trophies: number;
  rank: number;
  memberCount: number;
  badgeId: number;
}

// Icons
export interface AssetEntry {
  id: number;
  type: string;
  fileName: string;
  collection: string;
}

export interface FankitAsset {
  id: string; // es. "16000000"
  name: string;
  url: string;
  thumbnailUrl: string;
  fileName: string;
  // altri campi disponibili se ti servono
}
