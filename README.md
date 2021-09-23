## Basic audio components

That project contains a example recorder with custom made React components with audio editing purposes, styled with Material UI basic theme. It's included:  

* Real time visualization of waveform while recording;
* Uploading of local audio files for edition;
* Asynchronous and multi-threaded wave plotting with the help of Web Workers;
* Wavetable component with the following features:
  * Drag-enabled bars for setting start/end points;
  * Play/Pause/Stop transport;
  * animated play bar;
  * Manually click on playing start position;
  * Zooming the waveform for details (mouse wheel only, for now) *;
  * Inspector for monitor the full length when zooming;
* Download a rendered audio file with the selected start/end trimming;
  

\*: Somewhat large files might lag when zooming;
  
