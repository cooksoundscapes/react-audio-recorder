import { Grid, Fab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import ClipInfo from '../components/ClipInfo';
import ClipTransport from '../components/ClipTransport';
import WaveTable from '../components/WaveTable';
import Inspector from '../components/Inspector';
import { useSampler } from '../components/SamplerProvider';
import DragBar from '../components/DragBar';
import PlayBar from '../components/PlayBar';
import renderWavFile from '../lib/renderWavFile';
import { useHistory, Link } from 'react-router-dom';
import { useEffect } from 'react';

const styles = makeStyles( ({spacing}) => ({
    grid: {
        gap: spacing(1),
        marginTop: spacing(1)
    },
    wavetable: {
        marginTop: spacing(1),
        width: '80%'
    },
    nav: {
        margin: `0 ${spacing(1)}px`
    },
}));

 // invisible wrapper, for rendering some children
 // somewhere else on a component (like, outside main div)
const Tools = ({children}) => <>{children}</>

const Edit = () => {
    const {dsp, records, clipArea} = useSampler();
    const classes = styles();
    const history = useHistory();
    
    useEffect( () => {
        if (!records) {
            history.push('/');
        }
    })

    return (    
        <Grid className={classes.grid} container direction='column' alignItems='center' >
            <Typography variant='h5'>Chop if needed</Typography>
            <WaveTable className={classes.wavetable} source={records ? records.buffer : null} >
                <DragBar type='start' position={0} />
                <PlayBar /> 
                <DragBar type='end' position={100} />
                <Tools>
                    <Inspector staticImg={records ? records.img : null} />
                    <ClipTransport color='secondary' variant='contained'/>
                    <ClipInfo />
                </Tools>
            </WaveTable>
            <Typography variant='subtitle1'>Click next to render clipped wave file.</Typography>
            <Grid container justifyContent='space-between'>
                <Link to={'/'}>
                    <Fab color='primary' aria-label='prev-button' 
                         className={classes.nav}> <NavigateBeforeIcon /> </Fab>
                </Link>
                <Fab color='primary' aria-label='next-button' className={classes.nav}
                     onClick={() => renderWavFile(records.buffer, clipArea, dsp.sampleRate)}> 
                     <NavigateNextIcon /> </Fab>
            </Grid>
        </Grid>
    )
}

export default Edit;