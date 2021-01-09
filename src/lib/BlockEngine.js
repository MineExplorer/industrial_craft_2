var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
LIBRARY({
    name: "BlockEngine",
    version: 1,
    shared: false,
    api: "CoreEngine"
});
var ItemStack = /** @class */ (function () {
    function ItemStack(item, count, data, extra) {
        if (item === void 0) { item = 0; }
        if (count === void 0) { count = 0; }
        if (data === void 0) { data = 0; }
        if (extra === void 0) { extra = null; }
        if (typeof item == "object") {
            return new ItemStack(item.id, item.count, item.data, item.extra);
        }
        else {
            this.id = item;
            this.data = data;
            this.count = count;
            this.extra = extra;
        }
    }
    ItemStack.prototype.getMaxStack = function () {
        return Item.getMaxStack(this.id);
    };
    ItemStack.prototype.getMaxDamage = function () {
        Item.getMaxDamage(this.id);
    };
    ItemStack.prototype.isEmpty = function () {
        return this.id == 0 && this.count == 0 && this.data == 0 && this.extra == null;
    };
    ItemStack.prototype.decrease = function (count) {
        this.count -= count;
        if (this.count <= 0)
            this.clear();
    };
    ItemStack.prototype.clear = function () {
        this.id = this.data = this.count = 0;
        this.extra = null;
    };
    return ItemStack;
}());
var Vector3 = /** @class */ (function () {
    function Vector3(vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x = vx;
            this.y = vy;
            this.z = vz;
        }
        else {
            var v = vx;
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        }
    }
    Vector3.getDirection = function (side) {
        switch (side) {
            case 0: return this.DOWN;
            case 1: return this.UP;
            case 2: return this.NORTH;
            case 3: return this.SOUTH;
            case 4: return this.EAST;
            case 5: return this.WEST;
            default: Logger.Log("Invalid block side: " + side, "ERROR");
        }
    };
    Vector3.prototype.copy = function (dst) {
        if (dst) {
            return dst.set(this);
        }
        return new Vector3(this);
    };
    Vector3.prototype.set = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x = vx;
            this.y = vy;
            this.z = vz;
            return this;
        }
        var v = vx;
        return this.set(v.x, v.y, v.z);
    };
    Vector3.prototype.add = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x += vx;
            this.y += vy;
            this.z += vz;
            return this;
        }
        var v = vx;
        return this.add(v.x, v.y, v.z);
    };
    Vector3.prototype.addScaled = function (v, scale) {
        return this.add(v.x * scale, v.y * scale, v.z * scale);
    };
    Vector3.prototype.sub = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x -= vx;
            this.y -= vy;
            this.z -= vz;
            return this;
        }
        var v = vx;
        return this.sub(v.x, v.y, v.z);
    };
    Vector3.prototype.cross = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            return this.set(this.y * vz - this.z * vy, this.z * vx - this.x * vz, this.x * vy - this.y * vx);
        }
        var v = vx;
        return this.cross(v.x, v.y, v.z);
    };
    Vector3.prototype.dot = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            return this.x * vx + this.y * vy + this.z * vz;
        }
        var v = vx;
        return this.dot(v.x, v.y, v.z);
    };
    Vector3.prototype.normalize = function () {
        var len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    };
    Vector3.prototype.lengthSquared = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };
    Vector3.prototype.length = function () {
        return Math.sqrt(this.lengthSquared());
    };
    Vector3.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    Vector3.prototype.distanceSquared = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            var dx = vx - this.x;
            var dy = vy - this.y;
            var dz = vz - this.z;
            return dx * dx + dy * dy + dz * dz;
        }
        var v = vx;
        return this.distanceSquared(v.x, v.y, v.z);
    };
    Vector3.prototype.distance = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            return Math.sqrt(this.distanceSquared(vx, vy, vz));
        }
        var v = vx;
        return this.distance(v.x, v.y, v.z);
    };
    Vector3.prototype.scale = function (factor) {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
        return this;
    };
    Vector3.prototype.scaleTo = function (len) {
        var factor = len / this.length();
        return this.scale(factor);
    };
    Vector3.prototype.toString = function () {
        return "[ " + this.x + ", " + this.y + ", " + this.z + " ]";
    };
    Vector3.DOWN = new Vector3(0, -1, 0);
    Vector3.UP = new Vector3(0, 1, 0);
    Vector3.NORTH = new Vector3(0, 0, -1);
    Vector3.SOUTH = new Vector3(0, 0, 1);
    Vector3.EAST = new Vector3(-1, 0, 0);
    Vector3.WEST = new Vector3(1, 0, 0);
    return Vector3;
}());
EXPORT("Vector3", Vector3);
/**
 * Class to work with world based on BlockSource
 */
