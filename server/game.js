const config = require('./config');

function evolveGrid(grid, players) {
    const width = config.gridWidth;
    const height = config.gridHeight;
    const nextGrid = Array(width).fill(null).map(() => Array(height).fill(null));

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const neighbors = countLiveNeighbors(grid, x, y);
            const cellOwner = grid[x][y]; // Player ID or null

            if (cellOwner) { // Cell is alive
                if (neighbors < 2 || neighbors > 3) {
                    nextGrid[x][y] = null; // Cell dies
                } else {
                    nextGrid[x][y] = cellOwner; // Cell survives
                }
            } else { // Cell is dead
                if (neighbors ===3) {
                    //Find out which of the neighbors that are alive have the majority
                    const owners = getNeighborOwners(grid,x,y);
                    const ownerCounts = {};
                    owners.forEach(owner => {
                        if(owner){
                            ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
                        }
                    });

                    let winningOwner = null;
                    let maxCount = 0;
                    for(const owner in ownerCounts) {
                        if(ownerCounts[owner] > maxCount) {
                            maxCount = ownerCounts[owner];
                            winningOwner = owner;
                        }
                    }

                    nextGrid[x][y] = winningOwner; // Cell is born, owned by the majority neighbor
                } else {
                    nextGrid[x][y] = null; // Cell remains dead
                }
            }
        }
    }

    return nextGrid;
}

function countLiveNeighbors(grid, x, y) {
    let count = 0;
    const width = config.gridWidth;
    const height = config.gridHeight;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <=1; j++) {
            if (i === 0 && j === 0) continue; // Don't count the cell itself

            const nx = (x + i + width) % width; // Wrap around the edges
            const ny = (y + j + height) % height; // Wrap around the edges

            if (grid[nx][ny]) { // Cell is alive (owned by someone)
                count++;
            }
        }
    }
    return count;
}

function getNeighborOwners(grid, x, y) {
    const owners = [];
    const width = config.gridWidth;
    const height = config.gridHeight;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Don't count the cell itself

            const nx = (x + i + width) % width; // Wrap around the edges
            const ny = (y + j + height) % height; // Wrap around the edges

            if (grid[nx][ny]) { // Cell is alive (owned by someone)
                owners.push(grid[nx][ny]);
            }
        }
    }
    return owners;
}

module.exports = { evolveGrid };