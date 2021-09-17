export default function analyzeAudio(dsp, cnvRef, source) {
    const analyser = dsp.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = cnvRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const x_correction = width/Math.max(1,bufferLength);
    source.connect(analyser, 0);

    const wavePlot = () => {
        analyser.getFloatFrequencyData(dataArray); // or .getTimeDomainData, you choose;
        // clean canvas;
        ctx.clearRect(0,0,width,height);
        ctx.beginPath();
        // draw wave;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.moveTo(0,height/2);
        for (let i = 0; i < bufferLength; i++) {
            ctx.lineTo(i*x_correction,(dataArray[i]/128.0)*(height*.5)*-1+height);
        }
        ctx.stroke();
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(wavePlot);
    }

    const liveWaveDraw = () => {
        analyser.getByteFrequencyData(dataArray);
        let sumOfSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sumOfSquares += Math.sqrt(dataArray[i]);
        }
        let point = sumOfSquares/dataArray.length;
        wavepts.push(point**3);

        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < wavepts.length; i++) {
            if (i*4 > width) wavepts.shift();
            ctx.beginPath();
            ctx.fillStyle = 'white'
            ctx.rect(i*4, height/2-wavepts[i]*.05, 3, wavepts[i]*.1);
            ctx.fill()
        }
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(liveWaveDraw);
    }
    
    let wavepts = [];
    let animId = requestAnimationFrame(liveWaveDraw);
    //let animId = requestAnimationFrame(wavePlot);

    analyzeAudio.stop = () => {
        cancelAnimationFrame(animId);
        posX = 0;
    }
}