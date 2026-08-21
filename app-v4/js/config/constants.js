/* ==========================================================================
   V4 CONFIG & CONSTANTS
   ========================================================================== */

export const STORAGE_KEY = 'spidey_v4_state';
export const SCHEMA_VERSION = 4;

export const NAV_ITEMS = [
  { id: 'world', label: 'World', icon: 'world', route: '#/world' },
  { id: 'missions', label: 'Missions', icon: 'target', route: '#/missions' },
  { id: 'hero', label: 'Hero', icon: 'user', route: '#/hero' },
  { id: 'arsenal', label: 'Arsenal', icon: 'shield', route: '#/arsenal' },
  { id: 'chronicle', label: 'Chronicle', icon: 'scroll', route: '#/chronicle' }
];

export const EVENTS = {
  STATE_CHANGED: 'state:changed',
  ACTION_COMPLETED: 'action:completed',
  ACTION_ADDED: 'action:added',
  ACTION_DELETED: 'action:deleted',
  FOCUS_TOGGLED: 'focus:toggled',
  FOCUS_TICK: 'focus:tick',
  ROUTE_CHANGED: 'route:changed',
  NOTIFICATION: 'app:notification',
  REWARD_BREAKDOWN_OPEN: 'reward:open',
  REWARD_BREAKDOWN_CLOSE: 'reward:close'
};

export const PRIORITIES = {
  HIGH: { id: 'HIGH', label: 'HIGH', color: 'var(--color-spider-red)', xpMultiplier: 1.5, goldMultiplier: 1.5 },
  MEDIUM: { id: 'MEDIUM', label: 'MEDIUM', color: 'var(--color-gold-warning)', xpMultiplier: 1.0, goldMultiplier: 1.0 },
  LOW: { id: 'LOW', label: 'LOW', color: 'var(--color-spider-cyan)', xpMultiplier: 0.75, goldMultiplier: 0.75 }
};

export const DEFAULT_FOCUS_DURATION_MINUTES = 25;
