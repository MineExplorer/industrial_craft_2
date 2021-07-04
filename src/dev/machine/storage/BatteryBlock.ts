/// <reference path="../ElectricMachine.ts" />

namespace Machine {
	export class BatteryBlock extends ElectricMachine {
		readonly isTeleporterCompatible: boolean = true;

		readonly tier: number;
		readonly capacity: number;
		readonly guiScreen: UI.StandartWindow;

		constructor(tier: number, capacity: number, defaultDrop: number, guiScreen: UI.StandartWindow) {
			super();
			this.tier = tier;
			this.capacity = capacity;
			this.defaultDrop = defaultDrop;
			this.guiScreen = guiScreen;
		}

		getScreenByName(): UI.StandartWindow {
			return this.guiScreen;
		}

		getTier(): number {
			return this.tier;
		}

		setupContainer(): void {
			StorageInterface.setSlotValidatePolicy(this.container, "slot1", (name, id) => {
				return ChargeItemRegistry.isValidItem(id, "Eu", this.getTier());
			});
			StorageInterface.setSlotValidatePolicy(this.container, "slot2", (name, id) => {
				return ChargeItemRegistry.isValidStorage(id, "Eu", this.getTier());
			});
		}

		canRotate(): boolean {
			return true;
		}

		setFacing(side: number): boolean {
			if (super.setFacing(side)) {
				this.rebuildGrid();
				return true;
			}
			return false;
		}

		onTick(): void {
			StorageInterface.checkHoppers(this);

			this.dischargeSlot("slot2");
			this.chargeSlot("slot1");

			this.container.setScale("energyScale", this.getRelativeEnergy());
			this.container.setText("textInfo1", Math.floor(this.data.energy) + "/");
			this.container.setText("textInfo2", this.getEnergyStorage());
			this.container.sendChanges();
		}

		energyTick(type: string, src: EnergyTileNode): void {
			let output = this.getMaxPacketSize();
			if (this.data.energy >= output) {
				this.data.energy += src.add(output) - output;
			}
		}

		getEnergyStorage(): number {
			return this.capacity;
		}

		canReceiveEnergy(side: number): boolean {
			return side != this.getFacing();
		}

		canExtractEnergy(side: number): boolean {
			return side == this.getFacing();
		}

		adjustDrop(item: ItemInstance): ItemInstance {
			if (item.id == this.blockID && this.data.energy > 0) {
				let extra = new ItemExtraData();
				item.extra = extra.putInt("energy", this.data.energy);
			}
			return item;
		}
	}
}

function BatteryBlockWindow(header: string) {
	return MachineRegistry.createInventoryWindow(header, {
		drawing: [
			{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_SCALE},
		],

		elements: {
			"energyScale": {type: "scale", x: 530 + GUI_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
			"slot1": {type: "slot", x: 441, y: 75},
			"slot2": {type: "slot", x: 441, y: 212},
			"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
			"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "40000"}
		}
	});
}

const BatteryBlockInterface = {
	slots: {
		"slot1": {input: true, output: true,
			isValid: function(item: ItemStack, side: number, tileEntity: Machine.BatteryBlock) {
				return side == 1 && ChargeItemRegistry.isValidItem(item.id, "Eu", tileEntity.getTier());
			},
			canOutput: function(item: ItemStack) {
				return ChargeItemRegistry.getEnergyStored(item) >= ChargeItemRegistry.getMaxCharge(item.id);
			}
		},
		"slot2": {input: true, output: true,
			isValid: function(item: ItemStack, side: number, tileEntity: Machine.BatteryBlock) {
				return side > 1 && ChargeItemRegistry.isValidStorage(item.id, "Eu", tileEntity.getTier());
			},
			canOutput: function(item: ItemStack) {
				return ChargeItemRegistry.getEnergyStored(item) <= 0;
			}
		}
	}
}