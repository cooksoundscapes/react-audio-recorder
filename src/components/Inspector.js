import { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useEditor } from './WaveTable';
import PlayBar from './PlayBar';

const boxStyles = makeStyles( ({palette, spacing}) => ({
    root: {
        position: 'relative',
        backgroundColor: palette.background.paper,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '50%',
        height: 60,
    },
    scope: {
        background: 'rgba(80,80,80,.5)',
        border: '1px solid #aaa',
        borderRadius: spacing(.5),
        height: '100%'
    },
    clipbar: {
      position: 'absolute',
      top: 0,
      width: 2,
      height: '100%',
      backgroundColor: palette.secondary.main  
    }
}));

const Inspector = ({staticImg}) => {
    const classes = boxStyles();
    const [scrolled, setScrolled] = useState(0);
    const {cnv, box, clipArea} = useEditor();
    const containerRef = useRef();

    useEffect( () => {
        if (box.current) {
            const scrollEv = event => {
                setScrolled((event.target.scrollLeft / cnv.current.width)*100);
            }
            box.current.addEventListener('scroll', scrollEv, {passive: true});
            return () => {
                if (box.current) box.current.removeEventListener('scroll', scrollEv);
            }
        }
    });

    const forceScroll = event => {
        let ratio = ((event.clientX - event.target.offsetLeft) / event.target.offsetWidth) * cnv.current.width;
        box.current.scrollLeft = ratio;
    }

    const sizeRatio = () => {
        if (cnv.current && box.current) {
            return ((box.current.offsetWidth / cnv.current.width)*100).toFixed(2);
        }
    }
    return (
        <Box ref={containerRef} onClick={forceScroll} className={classes.root} style={{backgroundImage: `url(${staticImg})`}} >
            <div className={classes.clipbar} style={{left: clipArea[0]+'%'}} ></div>
            <div className={classes.clipbar} style={{left: clipArea[1]+'%'}} ></div>
            <PlayBar parentWidth={containerRef.current ? containerRef.current.offsetWidth : 0} />
            <Box className={classes.scope} style={{width: sizeRatio()+'%', marginLeft: scrolled+'%'}} />
        </Box>    
    )
}

export default Inspector;