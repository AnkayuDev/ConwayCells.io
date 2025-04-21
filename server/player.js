class Player {
    constructor(id, initalEnergy) {
        this.id = id;
        this.energy = initalEnergy;
        this.cells = []; // Array of {x, y} coordinates
        this.alive = true;
    }

    addCell(x, y) {
        this.cells.push({ x, y });
    }

    removeCell(x, y) {
        this.cells = this.cells.filter(cell => !(cell.x === x && cell.y === y));
    }

    hasEnoughEnergy(cost) {
        return this.energy >= cost;
    }

    consumeEnergy(cost) {
        this.energy -= cost;
    }

    rechargeEnergy() {
        this.energy = Math.min(100, this.energy + config.energyRechargeRate); // Cap at 100
    }

    isAlive() {
        return this.alive;
    }

    setAlive(alive) {
        this.alive = alive;
    }

    getCells() {
        return this.cells;
    }
}

module.exports = Player;