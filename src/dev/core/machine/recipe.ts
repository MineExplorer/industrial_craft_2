namespace MachineRecipeRegistry {
	export let recipeData = {};
	export let fluidRecipeData = {};

	export function registerRecipesFor(name: string, data: any, validateKeys?: boolean) {
		if (validateKeys) {
			let newData = {};
			for (let key in data) {
				let newKey: any;
				if (key.includes(":")) {
					let keyArray = key.split(":");
					if (keyArray[0] == "minecraft") {
						let stringID = keyArray[1];
						let numericID = VanillaBlockID[stringID] || VanillaItemID[stringID];
						if (!numericID) {
							let source = IDConverter.getIDData(stringID);
							newKey = source.id + ":" + source.data;
						} else {
							newKey = numericID;
							if (keyArray[2]) newKey += ":" + keyArray[2];
						}
					} else {
						newKey = eval(keyArray[0]) + ":" + keyArray[1];
					}
				} else {
					newKey = eval(key);
				}
				if (newKey) newData[newKey] = data[key];
			}
			data = newData;
		}
		this.recipeData[name] = data;
	}

	export function addRecipeFor(name: string, input: any, result: any): void {
		let recipes = this.requireRecipesFor(name, true);
		if (Array.isArray(recipes)) {
			recipes.push({input: input, result: result});
		}
		else {
			recipes[input] = result;
		}
	}

	export function requireRecipesFor(name: string, createIfNotFound?: boolean) {
		if (!recipeData[name] && createIfNotFound) {
			recipeData[name] = {};
		}
		return recipeData[name];
	}

	export function getRecipeResult(name: string, key1: string|number, key2?: string|number) {
		let data = this.requireRecipesFor(name);
		if (data && key1) {
			return data[key1] || data[key1+":"+key2];
		}
		return null;
	}

	export function hasRecipeFor(name: string, key1: string|number, key2?: string|number) {
		return this.getRecipeResult(name, key1, key2)? true : false;
	}

	export function registerFluidRecipes(name: string, data: any) {
		fluidRecipeData[name] = data;
	}

	export function requireFluidRecipes(name: string) {
		if (!fluidRecipeData[name]) {
			fluidRecipeData[name] = {};
		}
		return fluidRecipeData[name];
	}

	export function addFluidRecipe(name: string, liquid: string, data: any) {
		let recipes = requireFluidRecipes(name);
		recipes[liquid] = data;
	}

	export function getFluidRecipe(name: string, liquid: string) {
		let recipes = requireFluidRecipes(name);
		return recipes[liquid];
	}

	export type RecipeData = {
		id: number,
		count: number,
		data?: number,
		sourceCount?: number
	}
}