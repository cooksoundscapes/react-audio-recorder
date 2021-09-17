import { Typography } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useSampler } from './SamplerProvider';

const Timer = props => {
    const [gate, setGate] = useState(false);
    const [id, setId] = useState(null);   
    const [time, setTime] = useState(['00','00','00']);
    const {dsp} = useSampler();
    let mins, secs, msecs;

    function timer(offset) {
        if (!dsp) return;
        let realTime = dsp.currentTime - offset;
        mins = Math.floor(realTime/60);
        secs = Math.floor(realTime%60);
        msecs = Math.floor((realTime - Math.floor(realTime))*100);
        realTime = [mins, secs, msecs].map( unit => (
            <span style={{width: '1.2em', display: 'inline-block'}}>
                {unit.toString().padStart(2, '0')}
            </span>   
        ));
        setTime(realTime);
    }

    useEffect( () => {  //#1: prop into state
        setGate(props.isCounting);
    }, [props.isCounting]);

    useEffect( () => {  //#2: start/stop polling;
        if (gate) setId(setInterval(timer, 80, dsp.currentTime));
        return () => {
            setId( id => clearInterval(id));
        }
    }, [gate]);

    return (
        <div style={{textAlign: 'center'}}>
        <Typography variant='h3' style={{textAlign: 'center', textShadow: '2px 2px 8px #502280'}}>
            {time[0]}:{time[1]}.{time[2]}
        </Typography>
        </div>
    )
}

export default Timer;