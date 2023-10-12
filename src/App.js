import './App.css';
import Die from './Die';
import GameStats from './GameStats';
import React, { useEffect } from "react";
import useWindowSize from 'react-use/lib/useWindowSize';
import { nanoid } from 'nanoid';
import Confetti from "react-confetti"; 

function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [numOfRolls, setNumOfRolls] = React.useState(0)
  const [timeTaken, setTimeTaken] = React.useState({
    rawTimeTaken: 0,
    minutes: '0',
    seconds: '00'
  })
  const [intervalId, setIntervalId] = React.useState(null)
  const [records, setRecords] = React.useState(
    JSON.parse(localStorage.getItem("records")) || {}
  )

  function allNewDice() {

    const randomDice = new Array(10)

    for (let i = 0; i < randomDice.length; i++) {

      randomDice[i] = {
        shake: true,
        value: rollDiceValue(),
        isHeld: false,
        id: nanoid()
      }
    }

    return randomDice
  }

  React.useEffect(() => {

    // initialising timer
    const newIntervalId = startTimer()

    console.log(records)

    return () => clearInterval(newIntervalId)
  }, [])

  React.useEffect(() => {

    // whenever records change, push it to localStorage
    localStorage.setItem("records", JSON.stringify(records))

  }, [records])

  React.useEffect(() => {
    let allMatchedAndHeld = true

    for (let i = 1; i < dice.length; i++) {

      const currentDie = dice[i]
      const prevDie = dice[i - 1]

      if (!dice[0].isHeld) {
        return
      }

      if (currentDie.value !== prevDie.value || !currentDie.isHeld) {
        allMatchedAndHeld = false
        break
      }
    }
    // if the function gets to this point, all dice should be matching
    if (allMatchedAndHeld) {
      console.log("You won!")
      setTenzies(true)
    }
  }, [dice])

  function rollDiceValue() {
    return Math.ceil(Math.random() * 6)
  }

  function holdDice(id) {

    setDice(prevDice => {

      const updatedDice = prevDice.map(die => {
        if (die.id === id) {
          return { ...die, isHeld: !die.isHeld }
        }
        else {
          return die
        }
      })

      return updatedDice
    })
  }

  function reRoll() {

    setNumOfRolls(prevNumberOfRolls => prevNumberOfRolls + 1)

    setDice(prevDice => {
      const updatedDice = prevDice.map(die => {
        if (!die.isHeld) {
          // reroll a random new die value
          return { 
              shake: true,
              value: rollDiceValue(),
              isHeld: false,
              id: nanoid()
          }
        }
        else {
          // die stays the same
          return die
        }
      })

      return updatedDice
    })
  }

  function newGame() {
    setTenzies(false)
    startTimer()
    setNumOfRolls(0)
    setDice(allNewDice)
  }

  // Stopwatch functions 
  
  function updateStopwatch(startTime) {
    const currentTime = new Date().getTime()
    // console.log("start time in stopwatch: " + startTime)
    const timeTaken = currentTime - startTime
    const minutes = getMinutes(timeTaken)
    const seconds = getSeconds(timeTaken)

    const formattedSeconds = seconds.toString().padStart(2, '0')
    setTimeTaken({rawTimeTaken: timeTaken, minutes: minutes, seconds: formattedSeconds})
  }

  function getMinutes(time) {
    return Math.floor(time / 60000)
  }

  function getSeconds(time) {
    return Math.floor((time % 60000) / 1000)
  }

  function startTimer() {

    const newStartTime = new Date().getTime()

    // console.log("start time: " + newStartTime)

    const newIntervalId = setInterval(() => updateStopwatch(newStartTime), 1000)
    setIntervalId(newIntervalId)

    // console.log("Interval id: " + intervalId)

    return newIntervalId
  }

  React.useEffect(() => {

    if (tenzies) {
      checkForRecord()
      clearInterval(intervalId);
    }
  }, [tenzies])

  // record functionality

  function checkForRecord() {
    console.log("raw time taken: " + timeTaken.rawTimeTaken)
    console.log("num of rolls: " + numOfRolls)

    console.log(records)

    // no record has been created yet
    if (Object.keys(records).length === 0) {
      console.log("no record set yet")
      setRecords({
        numRollsRecord: numOfRolls,
        rawTimeRecord: timeTaken.rawTimeTaken,
        timeRecordMins: getMinutes(timeTaken.rawTimeTaken),
        timeRecordSecs: getSeconds(timeTaken.rawTimeTaken).toString().padStart(2, '0') 
      })
    }
    else {

      console.log("record has already been set")
      if (timeTaken.rawTimeTaken < records.rawTimeRecord) {

        console.log("new time record found")
        setRecords((prevRecords => {
          const updatedRecords = {
            ...prevRecords,
            rawTimeRecord: timeTaken.rawTimeTaken,
            timeRecordMins: getMinutes(timeTaken.rawTimeTaken),
            timeRecordSecs: getSeconds(timeTaken.rawTimeTaken)
          }

          return updatedRecords
        }))
      }

      if (numOfRolls < records.numRollsRecord) {

        console.log("new rolls record found")
        setRecords((prevRecords => {
          const updatedRecords = {
            ...prevRecords,
            numRollsRecord: numOfRolls
          }

          return updatedRecords
        }))
      }
    }
  }

  const diceElements = dice.map(die => {
    return (
      <Die 
        value={die.value}
        isHeld={die.isHeld}
        key={die.id}
        holdDice={() => holdDice(die.id)}
        shake={die.shake}
      />
    )
  })


  return (
    <div className="App">
      <main>
        <div className="container" style={{ overflow: 'hidden'}}>
          { tenzies && <Confetti /> }
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <div className="dice-grid">
            {diceElements}
          </div>
          <button onClick={ tenzies ? newGame : reRoll }>{ tenzies ? "New game" : "Roll" }</button>
          <GameStats 
            numOfRolls={numOfRolls}
            timeTaken={timeTaken}
            records={records}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
