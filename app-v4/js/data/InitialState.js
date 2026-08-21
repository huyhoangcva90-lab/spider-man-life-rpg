/* ==========================================================================
   V4 INITIAL CANONICAL STATE (SCHEMA VERSION 4)
   ========================================================================== */

import { SCHEMA_VERSION } from '../config/constants.js';

export const INITIAL_STATE = {
  schemaVersion: SCHEMA_VERSION,
  user: {
    name: "Peter Parker",
    handle: "@freelance_spidey",
    title: "Freelance Photojournalist & Systems Specialist",
    level: 3,
    xp: 420,
    gold: 280,
    streakDays: 7,
    attributes: {
      intelligence: 16,
      focus: 14,
      agility: 18,
      resilience: 12
    }
  },
  activeEncounter: {
    id: "boss-doc-ock",
    name: "Doctor Octopus",
    alias: "Otto Octavius",
    subtitle: "Master Strategist & Cybernetic Tentacles",
    hp: 2250,
    maxHp: 3000,
    armor: 600,
    maxArmor: 600,
    stagger: 25,
    maxStagger: 100,
    status: "ARMORED", // "ARMORED" | "VULNERABLE" | "STAGGERED"
    weaknessDomain: "Engineering"
  },
  loadout: [
    {
      id: "load-1",
      name: "Peter Parker",
      category: "Identity",
      localArtKey: "artPeter",
      description: "Adult 29-yo freelancer. +15% Intelligence XP & Armor Pen.",
      modifiers: { xpBonus: 0.15, armorPen: 0.20, attribute: "Intelligence" }
    },
    {
      id: "load-2",
      name: "Advanced Suit 2.0",
      category: "Suit",
      localArtKey: "artSuit",
      description: "+20% Base Damage to Doc Ock, +10 Stagger per Action.",
      modifiers: { damageBonus: 0.20, staggerBonus: 10 }
    },
    {
      id: "load-3",
      name: "Web-Shooter",
      category: "Gadget",
      localArtKey: "artShooter",
      description: "+10% Duration Multiplier & Quick Web Constraints.",
      modifiers: { durationBonus: 0.10 }
    },
    {
      id: "load-4",
      name: "Impact Web",
      category: "Tech",
      localArtKey: "artImpact",
      description: "+40 Heavy Impact Armor Damage.",
      modifiers: { flatArmorDamage: 40 }
    },
    {
      id: "load-5",
      name: "Mary Jane",
      category: "Ally",
      localArtKey: "artMj",
      description: "+25% Gold Yield & Focus Stability.",
      modifiers: { goldBonus: 0.25, attribute: "Focus" }
    }
  ],
  focusSession: {
    active: false,
    actionId: "act-1",
    startedAt: null,
    durationMinutes: 25,
    secondsRemaining: 1500,
    isPaused: false
  },
  actions: [
    {
      id: "act-1",
      externalId: "local-act-1",
      origin: "local_demo",
      title: "Deliver Database Schema",
      reason: "Critical PostgreSQL migration for Client Alpha; prevents Doc Ock mainframe breach.",
      description: "Finalize PostgreSQL migration scripts, table constraints, and schema documentation for client sign-off.",
      campaign: "Client Alpha Portal",
      category: "Engineering",
      domain: "Engineering",
      priority: "HIGH",
      rewardXp: 180,
      rewardGold: 120,
      estimatedMinutes: 45,
      baseBossDamage: 240,
      attributeGain: { name: "Intelligence", points: 3 },
      status: "PENDING",
      completedAt: null,
      createdAt: "2026-08-13T08:00:00.000Z",
      tags: ["Database", "Backend", "Client Deliverable"]
    },
    {
      id: "act-2",
      externalId: "local-act-2",
      origin: "local_demo",
      title: "Client Lead Generation Call",
      reason: "Secure Q4 frontend overhaul contract to maintain freelance runway and upgrade gear.",
      description: "Conduct discovery strategy call with SaaS founder for Q4 frontend application overhaul.",
      campaign: "Business Growth",
      category: "Sales",
      domain: "Sales",
      priority: "HIGH",
      rewardXp: 150,
      rewardGold: 150,
      estimatedMinutes: 30,
      baseBossDamage: 180,
      attributeGain: { name: "Focus", points: 2 },
      status: "PENDING",
      completedAt: null,
      createdAt: "2026-08-13T09:30:00.000Z",
      tags: ["Outreach", "Pipeline", "Discovery"]
    },
    {
      id: "act-3",
      externalId: "local-act-3",
      origin: "local_demo",
      title: "Morning Hydration & Mobility Routine",
      reason: "Maintain physical agility and combat freelancer burnout before morning focus block.",
      description: "15-minute spine mobility routine + 1L water hydration protocol prior to morning focus block.",
      campaign: "Physical Ops",
      category: "Wellness",
      domain: "Wellness",
      priority: "MEDIUM",
      rewardXp: 60,
      rewardGold: 40,
      estimatedMinutes: 15,
      baseBossDamage: 90,
      attributeGain: { name: "Agility", points: 1 },
      status: "COMPLETED",
      completedAt: "2026-08-13T07:30:00.000Z",
      createdAt: "2026-08-13T07:00:00.000Z",
      tags: ["Health", "Protocol", "Daily"]
    }
  ],
  campaigns: [
    { id: "cmp-1", title: "Client Alpha Portal", domain: "Engineering", color: "var(--color-spider-cyan)", activeTasks: 1 },
    { id: "cmp-2", title: "Business Growth", domain: "Sales", color: "var(--color-gold-warning)", activeTasks: 1 },
    { id: "cmp-3", title: "Physical Ops", domain: "Wellness", color: "var(--color-spider-red)", activeTasks: 0 }
  ],
  ledger: [
    {
      id: "tx-init-1",
      actionId: "act-3",
      actionTitle: "Morning Hydration & Mobility Routine",
      timestamp: "2026-08-13T07:30:00.000Z",
      xpAwarded: 60,
      goldAwarded: 40,
      bossDamageApplied: 90
    }
  ],
  activityLog: [
    {
      id: "log-1",
      timestamp: "2026-08-13T07:30:00.000Z",
      text: "Completed Morning Hydration & Mobility Routine (+60 XP, +40 Gold, 90 Boss Armor Dmg)",
      type: "COMPLETION"
    },
    {
      id: "log-2",
      timestamp: "2026-08-13T07:00:00.000Z",
      text: "Tactical dossier active: Doctor Octopus encounter initialized.",
      type: "SYSTEM"
    }
  ],
  lastRewardBreakdown: null,
  currentRoute: "#/command"
};
