import React from 'react';

function PlayerInfo({ player }) {
    return (
        <div className="player-info">
            <p>Energy: {player.energy}</p>
            <p>Status: {player.alive ? 'Alive' : 'Eliminated'}</p>
        </div>
    );
}

export default PlayerInfo;