export default function Die(props) {

    return (
        <div 
            className={`dice ${props.value} ${props.isHeld ? 'frozen' : ''} ${props.shake ? 'shake' : ''}`}
            onClick={props.holdDice}
        >
            {props.value}
        </div>
    )

}