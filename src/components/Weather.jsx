import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
import { useEffect, useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const Weather = () => {

  const [loading, setLoading] = useState(false); // To track loading state of loader

  //Loader Spinner
  const Loader = () => {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  };

  const inputRef = useRef();

  const [weatherData, setWeatherData] = useState(false);

  const [showModal, setShowModal] = useState(false); // To control the visibility of the modal
  const [modalMessage, setModalMessage] = useState(""); // To store the message for the modal

  const handleClose = () => setShowModal(false); // Close the modal
  const showModalMessage = (message) => {
    setModalMessage(message); // Set the message to show in the modal
    setShowModal(true); // Show the modal
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search(inputRef.current.value); // Trigger search when Enter is pressed
    }
  };

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if (city === "") {
      showModalMessage("Please enter the city name."); // Show modal for empty city name
      return;
    }

    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        showModalMessage("Please enter the correct city name."); // Show modal for invalid city name
        setLoading(false); // Stop loading when the response is invalid
        return;
      }

      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
      setLoading(false); // Stop loading when the data is fetched successfully
    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data");
      setLoading(false); // Stop loading in case of error
    }
  };

  useEffect(() => {
    console.log("Fetching Weather for london....");
    search("Pune");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={handleKeyDown}
        />
        <img
          src={search_icon}
          alt=""
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {loading ? (
        <Loader /> // Show loader while fetching data
      ) : weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}*C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {/* Modal for showing alerts */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Weather;
