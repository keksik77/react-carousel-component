import React, { useState, useEffect } from 'react';
import './style.css';

const Pagination = ({ cellCount, currentCell, changeCurrentCell, visibleCellsNum }) => {
  const cellArray = [...Array(cellCount).keys()];
  const maxLevel = Math.ceil(cellArray.length / visibleCellsNum) - 1;
  const [currentLvl, setCurrentLvl] = useState(Math.ceil(currentCell / visibleCellsNum) - 1);

  useEffect(() => {
    setCurrentLvl(Math.ceil(currentCell / visibleCellsNum) - 1);
  }, [visibleCellsNum, currentCell]);

  const visibleCells = cellArray.slice(
    currentLvl * visibleCellsNum,
    currentLvl * visibleCellsNum + visibleCellsNum
  );

  const selectCell = (cell) => () => {
    if (cell <= cellCount && cell > 0) {
      changeCurrentCell(cell);
    }
  };

  return (
    <div className={'pg_container'}>
      {currentLvl !== 0 && (
        <>
          <div className={'pg_cell'} onClick={selectCell(1)}>
            {1}
          </div>
          <div
            className={'pg_cell'}
            onClick={() => {
              setCurrentLvl(currentLvl - 1);
            }}
          >
            ...
          </div>
        </>
      )}
      {visibleCells.map((cellNumber, i) => {
        return (
          <div
            className={'pg_cell' + (currentCell === cellNumber + 1 ? ' pg_active' : '')}
            key={i}
            onClick={selectCell(cellNumber + 1)}
          >
            {cellNumber + 1}
          </div>
        );
      })}
      {currentLvl !== maxLevel && (
        <>
          <div
            className={'pg_cell'}
            onClick={() => {
              setCurrentLvl(currentLvl + 1);
            }}
          >
            ...
          </div>
          <div className={'pg_cell'} onClick={selectCell(cellCount)}>
            {cellCount}
          </div>
        </>
      )}
    </div>
  );
};

export default Pagination;
