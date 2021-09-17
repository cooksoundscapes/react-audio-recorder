onmessage = function(event) {
    const canvas = event.data.canvas;
    const src = event.data.src;
    const jump = event.data.jump;
    const color = event.data.color;
    const width = canvas.width;
    const height = canvas.height;
    const length = src.length;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    if (typeof(color) === 'string') {
        ctx.strokeStyle = color;
    } else if (typeof(color) === 'function') {
        color(ctx);
    }
    ctx.lineWidth = 1;
    ctx.moveTo(0, height/2);
    for (let i = 0; i < length; i++) {
        ctx.lineTo(i * jump, (src[i]*-1+1)*(height*.5));
    }
    ctx.stroke();
    const bmp = canvas.transferToImageBitmap();
    postMessage(bmp); 
}