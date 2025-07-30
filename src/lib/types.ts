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
  "3vs3Victories"?: number; // chiave che inizia con numero -> va quotata
  soloVictories?: number;
  duoVictories?: number;
  bestRoboRumbleTime?: number;
  bestTimeAsBigBrawler?: number;
  club?: Club;
  brawlers: Brawler[];
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
