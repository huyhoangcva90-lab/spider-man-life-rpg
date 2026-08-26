import { createPhaseOneContent } from './phaseOneContent.js';

const content = createPhaseOneContent();
const hero = content.heroes.get('peter-classic');
const ally = content.allies.get('miles-morales');
const district = content.districts.get('manhattan');
const zone = content.zones.get('rooftop-night-rain');
const mainQuest = content.quests.get('main-001');

// Compatibility projection for the current UI. Canonical content lives in registries.
export const PHASE_ONE_DATA = Object.freeze({
  content,
  district: {
    id: district.id,
    zoneId: zone.id,
    name: zone.name,
    weather: `${zone.time} // ${zone.weather}`,
    threat: 2,
    story: `CHAPTER 01 // ${mainQuest.title}`
  },
  hero,
  ally,
  encounter: mainQuest.enemyIds.map((id) => {
    const enemy = content.enemies.get(id);
    return {
      ...enemy,
      maxHp: enemy.hp,
      attack: enemy.power,
      tier: enemy.displayTier || enemy.tier,
      weakness: enemy.weakness.join(' / ') || 'NONE',
      resistance: enemy.resistance.join(' / ') || 'NONE'
    };
  }),
  actions: Object.fromEntries(content.actions.all().map((action) => [action.slot, {
    ...action,
    energy: action.energyCost,
    cooldown: action.cooldownTurns
  }])),
  quests: content.quests.all().map((quest) => ({
    ...quest,
    copy: quest.description,
    reward: content.rewards.get(quest.rewardId).guaranteed.map((item) => item.name || `${item.amount} ${item.type}`).join(' + ')
  })),
  gadgets: content.gadgets.all(),
  skills: content.skills.all()
});
