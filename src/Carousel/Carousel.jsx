import React, { useState, useRef, useEffect } from "react";
import "./style.css";

let dragX1 = 0;
let dragPresent = 0;

const Carousel = (props) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(null);
  const sliderElement = useRef(null);
  //const [dragX1, setDragX1] = useState(0);
  //const [dragX2, setDragX2] = useState(0);

  useEffect(() => {
    setSliderWidth(sliderElement.current.offsetWidth);
    window.addEventListener("resize", () => {
      setSliderWidth(sliderElement.current.offsetWidth);
    });

    return () => {
      document.removeEventListener("resize");
    };
  }, []);

  useEffect(() => {
    sliderElement.current.style.transform = `translateX(${sliderPosition}%)`;
    sliderElement.current.style.transition = `all .35s ease-in-out`;
  }, [sliderPosition]);

  const dragEnd = () => {
    const dragOfSlides = Math.round((dragPresent * props.slidesCount) / 100);

    console.log(dragOfSlides);
    if (dragPresent > 40) {
      setSliderPosition(sliderPosition - 100);
    } else if (dragPresent < -40) {
      setSliderPosition(sliderPosition + 100);
    } else {
      sliderElement.current.style.transform = `translateX(${sliderPosition}%)`;
      sliderElement.current.style.transition = `all .35s ease-in-out`;
    }

    dragPresent = 0;
    document.onmouseup = null;
    document.onmousemove = null;
  };

  const dragAction = (event) => {
    dragPresent = ((dragX1 - event.clientX) / sliderWidth) * 100;

    sliderElement.current.style.transform = `translateX(${
      sliderPosition - dragPresent
    }%)`;
    sliderElement.current.style.transition = "null";
  };

  const dragStart = (event) => {
    event.preventDefault();
    dragX1 = event.clientX;
    document.onmousemove = dragAction;
    document.onmouseup = dragEnd;
  };

  return (
    <>
      <div className="wrapper">
        <ul
          ref={sliderElement}
          className="slides"
          /*onTouchStart={dragStart}*/
          /*onTouchMove={dragAction}*/
          /*onTouchEnd={dragEnd}*/
          onMouseDown={dragStart}
          /*onTransitionEnd={checkIndex}*/
        >
          {props.children.map((child, i) => {
            return (
              <li
                className="slide"
                style={{ minWidth: `${100 / props.slidesCount}%` }}
                key={i}
              >
                {child}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Carousel;
