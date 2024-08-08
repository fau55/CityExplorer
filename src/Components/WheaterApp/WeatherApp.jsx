import './WeatherApp.css';
import { useState, useEffect } from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Swal from 'sweetalert2';
import WeatherCard from './WeatherCard';
import CityInfo from './CityInfo';
import Sunny from '../../Assets/sunnyAnimation.gif'
import Rain from '../../Assets/rainyAnimation.gif'
import Snow from '../../Assets/snowAnimation.gif'
import Cloudy from '../../Assets/cloud.gif'
import Mist from '../../Assets/mist.gif'

const WeatherApp = () => {
    const [cityName, setCityName] = useState('Aurangabad');
    const [indexNo, setIndexNo] = useState(0);
    const [weatherValue, setWeather] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCityInfoCard, setCityInfoCard] = useState(false);
    const [showCityInfo, setCityInfo] = useState();
    const [icon, setWeatherIcon] = useState('');

    const apiKey = '69d0f4fab4f207caf5ce2e307a9a4caf';

    const getCityName = (event) => {
        setCityName(event.target.value);
    };

    const setMainCardValue = (index, city) => {
        console.log('this is city name:', city);
        setIndexNo(index);
        fetch(`http://localhost:3500/api/cityExplore/get/city/by/name/${city}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('city data not found');
                }
                return res.json();
            })
            .then(data => {
                setCityInfo(data.city);
                console.log(data.city);
                setCityInfoCard(true);
            })
            .catch(error => {
                console.error('Error fetching city data:', error);
            });
    };

    const fetchCityWeather = () => {
        const cityExists = weatherValue.some(element => element.name.toLowerCase() === cityName.toLowerCase());
        if (cityExists) {
            Swal.fire({
                position: "top-end",
                text: 'Already Searched For this City!!',
                icon: "warning",
                showConfirmButton: false,
                timer: 2000
            });
        } else {
            setLoading(true);
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Weather data not found');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                        console.log("City Weather Data :", data);
                        const { main, name, weather, timezone, coord,sys } = data;

                        fetch(`http://localhost:3500/api/cityExplore/get/city-image/${cityName}`)
                            .then(res => {
                                if (!res.ok) {
                                    throw new Error('Image not found');
                                }
                                return res.json();
                            })
                            .then(image => {
                                let weatherIcon;
                                switch (weather[0].main) {
                                    case "Clear": // clear sky
                                        weatherIcon = Sunny;
                                        break;
                                    case "Clouds": // few clouds
                                        weatherIcon = Cloudy;
                                        break;
                                    case "Rain": // scattered clouds
                                        weatherIcon = Rain;
                                        break;
                                    case "Mist": // mist
                                        weatherIcon = Mist;
                                        break;
                                    case "Haze": // mist
                                        weatherIcon = Mist;
                                        break;
                                    case "Snow": // snow
                                        weatherIcon = Snow;
                                        break;
                                    default:
                                        weatherIcon = Sunny; // default icon
                                }

                                const updatedWeather = {
                                    name: name,
                                    condition: weather[0].main,
                                    description: weather[0].description,
                                    feels_like : main.feels_like,
                                    grnd_level : main.grnd_level,
                                    humidity : main.humidity,
                                    pressure : main.pressure,
                                    sea_level : main.sea_level,
                                    icon: weatherIcon,
                                    timezone: timezone,
                                    sunrise:  calcTime2(sys.sunrise),
                                    sunset: calcTime2(sys.sunset),
                                    time: calcTime(timezone),
                                    long: coord.lon,
                                    lat: coord.lat,
                                    temp: Math.round(main.temp),
                                    cityImage: image.cityImage
                                };
                                setWeather(prevWeather => [updatedWeather, ...prevWeather]);
                                setIndexNo(0);
                                setCityName('');
                                setLoading(false);
                            })
                            .catch(error => {
                                console.error('Failed to fetch city image:', error);
                            });
                    } else {
                        Swal.fire({
                            text: 'Invalid City Name',
                            icon: "error",
                            showConfirmButton: false,
                            timer: 1000
                        });
                    }
                })
                .catch(error => {
                    setLoading(false);
                    Swal.fire({
                        text: error.message,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1000
                    });
                });
        }
    };


    const calcTime = (offsetInSeconds) => {
        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const offsetInMilliseconds = offsetInSeconds * 1000;
        const nd = new Date(utc + offsetInMilliseconds);
        return nd.toLocaleString();
    };

    const calcTime2 = (timestamp) => {
        const d = new Date(timestamp * 1000); // Convert from Unix timestamp (seconds) to JavaScript Date object
        
        // Options for time format
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true // Use 12-hour format with AM/PM
        };
        
        return d.toLocaleTimeString([], options);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setWeather(prevWeather =>
                prevWeather.map(cityWeather => ({
                    ...cityWeather,
                    time: calcTime(cityWeather.timezone)
                }))
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="weatherApp">
            <input
                type="text"
                className="form-control input mt-3"
                value={cityName}
                onKeyDown={(e) => {
                    if (e.key === "Enter")
                        fetchCityWeather();
                }}
                placeholder='Search City Name Here...'
                onChange={getCityName}
            />
            {loading ? (
                <div className="row">
                    <div className="col text-center">
                        <div className="loader"></div>
                    </div>
                </div>
            ) : (
                <div className="card mt-4">
                    <h6 className='mb-3'>City Weather Information</h6>
                    <div className="row">
                        {/* <div className="col"> */}
                        <div className="col side-bg mx-4">
                            {weatherValue.length > 0 ? (
                                <>
                                    <div className="row mt-4 mb-4">
                                        <div className="col-8">
                                            <div class="weathercard text-start">
                                                <div className="card-header">
                                                    <div className="row">
                                                        <div className="col">Todays Weather</div>
                                                        <div className="col text-end">{weatherValue[indexNo].time}</div>
                                                    </div>
                                                </div>
                                                <div class="card-body">
                                                    <h4 className='cityName'>{weatherValue[indexNo].name}</h4>
                                                    <div className="row">
                                                        <div className="col">
                                                            <p className="card-text">Logitute : {weatherValue[indexNo].long}</p>
                                                        </div>
                                                        <div className="col">
                                                            <p className="card-text">Latitude : {weatherValue[indexNo].lat}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col">
                                                            <p className="card-text">Sunset : {weatherValue[indexNo].sunset}</p>
                                                        </div>
                                                        <div className="col">
                                                            <p className="card-text">Sunrise : {weatherValue[indexNo].sunrise}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col">
                                                    <div className="weathercard text-start">
                                                        <div className="card-header">Weather Related Information</div>
                                                        <div className="card-body">
                                                            <div className="card-text">Feels Like : {weatherValue[indexNo].feels_like}</div>
                                                            <div className="card-text">Humidity : {weatherValue[indexNo].humidity}</div>
                                                            <div className="card-text">Ground Level: {weatherValue[indexNo].grnd_level}</div>
                                                            <div className="card-text">Sea Level : {weatherValue[indexNo].sea_level}</div>
                                                            <div className="card-text">Air Pressure : {weatherValue[indexNo].pressure}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="weathercard">
                                                <div className="card-header text-start">Condition  & temperature</div>
                                                <div className="card-body mt-0 pt-2">
                                                    <div className="row">
                                                        <div className="col">
                                                            <img src={weatherValue[indexNo]?.icon} alt="Weather Icon" className="card-image iconImg" />
                                                            <h1 className='temp'>{weatherValue[indexNo]?.temp}°C</h1>
                                                            <h6 className='cityName'>Temp</h6>
                                                            <p className='cityName'>Condition : {weatherValue[indexNo]?.condition}</p>
                                                            <p className="card-text">Description : {weatherValue[indexNo]?.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <h5 className='text-light mt-2'>Enter City Name...</h5>
                            )}
                        </div>
                        {/* </div> */}
                    </div>

                </div>
            )}
            <div className="cardContainer">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    slidesPerView={3}
                    pagination={{ clickable: true }}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                    <div className="row">
                        {weatherValue.map((value, index) => (
                            <SwiperSlide key={index} onClick={() => setMainCardValue(index, value.name)} className='mb-5'>
                                <WeatherCard
                                    CityName={value.name}
                                    CityImage={value.cityImage}
                                    Icon={value.icon}
                                />
                            </SwiperSlide>
                        ))}
                    </div>
                </Swiper>
            </div>
            {showCityInfoCard && (
                <div className="row">
                    <CityInfo CityInfo={showCityInfo} City={weatherValue[indexNo]?.name} />
                </div>
            )}
        </div>
    );
};

export default WeatherApp;
