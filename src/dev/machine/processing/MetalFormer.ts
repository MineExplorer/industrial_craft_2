/// <reference path="ProcessingMachine.ts" />

IDRegistry.genBlockID("metalFormer");
Block.createBlock("metalFormer", [
	{name: "Metal Former", texture: [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.metalFormer, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.metalFormer, 2, [["machine_bottom", 0], ["metal_former_top", 0], ["machine_side", 0], ["metal_former_front", 0], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.metalFormer, 2, [["machine_bottom", 0], ["metal_former_top", 1], ["machine_side", 0], ["metal_former_front", 1], ["machine_side", 0], ["machine_side", 0]]);
TileRenderer.setRotationFunction(BlockID.metalFormer);

ItemName.addTierTooltip("metalFormer", 1);

Callback.addCallback("PreLoaded", function() {
	function isToolboxEmpty(slot: ItemInstance) {
		let container = BackpackRegistry.containers["d" + slot.data];
		if (container) {
			for (let i = 1; i <= 10; i++) {
				if (container.getSlot("slot"+i).id != 0) {
					return false;
				}
			}
		}
		return true;
	}
	Recipes.addShaped({id: BlockID.metalFormer, count: 1, data: 0}, [
		" x ",
		"b#b",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', ItemID.toolbox, -1, 'c', ItemID.coil, 0],
	function(api, field, result) {
		if (isToolboxEmpty(field[3]) && isToolboxEmpty(field[5])) {
			for (let i = 0; i < field.length; i++) {
				api.decreaseFieldSlot(i);
			}
		}
		else {
			result.id = result.count = 0;
		}
	});

	// rolling
	MachineRecipeRegistry.registerRecipesFor("metalFormer0", {
		// ingots
		265: {id: ItemID.plateIron, count: 1},
		266: {id: ItemID.plateGold, count: 1},
		"ItemID.ingotCopper": {id: ItemID.plateCopper, count: 1},
		"ItemID.ingotTin": {id: ItemID.plateTin, count: 1},
		"ItemID.ingotBronze": {id: ItemID.plateBronze, count: 1},
		"ItemID.ingotSteel": {id: ItemID.plateSteel, count: 1},
		"ItemID.ingotLead": {id: ItemID.plateLead, count: 1},
		// plates
		"ItemID.plateIron": {id: ItemID.casingIron, count: 2},
		"ItemID.plateGold": {id: ItemID.casingGold, count: 2},
		"ItemID.plateTin": {id: ItemID.casingTin, count: 2},
		"ItemID.plateCopper": {id: ItemID.casingCopper, count: 2},
		"ItemID.plateBronze": {id: ItemID.casingBronze, count: 2},
		"ItemID.plateSteel": {id: ItemID.casingSteel, count: 2},
		"ItemID.plateLead": {id: ItemID.casingLead, count: 2}
	}, true);
	// cutting
	MachineRecipeRegistry.registerRecipesFor("metalFormer1", {
		"ItemID.plateTin": {id: ItemID.cableTin0, count: 3},
		"ItemID.plateCopper": {id: ItemID.cableCopper0, count: 3},
		"ItemID.plateGold": {id: ItemID.cableGold0, count: 4},
		"ItemID.plateIron": {id: ItemID.cableIron0, count: 4},
	}, true);
	// extruding
	MachineRecipeRegistry.registerRecipesFor("metalFormer2", {
		"ItemID.ingotTin": {id: ItemID.cableTin0, count: 3},
		"ItemID.ingotCopper": {id: ItemID.cableCopper0, count: 3},
		"ItemID.ingotGold": {id: ItemID.cableGold0, count: 4},
		265: {id: ItemID.cableIron0, count: 4},
		266: {id: ItemID.cableGold0, count: 4},
		"ItemID.casingTin": {id: ItemID.tinCanEmpty, count: 1},
		"ItemID.plateIron": {id: ItemID.fuelRod, count: 1},
	}, true);
});


const guiMetalFormer = InventoryWindow("Metal Former", {
	drawing: [
		{type: "bitmap", x: 530, y: 164, bitmap: "metalformer_bar_background", scale: GUI_SCALE},
		{type: "bitmap", x: 450, y: 155, bitmap: "energy_small_background", scale: GUI_SCALE},
	],

	elements: {
		"progressScale": {type: "scale", x: 530, y: 164, direction: 0, bitmap: "metalformer_bar_scale", scale: GUI_SCALE},
		"energyScale": {type: "scale", x: 450, y: 155, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_SCALE},
		"slotSource": {type: "slot", x: 441, y: 79},
		"slotEnergy": {type: "slot", x: 441, y: 218},
		"slotResult": {type: "slot", x: 717, y: 148},
		"slotUpgrade1": {type: "slot", x: 870, y: 60},
		"slotUpgrade2": {type: "slot", x: 870, y: 119},
		"slotUpgrade3": {type: "slot", x: 870, y: 178},
		"slotUpgrade4": {type: "slot", x: 870, y: 237},
		"button": {type: "button", x: 572, y: 210, bitmap: "metal_former_button_0", scale: GUI_SCALE, clicker: {
			onClick: function(_, container: ItemContainer) {
				container.sendEvent("switchMode", {});
			}
		}}
	}
});

namespace Machine {
	export class MetalFormer extends ProcessingMachine {
		defaultValues = {
			energy: 0,
			tier: 1,
			energy_storage: 4000,
			energy_consume: 10,
			work_time: 200,
			progress: 0,
			mode: 0
		}

		upgrades: ["overclocker", "transformer", "energyStorage", "itemEjector", "itemPulling"];

		getScreenByName() {
			return guiMetalFormer;
		}

		getRecipeResult(id: number) {
			return MachineRecipeRegistry.getRecipeResult("metalFormer" + this.data.mode, id);
		}

		onTick(): void {
			this.resetValues();
			UpgradeAPI.executeUpgrades(this);

			let newActive = false;
			let sourceSlot = this.container.getSlot("slotSource");
			let resultSlot = this.container.getSlot("slotResult");
			let result = this.getRecipeResult(sourceSlot.id);
			if (result && (resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0)) {
				if (this.data.energy >= this.data.energy_consume) {
					this.data.energy -= this.data.energy_consume;
					this.data.progress += 1/this.data.work_time;
					newActive = true;
				}
				if (+this.data.progress.toFixed(3) >= 1) {
					this.decreaseSlot(sourceSlot, 1);
					resultSlot.setSlot(result.id, resultSlot.count + result.count, 0);
					this.data.progress = 0;
				}
			}
			else {
				this.data.progress = 0;
			}
			this.setActive(newActive);

			const energyStorage = this.getEnergyStorage();
			this.data.energy = Math.min(this.data.energy, energyStorage);
			this.dischargeSlot("slotEnergy");

			this.container.setScale("progressScale", this.data.progress);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.sendEvent("setModeIcon", {mode: this.data.mode});
			this.container.sendChanges();
		}

		@ContainerEvent(Side.Server)
		switchMode(): void {
			this.data.mode = (this.data.mode + 1) % 3;
		}

		@ContainerEvent(Side.Client)
		setModeIcon(container: ItemContainer, window: any, content: any, data: {mode: number}): void {
			if (content) {
				content.elements.button.bitmap = "metal_former_button_" + data.mode;
			}
		}
	}

	MachineRegistry.registerPrototype(BlockID.metalFormer, new MetalFormer());

	StorageInterface.createInterface(BlockID.metalFormer, {
		slots: {
			"slotSource": {input: true},
			"slotResult": {output: true}
		},
		isValidInput: (item: ItemInstance) => {
			return MachineRecipeRegistry.hasRecipeFor("metalFormer0", item.id) ||
			MachineRecipeRegistry.hasRecipeFor("metalFormer1", item.id) ||
			MachineRecipeRegistry.hasRecipeFor("metalFormer2", item.id);
		}
	});
}