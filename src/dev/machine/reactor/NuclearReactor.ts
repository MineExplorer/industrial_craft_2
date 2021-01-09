IDRegistry.genBlockID("nuclearReactor");
Block.createBlock("nuclearReactor", [
	{name: "Nuclear Reactor", texture: [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.nuclearReactor, "stone", 1, true);
ItemName.setRarity(BlockID.nuclearReactor, 1, true);

TileRenderer.setStandardModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0], ["nuclear_reactor_side", 0]]);
TileRenderer.registerRenderModel(BlockID.nuclearReactor, 0, [["machine_bottom", 0], ["nuclear_reactor_top", 0], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1], ["nuclear_reactor_side", 1]]);

MachineRegistry.setMachineDrop("nuclearReactor", BlockID.primalGenerator);

Block.registerPlaceFunction(BlockID.nuclearReactor, function(coords, item, block, player, region) {
	let x = coords.relative.x;
	let y = coords.relative.y;
	let z = coords.relative.z;
	for (let i = 0; i < 6; i++) {
		let c = World.getRelativeCoords(x, y, z, i);
		if (region.getBlockId(c.x, c.y, c.z) == BlockID.reactorChamber) {
			let tileEnt = World.getTileEntity(c.x, c.y, c.z, region);
			if (tileEnt.core) {
				item.count++;
				return;
			}
		}
	}
	region.setBlock(x, y, z, item.id, 0);
	//World.playSound(x, y, z, "dig.stone", 1, 0.8)
	World.addTileEntity(x, y, z, region);
});

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.nuclearReactor, count: 1, data: 0}, [
		"xcx",
		"aaa",
		"x#x"
	], ['#', BlockID.primalGenerator, 0, 'a', BlockID.reactorChamber, 0, 'x', ItemID.densePlateLead, 0, 'c', ItemID.circuitAdvanced, 0]);
});

let reactorElements: UI.ElementSet = {
	"heatScale": {type: "scale", x: 346, y: 376, direction: 0, value: 0.5, bitmap: "reactor_heat_scale", scale: 3},
	"textInfo": {type: "text", font: {size: 24, color: Color.GREEN}, x: 685, y: 382, width: 256, height: 42, text: Translation.translate("Generating: ")},
}

for (let y = 0; y < 6; y++) {
	for (let x = 0; x < 9; x++) {
		let i = y*9+x;
		reactorElements["slot"+i] = {type: "slot", x: 400 + 54 * x, y: 40 + 54 * y, size: 54}
	}
}

let guiNuclearReactor = InventoryWindow("Nuclear Reactor", {
	drawing: [
		{type: "bitmap", x: 340, y: 370, bitmap: "reactor_info", scale: GUI_SCALE},
	],

	elements: reactorElements
});


let EUReactorModifier = 5;