var WorldRegion = /** @class */ (function () {
    function WorldRegion(blockSource) {
        this.blockSource = blockSource;
    }
    /**
     * @returns interface to given dimension
     * (null if given dimension is not loaded and this interface
     * was not created yet)
     */
    WorldRegion.getForDimension = function (dimension) {
        var blockSource = BlockSource.getDefaultForDimension(dimension);
        if (blockSource) {
            return new WorldRegion(blockSource);
        }
        return null;
    };
    /**
     * @returns interface to the dimension where the given entity is
     * (null if given entity does not exist or the dimension is not loaded
     * and interface was not created)
     */
    WorldRegion.getForActor = function (entityUid) {
        var blockSource = BlockSource.getDefaultForActor(entityUid);
        if (blockSource) {
            return new WorldRegion(blockSource);
        }
        return null;
    };
    /**
     * @returns the dimension id to which the following object belongs
     */
    WorldRegion.prototype.getDimension = function () {
        return this.blockSource.getDimension();
    };
    WorldRegion.prototype.getBlock = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getBlock(x, y, z);
        }
        var pos = x;
        return this.getBlock(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getBlockId = function (x, y, z) {
        return this.getBlock(x, y, z).id;
    };
    WorldRegion.prototype.getBlockData = function (x, y, z) {
        return this.getBlock(x, y, z).data;
    };
    WorldRegion.prototype.setBlock = function (x, y, z, id, data) {
        if (typeof x === "number") {
            return this.blockSource.setBlock(x, y, z, id, data);
        }
        var pos = x;
        id = y;
        data = z;
        return this.setBlock(pos.x, pos.y, pos.z, id, data);
    };
    WorldRegion.prototype.destroyBlock = function (x, y, z, drop, player) {
        if (typeof x === "object") {
            var pos = x, drop_1 = y, player_1 = z;
            this.destroyBlock(pos.x, pos.y, pos.z, drop_1, player_1);
            return;
        }
        var block = this.getBlock(x, y, z);
        this.blockSource.destroyBlock(x, y, z, drop);
        if (drop) {
            var item = player ? Entity.getCarriedItem(player) : new ItemStack();
            var result = Block.getBlockDropViaItem(block, item, new Vector3(x, y, z), this.blockSource);
            if (result) {
                for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                    var dropItem = result_1[_i];
                    this.dropItem(x + .5, y + .5, z + .5, dropItem[0], dropItem[1], dropItem[2], dropItem[3] || null);
                }
            }
        }
    };
    WorldRegion.prototype.getNativeTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getBlockEntity(x, y, z);
        }
        var pos = x;
        return this.getNativeTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            var tileEntity = TileEntity.getTileEntity(x, y, z, this.blockSource);
            if (tileEntity && tileEntity.__initialized)
                return tileEntity;
            return null;
        }
        var pos = x;
        return this.getTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.addTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            return TileEntity.addTileEntity(x, y, z, this.blockSource);
        }
        var pos = x;
        return this.addTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.removeTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            return TileEntity.destroyTileEntityAtCoords(x, y, z, this.blockSource);
        }
        var pos = x;
        return this.removeTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getContainer = function (x, y, z) {
        if (typeof x === "number") {
            return World.getContainer(x, y, z, this.blockSource);
        }
        var pos = x;
        return this.getContainer(pos.x, pos.y, pos.z);
    };
    /**
     * Causes an explosion on coords
     * @param power defines radius of the explosion and what blocks it can destroy
     * @param fire if true, puts the crater on fire
     */
    WorldRegion.prototype.explode = function (x, y, z, power, fire) {
        if (fire === void 0) { fire = false; }
        this.blockSource.explode(x, y, z, power, fire);
    };
    /**
     * @returns biome id at X and Z coord
     */
    WorldRegion.prototype.getBiome = function (x, z) {
        return this.blockSource.getBiome(x, z);
    };
    /**
     * Sets biome id by coords
     * @param id - id of the biome to set
     */
    WorldRegion.prototype.setBiome = function (x, z, biomeID) {
        this.blockSource.setBiome(x, z, biomeID);
    };
    /**
     * @returns temperature of the biome on coords
     */
    WorldRegion.prototype.getBiomeTemperatureAt = function (x, y, z) {
        return this.blockSource.getBiomeTemperatureAt(x, y, z);
    };
    /**
     * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns true if chunk is loaded, false otherwise
     */
    WorldRegion.prototype.isChunkLoaded = function (chunkX, chunkZ) {
        return this.blockSource.isChunkLoaded(chunkX, chunkZ);
    };
    /**
     * @param x X coord of the position
     * @param z Z coord of the position
     * @returns true if chunk on the position is loaded, false otherwise
     */
    WorldRegion.prototype.isChunkLoadedAt = function (x, z) {
        return this.blockSource.isChunkLoadedAt(x, z);
    };
    /**
     * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns the loading state of the chunk by chunk coords
     */
    WorldRegion.prototype.getChunkState = function (chunkX, chunkZ) {
        return this.blockSource.getChunkState(chunkX, chunkZ);
    };
    /**
     * @param x X coord of the position
     * @param z Z coord of the position
     * @returns the loading state of the chunk by coords
     */
    WorldRegion.prototype.getChunkStateAt = function (x, z) {
        return this.blockSource.getChunkStateAt(x, z);
    };
    WorldRegion.prototype.getLightLevel = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getLightLevel(x, y, z);
        }
        var pos = x;
        return this.getLightLevel(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.canSeeSky = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.canSeeSky(x, y, z);
        }
        var pos = x;
        return this.canSeeSky(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getGrassColor = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getGrassColor(x, y, z);
        }
        var pos = x;
        return this.getGrassColor(pos.x, pos.y, pos.z);
    };
    /**
     * Creates dropped item and returns entity id
     * @param x X coord of the place where item will be dropped
     * @param y Y coord of the place where item will be dropped
     * @param z Z coord of the place where item will be dropped
     * @param id id of the item to drop
     * @param count count of the item to drop
     * @param data data of the item to drop
     * @param extra extra of the item to drop
     * @returns drop entity id
     */
    WorldRegion.prototype.dropItem = function (x, y, z, id, count, data, extra) {
        if (extra === void 0) { extra = null; }
        return this.blockSource.spawnDroppedItem(x, y, z, id, count, data, extra);
    };
    WorldRegion.prototype.spawnEntity = function (x, y, z, namespace, type, init_data) {
        if (type === void 0) {
            return this.blockSource.spawnEntity(x, y, z, namespace);
        }
        return this.blockSource.spawnEntity(x, y, z, namespace, type, init_data);
    };
    /**
     * Spawns experience orbs on coords
     * @param amount experience amount
     */
    WorldRegion.prototype.spawnExpOrbs = function (x, y, z, amount) {
        return this.blockSource.spawnExpOrbs(x, y, z, amount);
    };
    /**
     * @returns the list of entity IDs in given box,
     * that are equal to the given type, if blacklist value is false,
     * and all except the entities of the given type, if blacklist value is true
     */
    WorldRegion.prototype.fetchEntitiesInAABB = function (x1, y1, z1, x2, y2, z2, type, blacklist) {
        if (blacklist === void 0) { blacklist = false; }
        return this.blockSource.fetchEntitiesInAABB(x1, y1, z1, x2, y2, z2, type, blacklist);
    };
    /**
     * @returns the list of entity IDs in given box,
     * that are equal to the given type, if blacklist value is false,
     * and all except the entities of the given type, if blacklist value is true
     */
    WorldRegion.prototype.listEntitiesInAABB = function (x1, y1, z1, x2, y2, z2, type, blacklist) {
        if (blacklist === void 0) { blacklist = false; }
        return this.blockSource.listEntitiesInAABB(x1, y1, z1, x2, y2, z2, type, blacklist);
    };
    return WorldRegion;
}());
var PlayerManager = /** @class */ (function () {
    function PlayerManager(playerUid) {
        this.playerActor = new PlayerActor(playerUid);
        this.playerUid = playerUid;
    }
    /**
     * @returns player's unique numeric entity id
     */
    PlayerManager.prototype.getUid = function () {
        return this.playerUid;
    };
    /**
     * @returns the id of dimension where player is.
     */
    PlayerManager.prototype.getDimension = function () {
        return this.playerActor.getDimension();
    };
    /**
     * @returns player's gamemode.
     */
    PlayerManager.prototype.getGameMode = function () {
        return this.playerActor.getGameMode();
    };
    /**
     * Adds item to player's inventory
     * @param dropRemainings if true, surplus will be dropped near player
     */
    PlayerManager.prototype.addItemToInventory = function (id, count, data, extra, dropRemainings) {
        if (extra === void 0) { extra = null; }
        if (dropRemainings === void 0) { dropRemainings = true; }
        this.playerActor.addItemToInventory(id, count, data, extra, dropRemainings);
    };
    /**
     * @returns inventory slot's contents.
     */
    PlayerManager.prototype.getInventorySlot = function (slot) {
        return this.playerActor.getInventorySlot(slot);
    };
    /**
     * Sets inventory slot's contents.
     */
    PlayerManager.prototype.setInventorySlot = function (slot, id, count, data, extra) {
        if (extra === void 0) { extra = null; }
        this.playerActor.setInventorySlot(slot, id, count, data, extra);
    };
    /**
     * @returns item in player's hand
    */
    PlayerManager.prototype.getCarriedItem = function () {
        return Entity.getCarriedItem(this.getUid());
    };
    /**
     * Sets item in player's hand
     * @param id item id
     * @param count item count
     * @param data item data
     * @param extra item extra
     */
    PlayerManager.prototype.setCarriedItem = function (id, count, data, extra) {
        if (extra === void 0) { extra = null; }
        Entity.setCarriedItem(this.getUid(), id, count, data, extra);
    };
    /**
     * Decreases carried item count by specified number
     * @param amount amount of items to decrease, default is 1
     */
    PlayerManager.prototype.decreaseCarriedItem = function (amount) {
        if (amount === void 0) { amount = 1; }
        var item = this.getCarriedItem();
        this.setCarriedItem(item.id, item.count - amount, item.data, item.extra);
    };
    /**
     * @returns armor slot's contents.
     */
    PlayerManager.prototype.getArmor = function (slot) {
        return this.playerActor.getArmor(slot);
    };
    /**
     * Sets armor slot's contents.
     */
    PlayerManager.prototype.setArmor = function (slot, id, count, data, extra) {
        if (extra === void 0) { extra = null; }
        this.playerActor.setArmor(slot, id, count, data, extra);
    };
    /**
     * Sets respawn coords for the player.
     */
    PlayerManager.prototype.setRespawnCoords = function (x, y, z) {
        this.playerActor.setRespawnCoords(x, y, z);
    };
    /**
     * Spawns exp on coords.
     * @param value experience points value
     */
    PlayerManager.prototype.spawnExpOrbs = function (x, y, z, value) {
        this.playerActor.spawnExpOrbs(x, y, z, value);
    };
    /**
     * @returns whether the player is a valid entity.
     */
    PlayerManager.prototype.isValid = function () {
        return this.playerActor.isValid();
    };
    /**
     * @returns player's selected slot.
     */
    PlayerManager.prototype.getSelectedSlot = function () {
        return this.playerActor.getSelectedSlot();
    };
    /**
     * Sets player's selected slot.
     */
    PlayerManager.prototype.setSelectedSlot = function (slot) {
        this.playerActor.setSelectedSlot(slot);
    };
    /**
     * @returns player's experience.
     */
    PlayerManager.prototype.getExperience = function () {
        return this.playerActor.getExperience();
    };
    /**
     * Sets player's experience.
     */
    PlayerManager.prototype.setExperience = function (value) {
        this.playerActor.setExperience(value);
    };
    /**
     * Add experience to player.
     */
    PlayerManager.prototype.addExperience = function (amount) {
        this.playerActor.addExperience(amount);
    };
    /**
     * @returns player's xp level.
     */
    PlayerManager.prototype.getLevel = function () {
        return this.playerActor.getLevel();
    };
    /**
     * Sets player's xp level.
     */
    PlayerManager.prototype.setLevel = function (level) {
        this.playerActor.setLevel(level);
    };
    /**
     * @returns player's exhaustion.
     */
    PlayerManager.prototype.getExhaustion = function () {
        return this.playerActor.getExhaustion();
    };
    /**
     * Sets player's exhaustion.
     */
    PlayerManager.prototype.setExhaustion = function (value) {
        this.playerActor.setExhaustion(value);
    };
    /**
     * @returns player's hunger.
     */
    PlayerManager.prototype.getHunger = function () {
        return this.playerActor.getHunger();
    };
    /**
     * Sets player's hunger.
     */
    PlayerManager.prototype.setHunger = function (value) {
        this.playerActor.setHunger(value);
    };
    /**
     * @returns player's saturation.
     */
    PlayerManager.prototype.getSaturation = function () {
        return this.playerActor.getSaturation();
    };
    /**
     * Sets player's saturation.
     */
    PlayerManager.prototype.setSaturation = function (value) {
        this.playerActor.setSaturation(value);
    };
    /**
     * @returns player's score.
     */
    PlayerManager.prototype.getScore = function () {
        return this.playerActor.getScore();
    };
    /**
     * Sets player's score.
     */
    PlayerManager.prototype.setScore = function (value) {
        this.playerActor.setScore(value);
    };
    return PlayerManager;
}());
var BlockBase = /** @class */ (function () {
    function BlockBase(nameID) {
        this.variants = [];
        this.nameID = nameID;
        this.id = IDRegistry.genBlockID(nameID);
        //ItemRegistry.register(this);
    }
    BlockBase.prototype.addVariant = function (name, texture, inCreative) {
        this.variants.push();
    };
    BlockBase.prototype.create = function (blockType) {
        Block.createBlock(this.nameID, this.variants, blockType);
    };
    BlockBase.prototype.setDestroyTime = function (destroyTime) {
        Block.setDestroyTime(this.nameID, destroyTime);
        return this;
    };
    BlockBase.prototype.setBlockMaterial = function (material, level) {
        Block.setBlockMaterial(this.nameID, material, level);
        return this;
    };
    BlockBase.prototype.setShape = function (x1, y1, z1, x2, y2, z2, data) {
        Block.setShape(this.id, x1, y1, z1, x2, y2, z2, data);
        return this;
    };
    BlockBase.prototype.registerTileEntity = function (prototype) {
        TileEntity.registerPrototype(this.id, prototype);
    };
    return BlockBase;
}());
var ItemBasic = /** @class */ (function () {
    function ItemBasic(nameID, name, icon) {
        this.rarity = 0;
        this.nameID = nameID;
        this.id = IDRegistry.genItemID(nameID);
        this.setName(name || nameID);
        if (typeof icon == "string")
            this.setIcon(icon);
        else if (typeof icon == "object")
            this.setIcon(icon.name, icon.meta || icon.data);
        else
            this.setIcon("missing_icon");
    }
    ItemBasic.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    ItemBasic.prototype.setIcon = function (texture, index) {
        if (index === void 0) { index = 0; }
        this.icon = { name: texture, meta: index };
        return this;
    };
    ItemBasic.prototype.createItem = function (inCreative) {
        if (inCreative === void 0) { inCreative = true; }
        this.item = Item.createItem(this.nameID, this.name, this.icon, { isTech: !inCreative });
        return this;
    };
    ItemBasic.prototype.setMaxDamage = function (maxDamage) {
        this.item.setMaxDamage(maxDamage);
        return this;
    };
    ItemBasic.prototype.setMaxStack = function (maxStack) {
        this.item.setMaxStackSize(maxStack);
        return this;
    };
    ItemBasic.prototype.setHandEquipped = function (enabled) {
        this.item.setHandEquipped(enabled);
        return this;
    };
    ItemBasic.prototype.setEnchantType = function (type, enchantability) {
        this.item.setEnchantType(type, enchantability);
        return this;
    };
    ItemBasic.prototype.setLiquidClip = function () {
        this.item.setLiquidClip(true);
        return this;
    };
    ItemBasic.prototype.setGlint = function (enabled) {
        this.item.setGlint(enabled);
        return this;
    };
    ItemBasic.prototype.allowInOffHand = function () {
        this.item.setAllowedInOffhand(true);
        return this;
    };
    ItemBasic.prototype.addRepairItem = function (itemID) {
        this.item.addRepairItem(itemID);
        return this;
    };
    ItemBasic.prototype.setRarity = function (rarity) {
        this.rarity = rarity;
        return this;
    };
    ItemBasic.prototype.getRarityColor = function (rarity) {
        if (rarity == 1)
            return "§e";
        if (rarity == 2)
            return "§b";
        if (rarity == 3)
            return "§d";
        return "";
    };
    return ItemBasic;
}());
/// <reference path="./ItemBasic.ts" />
var ItemArmor = /** @class */ (function (_super) {
    __extends(ItemArmor, _super);
    function ItemArmor(nameID, name, icon, params) {
        var _this = _super.call(this, nameID, name, icon) || this;
        _this.armorType = params.type;
        _this.defence = params.defence;
        if (params.texture)
            _this.setArmorTexture(params.texture);
        if (params.material)
            _this.setMaterial(params.material);
        return _this;
    }
    ItemArmor.prototype.createItem = function (inCreative) {
        if (inCreative === void 0) { inCreative = true; }
        this.item = Item.createArmorItem(this.nameID, this.name, this.icon, { type: this.armorType, armor: this.defence, durability: 0, texture: this.texture, isTech: !inCreative });
        if (this.armorMaterial)
            this.setMaterial(this.armorMaterial);
        ItemArmor.registerListeners(this.id, this);
        return this;
    };
    ItemArmor.prototype.setArmorTexture = function (texture) {
        this.texture = texture;
        return this;
    };
    ItemArmor.prototype.setMaterial = function (armorMaterial) {
        if (typeof armorMaterial == "string") {
            armorMaterial = ItemRegistry.getArmorMaterial(armorMaterial);
        }
        this.armorMaterial = armorMaterial;
        if (this.item) {
            var index = Native.ArmorType[this.armorType];
            var maxDamage = armorMaterial.durabilityFactor * ItemArmor.maxDamageArray[index];
            this.setMaxDamage(maxDamage);
            if (armorMaterial.enchantability) {
                this.setEnchantType(Native.EnchantType[this.armorType], armorMaterial.enchantability);
            }
            if (armorMaterial.repairItem) {
                this.addRepairItem(armorMaterial.repairItem);
            }
        }
        return this;
    };
    ItemArmor.registerListeners = function (id, armorFuncs) {
        if ('onHurt' in armorFuncs) {
            Armor.registerOnHurtListener(id, function (item, slot, player, type, value, attacker, bool1, bool2) {
                return armorFuncs.onHurt({ attacker: attacker, type: type, damage: value, bool1: bool1, bool2: bool2 }, item, slot, player);
            });
        }
        if ('onTick' in armorFuncs) {
            Armor.registerOnTickListener(id, function (item, slot, player) {
                return armorFuncs.onTick(item, slot, player);
            });
        }
        if ('onTakeOn' in armorFuncs) {
            Armor.registerOnTakeOnListener(id, function (item, slot, player) {
                armorFuncs.onTakeOn(item, slot, player);
            });
        }
        if ('onTakeOff' in armorFuncs) {
            Armor.registerOnTakeOffListener(id, function (item, slot, player) {
                armorFuncs.onTakeOff(item, slot, player);
            });
        }
    };
    ItemArmor.maxDamageArray = [11, 16, 15, 13];
    return ItemArmor;
}(ItemBasic));
/// <reference path="./BlockBase.ts" />
/// <reference path="./ItemBasic.ts" />
/// <reference path="./ItemArmor.ts" />
var ItemRegistry;
(function (ItemRegistry) {
    var items = {};
    var armorMaterials = {};
    function addArmorMaterial(name, material) {
        armorMaterials[name] = material;
    }
    ItemRegistry.addArmorMaterial = addArmorMaterial;
    function getArmorMaterial(name) {
        return armorMaterials[name];
    }
    ItemRegistry.getArmorMaterial = getArmorMaterial;
    function registerItem(itemInstance, addToCreative) {
        if (!itemInstance.item)
            itemInstance.createItem(addToCreative);
        items[itemInstance.id] = itemInstance;
        if ('onNameOverride' in itemInstance) {
            Item.registerNameOverrideFunction(itemInstance.id, function (item, translation, name) {
                return itemInstance.onNameOverride(item, translation, name);
            });
        }
        if ('onIconOverride' in itemInstance) {
            Item.registerIconOverrideFunction(itemInstance.id, function (item, isModUi) {
                return itemInstance.onIconOverride(item, isModUi);
            });
        }
        if ('onItemUse' in itemInstance) {
            Item.registerUseFunction(itemInstance.id, function (coords, item, block, player) {
                itemInstance.onItemUse(coords, item, block, player);
            });
        }
        if ('onNoTargetUse' in itemInstance) {
            Item.registerNoTargetUseFunction(itemInstance.id, function (item, player) {
                itemInstance.onNoTargetUse(item, player);
            });
        }
        if ('onUsingReleased' in itemInstance) {
            Item.registerUsingReleasedFunction(itemInstance.id, function (item, ticks, player) {
                itemInstance.onUsingReleased(item, ticks, player);
            });
        }
        if ('onUsingComplete' in itemInstance) {
            Item.registerUsingCompleteFunction(itemInstance.id, function (item, player) {
                itemInstance.onUsingComplete(item, player);
            });
        }
        if ('onDispense' in itemInstance) {
            Item.registerDispenseFunction(itemInstance.id, function (coords, item, blockSource) {
                var region = new WorldRegion(blockSource);
                itemInstance.onDispense(coords, item, region);
            });
        }
    }
    ItemRegistry.registerItem = registerItem;
    function getInstanceOf(itemID) {
        return items[itemID] || null;
    }
    ItemRegistry.getInstanceOf = getInstanceOf;
    function createItem(nameID, params) {
        var item = new ItemBasic(nameID, params.name, params.icon);
        item.createItem(params.inCreative);
        if (params.maxStack)
            item.setMaxStack(params.maxStack);
        return item;
    }
    ItemRegistry.createItem = createItem;
    function createArmorItem(nameID, params) {
        var item = new ItemArmor(nameID, params.name, params.icon, params);
        item.createItem(params.inCreative);
        if (params.material)
            item.setMaterial(params.material);
        return item;
    }
    ItemRegistry.createArmorItem = createArmorItem;
})(ItemRegistry || (ItemRegistry = {}));
var TileEntityBase = /** @class */ (function () {
    function TileEntityBase() {
        this.useNetworkItemContainer = true;
        this.client = this.client || {};
        this.client.load = this.clientLoad;
        this.client.unload = this.clientUnload;
        this.client.tick = this.clientTick;
    }
    TileEntityBase.prototype.created = function () { };
    TileEntityBase.prototype.init = function () {
        this.region = new WorldRegion(this.blockSource);
    };
    TileEntityBase.prototype.load = function () { };
    TileEntityBase.prototype.unload = function () { };
    TileEntityBase.prototype.tick = function () { };
    TileEntityBase.prototype.clientLoad = function () { };
    TileEntityBase.prototype.clientUnload = function () { };
    TileEntityBase.prototype.clientTick = function () { };
    TileEntityBase.prototype.onCheckerTick = function (isInitialized, isLoaded, wasLoaded) { };
    TileEntityBase.prototype.getScreenName = function (player, coords) {
        return "main";
    };
    TileEntityBase.prototype.getScreenByName = function (screenName) {
        return null;
    };
    /**
     * Called when player uses some item on a TileEntity. Replaces "click" function.
     * @returns true if should prevent opening UI.
    */
    TileEntityBase.prototype.onItemUse = function (coords, item, player) {
        return false;
    };
    TileEntityBase.prototype.onItemClick = function (id, count, data, coords, player, extra) {
        if (!this.__initialized) {
            if (!this._runInit()) {
                return false;
            }
        }
        if (this.onItemUse(coords, new ItemStack(id, count, data, extra), player)) {
            return false;
        }
        if (Entity.getSneaking(player)) {
            return false;
        }
        var screenName = this.getScreenName(player, coords);
        if (screenName) {
            var client = Network.getClientForPlayer(player);
            if (client) {
                this.container.openFor(client, screenName);
                return true;
            }
        }
        return false;
    };
    TileEntityBase.prototype.destroyBlock = function (coords, player) { };
    TileEntityBase.prototype.redstone = function (params) {
        this.onRedstoneUpdate(params.power);
    };
    /**
     * Occurs when redstone signal on TileEntity block was updated. Replaces "redstone" function
     * @param signal signal power (0-15)
     */
    TileEntityBase.prototype.onRedstoneUpdate = function (signal) { };
    TileEntityBase.prototype.projectileHit = function (coords, target) { };
    TileEntityBase.prototype.destroy = function () {
        return false;
    };
    TileEntityBase.prototype.selfDestroy = function () {
        TileEntity.destroyTileEntity(this);
    };
    TileEntityBase.prototype.requireMoreLiquid = function (liquid, amount) { };
    return TileEntityBase;
}());
var Side;
(function (Side) {
    Side[Side["Client"] = 0] = "Client";
    Side[Side["Server"] = 1] = "Server";
})(Side || (Side = {}));
var BlockEngine;
(function (BlockEngine) {
    var Decorators;
    (function (Decorators) {
        function ClientSide() {
            return function (target, propertyName) {
                if (!target.client)
                    target.client = {};
                target.client[propertyName] = target[propertyName];
            };
        }
        Decorators.ClientSide = ClientSide;
        function NetworkEvent(side) {
            return function (target, propertyName) {
                if (side == Side.Client) {
                    if (!target.client)
                        target.client = {};
                    if (!target.client.events)
                        target.client.events = {};
                    target.client.events[propertyName] = target[propertyName];
                    delete target[propertyName];
                }
                else {
                    if (!target.events)
                        target.events = {};
                    target.events[propertyName] = target[propertyName];
                }
            };
        }
        Decorators.NetworkEvent = NetworkEvent;
        function ContainerEvent(side) {
            return function (target, propertyName) {
                if (side == Side.Client) {
                    if (!target.client)
                        target.client = {};
                    if (!target.client.containerEvents)
                        target.client.containerEvents = {};
                    target.client.containerEvents[propertyName] = target[propertyName];
                    delete target[propertyName];
                }
                else {
                    if (!target.containerEvents)
                        target.containerEvents = {};
                    target.containerEvents[propertyName] = target[propertyName];
                }
            };
        }
        Decorators.ContainerEvent = ContainerEvent;
    })(Decorators = BlockEngine.Decorators || (BlockEngine.Decorators = {}));
})(BlockEngine || (BlockEngine = {}));
EXPORT("ItemStack", ItemStack);
EXPORT("Vector3", Vector3);
EXPORT("WorldRegion", WorldRegion);
EXPORT("PlayerManager", PlayerManager);
EXPORT("ItemBasic", ItemBasic);
EXPORT("ItemArmor", ItemArmor);
EXPORT("ItemRegistry", ItemRegistry);
EXPORT("TileEntityBase", TileEntityBase);
EXPORT("Side", Side);
EXPORT("BlockEngine", BlockEngine);
