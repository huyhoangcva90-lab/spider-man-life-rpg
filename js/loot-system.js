/* ==========================================================================
   SPIDER-MAN LIFE RPG - LOOT SYSTEM MODULE
   Deterministic per-encounter loot, idempotent grants, inventory tracking.
   ========================================================================== */

class LootSystem {
  /**
   * Get the ITEMS_DATA definition for an item ID.
   * Falls back to a minimal descriptor if the item is unknown.
   */
  static getItemDef(itemId) {
    if (typeof ITEMS_DATA !== 'undefined') {
      const found = ITEMS_DATA.find(i => i.id === itemId);
      if (found) return found;
    }
    return { id: itemId, name: itemId, icon: '❓', rarity: 'Common', category: 'unknown', description: '' };
  }

  /**
   * Build the loot grant list for a villain defeat.
   * Only returns guaranteed drops for this milestone.
   * @param {object} villainDef - from VILLAINS_DATA
   * @returns {Array<{ itemId, quantity }>}
   */
  static buildLootGrant(villainDef) {
    const grants = [];
    if (!villainDef.lootTable) return grants;

    villainDef.lootTable.forEach(entry => {
      // In this milestone we only process guaranteed drops
      const chance = entry.chance !== undefined ? entry.chance : entry.dropChance;
      if (chance >= 1.0 || entry.guaranteed) {
        grants.push({ itemId: entry.itemId, quantity: entry.quantity || 1 });
      }
    });

    return grants;
  }

  /**
   * Apply a loot grant to inventory state (mutates inventory in place).
   * @param {object} inventory - state.inventory
   * @param {Array}  grants    - [{ itemId, quantity }]
   */
  static applyToInventory(inventory, grants) {
    grants.forEach(({ itemId, quantity }) => {
      // Add to stacks
      inventory.itemStacks[itemId] = (inventory.itemStacks[itemId] || 0) + quantity;

      // Track as unlocked (once only)
      if (!inventory.unlockedItemIds.includes(itemId)) {
        inventory.unlockedItemIds.push(itemId);
        inventory.newItemIds.push(itemId);   // "new" badge until seen
      }
    });
  }

  /**
   * Record a boss defeat in inventory (idempotent by encounterId).
   * @param {object} inventory
   * @param {string} encounterId
   * @param {string} villainId
   */
  static recordDefeat(inventory, encounterId, villainId) {
    const alreadyRecorded = inventory.defeatRecords.some(r => r.encounterId === encounterId);
    if (!alreadyRecorded) {
      inventory.defeatRecords.push({
        encounterId,
        villainId,
        defeatedAt: new Date().toISOString()
      });
    }
  }

  /**
   * Mark items as "seen" (remove from newItemIds) for a set of item IDs.
   * @param {object} inventory
   * @param {string[]} itemIds
   */
  static markItemsSeen(inventory, itemIds) {
    inventory.newItemIds = inventory.newItemIds.filter(id => !itemIds.includes(id));
  }
}

window.LootSystem = LootSystem;
