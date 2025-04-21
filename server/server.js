const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const config = require('./config');
const Player = require('./player');
const game = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*", // Allow all origins for development.  CHANGE THIS FOR PRODUCTION!
        methods: ["GET", "POST"]
    }
});

const players = {};
let grid = Array(config.gridWidth).fill(null).map(() => Array(config.gridHeight).fill(null));  // Initialize with null (dead cells)

function initializeGrid() {
  for (let x = 0; x < config.gridWidth; x++) {
    for (let y = 0; y < config.gridHeight; y++) {
      grid[x][y] = null; // Initialize with null (dead cells)
    }
  }
}

initializeGrid();

function updateGame() {
    grid = game.evolveGrid(grid, players);

    // Recharge energy for all players
    for (const playerId in players) {
        players[playerId].rechargeEnergy();
    }

    // Check for player elimination
    for (const playerId in players) {
        const player = players[playerId];
        player.setAlive(player.getCells().length > 0); // Player is alive if they have cells.

        if (!player.isAlive()) {
            console.log(`Player ${playerId} eliminated!`);
            io.to(playerId).emit('eliminated');
            //Potentially remove the player's cells from the grid.
            for (let x = 0; x < config.gridWidth; x++) {
              for (let y = 0; y < config.gridHeight; y++) {
                if(grid[x][y] === playerId){
                  grid[x][y] = null;
                }
              }
            }

        }
    }

    // Check for winner (last player standing)
    const alivePlayers = Object.values(players).filter(player => player.isAlive());
    if (alivePlayers.length <= 1 && Object.keys(players).length > 1) {
        const winner = alivePlayers.length === 1 ? alivePlayers[0].id : "No one";
        console.log(`Game over! Winner: ${winner}`);
        io.emit('game-over', { winner });
        clearInterval(gameInterval); // Stop the game loop
    }

    io.emit('grid-update', { grid, players: Object.values(players) });
}

io.on('connection', (socket) => {
    const playerId = socket.id;
    console.log('Player connected:', playerId);

    players[playerId] = new Player(playerId, config.initialEnergy);

    socket.emit('player-id', playerId); // Send the player their ID
    socket.emit('grid-update', { grid, players: Object.values(players) }); //Initial grid send

    socket.on('create-cell', ({ x, y }) => {
        const player = players[playerId];

        if (player && player.isAlive() && !grid[x][y] && player.hasEnoughEnergy(config.cellCreationCost)) {
            grid[x][y] = playerId; // Mark cell as owned by the player
            player.consumeEnergy(config.cellCreationCost);
            player.addCell(x, y);
            console.log(`Player ${playerId} created cell at ${x}, ${y}`);
            io.emit('grid-update', { grid, players: Object.values(players) });
        } else {
            console.log(`Player ${playerId} could not create cell at ${x}, ${y}`);
            //Potentially emit an error message to the client
        }
    });

    socket.on('destroy-cell', ({ x, y }) => {
        const player = players[playerId];

        if (player && player.isAlive() && grid[x][y] === playerId && player.hasEnoughEnergy(config.cellDestructionCost)) {
            grid[x][y] = null; // Remove ownership
            player.consumeEnergy(config.cellDestructionCost);
            player.removeCell(x, y);
            console.log(`Player ${playerId} destroyed cell at ${x}, ${y}`);
            io.emit('grid-update', { grid, players: Object.values(players) });
        } else {
            console.log(`Player ${playerId} could not destroy cell at ${x}, ${y}`);
            //Potentially emit an error message to the client
        }
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', playerId);
        delete players[playerId];
        //Potentially remove the player's cells from the grid
        for (let x = 0; x < config.gridWidth; x++) {
          for (let y = 0; y < config.gridHeight; y++) {
            if(grid[x][y] === playerId){
              grid[x][y] = null;
            }
          }
        }
    });
});

const gameInterval = setInterval(updateGame, config.tickInterval);

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));