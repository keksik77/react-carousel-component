import React, { useState, useEffect } from "react";
import { Carousel } from "./Carousel";

const imageApiUrl =
  "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=d139d88fe734f56137ac0532cdadd2db&tags=nature,morning,space,colors&tag_mode=all&extras=url_h&format=json&nojsoncallback=1";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(imageApiUrl).then((response) => {
      response.json().then((responseData) => {
        setData(
          responseData.photos.photo.slice(0, 15).filter((el) => el.url_h)
        );
        setLoading(false);
      });
    });
  }, []);

  return (
    <>
      {!loading && Array.isArray(data) && (
        <Carousel slidesCount={6} infinity={true}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => {
            return (
              <div style={{ textAlign: "center", border: "2px solid black" }}>
                {number}
              </div>
            );
          })}
          {/*data.map((photoData) => {
            return (
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                src={photoData.url_h}
                key={photoData.id}
                alt={photoData.title}
              />
            );
          })*/}
        </Carousel>
      )}
    </>
  );
};

export default App;
