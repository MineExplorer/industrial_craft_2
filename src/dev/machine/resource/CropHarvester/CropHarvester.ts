/// <reference path="./TileCropHarvester.ts" />

IDRegistry.genBlockID("cropHarvester");
Block.createBlock("cropHarvester", [
	{ name: "Crop Harvester", texture: [["machine_bottom", 0], ["crop_harvester", 0]], inCreative: true }
], "machine");
ItemName.addTierTooltip("cropHarvester", 1);

Callback.addCallback("PreLoaded", function () {
	Recipes.addShaped({ id: BlockID.cropHarvester, count: 1, data: 0 }, [
		"zcz",
		"s#s",
		"pap"
	], ['#', BlockID.machineBlockBasic, 0, 'z', ItemID.circuitBasic, 0, 'c', 54, -1, 'a', ItemID.agriculturalAnalyzer, 0, 'p', ItemID.plateIron, 0, 's', 359, 0]);
});

MachineRegistry.registerPrototype(BlockID.cropHarvester, new Machine.CropHarvester());

StorageInterface.createInterface(BlockID.cropHarvester, {
	slots: {
		"outSlot^0-14": { output: true }
	}
});