import React, { useState, useEffect } from 'react';
import './style.css';
import { Carousel } from './Carousel';
import useWindowDimensions from './useWindowDimensions';

const imageApiUrl =
  'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=d139d88fe734f56137ac0532cdadd2db&tags=scenery,lake&tag_mode=all&extras=url_h&format=json&nojsoncallback=1';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

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

  useEffect(() => {
    fetch(imageApiUrl).then((response) => {
      response.json().then((responseData) => {
        console.log(response);
        setData(responseData.photos.photo.slice(0, 10).filter((el) => el.url_h));
        setLoading(false);
      });
    });
  }, []);

  return (
    <>
      {!loading && Array.isArray(data) && (
        <>
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
        </>
      )}
    </>
  );
};

export default App;
