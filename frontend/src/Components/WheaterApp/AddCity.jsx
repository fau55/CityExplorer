import { useState } from "react";
import CityInfo from "./CityInfo";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { imagedb } from "../../FireBase/Config";

export default function AddCity({ CityNameToAdd }) {
    const [cityToAdd, setCityToAdd] = useState([]);
    const [cityDetails, setCityDetails] = useState([]);
    const [showCityDetails, setShowCityDetails] = useState(false);
    const [image, setImage] = useState('');

    const cityFormSubmitHandler = (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        if (!image) {
            alert("Please select an image.");
            return;
        }
        const imageRef = ref(imagedb, `images/${v4()}`);
        uploadBytes(imageRef, image).then((value) => {
            getDownloadURL(value.ref).then((url) => {
                let city = String(CityNameToAdd).toLowerCase()
                const newCity = {
                    city_name: city,
                    city_description: document.getElementById('Description').value,
                    city_population: document.getElementById('Population').value,
                    city_state: document.getElementById('State').value,
                    city_country: document.getElementById('Country').value,
                    city_language: document.getElementById('Language').value,
                    city_images: [{
                        image_url: url,
                        image_description: document.getElementById('placeDescription').value,
                        image_name: document.getElementById('placeName').value,
                    }]
                };

                // Update state
                setCityToAdd([...cityToAdd, newCity]);

                // Send a POST request to the backend
                fetch('http://localhost:3500/api/cityExplore/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCity)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        fetch(`http://localhost:3500/api/cityExplore/get/city/by/name/${city}`)
                            .then(res => {
                                if (!res.ok) {
                                    throw new Error('city data not found');
                                }
                                return res.json();
                            })
                            .then(data => {
                                setCityDetails(data.city);
                                console.log(data.city);
                                setShowCityDetails(true)
                            })
                            .catch(error => {
                                console.error('Error fetching city data:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

                console.log(cityToAdd);
            });
        });

    };

    return (
        <>
            {
                !showCityDetails ? (
                    <div className="card text-start">
                        <div className="card-body">
                            <h2 className="card-title">{CityNameToAdd}</h2>
                            <form onSubmit={cityFormSubmitHandler}>
                                <h4>Key Factors :</h4>
                                <div className="mb-3">
                                    <label className="form-label">Country</label>
                                    <input type="text" className="form-control" id="Country" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">State</label>
                                    <input type="text" className="form-control" id="State" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Population</label>
                                    <input type="text" className="form-control" id="Population" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Language</label>
                                    <input type="text" className="form-control" id="Language" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea name="Description" className="form-control" id="Description"></textarea>
                                </div>
                                <h4>Tourist Places :</h4>
                                <div className="mb-3">
                                    <label className="form-label">Image</label>
                                    <input type="file" className="form-control" id="Image" onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Place Name</label>
                                    <input type="text" className="form-control" id="placeName" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Place Description</label>
                                    <textarea name="placeDescription" className="form-control" id="placeDescription"></textarea>
                                </div>
                                <div className="row">
                                    <div className="col text-center">
                                        <button className="btn btn-success mt-3" type="submit">Add</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                ) : <CityInfo CityInfo={cityDetails}></CityInfo>
            }
        </>
    );
}
