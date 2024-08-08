import { useState, useEffect } from "react";
import AddCity from './AddCity';
import './Cityinfo.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { imagedb } from "../../FireBase/Config";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

export default function CityInfo({ CityInfo, City }) {
    const [showAddCityCard, setAddCityCard] = useState(false);
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const [cityInfo, setCityInfo] = useState(CityInfo);

    useEffect(() => {
        setCityInfo(CityInfo);
    }, [CityInfo]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showCityCardHandler = () => {
        setAddCityCard(true);
    };

    const submitFormHandler = (e) => {
        e.preventDefault();
        if (!image) {
            alert("Please select an image.");
            return;
        }

        const imageRef = ref(imagedb, `images/${v4()}`);
        uploadBytes(imageRef, image).then((value) => {
            getDownloadURL(value.ref).then((url) => {
                let newPlace = {
                    image_url: url,
                    image_name: e.target.imageName.value,
                    image_description: e.target.imageDescription.value
                };
                let cityname = String(City).toLowerCase();
                fetch(`http://localhost:3500/api/cityExplore/city/add/images/${cityname}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newPlace)
                })
                .then(res => res.json())
                .then((data) => {
                    setCityInfo(data.city);
                    console.log("data after adding tourist place", data);
                })
                .catch((e) => console.log(e));
            });
        });
    };

    if (!cityInfo) {
        return (
            <div className="text-center">
                {!showAddCityCard ? (
                    <div>
                        <h5>Information About this City is not Available</h5>
                        <button className="btn btn-success mt-3 mb-3" onClick={showCityCardHandler}>Add Information?</button>
                    </div>
                ) : <AddCity CityNameToAdd={City} />}
            </div>
        );
    }

    return (
        <div>
            <div className="cityCard">
                <div className="row">
                    <div className="col-7">
                        <h1 className="cityname">{cityInfo.city_name}</h1>
                        <h4 className="mt-4">Key Facts :</h4>
                        <p>Country: {cityInfo.city_country}</p>
                        <p>State: {cityInfo.city_state}</p>
                        <p>Spoken Language: {cityInfo.city_language}</p>
                        <p>Population: {cityInfo.city_population}</p>
                        <h4>Description :</h4>
                        <p>{cityInfo.city_description}</p>
                    </div>
                    <div className="col-5 imagesCol">
                        <Swiper
                            style={{ width: "100%" }}
                            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                        >
                            {cityInfo.city_images.map((value, index) => (
                                <SwiperSlide key={index}>
                                    <div className="card text-start">
                                        <img src={value.image_url} alt="Title" />
                                        <div className="card-body">
                                            <h4 className="card-title cityname">{value.image_name}</h4>
                                            <p className="card-text">{value.image_description}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="row mt-2">
                            <div className="col text-center">
                                <Button variant="success" onClick={handleShow}>
                                    Add More?
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  modal  */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{City}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitFormHandler}>
                        <h3>Add New Tourist Place</h3>
                        <div className="mb-3">
                            <label className="form-label">Image :</label>
                            <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" id="imageName" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <input type="text" className="form-control" id="imageDescription" required />
                        </div>
                        <div className="row">
                            <div className="col text-center">
                                <button type="submit" className="btn btn-success" onClick={handleClose}>Submit</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
