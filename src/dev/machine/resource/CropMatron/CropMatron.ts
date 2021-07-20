/// <reference path="./TileCropMatron.ts" />

IDRegistry.genBlockID("cropMatron");
Block.createBlock("cropMatron", [
    { name: "Crop Matron", texture: [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]], inCreative: true }
], "machine");

TileRenderer.setStandardModelWithRotation(BlockID.cropMatron, 2, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0], ["cropmatron_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.cropMatron, 2, [["machine_bottom", 0], ["cropmatron_top", 0], ["cropmatron_side", 3], ["cropmatron_side", 1], ["cropmatron_side", 2], ["cropmatron_side", 2]]);
TileRenderer.setRotationFunction(BlockID.cropMatron, true);

ItemName.addTierTooltip("cropMatron", 1);

Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: BlockID.cropMatron, count: 1, data: 0 }, [
        "cxc",
        "a#a",
        "nnn"
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 54, -1, 'c', ItemID.circuitBasic, 0, 'a', ItemID.cellEmpty, 0, 'n', ItemID.cropStick, 0]);
});

MachineRegistry.registerPrototype(BlockID.cropMatron, new Machine.CropMatron());

MachineRegistry.createStorageInterface(BlockID.cropMatron, {
    slots: {
        "slotFertilizer^0-6": { input: true, isValid: (item: ItemInstance) => item.id == ItemID.fertilizer },
        "slotWeedEx^0-6": { input: true, isValid: (item: ItemInstance) => item.id == ItemID.weedEx },
        "slotWaterIn": {
            input: true, isValid: (item: ItemInstance) => {
                return LiquidItemRegistry.getItemLiquid(item.id, item.data) == "water";
            }
        },
        "slotWaterOut": { output: true }
    },

    canReceiveLiquid: (liquid: string) => liquid == "water"
});