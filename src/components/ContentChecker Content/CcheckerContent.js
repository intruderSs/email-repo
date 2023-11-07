import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';


function CcheckerContent() {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    (async () => {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(file);
      console.log(ret.data.text);
      setText(ret.data.text);
      await worker.terminate();
    })();
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {text && <div>Text from the image: {text}</div>}
      {imageFile && (
        <img style={{height: '800px', width: '700px'}} src={URL.createObjectURL(imageFile)} alt="Uploaded Image" />
      )}
    </div>
  );
}

export default CcheckerContent;
