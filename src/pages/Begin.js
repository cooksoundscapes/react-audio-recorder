import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MicIcon from '@material-ui/icons/Mic';
import PublishIcon from '@material-ui/icons/Publish';
import HelpIcon from '@material-ui/icons/Help';
import CheckIcon from '@material-ui/icons/Check';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { LinearProgress, Box, Fade, Grid, Fab, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Timer from '../components/Timer';
import UploadButton from '../components/UploadButton';
import { useSampler } from '../components/SamplerProvider';
import recordAudio from '../lib/recordAudio';
import asyncReadFile from '../lib/asyncReadFile';
import waveDraw from '../lib/waveDraw';

const style = makeStyles( ({spacing}) => ({
    grid: {
        gap: spacing(1),
    },
    helpBtn: {
       position: 'absolute',
       right: spacing(1),
       bottom: spacing(1)
    },
    recBtn: {
        width: spacing(10),
        height: spacing(10),
        marginLeft: spacing(8),
        '& svg': {
            fontSize: spacing(4)
        }
    },
    okBtn: {
        marginLeft: spacing(1)
    }
}));

const Begin = () => {
    const classes = style();
    const [recState, setRec] = useState(null); //quadstate - null, recording, uploading, done
    const [upload, setUpload] = useState(null);
    const scope = useRef();
    const wavePlot = useRef();
    const {dsp, startDSP, setRecords, setClipArea} = useSampler();

    useEffect( () => {  
        if (!dsp && recState == ('recording' || 'uploading')) startDSP();  
        if (dsp && recState == 'uploading') {
            asyncReadFile(upload).then( arrBuff => {
                dsp.decodeAudioData(arrBuff).then( audioBuff => {
                    waveDraw(audioBuff, wavePlot).then( staticImg => {
                        setRecords({buffer: audioBuff, img: staticImg});
                        setRec('done');
                        setClipArea([0,100]);
                    });
                }).catch( err => console.log(err));
            }).catch( err => console.log(err));
        } else if (dsp && recState == 'recording') {
            recordAudio(dsp, scope, wavePlot).then( newRec => {
                setRecords(newRec);
                setRec('done');
                setClipArea([0,100]);
            })
            .catch( err => {
                setRec('error');
                console.log('error at Begin.js recordAudio promise:', err);
            });
        } else if (recState == 'done') {
            try {
                recordAudio.stop();
            } catch(err) {
                console.log('Harmless warning: tried to invoke recordAudio.stop() before instantiation.');
            }
        }
    })

    const uploadFile = file => {
        startDSP();
        setUpload(file);
        setRec('uploading');
    }
    return (
        <>
            <IconButton aria-label='login-button'> <AccountCircleIcon /> </IconButton>
            <Grid container alignItems='center' direction='column' className={classes.grid}>
                <Timer isCounting={recState == 'recording'}/>
                <div style={{height: 150, width: 300, margin: 'auto', position: 'relative'}}>
                    <Fade in={recState == 'recording'}>
                        <canvas style={{position: 'absolute'}} ref={scope} />
                    </Fade>
                    <Fade in={recState == 'done'}>
                        <canvas style={{position: 'absolute'}} ref={wavePlot} />
                    </Fade>
                    {recState == 'uploading' ? <LinearProgress color='secondary' /> : null}
                </div>
                    <Box>
                        <Fab aria-label='record-button' 
                             className={classes.recBtn} 
                             size='large' 
                             color='primary'
                             onClick={ () => setRec(recState == 'recording' ? 'done' : 'recording')}> 
                            {recState == 'recording' ? <CheckIcon /> : <MicIcon /> }
                        </Fab>
                        <Fade in={recState == 'done'}>
                            <Link to='/edit'>
                                <Fab color='secondary' 
                                     className={classes.okBtn}
                                     aria-label='next-button' 
                                     size='large'>
                                    <NavigateNextIcon /> 
                                </Fab>
                            </Link>
                        </Fade>
                    </Box>
                <UploadButton variant='contained' color='secondary' 
                        disabled={recState == 'recording'}
                        fileHandler={uploadFile}
                        startIcon={<PublishIcon />}> Upload local file </UploadButton>
            </Grid>
            <IconButton aria-label='help-button' className={classes.helpBtn}> <HelpIcon /> </IconButton>
        </>
    )
}

export default Begin;