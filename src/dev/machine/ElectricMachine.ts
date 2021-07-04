/// <reference path="MachineBase.ts" />

namespace Machine {
	export abstract class ElectricMachine
	extends MachineBase
	implements EnergyTile {
		energyNode: EnergyTileNode;
		energyTypes: object;

		defaultValues = {
			energy: 0
		};

		data: this["defaultValues"];

		getTier(): number {
			return 1;
		}

		getEnergyStorage(): number {
			return 0;
		}

		getRelativeEnergy(): number {
			return this.data.energy / this.getEnergyStorage();
		}

		getMaxPacketSize(): number {
			return 8 << this.getTier()*2;
		}

		onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
			if (item.id == ItemID.EUMeter) return true;
			return super.onItemUse(coords, item, player);
		}

		chargeSlot(slotName: string) {
			this.data.energy -= ChargeItemRegistry.addEnergyToSlot(this.container.getSlot(slotName), "Eu", this.data.energy, this.getTier());
		}

		dischargeSlot(slotName: string) {
			let amount = this.getEnergyStorage() - this.data.energy;
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot(slotName), "Eu", amount, this.getTier());
		}

		energyTick(type: string, src: EnergyTileNode): void {}

		energyReceive(type: string, amount: number, voltage: number): number {
			let maxVoltage = this.getMaxPacketSize();
			if (voltage > maxVoltage) {
				if (IC2Config.voltageEnabled) {
					this.blockSource.setBlock(this.x, this.y, this.z, 0, 0);
					this.blockSource.explode(this.x + 0.5, this.y + 0.5, this.z + 0.5, this.getExplosionPower(), true);
					SoundManager.playSoundAtBlock(this, "MachineOverload.ogg", 1, 32);
					this.selfDestroy();
					return 1;
				}
				amount = Math.min(amount, maxVoltage);
			}
			let add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
			this.data.energy += add;
			return add;
		}

		getExplosionPower(): number {
			return 1.2;
		}

		isConductor(type: string): boolean {
			return false;
		}

		canReceiveEnergy(side: number, type: string): boolean {
			return true;
		}

		canExtractEnergy(side: number, type: string): boolean {
			return false;
		}

		rebuildGrid(): void {
			this.energyNode.resetConnections();
			EnergyGridBuilder.buildGridForTile(this);
		}
	}
}