import React, { useState, useRef, useEffect } from "react";
import "./style.css";

let dragX1 = 0;
let dragPresent = 0;

const Carousel = (props) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(null);
  const sliderElement = useRef(null);

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

  /*var slider = document.getElementById('slider'),
    sliderItems = document.getElementById('slides'),
    prev = document.getElementById('prev'),
    next = document.getElementById('next');
  */

  function slide(wrapper, items, prev, next) {
    var posX1 = 0,
      posX2 = 0,
      posInitial,
      posFinal,
      threshold = 100,
      slides = items.getElementsByClassName("slide"),
      slidesLength = slides.length,
      slideSize = items.getElementsByClassName("slide")[0].offsetWidth,
      firstSlide = slides[0],
      lastSlide = slides[slidesLength - 1],
      cloneFirst = firstSlide.cloneNode(true),
      cloneLast = lastSlide.cloneNode(true),
      index = 0,
      allowShift = true;

    // Clone first and last slide
    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);
    wrapper.classList.add("loaded");

    // Mouse events
    items.onmousedown = dragStart;

    // Touch events
    items.addEventListener("touchstart", dragStart);
    items.addEventListener("touchend", dragEnd);
    items.addEventListener("touchmove", dragAction);

    // Click events
    prev.addEventListener("click", function () {
      shiftSlide(-1);
    });
    next.addEventListener("click", function () {
      shiftSlide(1);
    });

    // Transition events
    items.addEventListener("transitionend", checkIndex);

    function dragStart(e) {
      e = e || window.event;
      e.preventDefault();
      posInitial = items.offsetLeft;

      if (e.type == "touchstart") {
        posX1 = e.touches[0].clientX;
      } else {
        posX1 = e.clientX;
        document.onmouseup = dragEnd;
        document.onmousemove = dragAction;
      }
    }

    function dragAction(e) {
      e = e || window.event;

      if (e.type == "touchmove") {
        posX2 = posX1 - e.touches[0].clientX;
        posX1 = e.touches[0].clientX;
      } else {
        posX2 = posX1 - e.clientX;
        posX1 = e.clientX;
      }
      items.style.left = items.offsetLeft - posX2 + "px";
    }

    function dragEnd(e) {
      posFinal = items.offsetLeft;
      if (posFinal - posInitial < -threshold) {
        shiftSlide(1, "drag");
      } else if (posFinal - posInitial > threshold) {
        shiftSlide(-1, "drag");
      } else {
        items.style.left = posInitial + "px";
      }

      document.onmouseup = null;
      document.onmousemove = null;
    }

    function shiftSlide(dir, action) {
      items.classList.add("shifting");

      if (allowShift) {
        if (!action) {
          posInitial = items.offsetLeft;
        }

        if (dir == 1) {
          items.style.left = posInitial - slideSize + "px";
          index++;
        } else if (dir == -1) {
          items.style.left = posInitial + slideSize + "px";
          index--;
        }
      }

      allowShift = false;
    }

    function checkIndex() {
      items.classList.remove("shifting");

      if (index == -1) {
        items.style.left = -(slidesLength * slideSize) + "px";
        index = slidesLength - 1;
      }

      if (index == slidesLength) {
        items.style.left = -(1 * slideSize) + "px";
        index = 0;
      }

      allowShift = true;
    }
  }

  /*function dragEnd(e) {
      posFinal = items.offsetLeft;
      if (posFinal - posInitial < -threshold) {
        shiftSlide(1, "drag");
      } else if (posFinal - posInitial > threshold) {
        shiftSlide(-1, "drag");
      } else {
        items.style.left = posInitial + "px";
      }

      document.onmouseup = null;
      document.onmousemove = null;
    }*/

  const dragEnd = () => {
    const additionalOffset = dragPresent < 0 ? -0.2 : 0.2;
    const dragOfSlides = Math.round(
      (dragPresent * props.slidesCount) / 100 + additionalOffset
    );

    if (dragOfSlides) {
      setSliderPosition(
        sliderPosition - dragOfSlides * (100 / props.slidesCount)
      );
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
          //onTouchStart={dragStart}*/
          /*onTouchMove={dragAction}*/
          /*onTouchEnd={dragEnd}*/
          onMouseDown={dragStart}
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
