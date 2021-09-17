import analyzeAudio from './analyzeAudio';
import waveDraw from './waveDraw';

const options = {
    audio: {
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false,
        channelCount: 2
    },
    video: false
}

export default function recordAudio(dsp, scopeCanvas, plotCanvas) {
    let recorder, chunks, source;
    
    recordAudio.stop = () => {
        /*How that works: after the function is called once, 
        you can access this method from outside*/
        if (recorder.state !== 'inactive') {
            recorder.stop();
        }   
    }
    
    return new Promise( (resolve,reject) => {
        navigator.mediaDevices.getUserMedia(options)
        .then( stream => {
            chunks = [];
            recorder = new MediaRecorder(stream);
            source = dsp.createMediaStreamSource(stream);
            analyzeAudio(dsp, scopeCanvas, source);

            recorder.ondataavailable = event => {
                if (event.data) {
                    chunks.push(event.data);
                }
            }

            recorder.onstop = () => {
                stream.getTracks().forEach( track => track.stop());
                const recordData = new Blob(chunks);              
                //const recordFile = new File(chunks, 'test.wav', {type: 'audio/wav'});
                //asyncReadFile(recordFile)  //.then... <-- works equally as below;
                recordData.arrayBuffer()
                .then( buffer => {
                    dsp.decodeAudioData(buffer)
                    .then( audioBuffer => {
                        analyzeAudio.stop();
                        waveDraw(audioBuffer, plotCanvas).then( staticImg => {
                            resolve({buffer: audioBuffer, img: staticImg});
                        })
                    })
                    .catch( err => reject(err))
                })
                .catch( err => reject(err))
            }
            recorder.start();
        })
        .catch( err => reject(console.log(err)))
    })
}
