import { useSampler } from './SamplerProvider';
import { useEditor } from './WaveTable';
import { useEffect, useState, useRef } from 'react';
import { ButtonGroup, Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';

const ClipTransport = props => {
    const {src, cnv, clipArea, isPlaying, setPlay, seekPos, setSeek} = useEditor();
    const [pausedAt, setPaused] = useState(0);
    const {dsp} = useSampler();
    const playRef = useRef();
    const pauseRef = useRef();
    let player, timeOutId;

    useEffect( () => {
        if (isPlaying) pauseRef.current.focus();
        else playRef.current.focus();
    });

    useEffect( () => {
        if (isPlaying) {
            player = dsp.createBufferSource();
            const startPoint = Math.max((src.duration*clipArea[0]*.01), seekPos);
            let length = (src.duration*clipArea[1]*.01) - startPoint;
            if (length <= 0) length = (src.duration*(clipArea[1] - clipArea[0])*.01);
            player.buffer = src;
            player.connect(dsp.destination);
            player.start(0, startPoint, length);
            timeOutId = setTimeout(stopAction, length*1000);
        }
        return () => {
            if (player) {
                player.stop();
                clearTimeout(timeOutId);
            } 
        }
    }, [isPlaying, seekPos]);

    const playAction = () => {
        setPaused(dsp.currentTime);
        setPlay(true);
    }
    const stopAction = () => {
        setSeek(0);
        setPlay(false)
    };
    const pauseAction = () => {
        if (!isPlaying) return;
        const absolutePos = dsp.currentTime - pausedAt + Math.max(clipArea[0]*.01*src.duration, seekPos); 
        setSeek(absolutePos);
        setPlay(false);
    }
    return (
    <ButtonGroup {...props} >
        <Button ref={playRef} disabled={isPlaying} onClick={playAction} > <PlayArrowIcon /> </Button>
        <Button ref={pauseRef} onClick={pauseAction} > <PauseIcon /> </Button>
        <Button disabled={seekPos == 0 && !isPlaying} onClick={stopAction} > <StopIcon /> </Button>
    </ButtonGroup>
    )
}

export default ClipTransport;