import { useEffect, useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import "./App.css";

const URL = "https://api.unsplash.com/photos/?client_id=";
const KEY = "ZdmgHrccPutxY3A6V6TdxOgV7IFh9QC7wEOS2FOd6u4";

function App() {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reset, setReset] = useState(false);

  const fetchFromServer = async () => {
    try {
      const [page1, page2] = await axios.all([
        axios.get(URL + KEY + "&page=2"),
        axios.get(URL + KEY + "&page=3"),
      ]);

      let data = [
        ...page1.data,
        ...page1.data,
        ...page2.data.slice(0, 2),
        ...page2.data.slice(0, 2),
      ];

      data = data.map((image) => {
        return { ...image, unique: nanoid() };
      });

      const shuffle = (arr) => {
        for (let i = 0 ; i < arr.length ; i++) {
          const randomIndex = Math.floor(Math.random() * arr.length); 
          const temp = arr[randomIndex];
          arr[randomIndex] = arr[i];
          arr[i] = temp;
        }
        return arr;
      }

      setPhotos(shuffle(data));
    } catch(err) {
      console.log(err);
    }
  };

  const clickHandler = (index) =>{
    let newPhotos = [...photos];
    newPhotos[index].mark = true;
    setPhotos(newPhotos);
    if (selected === null) {
      setSelected(index);
      return;
    } else {
      if (newPhotos[index].unique === newPhotos[selected].unique){
        return;
      } else {
        if (newPhotos[index].id !== newPhotos[selected].id){
          setTimeout(() => {
            newPhotos[index].mark = false;
            newPhotos[selected].mark = false;
            setPhotos(newPhotos);
            setSelected(null);
          }, 500);
        } else {
          setSelected(null);
        }
      }
    }
  }

  useEffect(() => {
    fetchFromServer();
  }, [reset]);

  return (
    <>
    <h3>Memory Game</h3>
    <div className="App">
      {photos.map((photo, index) => {
        return (
          <div className="card" key={photo.unique} onClick={()=> clickHandler(index)}>
            <img src={photo.urls.thumb} alt={photo.alt_description} className={photo.mark ? "show" : "notShow"} />
          </div>
        );
      })}
      <button onClick={() => setReset(!reset)}>Reset</button>
    </div>
    </>
  );
}

export default App;