IDRegistry.genBlockID("genWatermill");
Block.createBlock("genWatermill", [
	{name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]], inCreative: true}
], "machine");
ToolAPI.registerBlockMaterial(BlockID.genWatermill, "stone", 1, true);

TileRenderer.setStandardModelWithRotation(BlockID.genWatermill, 2, [["machine_bottom", 0], ["machine_top", 0], ["watermill_back", 0], ["watermill_front", 0], ["watermill_left", 0], ["watermill_right", 0]]);
TileRenderer.setRotationFunction(BlockID.genWatermill);

Callback.addCallback("PreLoaded", function() {
	Recipes.addShaped({id: BlockID.genWatermill, count: 1, data: 0}, [
		"x x",
		"a#a",
		"xcx"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0, 'a', ItemID.casingSteel, 0, 'c', ItemID.coil, 0]);
});

namespace Machine {
	export class WaterGenerator extends Generator {
		defaultValues = {
			energy: 0,
			output: 0
		}

		biomeCheck(x: number, z: number) {
			let coords = [[x, z], [x-7, z], [x+7, z], [x, z-7], [x, z+7]];
			for (let c of coords) {
				let biome = this.region.getBiome(c[0], c[1]);
				if (biome==0 || biome==24) {return "ocean";}
				if (biome==7) {return "river";}
			}
			return null;
		}

		energyTick(type: string, src: EnergyTileNode): void {
			if (World.getThreadTime()%20 == 0) {
				this.data.output = 0;
				let biome = this.biomeCheck(this.x, this.z);
				if (biome && this.y >= 32 && this.y < 64) {
					let output = 50;
					let radius = 1;
					let wether = World.getWeather();
					if (wether.thunder && wether.rain) {
						if (wether.thunder) {output *= 2;}
						else {output *= 1.5;}
					}
					else if (biome == "ocean") {
						output *= 1.5 * Math.sin(World.getWorldTime()%6000 / (6000 / Math.PI));
					}
					let tile = this.region.getBlockId(
						this.x - randomInt(-radius, radius),
						this.y - randomInt(-radius, radius),
						this.z - randomInt(-radius, radius)
					);
					if (tile == 8 || tile == 9) {
						this.data.output = Math.round(output) / 20;
					}
					else {
						this.data.output = 0;
					}
				}
			}
			src.addAll(this.data.output);
		}

		canRotate(side: number): boolean {
			return side > 1;
		}
	}

	MachineRegistry.registerPrototype(BlockID.genWatermill, new WaterGenerator());
}