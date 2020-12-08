IDRegistry.genBlockID("rtGenerator");
Block.createBlock("rtGenerator", [
	{name: "Radioisotope Thermoelectric Generator", texture: [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]], inCreative: true},
], "machine");
ToolAPI.registerBlockMaterial(BlockID.rtGenerator, "stone", 1, true);

TileRenderer.setStandardModel(BlockID.rtGenerator, 0, [["machine_bottom", 0], ["rt_generator_top", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);
TileRenderer.registerRenderModel(BlockID.rtGenerator, 0, [["machine_bottom", 0], ["rt_generator_top", 1], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0], ["rt_generator_side", 0]]);

MachineRegistry.setMachineDrop("rtGenerator", BlockID.primalGenerator);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.rtGenerator, count: 1, data: 0}, [
		"ccc",
		"c#c",
		"cxc"
	], ['#', BlockID.reactorChamber, 0, 'x', BlockID.primalGenerator, 0, 'c', ItemID.casingIron, 0]);
});

var guiRTGenerator = InventoryWindow("Radioisotope Thermoelectric Generator", {
	drawing: [
		{type: "bitmap", x: 630, y: 150, bitmap: "energy_bar_background", scale: GUI_SCALE},
	],

	elements: {
		"slot0": {type: "slot", x: 420, y: 120},
		"slot1": {type: "slot", x: 480, y: 120},
		"slot2": {type: "slot", x: 540, y: 120},
		"slot3": {type: "slot", x: 420, y: 180},
		"slot4": {type: "slot", x: 480, y: 180},
		"slot5": {type: "slot", x: 540, y: 180},
		"energyScale": {type: "scale", x: 630 + GUI_SCALE * 4, y: 150, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_SCALE},
		"textInfo1": {type: "text", x: 742, y: 148, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 742, y: 178, width: 300, height: 30, text: "10000"}
	}
});


namespace Machine {
	export class RTGenerator
	extends Generator {
		defaultValues = {
			energy: 0,
			isActive: false
		}

		setupContainer() {
			this.container.setGlobalAddTransferPolicy((contaier, name, id, amount, data) => {
				return (id == ItemID.rtgPellet)? amount : 0
			});
		}

		getScreenByName() {
			return guiRTGenerator;
		}

		tick() {
			var energyStorage = this.getEnergyStorage();
			var output = 0.5;
			for (var i = 0; i < 6; i++) {
				var slot = this.container.getSlot("slot"+i);
				if (slot.id == ItemID.rtgPellet) {
					output *= 2;
				}
			}
			output = Math.floor(output);
			this.setActive(output > 0);
			this.data.energy = Math.min(this.data.energy + output, energyStorage);
			this.container.setScale("energyScale", this.data.energy / energyStorage);
			this.container.setText("textInfo1", this.data.energy + "/");
			this.container.sendChanges();
		}

		getEnergyStorage() {
			return 10000;
		}
	}

	MachineRegistry.registerPrototype(BlockID.rtGenerator, new RTGenerator());
}