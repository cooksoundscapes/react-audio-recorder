import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { useEditor } from './WaveTable';

const styling = makeStyles({
    grid: {
        height: 15,
        border: '1px solid #313131',
        backgroundColor: '#aaa',
        '& span': {
            display: 'block',
            width: 1,
            backgroundColor: '#313131',
            height: '100%',
            fontSize: 12,
            color: 'black'
        }
    },
    endtag: {
        position: 'absolute',
        top: 1,
        fontSize: 12,
        color: 'black',
        
    }
});

const TimeBar = () => {
    const classes = styling();
    const {cnv, src} = useEditor();
    const marks = () => {
        if (cnv.current && src) {
            const marks = [];
            let amount = Math.trunc(cnv.current.offsetWidth / 80);
            for (let i = 0; i < amount; i++) {
                let pos = (i+1)/(amount+1) * src.duration;
                if (pos < .1) {
                    pos = (pos * 1000).toFixed(1)+'ms';

                } else if (pos > 59) {
                    pos = (pos / 60).toFixed(2)+'min';
                } else {
                    pos = pos.toFixed(2)+'s';
                }
                marks.push(<span key={i}>{pos}</span>);
            }
            return marks;
        }    
    }

    return (
        <div style={{position: 'relative', width: cnv.current ? cnv.current.offsetWidth : 'auto'}}>
            <Grid container justifyContent='space-between' 
                className={classes.grid} >
            <span >0</span>
            {marks()}
            <div></div>
            </Grid>
            <span className={classes.endtag} style={{right: 0}} >{src ? src.duration.toFixed(1)+'s' : null}</span>
        </div>
    )
}

export default TimeBar;