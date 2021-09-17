export default function waveDraw(clip, cnvRef, color='white', resolution) {
  const canvas = cnvRef.current;  
  const src = clip.getChannelData(0);
  let width, jump;
  if (!resolution) {
      width = canvas.width;
      jump = width/Math.max(1, src.length);
  } else {
      width = Math.ceil(src.length/resolution);
      canvas.width = width;
      jump = 1/Math.ceil(resolution);
  }
  const offcanvas = new OffscreenCanvas(width, canvas.height);
  const args = {
    canvas: offcanvas,
    src: src,
    jump: jump,
    color: color
  } 
  const bmpCtx = canvas.getContext('bitmaprenderer');
  if (!bmpCtx) throw "This canvas already have a context, aborting."
  const asyncDraw = new Worker(new URL('asyncWaveDraw.js', import.meta.url));
  let resolveDrawing;
  asyncDraw.onmessage = event => {
    resolveDrawing(event.data);
  }
  const drawingPromise = new Promise( resolve => {
    asyncDraw.postMessage(args, [offcanvas])
    resolveDrawing = resolve;
  });

  return new Promise( resolve => { //2nd promise for returning image file;
    drawingPromise.then( bitmap => {
      bmpCtx.transferFromImageBitmap(bitmap);
      asyncDraw.terminate();
      resolve(canvas.toDataURL('image/webp'));
    });
  });
}