namespace Machine {
	export class NuclearReactor
	extends Generator {
		audioSourceGeiger: AudioSource;
		__energyNets: any;

		defaultValues = {
			energy: 0,
			isEnabled: false,
			heat: 0,
			maxHeat: 10000,
			hem: 1,
			output: 0,
			boomPower: 0
		}

		chambers: ReactorChamber[] = [];

		getScreenByName() {
			return guiNuclearReactor;
		}

		init(): void {
			super.init();
			this.chambers = [];
			this.renderModel();
			this.__initialized = true;
			this.rebuildEnergyNet();
		}

		setupContainer(): void {
			this.container.setGlobalAddTransferPolicy((container, name, id, amount, data)  => {
				if (!ReactorAPI.isReactorItem(id) || container.getSlot(name).count > 0) return 0;
				return 1;
			})
		}

		rebuildEnergyNet(): void {
			let net = this.__energyNets.Eu;
			if (net) {
				EnergyNetBuilder.removeNet(net);
			}
			net = EnergyNetBuilder.buildForTile(this, EU);
			this.__energyNets.Eu = net;
			for (let i = 0; i < 6; i++) {
				let coords = StorageInterface.getRelativeCoords(this, i);
				if (this.region.getBlockId(coords) == BlockID.reactorChamber) {
					let tileEnt = this.region.getTileEntity(coords) as ReactorChamber;
					if (tileEnt) {
						this.addChamber(tileEnt);
					}
				}
			}
		}

		addChamber(chamber: ReactorChamber) {
			if (!this.__initialized || chamber.remove || (chamber.core && chamber.core != this)) {
				return;
			}
			if (this.chambers.indexOf(chamber) == -1) {
				this.chambers.push(chamber);
				chamber.core = this;
				chamber.data.x = this.x;
				chamber.data.y = this.y;
				chamber.data.z = this.z;
			}
			let net = this.__energyNets.Eu;
			let chamberNets = chamber.__energyNets;
			if (chamberNets.Eu) {
				if (chamberNets.Eu != net) {
				EnergyNetBuilder.mergeNets(net, chamberNets.Eu);}
			} else {
				for (let side = 0; side < 6; side++) {
					let c = StorageInterface.getRelativeCoords(chamber, side);
					EnergyNetBuilder.buildTileNet(net, c.x, c.y, c.z, side ^ 1);
				}
			}
			chamberNets.Eu = net;
		}

		removeChamber(chamber: ReactorChamber): void {
			this.chambers.splice(this.chambers.indexOf(chamber), 1);
			this.rebuildEnergyNet();
			let x = this.getReactorSize();
			for (let y = 0; y < 6; y++) {
				let slotName = "slot"+(y*9+x);
				let slot = this.container.getSlot(slotName);
				if (slot.id > 0) {
					this.region.dropItem(chamber.x + .5, chamber.y + .5, chamber.z + .5, slot.id, slot.count, slot.data);
					this.container.setSlot(slotName, 0, 0, 0);
				}
			}
		}

		getReactorSize(): number {
			return 3 + this.chambers.length;
		}

		processChambers(): void {
			let size = this.getReactorSize();
			for (let pass = 0; pass < 2; pass++) {
				for (let y = 0; y < 6; y++) {
					for (let x = 0; x < size; x++) {
						let slot = this.container.getSlot("slot"+(y*9+x));
						let component = ReactorAPI.getComponent(slot.id);
						if (component) {
							component.processChamber(slot, this, x, y, pass == 0);
						}
					}
				}
			}
		}

		tick(): void {
			let reactorSize = this.getReactorSize();
			this.container.sendEvent("setFieldSize", {size: reactorSize});
			if (this.data.isEnabled) {
				if (World.getThreadTime()%20 == 0) {
					this.data.maxHeat = 10000;
					this.data.hem = 1;
					this.data.output = 0;
					this.processChambers();
					this.calculateHeatEffects();
				}
			} else {
				this.data.output = 0;
			}
			this.setActive(this.data.heat >= 1000 || this.data.output > 0);

			if (this.data.output > 0) {
				this.startPlaySound();
			} else {
				this.stopPlaySound();
			}

			this.container.setScale("heatScale", this.data.heat / this.data.maxHeat);
			this.container.setText("textInfo", "Generating: " + this.getEnergyOutput() + " EU/t");
			this.container.sendChanges();
		}

		energyTick(type: string, src: any): void {
			var output = this.getEnergyOutput();
			src.add(output, Math.min(output, 8192));
		}

		onRedstoneUpdate(signal: number) {
			this.data.isEnabled = signal > 0;
		}

		getEnergyOutput(): number {
			return Math.floor(this.data.output * EUReactorModifier);
		}

		startPlaySound(): void {
			if (!ConfigIC.machineSoundEnabled || this.remove) return;
			if (!this.audioSource) {
				this.audioSource = SoundManager.createSource(SourceType.TILEENTITY, this, "NuclearReactorLoop.ogg");;
			}
			if (this.data.output < 40) {
				var geigerSound = "GeigerLowEU.ogg";
			} else if (this.data.output < 80) {
				var geigerSound = "GeigerMedEU.ogg";
			} else {
				var geigerSound = "GeigerHighEU.ogg";
			}
			if (!this.audioSourceGeiger) {
				this.audioSourceGeiger = SoundManager.createSource(SourceType.TILEENTITY, this, geigerSound);
			}
			else if (this.audioSourceGeiger.soundName != geigerSound) {
				this.audioSourceGeiger.setSound(geigerSound);
			}
		}

		stopPlaySound(): void {
			if (this.audioSource) {
				SoundManager.removeSource(this.audioSource);
				this.audioSource = null;
			}
			if (this.audioSourceGeiger) {
				SoundManager.removeSource(this.audioSourceGeiger);
				this.audioSourceGeiger = null;
			}
		}

		getHeat(): number {
			return this.data.heat;
		}

		setHeat(heat: number): void {
			this.data.heat = heat;
		}

		addHeat(amount: number): void {
			this.data.heat += amount;
		}

		getMaxHeat(): number {
			return this.data.maxHeat;
		}

		setMaxHeat(newMaxHeat: number): void {
			this.data.maxHeat = newMaxHeat;
		}

		getHeatEffectModifier(): number {
			return this.data.hem;
		}

		setHeatEffectModifier(newHEM: number): void {
			this.data.hem = newHEM;
		}

		getItemAt(x: number, y: number): ItemContainerSlot {
			if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
				return null;
			}
			return this.container.getSlot("slot"+(y*9+x));
		}

