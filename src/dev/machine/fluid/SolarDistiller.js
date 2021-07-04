IDRegistry.genBlockID("solarDistiller");
Block.createBlock("solarDistiller", [
	{name: "Solar Distiller", texture: [["machine_bottom", 0], ["solar_distiller", 0], ["solar_distiller", 0], ["solar_distiller", 0], ["solar_distiller", 0], ["solar_distiller", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.solarDistiller, "stone", 1, true);

MachineRegistry.setMachineDrop("solarDistiller", BlockID.machineBlockBasic);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.solarDistiller, count: 1, data: 0}, [
		"aaa",
		"a a",
		"c#c"
	], ['#', BlockID.machineBlockBasic, 0, 'a', 20, -1, 'c', ItemID.cellEmpty, 0]);
});

const guiSolarDistiller = MachineRegistry.createInventoryWindow("Solar Distiller", {
	drawing: [
		{type: "background", color: Color.parseColor("#b3b3b3")},
	],

	elements: {
		"slotEnergy": {type: "slot", x: 600, y: 130},
		"sun": {type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_SCALE}
	}
});

MachineRegistry.registerPrototype(BlockID.solarDistiller, {
	defaultValues: {
		canSeeSky: false
	},

	getScreenByName: function() {
		return guiSolarDistiller;
	},

	onInit: function() {
		this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
	},

	tick: function() {
		if (World.getThreadTime()%100 == 0) {
			this.data.canSeeSky = this.region.canSeeSky(this.x, this.y + 1, this.z);
		}
		if (this.data.canSeeSky && this.region.getLightLevel(this.x, this.y + 1, this.z) == 15) {

		}
	}
});
