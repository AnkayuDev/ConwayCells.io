import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import Grid from './components/Grid';
import PlayerInfo from './components/PlayerInfo';

const ENDPOINT = "http://localhost:4000"; // Replace with your server URL

function App() {
    const [grid, setGrid] = useState([]);
    const [playerId, setPlayerId] = useState(null);
    const [players, setPlayers] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = socketIOClient(ENDPOINT);

        socketRef.current.on('player-id', (id) => {
            setPlayerId(id);
        });

        socketRef.current.on('grid-update', (data) => {
            setGrid(data.grid);
            setPlayers(data.players);
        });

        socketRef.current.on('eliminated', () => {
            alert('You have been eliminated!');
        });

        socketRef.current.on('game-over', (data) => {
            alert(`Game Over! Winner: ${data.winner}`);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const createCell = (x, y) => {
        socketRef.current.emit('create-cell', { x, y });
    };

    const destroyCell = (x, y) => {
        socketRef.current.emit('destroy-cell', { x, y });
    };

    const currentPlayer = players.find(player => player.id === playerId);

    return (
        <div className="app">
            <h1>Conway's Game of Life - Multiplayer</h1>
            {currentPlayer && <PlayerInfo player={currentPlayer} />}
            {grid.length > 0 && (
                <Grid
                    grid={grid}
                    playerId={playerId}
                    onCreateCell={createCell}
                    onDestroyCell={destroyCell}
                />
            )}
        </div>
    );
}

export default App;