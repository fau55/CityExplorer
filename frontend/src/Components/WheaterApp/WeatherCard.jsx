import './weatherCard.css'
export default function WeatherCard({ CityName, Icon, CityImage }) {
    return (
        <div className="col">
            <div className="cardCity text-start mt-4">
                <img className="card-img-top" src={CityImage} alt="Title" />
                <div className="card-body">
                    <h4 className="card-title">{CityName}</h4>
                    <p className="card-text">Show City Info..</p>
                </div>
            </div>
            {/* <img src={CityImage} alt="" />
            <h6 className=''>{CityName}</h6> */}
        </div>
    )

}

