/* ==========================================================================
   SPIDER-MAN LIFE RPG - ITEMS SEED DATA (Vertical-Slice, Milestone 01)
   Static definitions — never mutated at runtime; deep-clone on use.
   ========================================================================== */

const ITEMS_DATA = [
  {
    id: 'item_anti_ock_suit_bp',
    name: 'Anti-Ock Suit Blueprint',
    description: 'A partial schematic recovered from Doctor Octopus\'s hidden lab. Unlocks the Anti-Ock Suit for crafting.',
    icon: '📜',
    rarity: 'Mythic',
    category: 'blueprint',
    sourceVillainId: 'docock',
    equippedSuitId: 'anti_ock_suit',  // links to suits data id when forged
    loreText: 'Otto\'s obsessive notes fill every margin. The counter-measures are elegant — and terrifying.'
  },
  {
    id: 'item_gold_chest_500',
    name: 'Gold Chest (500)',
    description: 'A sealed strongbox packed with gold coins scavenged from Doctor Octopus\'s lair.',
    icon: '📦',
    rarity: 'Rare',
    category: 'consumable',
    sourceVillainId: 'docock',
    goldValue: 500,
    loreText: 'Heavy. Very heavy. Peter is not complaining.'
  }
];

window.ITEMS_DATA = ITEMS_DATA;
