// Presentation groups only; mechanics and selected relations remain in Notion.
export function skillGroup(skill){
 const type=String(skill?.['Skill Type']||'').toLowerCase();
 if(/passive|modifier|formula|keystone/.test(type))return 'passive';
 if(/ultimate|finisher/.test(type))return 'ultimate';
 if(/active|basic|reaction|signature/.test(type))return 'active';
 return 'other';
}
export const SKILL_GROUP_LABELS={active:'CHỦ ĐỘNG',passive:'NỘI TẠI / BỔ TRỢ',ultimate:'ULTIMATE',other:'CHƯA PHÂN LOẠI'};
