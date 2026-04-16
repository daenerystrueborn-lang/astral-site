// src/lib/api.ts
// ─────────────────────────────────────────────────────
// All calls to the bot API server go through here.
// Set VITE_API_URL in your Vercel env vars.
// ─────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || 'http://93.177.64.145:7814'
const KEY  = import.meta.env.VITE_API_KEY  || ''

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': KEY,
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `API error ${res.status}`)
  }
  return res.json()
}

// ── Types ──────────────────────────────────────────────

export interface BotPlayer {
  id: string
  name: string
  class: string
  race: string
  level: number
  exp: number
  rank: string
  prestige: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  str: number
  agi: number
  int: number
  def: number
  lck: number
  solars: number
  darkCrystals: number
  mond: number
  bankSolars: number
  location: string
  region: string
  dungeonsCleared: number
  pvpWins: number
  pvpLosses: number
  cards: number
  guildId: string | null
  joinDate: string | null
  isPremium: boolean
  premiumTier: string | null
}

export interface LeaderboardEntry {
  rank: number
  name: string
  class: string
  level: number
  rank_title: string
  prestige: number
}

export interface ServerStats {
  activePlayers: number
  dungeonsCleared: number
  cardsDrawn: number
  guildsFormed: number
}

// ── API calls ──────────────────────────────────────────

export const api = {

  health: () =>
    apiFetch<{ status: string; bot: string; ts: number }>('/api/health'),

  stats: () =>
    apiFetch<ServerStats>('/api/stats'),

  leaderboard: () =>
    apiFetch<{ leaderboard: LeaderboardEntry[]; total: number }>('/api/leaderboard'),

  worldBoss: () =>
    apiFetch<{ boss: Record<string, unknown> | null }>('/api/world-boss'),

  market: () =>
    apiFetch<{ listings: unknown[] }>('/api/market'),

  // Look up player by WhatsApp number (e.g. "2347062301848")
  getPlayer: (phone: string) =>
    apiFetch<{ player: BotPlayer }>(`/api/player/${phone}`),

  // Owner/admin: credit a topup
  creditTopup: (phone: string, type: string, packageId: string) =>
    apiFetch<{ success: boolean; player: string; credited: string }>('/api/topup/credit', {
      method: 'POST',
      body: JSON.stringify({ phone, type, packageId }),
    }),
}
