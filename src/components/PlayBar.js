import { useEditor } from './WaveTable';
import { useSampler } from './SamplerProvider';
import { useEffect, useRef } from 'react';

const PlayBar = ({parentWidth}) => {
    const {clipArea} = useSampler();
    const {cnv, src, isPlaying, seekPos} = useEditor();
    const bar = useRef(null);
    let animId;

    useEffect( () => {
        const width = parentWidth || cnv.current.width;
        let position = 0;
        if (src) position = Math.max( clipArea[0]*.01*width, (seekPos/src.duration)*width);
        bar.current.style.left = position+'px';
        if (isPlaying) {
            if (position >= (clipArea[1]*.01*width)) position = clipArea[0]*.01*width;
            const fpsInMs = 1000 / 61;
            const jump = (width / (src.duration*1000)) * fpsInMs;
            const animLoop = () => {
                position = Math.min((width*.01*clipArea[1])-1, position + jump);
                bar.current.style.left = position+'px';
                cancelAnimationFrame(animId);
                animId = requestAnimationFrame(animLoop);
            }
            animId = requestAnimationFrame(animLoop);
        } else if (seekPos == 0 && bar.current) {
            bar.current.style.left = 0;
        }
        return () => {
            cancelAnimationFrame(animId);
        }
    }, [seekPos, isPlaying]);

    return (
    <   div ref={bar} style={{
        position: 'absolute',
        top: 0,
        width: 1,
        height: '100%',
        backgroundColor: 'red'}}>
    </div>
    )
}

export default PlayBar;