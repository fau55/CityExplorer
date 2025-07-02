import { useState } from "react"

export default function Child2({ setScoreFromChild }) {
    let [scoreValue, setScoreValue] = useState(0)

    let getInputValue = (event) => {
        setScoreValue(event.target.value)
    }
    let setInputValue = () => {
        setScoreFromChild(scoreValue)
    }
    return (
        <div>
            <input className="form-control-lg mt-3" onChange={getInputValue} />
            <br></br>
            <button className="btn mt-4 btn-success" onClick={setInputValue}>Submit</button>
        </div>
    )

}