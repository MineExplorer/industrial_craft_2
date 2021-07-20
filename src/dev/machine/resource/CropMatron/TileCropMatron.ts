/// <reference path="./CropMatronGUI.ts" />

namespace Machine {
	export class CropMatron extends ElectricMachine {
		liquidTank: BlockEngine.LiquidTank;
		defaultValues = {
			energy: 0,
			scanX: -5,
			scanY: -1,
			scanZ: -5
		}

		getScreenByName() {
			return guiCropMatron;
		}

		setupContainer(): void {
			this.liquidTank = this.addLiquidTank("fluid", 2000, ["water"]);

			StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
				if (name == "slotEnergy") return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
				if (name == "slotWaterIn") return LiquidItemRegistry.getItemLiquid(id, data) == "water";
				if (name.startsWith("slotFertilizer")) return id == ItemID.fertilizer;
				if (name.startsWith("slotWeedEx")) return id == ItemID.weedEx;
				return false;
			});
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (Entity.getSneaking(player)) {
				if (MachineRegistry.fillTankOnClick(this.liquidTank, item, player)) {
					this.preventClick();
					return true;
				}
			}
			return super.onItemUse(coords, item, player);
		}

		onTick(): void {
			StorageInterface.checkHoppers(this);

			let slot1 = this.container.getSlot("slotWaterIn");
			let slot2 = this.container.getSlot("slotWaterOut");
			this.liquidTank.getLiquidFromItem(slot1, slot2);

			if (this.data.energy >= 31) {
				this.scan();
				this.setActive(true);
			} else {
				this.setActive(false);
			}

			this.dischargeSlot("slotEnergy");

			this.liquidTank.updateUiScale("liquidScale");
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

			let tileentity = this.region.getTileEntity(this.x + this.data.scanX, this.y + this.data.scanY, this.z + this.data.scanZ);
			if (tileentity && tileentity.crop) {
				let slotFertilizer = this.getSlot("slotFertilizer");
				let weedExSlot = this.getSlot("slotWeedEx");
				if (slotFertilizer && tileentity.applyFertilizer(false)) {
					this.decreaseSlot(slotFertilizer, 1);
					this.data.energy -= 10;
				}
				let liquidAmount = this.liquidTank.getAmount("water");
				if (liquidAmount > 0) {
					let amount = tileentity.applyHydration(liquidAmount);
					if (amount > 0) {
						this.liquidTank.getLiquid(amount);
					}
				}
				if (weedExSlot.id && tileentity.applyWeedEx(weedExSlot, false)) {
					this.data.energy -= 10;
					if (++weedExSlot.data >= Item.getMaxDamage(weedExSlot.id)) {
						weedExSlot.clear();
					}
					weedExSlot.markDirty();
				}
			}
		}

		getSlot(type: string): ItemContainerSlot {
			for (let i = 0; i < 7; i++) {
				let slot = this.container.getSlot(type + i);
				if (slot.id) return slot;
			}
			return null;
		}

		getEnergyStorage(): number {
			return 10000;
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
	}
}