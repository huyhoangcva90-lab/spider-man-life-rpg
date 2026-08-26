export class DamageEngine {
  resolve({ action, enemy, bonus = 1, difficulty }) {
    const weaknessMatch = action.tags.some((tag) => enemy.weakness.includes(tag));
    const resisted = action.tags.some((tag) => enemy.resistance.includes(tag));
    const difficultyScale = difficulty?.enemyHp || 1;
    const damage = Math.max(1, Math.round((action.damage * bonus * (weaknessMatch ? 1.5 : 1) * (resisted ? 0.68 : 1)) / difficultyScale));
    return {
      sourceId: 'peter-classic',
      targetId: enemy.id,
      damage,
      critical: weaknessMatch,
      stagger: Math.round(action.stagger * (weaknessMatch ? 1.5 : 1)),
      statusEffects: action.tags.includes('WEB') ? ['WEBBED'] : [],
      element: action.tags.includes('WEB') ? 'WEB' : action.tags.includes('ELECTRIC') ? 'ELECTRIC' : 'PHYSICAL',
      weaknessMatch,
      resisted
    };
  }
}

