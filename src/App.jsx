import React, { useState, useEffect } from 'react';
import './style.css';
import { Carousel } from './Carousel';
import useWindowDimensions from './useWindowDimensions';

const imageApiUrl =
  'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=d139d88fe734f56137ac0532cdadd2db&tags=scenery,lake&tag_mode=all&extras=url_h&format=json&nojsoncallback=1';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(imageApiUrl).then((response) => {
      response.json().then((responseData) => {
        setData(responseData.photos.photo.slice(0, 6).filter((el) => el.url_h));
        setLoading(false);
      });
    });
  }, []);

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
    <div className={'page_wrapper'}>
      <header>
        <h1>React Carousel</h1>
        <a href={'https://github.com/keksik77/react-carousel-component'}>GitHub</a>
      </header>
      <main>
        <div className={'example_container'}>
          <h3>Usual carousel:</h3>
          <div className={'example_carousel_item'}>
            {Array.isArray(data) && (
              <Carousel numOfCells={1} sliderHeight={500}>
                {data.map((photoData) => {
                  return (
                    <div key={photoData.id} className={'full_size'}>
                      <img
                        className={'full_size img__slider_cell'}
                        src={photoData.url_h}
                        alt={photoData.title}
                      />
                      <p className={'slider_cell_title'}>{photoData.title}</p>
                    </div>
                  );
                })}
              </Carousel>
            )}
            {loading && <div className={'loader'}></div>}
          </div>
        </div>
        <div className={'example_container'}>
          <h3>Infinity loop carousel with pagination:</h3>
          <div className={'example_carousel_item'}>
            {Array.isArray(data) && (
              <Carousel numOfCells={2} pagination={true} paginationSize={5} sliderHeight={500}>
                {data.map((photoData) => {
                  return (
                    <div key={photoData.id} className={'full_size'}>
                      <img
                        className={'full_size img__slider_cell'}
                        src={photoData.url_h}
                        alt={photoData.title}
                      />
                      <p className={'slider_cell_title'}>{photoData.title}</p>
                    </div>
                  );
                })}
              </Carousel>
            )}
            {loading && <div className={'loader'}></div>}
          </div>
        </div>
        <div className={'example_container'}>
          <h3>Adaptive number of cells:</h3>
          <div className={'example_carousel_item'}>
            {Array.isArray(data) && (
              <Carousel numOfCells={numOfCells} pagination={true} sliderHeight={500}>
                {data.map((photoData) => {
                  return (
                    <div key={photoData.id} className={'full_size'}>
                      <img
                        className={'full_size img__slider_cell'}
                        src={photoData.url_h}
                        alt={photoData.title}
                      />
                      <p className={'slider_cell_title'}>{photoData.title}</p>
                    </div>
                  );
                })}
              </Carousel>
            )}
            {loading && <div className={'loader'}></div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
