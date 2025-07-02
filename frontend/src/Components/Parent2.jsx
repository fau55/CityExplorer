import { useState } from "react";
import Child2 from "./Child2"
import './Parent.css'
function Parent2() {
    let [mainScore, setMainScore] = useState(0);
    let setScore = (data) => {
        let finalScore = mainScore += +data
        setMainScore(finalScore)
    }
    return (
        <div className="scoreBoard">
            <h1>The Score is : {mainScore}</h1>
            <Child2 setScoreFromChild={setScore}/>
        </div>
    )
}
export default Parent2;