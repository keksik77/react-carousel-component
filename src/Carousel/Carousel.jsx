import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Pagination } from './components/Pagination';
import './style.css';

let dragX1 = 0;
let dragPresent = 0;

const Carousel = ({ children, slidesCount, infinity, pagination, paginationSize }) => {
  const cellSize = 100 / slidesCount;
  const [sliderPosition, setSliderPosition] = useState(infinity ? -100 : 0);
  const [sliderWidth, setSliderWidth] = useState(null);
  const sliderElement = useRef(null);
  const [maxPosition, setMaxPosition] = useState(-children.length * cellSize + cellSize);
  const [minPosition, setMinPosition] = useState(infinity ? -100 : 0);

  const paginationPosition = useMemo(() => {
    let position = Math.abs(Math.round(sliderPosition / cellSize)) + 1;
    if (infinity) {
      position -= slidesCount;
      if (position < 1) {
        position += children.length;
      }
    }
    return position;
  }, [sliderPosition]);

  const Slide = useMemo(
    () => (child, i) => (
      <li className="slide" style={{ minWidth: `${cellSize}%` }} key={i}>
        {child}
      </li>
    ),
    [slidesCount]
  );

  useEffect(() => {
    sliderElement.current.style.transform = `translateX(${sliderPosition}%)`;
    sliderElement.current.style.transition = 'null';

    setSliderWidth(sliderElement.current.offsetWidth);
    window.addEventListener('resize', () => {
      setSliderWidth(sliderElement.current.offsetWidth);
    });

    return () => {
      document.removeEventListener('resize');
    };
  }, []);

  const loopFunc = (position) => {
    if (position > minPosition && dragPresent <= 0) {
      sliderElement.current.style.transform = `translateX(${position + maxPosition - cellSize}%)`;
      sliderElement.current.style.transition = 'null';
      setSliderPosition(position + maxPosition - cellSize);
    } else if (position < maxPosition - cellSize && dragPresent >= 0) {
      sliderElement.current.style.transform = `translateX(${position - maxPosition + cellSize}%)`;
      sliderElement.current.style.transition = 'null';
      setSliderPosition(position - maxPosition + cellSize);
    }
  };

  const checkSliderLimit = (newSliderPosition) => {
    if (newSliderPosition > minPosition) {
      newSliderPosition = minPosition;
      sliderElement.current.style.transform = `translateX(${newSliderPosition}%)`;
      sliderElement.current.style.transition = `all .35s ease-in-out`;
    } else if (newSliderPosition < maxPosition) {
      newSliderPosition = maxPosition;
      sliderElement.current.style.transform = `translateX(${newSliderPosition}%)`;
      sliderElement.current.style.transition = `all .35s ease-in-out`;
    }
    return newSliderPosition;
  };

  const dragEnd = (event) => {
    //const additionalOffset = dragPresent < 0 ? -0.2 : 0.2;
    const dragOfSlides = Math.round((dragPresent * slidesCount) / 100 /*+ additionalOffset*/);

    let newSliderPosition = sliderPosition - dragOfSlides * cellSize;

    if (!infinity) {
      newSliderPosition = checkSliderLimit(newSliderPosition);
    }

    if (dragOfSlides) {
      sliderElement.current.style.transform = `translateX(${newSliderPosition}%)`;
      sliderElement.current.style.transition = `all .35s ease-in-out`;
      setSliderPosition(newSliderPosition);
    } else {
      sliderElement.current.style.transform = `translateX(${sliderPosition}%)`;
      sliderElement.current.style.transition = `all .35s ease-in-out`;
    }
    if (event.type === 'mouseup') {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  const dragAction = (event) => {
    if (event.type === 'mousemove') {
      dragPresent = ((dragX1 - event.clientX) / sliderWidth) * 80; //!lower speed of drag slide
    } else {
      dragPresent = ((dragX1 - event.touches[0].clientX) / sliderWidth) * 80;
    }

    sliderElement.current.style.transform = `translateX(${sliderPosition - dragPresent}%)`;
    sliderElement.current.style.transition = 'null';
  };

  const dragStart = (event) => {
    if (event.type === 'mousedown') {
      event.preventDefault();
      dragX1 = event.clientX;
      document.onmousemove = dragAction;
      document.onmouseup = dragEnd;
    } else {
      dragX1 = event.touches[0].clientX;
    }
  };

  const changeCurrentCell = (cell) => {
    let newPosition;
    if (infinity) newPosition = -(cell + slidesCount - 1) * cellSize;
    else newPosition = -(cell - 1) * cellSize;

    setSliderPosition(newPosition);
    sliderElement.current.style.transition = `all .35s ease-in-out`;
    sliderElement.current.style.transform = `translateX(${newPosition}%)`;
  };

  return (
    <>
      <div
        onTouchStart={dragStart}
        onTouchMove={dragAction}
        onTouchEnd={dragEnd}
        onMouseDown={dragStart}
        className="wrapper"
      >
        <ul
          ref={sliderElement}
          className="slides"
          onTransitionEnd={() => {
            if (infinity) loopFunc(sliderPosition);
            dragPresent = 0;
          }}
        >
          {infinity && children.slice(children.length - slidesCount).map(Slide)}
          {children.map(Slide)}
          {infinity && children.slice(0, slidesCount).map(Slide)}
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
      </div>
    </>
  );
};

export default Carousel;
