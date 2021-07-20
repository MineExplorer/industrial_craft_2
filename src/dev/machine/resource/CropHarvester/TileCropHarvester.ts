/// <reference path="./CropHarvesterGUI.ts" />

namespace Machine {
	export class CropHarvester extends ElectricMachine {
		defaultValues = {
			energy: 0,
			tier: 1,
			energy_storage: 10000,
			scanX: -5,
			scanY: -1,
			scanZ: -5
		};

		defaultTier = 1;
		defaultEnergyStorage = 10000;
		defaultDrop = BlockID.machineBlockBasic;
		upgrades = ["transformer", "energyStorage", "itemEjector"];

		tier: number;
		energyStorage: number;

		getScreenByName() {
			return guiCropHarvester;
		}

		getTier(): number {
			return this.tier;
		}

		getEnergyStorage(): number {
			return this.energyStorage;
		}

		useUpgrades(): void {
			let upgrades = UpgradeAPI.useUpgrades(this);
			this.tier = upgrades.getTier(this.defaultTier);
			this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
		}

		setupContainer(): void {
			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, count, data) => {
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				return UpgradeAPI.isValidUpgrade(id, this);
			});
		}

		onTick(): void {
			this.useUpgrades();
			StorageInterface.checkHoppers(this);

			if (this.data.energy > 100) this.scan();
			this.dischargeSlot("slotEnergy");

			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.sendChanges();
		}

		scan(): void {
			this.data.scanX++;
			if (this.data.scanX > 5) {
				this.data.scanX = -5;
				this.data.scanZ++;
				if (this.data.scanZ > 5) {
					this.data.scanZ = -5;
					this.data.scanY++;
					if (this.data.scanY > 1) {
						this.data.scanY = -1;
					}
				}
			}
			this.data.energy -= 1;
			let cropTile = this.region.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ) as Agriculture.ICropTileEntity;

			if (cropTile && cropTile.crop && !this.isInventoryFull()) {
				let drops = null;
				let crop = cropTile.crop;
				if (cropTile.data.currentSize == crop.getOptimalHarvestSize(cropTile)) {
					drops = cropTile.performHarvest();
				} else if (cropTile.data.currentSize == cropTile.crop.getMaxSize()) {
					drops = cropTile.performHarvest();
				}
				if (drops && drops.length) {
					for (let item of drops) {
						this.putItem(item);
						this.data.energy -= 100;
						if (item.count > 0) {
							this.region.dropItem(this.x, this.y + 1, this.z, item);
						}
					}
				}
			}
		}

		putItem(item: ItemInstance): void {
			for (let i = 0; i < 15; i++) {
				let slot = this.container.getSlot("outSlot" + i);
				if (StorageInterface.addItemToSlot(item, slot) > 0) {
					slot.markDirty();
				}
			}
		}

		isInventoryFull(): boolean {
			for (let i = 0; i < 15; i++) {
				let slot = this.container.getSlot("outSlot" + i);
				let maxStack = Item.getMaxStack(slot.id);
				if (!slot.id || slot.count < maxStack) return false;
			}
			return true;
		}
	}
}