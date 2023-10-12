export default function GameStats(props) {

    return (
        <div className="game-stats">
            <div>
              <p>Number of rolls: {props.numOfRolls}</p>
              { Object.keys(props.records).length !== 0 && <p className="record">Best: { props.records.numRollsRecord }</p> }
            </div>
            <div className="time-taken">
              <p>Time taken: { props.timeTaken.minutes }:{ props.timeTaken.seconds }</p>
              {/* Checks if object is empty, aka no record has been set yet */}
              { Object.keys(props.records).length !== 0 && <p className="record">Best: { props.records.timeRecordMins}:{ props.records.timeRecordSecs }</p> }
            </div>
        </div>
    )

}