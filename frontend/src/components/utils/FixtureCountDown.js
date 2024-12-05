import Countdown from 'react-countdown';

function FixtureCountDown({ date }) {

    // Renderer for displaying the countdown
    const renderer = ({ days, hours, minutes, seconds }) => {
       
            return (
                <span>
                    {days > 0 ? `${days}:` : ''}{hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
            );
        }

    return (
        <Countdown date={date} renderer={renderer} />
    );
}

export default FixtureCountDown;
