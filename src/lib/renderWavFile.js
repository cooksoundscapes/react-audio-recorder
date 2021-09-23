export default function renderWavFile(source, clipping, smprate) {
    const toWav = require('audiobuffer-to-wav');
    const newSize = Math.floor((clipping[1] - clipping[0]) * .01 * source.length);
    const startPoint = clipping[0] * .01 * source.duration;
    const offlineCtx = new OfflineAudioContext(1, newSize, smprate);
    const player = offlineCtx.createBufferSource();
    player.buffer = source;
    player.connect(offlineCtx.destination);
    player.start(0, startPoint);
    offlineCtx.startRendering().then( newBuffer => {
        const waveFile = toWav(newBuffer);
        const binary = new Blob([new DataView(waveFile)], {type: 'audio/wav'});
        const a = document.createElement('a');
        const url = URL.createObjectURL(binary);
        document.body.appendChild(a);
        a.href = url;
        a.download = 'clippedWaveFile';
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0)
    }).catch( err => console.log(err))
}