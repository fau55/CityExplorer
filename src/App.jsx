import './App.css';
import Nav from './Components/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import Parent from './Components/Parent';
import Parent2 from './Components/Parent2';
import WeatherApp from './Components/WheaterApp/WeatherApp';
import * as Icon from 'react-bootstrap-icons'
function App() {
  return (
    <div>
      <Nav />
     {/* <Parent2 /> */}
     <WeatherApp className="mt-5" />
    </div>
  );
}

export default App;
