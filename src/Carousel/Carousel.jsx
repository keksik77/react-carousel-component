import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Pagination } from './components/Pagination';
import './style.css';

let dragX = 0;
let dragPresent = 0;
let sliderWidth = 0;

const Carousel = ({
  children,
  numOfCells = !numOfCells || numOfCells < 1 ? 1 : numOfCells,
  infinity = Boolean(infinity),
  pagination = Boolean(pagination),
  paginationSize = !paginationSize || paginationSize < 3 ? 3 : paginationSize,
  sliderHeight,
}) => {
  const sliderElement = useRef(null);
  const cellSize = 100 / numOfCells;
  const [sliderPosition, setSliderPosition] = useState(infinity ? -100 : 0);
  const [maxPosition, setMaxPosition] = useState(-children.length * cellSize + cellSize);
  const [minPosition, setMinPosition] = useState(infinity ? -100 : 0);

  const paginationPosition = useMemo(() => {
    let position = Math.abs(Math.round(sliderPosition / cellSize)) + 1;
    if (infinity) {
      position -= numOfCells;
      if (position < 1) {
        position += children.length;
      }
    }
    return position;
  }, [sliderPosition]);

  const CellComponent = useMemo(
    () => (child, i) => (
      <li className="slider_cell" style={{ minWidth: `${cellSize}%` }} key={i}>
        {child}
      </li>
    ),
    [numOfCells]
  );

  useEffect(() => {
    sliderWidth = sliderElement.current.offsetWidth;
  }, []);

  const setTranslate = (position, transition) => {
    sliderElement.current.style.transition = transition ? 'all .25s ease-in-out' : 'null';
    sliderElement.current.style.transform = `translateX(${position}%)`;
  };

  const loopFunc = (position) => {
    if (position > minPosition && dragPresent <= 0) {
      setTranslate(position + maxPosition - cellSize, false);
      setSliderPosition(position + maxPosition - cellSize);
    } else if (position < maxPosition - cellSize && dragPresent >= 0) {
      setTranslate(position - maxPosition + cellSize, false);
      setSliderPosition(position - maxPosition + cellSize);
    }
  };

  const checkSliderLimit = (newSliderPosition) => {
    if (newSliderPosition > minPosition) {
      newSliderPosition = minPosition;
      setTranslate(newSliderPosition, true);
    } else if (newSliderPosition < maxPosition) {
      newSliderPosition = maxPosition;
      setTranslate(newSliderPosition, true);
    }
    return newSliderPosition;
  };

  const dragEnd = (event) => {
    //const additionalOffset = dragPresent < 0 ? -0.2 : 0.2;
    const dragOfSlides = Math.round((dragPresent * numOfCells) / 100 /*+ additionalOffset*/);

    let newSliderPosition = sliderPosition - dragOfSlides * cellSize;

    if (!infinity) newSliderPosition = checkSliderLimit(newSliderPosition);

    if (dragOfSlides) {
      setTranslate(newSliderPosition, true);
      setSliderPosition(newSliderPosition);
    } else {
      setTranslate(sliderPosition, true);
    }

    if (event && event.type === 'mouseup') {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  const dragAction = (event) => {
    if (event.type === 'mousemove') {
      event.preventDefault();
      dragPresent = ((dragX - event.clientX) / sliderWidth) * 100;
    } else {
      dragPresent = ((dragX - event.touches[0].clientX) / sliderWidth) * 80;
    }

    setTranslate(sliderPosition - dragPresent, false);
  };

  const dragStart = (event) => {
    if (sliderWidth !== sliderElement.current.offsetWidth) {
      sliderWidth = sliderElement.current.offsetWidth;
    }

    if (event.type === 'mousedown') {
      event.preventDefault();
      dragX = event.clientX;
      document.onmousemove = dragAction;
      document.onmouseup = dragEnd;
    } else {
      dragX = event.touches[0].clientX;
    }
  };

  const changeCurrentCell = (cell) => {
    let newPosition;
    if (infinity) newPosition = -(cell + numOfCells - 1) * cellSize;
    else newPosition = -(cell - 1) * cellSize;

    setTranslate(newPosition, true);
    setSliderPosition(newPosition);
  };

  useEffect(() => {
    changeCurrentCell(paginationPosition);
    setMaxPosition(-children.length * cellSize + cellSize);
    setMinPosition(infinity ? -100 : 0);
  }, [infinity, numOfCells]);

  const handlerArrowClick = (directionLeft) => () => {
    dragPresent = directionLeft ? -100 / numOfCells : 100 / numOfCells;
    dragEnd();
  };

  return (
    <>
      <div
        onTouchStart={dragStart}
        onTouchMove={dragAction}
        onTouchEnd={dragEnd}
        onMouseDown={dragStart}
        className="slider_wrapper"
      >
        <ul
          ref={sliderElement}
          className="slider_container"
          style={{ height: sliderHeight }}
          onTransitionEnd={() => {
            if (infinity) loopFunc(sliderPosition);
            dragPresent = 0;
          }}
        >
          {infinity && children.slice(children.length - numOfCells).map(CellComponent)}
          {children.map(CellComponent)}
          {infinity && children.slice(0, numOfCells).map(CellComponent)}
        </ul>
        {pagination && (
          <Pagination
            cellCount={children.length}
            currentCell={paginationPosition}
            changeCurrentCell={changeCurrentCell}
            visibleCellsNum={paginationSize}
            infinity={infinity}
          />
        )}
        {(sliderPosition < 0 || infinity) && (
          <div className={'left_arrow'} onClick={handlerArrowClick(true)}>
            &#8249;
          </div>
        )}
        {(sliderPosition > maxPosition || infinity) && (
          <div className={'right_arrow'} onClick={handlerArrowClick(false)}>
            &#8250;
          </div>
        )}
      </div>
    </>
  );
};

export default Carousel;
