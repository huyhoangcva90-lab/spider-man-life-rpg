import {skillGroup} from './SkillPresentation.mjs';
// Explicit visual interpretations. They never calculate damage or apply statuses.
export function notionSkillAnimation(skill) {
  if (!skill || skillGroup(skill)==='passive') return null;
  const key = String(skill.Skill || '').trim().toLowerCase();
  const clips = {
    'web trap': { clip: 'ranged_attack', effect: 'trap', label: 'Vùng tơ giữ chân' },
    'web shot': { clip: 'ranged_attack', effect: 'web', label: 'Bắn tơ' },
    'kick': { clip: 'attack_03', effect: 'kick', label: 'Đá cơ bản' },
    'maximum spider': { clip: 'combo_chain', effect: 'barrage', label: 'Chuỗi đòn tốc độ cao' },
    'web strike': { clip: 'web_pull', effect: 'dash', label: 'Lao theo sợi tơ' },
    'swing kick': { clip: 'swing_kick', effect: 'kick', label: 'Đu tơ đá' },
    'aerial launch': { clip: 'skill_02', effect: 'launch', label: 'Hất lên không' },
    'air punch': { clip: 'air_attack', effect: 'launch', label: 'Đấm trên không' },
    'air kick': { clip: 'air_attack', effect: 'kick', label: 'Đá trên không' },
    'punch': { clip: 'attack_01', effect: 'impact', label: 'Đấm cơ bản' },
    'heavy punch': { clip: 'skill_01', effect: 'impact', label: 'Đấm nặng' },
    'perfect dodge': { clip: 'dodge', effect: 'dodge', label: 'Né đòn' }
  };
  return clips[key] || null;
}
