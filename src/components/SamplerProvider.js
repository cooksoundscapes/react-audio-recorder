import { createContext, useContext, useState, useEffect } from 'react';

const SampCtx = createContext();

export const SamplerProvider = ({children}) => {
    const [dsp, setDsp] = useState(null);
    const [records, setRecords] = useState(null);
    const [clipArea, setClipArea] = useState([0,100]);
    const startDSP = () => {
        if (!dsp) {
            console.log('starting dsp...')
            setDsp(new AudioContext || window.webkitAudioContext);
        }
    }
    useEffect( () => {if (dsp) console.log('dsp started.', dsp)}, [dsp]);

    return(
        <SampCtx.Provider value={{dsp, startDSP, records, setRecords, clipArea, setClipArea}}>
            {children}
        </SampCtx.Provider>
    )
}

export const useSampler = () => useContext(SampCtx);