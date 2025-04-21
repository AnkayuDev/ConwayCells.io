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