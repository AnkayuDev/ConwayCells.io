import React from 'react';

function Grid({ grid, playerId, onCreateCell, onDestroyCell }) {
    const handleClick = (x, y) => {
        // Check if the clicked cell is owned by the player
        if (grid[x][y] === playerId) {
            onDestroyCell(x, y); // Destroy cell
        } else {
            onCreateCell(x, y); // Create cell
        }
    };

    return (
        <div className="grid">
            {grid.map((row, x) => (
                <div key={x} className="row">
                    {row.map((cell, y) => {
                        let cellClass = 'cell';

                        if (cell) {
                            cellClass += ' alive';
                            if (cell === playerId) {
                                cellClass += ' owned'; // Add a class for cells owned by the current player
                            }
                        }

                        return (
                            <div
                                key={y}
                                className={cellClass}
                                onClick={() => handleClick(x, y)}
                            ></div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default Grid;