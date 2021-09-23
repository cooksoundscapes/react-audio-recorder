import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import waveDraw from '../lib/waveDraw';
import { makeStyles } from '@material-ui/core/styles';
import TimeBar from '../components/TimeBar';
import { LinearProgress } from '@material-ui/core';
import { useSampler } from './SamplerProvider';

const styling = makeStyles( theme => ({
  container: {
    position: 'relative',
    overflowX: 'scroll',
    overflowY: 'hidden',
    height: 182,
    background: theme.palette.background.paper,
    '&::-webkit-scrollbar': {height: theme.spacing(1)},
    '&::-webkit-scrollbar-track': {background: '#212121'},
    '&::-webkit-scrollbar-thumb': {background: '#555555'}
  },
  shade: {
    position: 'absolute',
    top: 0,
    height: '100%',
    backgroundColor: 'black',
    opacity: .2,
  },
}));

const WaveEditor = createContext();

const Wavetable = React.forwardRef( (props, cnv) => {
  if (!cnv) cnv = useRef(null);   //fallback for the forwarded ref
  const box = useRef(null);
  const classes = styling();
  const {clipArea} = useSampler();
  const [plotted, setPlot] = useState(false);
  const [resolution, setRes] = useState(0); // points per pixel
  const [minRes, setMin] = useState(null);
  const [seekPos, setSeek] = useState(0);
  const [isPlaying, setPlay] = useState(false);
  const tools = props.children.find(child => child.type.name == 'Tools');
  const innerChild = React.Children.map(props.children, child => {
    if (child.type.name == "Tools") return;
    return child;
  });
  
  useEffect( () => {
    let timeHandle;
    const seek = event => {
      let point = (event.offsetX) / cnv.current.width;
      point = point * props.source.duration;
      setSeek(point);
    }
    const zoom = event => {
      if (timeHandle) {
        clearTimeout(timeHandle);
      }
      setRes(resolution => Math.max(10, Math.min(minRes, resolution += event.deltaY/5)) );
      timeHandle = setTimeout( () => setPlot(false), 100);
    }
    box.current.addEventListener('wheel', zoom, {passive: true});
    cnv.current.addEventListener('click', seek);
    return function cleanup() {
      if (box.current) box.current.removeEventListener('wheel', zoom);
      if (cnv.current) cnv.current.removeEventListener('click', seek);
    }
  });

  useEffect( () => {        //Drawing event
    if (props.source && !plotted) {
      let res;
      if (resolution === 0) {
        res = props.source.length / (box.current.offsetWidth);
        setRes(res);
        setMin(res);
      } else {
        res = resolution;
      }
      waveDraw(props.source, cnv, 'white', res).then( () => {
        setPlot(true);
      });
    }
  });
  const shadeStart = () => ({
    left: 0,
    width: (clipArea[0] * .01 * (cnv.current ? cnv.current.width : 0))+'px'
  })
  const shadeEnd = () => ({
    left: clipArea[1] * .01 * (cnv.current ? cnv.current.width : 0)+'px',
    width: (100-clipArea[1]) * .01 * (cnv.current ? cnv.current.width : 0)+'px'
  })
  return (
    <WaveEditor.Provider value={{src: props.source, cnv, box, isPlaying, setPlay, seekPos, setSeek}}>
      <div ref={box} className={[props.className, classes.container].join(' ')} style={props.style} >
        <TimeBar />
        <canvas ref={cnv} />
        <div className={classes.shade} style={shadeStart()} ></div>
        <div className={classes.shade} style={shadeEnd()} ></div>
        { !plotted ? <LinearProgress className={classes.progress} color='secondary'/> : null}
        {innerChild}
      </div>
      {tools ? tools.props.children : null}
    </WaveEditor.Provider>
  )
});

export default Wavetable;
export const useEditor = () => useContext(WaveEditor);