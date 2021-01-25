# React Carousel Component
[**Demo**](https://affectionate-mirzakhani-11fbd3.netlify.app/)
![Image of Yaktocat](screenshot.jpg)
## Features
 - Responsive
 - Works for mobile and desktop devices
 - Swipes
 - Works for any HTML content
 - Finger-following swipes
 - Multiple slides on the screen
 - Infinite option
 - Scrolling to a selected slide
 ## Props
 | Prop          | Type           | Default  | Explanation        |
 | :------------- |:-------------| :-----|:---------------------|
 | numOfCells    | number > 0      |   1   | number of cells on one slide   |
 | infinity      | boolean       |   false | true if the slider is infinite |
 | pagination | boolean      |    false |  visability of pagination   |
 | paginationSize | number > 0 |   3 | number of visible cells in pagination  |
 |sliderHeight| number| unset| slider block height|
 ## Usage
 ```javascript
const YourComponent = () => {
  return (
        <>
          <Carousel 
            numOfCells={1}
            pagination={true}
            paginationSize={5}
            sliderHeight={500}
          >
            <div>
               <img src="your_url" />
               <p>Cell 1</p>
            </div>
            <div>
               <img src="your_url" />
               <p>Cell 2</p>
            </div>
            <div>
               <img src="your_url" />
               <p>Cell 3</p>
            </div>
          </Carousel>
    </>
  );
};
```
#### Adaptive number of cells
```javascript
const YourComponent = () => {
  const { width } = useWindowDimensions();

  const [numOfCells, setNumOfCells] = useState(3);

  useEffect(() => {
    switch (true) {
      case width > 1200:
        setNumOfCells(3);
        break;
      case width > 800:
        setNumOfCells(2);
        break;
      default:
        setNumOfCells(1);
    }
  }, [width]);

  return (
        <>
          <Carousel 
            numOfCells={numOfCells}
            pagination={true}
            paginationSize={5}
            sliderHeight={500}
          >
            <div>
               <img src="your_url" />
               <p>Cell 1</p>
            </div>
            <div>
               <img src="your_url" />
               <p>Cell 2</p>
            </div>
            <div>
               <img src="your_url" />
               <p>Cell 3</p>
            </div>
          </Carousel>
    </>
  );
};
```
