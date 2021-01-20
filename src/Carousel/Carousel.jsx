import React, { useState, useRef, useEffect, useMemo } from "react";
import "./style.css";

let dragX1 = 0;
let dragPresent = 0;

const Carousel = ({ children, slidesCount, infinity }) => {
  const cellSize = 100 / slidesCount;
  const [sliderPosition, setSliderPosition] = useState(infinity ? -100 : 0);
  const [sliderWidth, setSliderWidth] = useState(null);
  const sliderElement = useRef(null);
  const [maxPosition, setMaxPosition] = useState(
    -children.length * cellSize + cellSize
  );
  const [minPosition, setMinPosition] = useState(infinity ? -100 : 0);

  const Slide = useMemo(
    () => (child, i) => {
      return (
        <li
          className="slide"
          style={{ minWidth: `${100 / slidesCount}%` }}
          key={i}
        >
          {child}
        </li>
      );
    },
    [slidesCount]
  );

  useEffect(() => {
    sliderElement.current.style.transform = `translateX(${sliderPosition}%)`;
    sliderElement.current.style.transition = "null";

    setSliderWidth(sliderElement.current.offsetWidth);
    window.addEventListener("resize", () => {
      setSliderWidth(sliderElement.current.offsetWidth);
    });

    return () => {
      document.removeEventListener("resize");
    };
  }, []);

  const loopFunc = (position) => {
    if (position > minPosition && dragPresent < 0) {
      console.log("right", dragPresent);
      sliderElement.current.style.transform = `translateX(${
        position + maxPosition - cellSize
      }%)`;
      sliderElement.current.style.transition = "null";
      setSliderPosition(position + maxPosition - cellSize);
    } else if (position < maxPosition - cellSize && dragPresent > 0) {
      console.log("left");
      sliderElement.current.style.transform = `translateX(${
        position - maxPosition + cellSize
      }%)`;
      sliderElement.current.style.transition = "null";
      setSliderPosition(position - maxPosition + cellSize);
    }
  };

  const checkSliderLimit = (newSliderPosition) => {
    if (newSliderPosition > minPosition) {
      newSliderPosition = minPosition;
      sliderElement.current.style.transform = `translateX(${newSliderPosition}%)`;
      sliderElement.current.style.transition = `all .35s ease-in-out`;
    } else if (newSliderPosition < maxPosition + (slidesCount - 1) * cellSize) {
      newSliderPosition = maxPosition + (slidesCount - 1) * cellSize;
      sliderElement.current.style.transform = `translateX(${newSliderPosition}%)`;
      sliderElement.current.style.transition = `all .35s ease-in-out`;
    }
    return newSliderPosition;
  };

  const dragEnd = (event) => {
    //const additionalOffset = dragPresent < 0 ? -0.2 : 0.2;
    const dragOfSlides = Math.round(
      (dragPresent * slidesCount) / 100 /*+ additionalOffset*/
    );

    let newSliderPosition = sliderPosition - dragOfSlides * cellSize;

    /*if (newSliderPosition > 0) {
      newSliderPosition = 0;
      sliderElement.current.style.transform = `translateX(${newSliderPosition}%)`;
      sliderElement.current.style.transition = `all .35s ease-in-out`;
    } else if (
      newSliderPosition <
      -(children.length - slidesCount) * (100 / slidesCount)
    ) {
      newSliderPosition =
        -(children.length - slidesCount) * (100 / slidesCount);
      sliderElement.current.style.transform = `translateX(${newSliderPosition}%)`;
      sliderElement.current.style.transition = `all .35s ease-in-out`;
    }*/

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
    if (event.type === "mouseup") {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  const dragAction = (event) => {
    if (event.type === "mousemove") {
      dragPresent = ((dragX1 - event.clientX) / sliderWidth) * 80; //!lower speed of drag slide
    } else {
      dragPresent = ((dragX1 - event.touches[0].clientX) / sliderWidth) * 80;
    }

    sliderElement.current.style.transform = `translateX(${
      sliderPosition - dragPresent
    }%)`;
    sliderElement.current.style.transition = "null";
  };

  const dragStart = (event) => {
    if (event.type === "mousedown") {
      event.preventDefault();
      dragX1 = event.clientX;
      document.onmousemove = dragAction;
      document.onmouseup = dragEnd;
    } else {
      dragX1 = event.touches[0].clientX;
    }
  };

  return (
    <>
      <div className="wrapper">
        <ul
          ref={sliderElement}
          className="slides"
          onTouchStart={dragStart}
          onTouchMove={dragAction}
          onTouchEnd={dragEnd}
          onMouseDown={dragStart}
          onTransitionEnd={() => {
            if (infinity) loopFunc(sliderPosition);
            dragPresent = 0;
          }}
        >
          {infinity && children.slice(children.length - slidesCount).map(Slide)}
          {children.map(Slide)}
          {infinity && children.slice(0, slidesCount).map(Slide)}
        </ul>
      </div>
    </>
  );
};

export default Carousel;
