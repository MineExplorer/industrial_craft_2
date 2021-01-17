namespace ItemName {
	export function addTooltip(id: number, tooltip: string): void {
		Item.registerNameOverrideFunction(id, function(item: ItemInstance, name: string) {
			return ItemRegistry.getItemRarityColor(item.id) + name + "\n§7" + tooltip;
		});
	}

	export function addTierTooltip(stringID: string, tier: number): void {
		addTooltip(Block.getNumericId(stringID), Translation.translate("tooltip.power_tier").replace("%s", tier.toString()));
	}

	export function addStorageBlockTooltip(stringID: string, tier: number, capacity: string): void {
		Item.registerNameOverrideFunction(Block.getNumericId(stringID), function(item: ItemInstance, name: string) {
			return ItemRegistry.getItemRarityColor(item.id) + ItemName.showBlockStorage(item, name, tier, capacity);
		});
	}

	export function showBlockStorage(item: ItemInstance, name: string, tier: number, capacity: string): string {
		let tierText = "§7" + Translation.translate("tooltip.power_tier").replace("%s", tier.toString());

		let energy = 0;
		if (item.extra) {
			energy = item.extra.getInt("energy");
		}
		let energyText = displayEnergy(energy) + "/" + capacity + " EU";

		return name + "\n" + tierText + "\n" +energyText;
	}

	export function getItemStorageText(item: ItemInstance): string {
		let capacity = ChargeItemRegistry.getMaxCharge(item.id);
		let energy = ChargeItemRegistry.getEnergyStored(item);
		return "§7" + displayEnergy(energy) + "/" + displayEnergy(capacity) + " EU";
	}

	export function showItemStorage(item: ItemInstance, name: string): string {
		let color = ItemRegistry.getItemRarityColor(item.id);
		return color + name + '\n' + ItemName.getItemStorageText(item);
	}

	export function displayEnergy(energy: number) {
		if (!ConfigIC.debugMode) {
			if (energy >= 1e6) {
				return Math.floor(energy / 1e5) / 10 + "M";
			}
			if (energy >= 1000) {
				return Math.floor(energy / 100) / 10 + "K";
			}
		}
		return energy;
	}
}
