/// <reference path="ElectricMachine.ts" />

namespace Machine {
	export abstract class Generator
	extends ElectricMachine {
		defaultDrop = BlockID.primalGenerator;

		canReceiveEnergy(): boolean {
			return false;
		}

		canExtractEnergy(): boolean {
			return true;
		}

		energyTick(type: string, src: EnergyTileNode): void {
			let output = Math.min(this.data.energy, this.getMaxPacketSize());
			this.data.energy += src.add(output) - output;
		}
	}
}