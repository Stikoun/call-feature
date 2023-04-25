import {useState, useEffect} from 'react';
import Moment from 'moment';


/**
 * Count and renders active call duration
 */
export default function CallDuration(props) {
    const {startTime} = props;
    // state
    const [duration, setDuration] = useState('00:00:00');

    /**
     * Count call duration every second
     */
    useEffect(() => {
        let interval = null;
        if (startTime) {
            const intervalFunc = () => {
                // get difference between startTime and now in seconds, convert to HH:mm:ss
                const difference = Moment.utc(Moment().diff(startTime, 'milliseconds')).format('HH:mm:ss');
                setDuration(difference);
            };
            // trigger immediately
            intervalFunc();
            // and then every second
            interval = setInterval(intervalFunc, 1000);
        }
        // clean up
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [startTime]);

    return duration;
}
