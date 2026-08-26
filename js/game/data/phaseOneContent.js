import { ContentRegistry, validatePhaseOneContent } from '../registry/ContentRegistry.js';
import { ACTIONS, DIFFICULTIES } from './actions.js';
import { HEROES, ALLIES, GADGETS, SKILLS } from './actors.js';
import { ENEMIES } from './enemies.js';
import { REWARDS } from './rewards.js';
import { DISTRICTS, ZONES, QUESTS } from './world.js';

export function createPhaseOneContent() {
  const content = {
    actions: new ContentRegistry('actions', ACTIONS),
    heroes: new ContentRegistry('heroes', HEROES),
    allies: new ContentRegistry('allies', ALLIES),
    gadgets: new ContentRegistry('gadgets', GADGETS),
    skills: new ContentRegistry('skills', SKILLS),
    enemies: new ContentRegistry('enemies', ENEMIES),
    rewards: new ContentRegistry('rewards', REWARDS),
    districts: new ContentRegistry('districts', DISTRICTS),
    zones: new ContentRegistry('zones', ZONES),
    quests: new ContentRegistry('quests', QUESTS),
    difficulties: DIFFICULTIES
  };
  content.validationWarnings = validatePhaseOneContent(content);
  return content;
}