		setItemAt(x: number, y: number, id: number, count: number = 0, data: number = 0, extra: ItemExtraData = null) {
			if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
				return null;
			}
			this.container.setSlot("slot"+(y*9+x), id, count, data, extra);
		}

		addOutput(energy: number): void {
			this.data.output += energy;
		}

		destroyBlock(coords: Callback.ItemUseCoordinates, player: number) {
			for (let i in this.chambers) {
				let coords = this.chambers[i];
				this.region.destroyBlock(coords, true);
			}
		}

		explode(): void {
			let explode = false;
			let boomPower = 10;
			let boomMod = 1;
			for (let i = 0; i < this.getReactorSize() * 6; i++) {
				let slot = this.container.getSlot("slot"+i);
				let component = ReactorAPI.getComponent(slot.id);
				if (component) {
					let f = component.influenceExplosion(slot, this)
					if (f > 0 && f < 1) {
						boomMod *= f;
					} else {
						if (f >= 1) explode = true;
						boomPower += f;
					}
				}
				this.container.setSlot("slot"+i, 0, 0, 0);
			}
			if (explode) {
				this.data.boomPower = Math.min(boomPower * this.data.hem * boomMod, __config__.getNumber("reactor_explosion_max_power").floatValue());
				RadiationAPI.addRadiationSource(this.x + .5, this.y + .5, this.z + .5, this.data.boomPower, 600);
				this.region.explode(this.x + .5, this.y + .5, this.z + .5, this.data.boomPower, false);
				this.selfDestroy();
			}
		}

		calculateHeatEffects(): void {
			let power = this.data.heat / this.data.maxHeat;
			if (power >= 1) {
				this.explode();
			}
			if (power >= 0.85 && Math.random() <= 0.2 * this.data.hem) {
				let coord = this.getRandCoord(2);
				let block = this.region.getBlockId(coord);
				let material = ToolAPI.getBlockMaterialName(block);
				if (block == BlockID.nuclearReactor) {
					let tileEntity = this.region.getTileEntity(coord);
					if (tileEntity) {
						tileEntity.explode();
					}
				}
				else if (material == "stone" || material == "dirt") {
					this.region.setBlock(coord, 11, 1);
				}
			}
			if (power >= 0.7 && World.getThreadTime()%20 == 0) {
				let entities = Entity.getAll();
				for (let i in entities) {
					let ent = entities[i];
					if (canTakeDamage(ent, "radiation")) {
						let c = Entity.getPosition(ent);
						if (Math.abs(this.x + 0.5 - c.x) <= 3 && Math.abs(this.y + 0.5 - c.y) <= 3 && Math.abs(this.z + 0.5 - c.z) <= 3) {
							RadiationAPI.addEffect(ent, Math.floor(4 * this.data.hem));
						}
					}
				}
			}
			if (power >= 0.5 && Math.random() <= this.data.hem) {
				let coord = this.getRandCoord(2);
				let block = this.region.getBlockId(coord);
				if (block == 8 || block == 9) {
					this.region.setBlock(coord, 0, 0);
				}
			}
			if (power >= 0.4 && Math.random() <= this.data.hem) {
				let coord = this.getRandCoord(2);
				let block = this.region.getBlockId(coord);
				let material = ToolAPI.getBlockMaterialName(block);
				if (block != 49 && (material == "wood" || material == "wool" || material == "fibre" || material == "plant")) {
					for (let i = 0; i < 6; i++) {
						let coord2 = StorageInterface.getRelativeCoords(coord, i);
						if (this.region.getBlockId(coord2) == 0) {
							this.region.setBlock(coord2, 51, 0);
							break;
						}
					}
				}
			}
		}

		getRandCoord(rad: number): Vector {
			return new Vector3(this.x + randomInt(-rad, rad), this.y + randomInt(-rad, rad), this.z + randomInt(-rad, rad));
		}

		@ContainerEvent(Side.Client)
		setFieldSize(container: any, window: any, content: any, data: {size: number}) {
			if (content) {
				for (let y = 0; y < 6; y++) {
					for (let x = 0; x < 9; x++) {
						let newX = (x < data.size) ? 400 + 54 * x : 1400;
						content.elements["slot"+(y*9+x)].x = newX;
					}
				}
			}
		}
	}

	MachineRegistry.registerGenerator(BlockID.nuclearReactor, new NuclearReactor());
}