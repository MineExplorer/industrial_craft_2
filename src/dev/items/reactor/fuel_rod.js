IDRegistry.genItemID("fuelRod");
Item.createItem("fuelRod", "Fuel Rod (Empty)", {name: "fuel_rod", meta: 0});

IDRegistry.genItemID("fuelRodUranium");
IDRegistry.genItemID("fuelRodUranium2");
IDRegistry.genItemID("fuelRodUranium4");
Item.createItem("fuelRodUranium", "Fuel Rod (Uranium)", {name: "fuel_rod_uranium", meta: 0});
Item.createItem("fuelRodUranium2", "Dual Fuel Rod (Uranium)", {name: "fuel_rod_uranium", meta: 1}, {stack: 32});
Item.createItem("fuelRodUranium4", "Quad Fuel Rod (Uranium)", {name: "fuel_rod_uranium", meta: 2}, {stack: 16});
ItemReactor.registerComponent(ItemID.fuelRodUranium, new ItemReactor.FuelRod(1, 20000, ItemID.fuelRodDepletedUranium));
ItemReactor.registerComponent(ItemID.fuelRodUranium2, new ItemReactor.FuelRod(2, 20000, ItemID.fuelRodDepletedUranium2));
ItemReactor.registerComponent(ItemID.fuelRodUranium4, new ItemReactor.FuelRod(4, 20000, ItemID.fuelRodDepletedUranium4));
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodUranium, 10);
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodUranium2, 10);
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodUranium4, 10);

IDRegistry.genItemID("fuelRodMOX");
IDRegistry.genItemID("fuelRodMOX2");
IDRegistry.genItemID("fuelRodMOX4");
Item.createItem("fuelRodMOX", "Fuel Rod (MOX)", {name: "fuel_rod_mox", meta: 0});
Item.createItem("fuelRodMOX2", "Dual Fuel Rod (MOX)", {name: "fuel_rod_mox", meta: 1}, {stack: 32});
Item.createItem("fuelRodMOX4", "Quad Fuel Rod (MOX)", {name: "fuel_rod_mox", meta: 2}, {stack: 16});
ItemReactor.registerComponent(ItemID.fuelRodMOX, new ItemReactor.FuelRodMOX(1, 10000, ItemID.fuelRodDepletedMOX));
ItemReactor.registerComponent(ItemID.fuelRodMOX2, new ItemReactor.FuelRodMOX(2, 10000, ItemID.fuelRodDepletedMOX2));
ItemReactor.registerComponent(ItemID.fuelRodMOX4, new ItemReactor.FuelRodMOX(4, 10000, ItemID.fuelRodDepletedMOX4));
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodMOX, 10);
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodMOX2, 10);
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodMOX4, 10);

IDRegistry.genItemID("fuelRodDepletedUranium");
IDRegistry.genItemID("fuelRodDepletedUranium2");
IDRegistry.genItemID("fuelRodDepletedUranium4");
Item.createItem("fuelRodDepletedUranium", "Fuel Rod (Depleted Uranium)", {name: "fuel_rod_depleted_uranium", meta: 0});
Item.createItem("fuelRodDepletedUranium2", "Dual Fuel Rod (Depleted Uranium)", {name: "fuel_rod_depleted_uranium", meta: 1}, {stack: 32});
Item.createItem("fuelRodDepletedUranium4", "Quad Fuel Rod (Depleted Uranium)", {name: "fuel_rod_depleted_uranium", meta: 2}, {stack: 16});
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodDepletedUranium, 10);
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodDepletedUranium2, 10);
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodDepletedUranium4, 10);

IDRegistry.genItemID("fuelRodDepletedMOX");
IDRegistry.genItemID("fuelRodDepletedMOX2");
IDRegistry.genItemID("fuelRodDepletedMOX4");
Item.createItem("fuelRodDepletedMOX", "Fuel Rod (Depleted MOX)", {name: "fuel_rod_depleted_mox", meta: 0});
Item.createItem("fuelRodDepletedMOX2", "Dual Fuel Rod (Depleted MOX)", {name: "fuel_rod_depleted_mox", meta: 1}, {stack: 32});
Item.createItem("fuelRodDepletedMOX4", "Quad Fuel Rod (Depleted MOX)", {name: "fuel_rod_depleted_mox", meta: 2}, {stack: 16});
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodDepletedMOX, 10);
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodDepletedMOX2, 10);
RadiationAPI.registerRadioactiveItem(ItemID.fuelRodDepletedMOX4, 10);

Item.addCreativeGroup("ic2_fuelRod", Translation.translate("Nuclear Fuel Rods"), [
	ItemID.fuelRod,
	ItemID.fuelRodUranium,
	ItemID.fuelRodUranium2,
	ItemID.fuelRodUranium4,
	ItemID.fuelRodMOX,
	ItemID.fuelRodMOX2,
	ItemID.fuelRodMOX4,
	ItemID.fuelRodDepletedUranium,
	ItemID.fuelRodDepletedUranium2,
	ItemID.fuelRodDepletedUranium4,
	ItemID.fuelRodDepletedMOX,
	ItemID.fuelRodDepletedMOX2,
	ItemID.fuelRodDepletedMOX4
]);

Recipes.addShaped({id: ItemID.fuelRodUranium2, count: 1, data: 0}, [
	"fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodUranium, 0]);

Recipes.addShaped({id: ItemID.fuelRodUranium4, count: 1, data: 0}, [
	" f ",
	"bab",
	" f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium2, 0]);

Recipes.addShaped({id: ItemID.fuelRodUranium4, count: 1, data: 0}, [
	"faf",
	"bab",
	"faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodUranium, 0]);

Recipes.addShaped({id: ItemID.fuelRodMOX2, count: 1, data: 0}, [
	"fxf"
], ['x', ItemID.plateIron, 0, 'f', ItemID.fuelRodMOX, 0]);

Recipes.addShaped({id: ItemID.fuelRodMOX4, count: 1, data: 0}, [
	" f ",
	"bab",
	" f "
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX2, 0]);

Recipes.addShaped({id: ItemID.fuelRodMOX4, count: 1, data: 0}, [
	"faf",
	"bab",
	"faf"
], ['a', ItemID.plateIron, 0, 'b', ItemID.plateCopper, 0, 'f', ItemID.fuelRodMOX, 0]);
