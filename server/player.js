/*
Conway's Game of Life - Multiplayer
Copyright (C) 2025  Ankayu

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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