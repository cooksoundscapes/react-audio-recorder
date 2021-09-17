import Button from '@material-ui/core/Button';

const UploadButton = ({fileHandler, children, ...props}) => {

  const handleFiles = event => {
    let files = event.target.files;
    files = [...files];
    event.target.value = null;     //event doesn't fire when selecting the same file 2 times. Shitty way to reset.
    files.forEach( file => fileHandler(file) );
  }

  return (
    <div>
      <input
        accept=".wav, .aiff"
        style={{display: 'none'}}
        id="contained-button-file"
        multiple
        type="file"
        onChange={handleFiles}
      />
      <label htmlFor="contained-button-file">
        <Button {...props} component="span">
          {children}
        </Button>
      </label>
    </div>
  )
}

export default UploadButton;
