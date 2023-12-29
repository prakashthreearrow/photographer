import React, { useState } from "react";

function FileUploader(props) {
  const { acceptedTypes, label } = props;
  const [file, setFile] = useState("");

  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (file && acceptedTypes.includes(file.type)) {
      setFile(file);
    } else {
      alert("Invalid file type");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={acceptedTypes}
        onChange={handleFileUpload}
        id={label}
        className="hidden"
      />
    </div>
  );
}

export default FileUploader;
