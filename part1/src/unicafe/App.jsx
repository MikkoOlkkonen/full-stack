import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [avg, setAvg] = useState(0)
  const [pos, setPos] = useState(0)
  const [all, setAll] = useState(0)

  const handleGood = () => {
    const new_good = good + 1
    setGood(new_good)
    setAvg((new_good-bad)/(new_good+neutral+bad))
    setPos(new_good/(new_good+neutral+bad))
    setAll(all+1)
  }

  const handleNeutral = () => {
    const new_neutral = neutral + 1
    setNeutral(new_neutral)
    setAvg((good-bad)/(good+new_neutral+bad))
    setPos(good/(good+new_neutral+bad))
    setAll(all+1)
  }

  const handleBad = () => {
    const new_bad = bad + 1
    setBad(new_bad)
    setAvg((good-new_bad)/(good+neutral+new_bad))
    setPos(good/(good+neutral+new_bad))
    setAll(all+1)
  }

  const Statistics = (props) => {
    if (good != 0 || bad != 0 || neutral != 0) {
      return (
        <div style={{ lineHeight: '1.2' }}>
          <StatisticsLine text={'good'} value={props.good} perc={''}/>
          <StatisticsLine text={'neutral'} value={props.neutral} perc={''}/>
          <StatisticsLine text={'bad'} value={props.bad} perc={''}/>
          <StatisticsLine text={'all'} value={props.all} perc={''}/>
          <StatisticsLine text={'average'} value={props.avg} perc={''}/>
          <StatisticsLine text={'positive'} value={props.pos} perc={'%'}/>
        </div>
      )
    }
    else {
      return (
        <div>
          <p>No feedback given</p>
        </div>
      )
    }
  }

  const StatisticsLine = (props) => {
    return (
      <tr>
        <td>{props.text} </td>
        <td>{props.value} {props.perc}</td>
      </tr>
    )
  }

  const Button = () => {
    return (
      <div>
        <button onClick={handleGood}>good</button>
        <button onClick={handleNeutral}>neutral</button>
        <button onClick={handleBad}>bad</button>
      </div>
    )
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button/>
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} avg={avg} pos={pos}/>
    </div>
  )
}

export default App