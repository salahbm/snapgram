import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUpLoaderProps = {
  fieldChange: (file: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUpLoaderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".JPEG", ".jpg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col flex-center cursor-pointer rounded-xl bg-dark-3"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5">
            <img src={fileUrl} alt="PostPic" className="file-uploader-img" />
          </div>
          <p className="file_uploader-label">
            Click or Drag new photo to replace
          </p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="Upload"
            width={96}
            height={77}
          />
          <h3 className="text-white-2 base-medium mb-2 mt-6">
            Drag Photo here
          </h3>
          <p className="text-light-4 small-regular mb-4">SVG, PNG, JPG</p>
          <Button className="shad-button_dark_4">Select from the device</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
