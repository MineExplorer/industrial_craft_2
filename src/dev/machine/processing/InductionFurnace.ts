/// <reference path="ProcessingMachine.ts" />

IDRegistry.genBlockID("inductionFurnace");
Block.createBlock("inductionFurnace", [
	{name: "Induction Furnace", texture: [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.inductionFurnace, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.inductionFurnace, 2, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 0], ["ind_furnace_side", 0], ["ind_furnace_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.inductionFurnace, 2, [["machine_advanced", 0], ["machine_advanced", 0], ["machine_back", 0], ["ind_furnace_front", 1], ["ind_furnace_side", 1], ["ind_furnace_side", 1]]);
TileRenderer.setRotationFunction(BlockID.inductionFurnace);

ItemName.setRarity(BlockID.inductionFurnace, 1, true);
ItemName.addTierTooltip("inductionFurnace", 2);

MachineRegistry.setMachineDrop("inductionFurnace", BlockID.machineBlockAdvanced);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.inductionFurnace, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xax"
	], ['#', BlockID.electricFurnace, -1, 'x', ItemID.ingotCopper, 0, 'a', BlockID.machineBlockAdvanced, 0]);
});

var guiInductionFurnace = InventoryWindow("Induction Furnace", {
	drawing: [
		{type: "bitmap", x: 630, y: 146, bitmap: "arrow_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_SCALE}
	],

	elements: {
		"progressScale": {type: "scale", x: 630, y: 146, direction: 0, value: 0.5, bitmap: "arrow_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource1": {type: "slot", x: 511, y: 75},
		"slotSource2": {type: "slot", x: 571, y: 75},
		"slotEnergy": {type: "slot", x: 541, y: 212},
		"slotResult1": {type: "slot", x: 725, y: 142},
		"slotResult2": {type: "slot", x: 785, y: 142},
		"slotUpgrade1": {type: "slot", x: 900, y: 80},
		"slotUpgrade2": {type: "slot", x: 900, y: 144},
		"slotUpgrade3": {type: "slot", x: 900, y: 208},
		"textInfo1": {type: "text", x: 402, y: 143, width: 100, height: 30, text: Translation.translate("Heat:")},
		"textInfo2": {type: "text", x: 402, y: 173, width: 100, height: 30, text: "0%"},
	}
});

namespace Machine {
	export class InductionFurnace
	extends ProcessingMachine {
		defaultValues = {
			energy: 0,
			power_tier: 2,
			energy_storage: 10000,
			progress: 0,
			isActive: false,
			isHeating: false,
			heat: 0,
			signal: 0
		}

		upgrades = ["transformer", "energyStorage", "redstone", "itemEjector", "itemPulling"];

		getScreenByName() {
			return guiInductionFurnace;
		}

		getRecipeResult(id: number, data: number): ItemInstance {
			return Recipes.getFurnaceRecipeResult(id, data, "iron");
		}

		getResult() {
			var sourceSlot1 = this.container.getSlot("slotSource1");
			var sourceSlot2 = this.container.getSlot("slotSource2");
			var result1 = this.getRecipeResult(sourceSlot1.id, sourceSlot1.data);
			var result2 = this.getRecipeResult(sourceSlot2.id, sourceSlot2.data);
			if (result1 || result2) {
				return [result1, result2];
			}
		}

		putResult(result: MachineRecipeRegistry.RecipeData, sourceSlot: ItemContainerSlot, resultSlot: ItemContainerSlot) {
			if (result) {
				if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0) {
					this.decreaseSlot(sourceSlot, 1);
					resultSlot.setSlot(result.id, resultSlot.count + 1, result.data);
					return true;
				}
			}
		}

		resetValues() {
			this.data.power_tier = this.defaultValues.power_tier;
			this.data.energy_storage = this.defaultValues.energy_storage;
			this.data.isHeating = this.data.signal > 0;
		}

		tick() {
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);

			var newActive = false;
			var result = this.getResult();
			if (result) {
				if (this.data.energy > 15 && this.data.progress < 100) {
					this.data.energy -= 16;
					if (this.data.heat < 10000) {this.data.heat++;}
					this.data.progress += this.data.heat / 1200;
					newActive = true;
					//this.startPlaySound();
				}
				if (this.data.progress >= 100) {
					var put1 = this.putResult(result[0], this.container.getSlot("slotSource1"), this.container.getSlot("slotResult1"));
					var put2 = this.putResult(result[1], this.container.getSlot("slotSource2"), this.container.getSlot("slotResult2"));
					if (put1 || put2) {
						this.container.validateAll();
						this.data.progress = 0;
					}
				}
			}
			else {
				this.data.progress = 0;
				if (this.data.isHeating && this.data.energy > 0) {
					if (this.data.heat < 10000) {this.data.heat++;}
					this.data.energy--;
				}
				else if (this.data.heat > 0) {
					this.data.heat -= 4;
				}
			}
			if (!newActive)
				//this.stopPlaySound();
			this.setActive(newActive);

			var energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.data.energy += ChargeItemRegistry.getEnergyFromSlot(this.container.getSlot("slotEnergy"), "Eu", energyStorage - this.data.energy, this.getTier());

			this.container.setScale("progressScale", this.data.progress / 100);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.setText("textInfo2", Math.floor(this.data.heat / 100) + "%");
			this.container.sendChanges();
		}

		redstone(signal: any) {
			this.data.signal = signal.power;
		}

		getEnergyStorage() {
			return this.data.energy_storage;
		}

		getStartingSound() {
			return "InductionStart.ogg";
		}

		getOperationSound() {
			return "InductionLoop.ogg";
		}

		getInterruptSound() {
			return "InductionStop.ogg";
		}
	}

	MachineRegistry.registerPrototype(BlockID.inductionFurnace, new InductionFurnace());

	StorageInterface.createInterface(BlockID.inductionFurnace, {
		slots: {
			"slotSource1": {input: true},
			"slotSource2": {input: true},
			"slotResult1": {output: true},
			"slotResult2": {output: true}
		},
		isValidInput: (item: ItemInstance) => {
			return Recipes.getFurnaceRecipeResult(item.id, item.data, "iron")? true : false;
		}
	});
}