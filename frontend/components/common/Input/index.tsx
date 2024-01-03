/// <reference no-default-lib="true"/>

import { TextLoaderNo, TextLoaderNoRevove } from "@/components/Loader/text";
import { useAppState } from "@/context/app.context";
import React, { useState, useEffect, useRef } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";

export const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 2px solid #d9d9d9;
  outline: none;
  color: #000;
  border-radius: 0.45rem;
  background-color: transparent;
  width: 100%;

  font-size: 14px;

  &:disabled {
    color: #fff7f7 !important;
    &::placeholder {
      color: #fff7f7 !important;
    }
  }

  &:hover {
    border: 2px solid ${(props) => props.theme.btnPrimary};
  }
`;
export const Suggestion1 = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  z-index: 10;
  left: 0;
  right: 0;
  max-width: 300px;
  max-height: 150px;
  overflow: scroll;
  border-radius: 8px;
  width: 200px;
  margin-bottom: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
  padding: 5px 5px;

  .item {
    background-color: #f3f3f3;
    padding: 5px 10px;
    margin-bottom: 5px;
    border-radius: 8px;
    transition: all 0.3s ease-out;
    font-size: 12px;

    &:hover {
      background-color: #e4e2e2;
    }
  }
`;
export const TestArea = styled.textarea`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d9d9d9;
  outline: none;
  color: #000;
  border-radius: 0.5rem;
  min-height: 80px;
  background-color: transparent;
  width: 100%;
  font-size: 14px;
  transition: all 0.3s ease;

  cursor: auto;

  &:focus-visible {
    border: 2px solid ${(props) => props.theme.btnPrimary};
  }

  &:disabled {
    color: #fff7f7 !important;
    &::placeholder {
      color: #fff7f7 !important;
    }
  }

  &:hover {
    /* border: 2px solid #d9d9d9; */
    border: 2px solid ${(props) => props.theme.btnPrimary};
  }
`;

export const Input2 = ({
  placeholders,
  interval,
}: {
  placeholders: string[];
  interval: number;
}) => {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) =>
        prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [placeholders, interval]);

  return <Input placeholder={placeholders[currentPlaceholderIndex]} />;
};

const InputFile = styled.div`
  border-radius: 6px;

  width: 100%;
  font-size: 10px;
  color: #888;

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    height: 250px;
    width: 100%;
  }
  .selected {
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      border: none;
      font-size: 12px;
    }
  }
`;

const InputFile1 = styled.div`
  width: 100%;

  font-size: 14px;
  color: #888;

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    height: 50px;
    border-radius: 6px;
    border: 2px solid #d9d9d9;
    transition: all 0.3s ease-in-out;
    width: 100%;
    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
      border-radius: 6px;
    }
  }
  .selected {
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      border: none;
      font-size: 12px;
    }
  }
`;

export const FileUpload = ({
  type,
  title,
  uerId,
}: {
  type: any;
  title: string;
  uerId: any;
}) => {
  const {
    file,
    setFile,
    uploadedProductlist,
    setUploadedProductlist,
    setLoader,
    addimgToCanvas,
    setPopup,
    projectId,
    setloadercarna,
    assetLoader,
    setassetLoader,
    loader,
    scaleDownImage,
  } = useAppState();

  const handleFileChange = (event: any) => {
    const fileSize = event.target.files[0].size;
    const maxSize = 25 * 1024 * 1024; // 1MB
    const filename = event.target.files[0].name;
    const format = filename.split(".").pop();

    if (fileSize > maxSize) {
      toast.error("File size must be less than 25MB");
      return false;
    } else if (
      format !== "png" &&
      format !== "webp" &&
      format !== "jpg" &&
      format !== "jpeg"
    ) {
      toast.error("Format not supported");
    } else {
      setassetLoader(true);
      const selectedFile = event.target.files?.[0] || null;
      setFile(selectedFile);
      const blobUrl = URL.createObjectURL(selectedFile);
      const idG = uploadedProductlist.length;
      try {
        if (selectedFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            if (type === "element") {
            } else {
              const filename = `img${Date.now()}`;
              // const dataimage = await scaleDownImage(reader.result);
              const response = await fetch("/api/removebg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  dataUrl: reader.result,
                  user_id: uerId,
                  project_id: projectId,
                  // type: "product",
                }),
              });

              if (response?.status === 413) {
                toast.error("Image exceeded 4mb limit");

                setassetLoader(false);
              } else if (response?.status === 400) {
                toast.error("Image is corrupted or unsupported dimensions");

                setassetLoader(false);
              } else if (response?.status !== 200 && response?.status !== 413) {
                toast.error(response?.statusText);

                setassetLoader(false);
              }
              const data = await response.json();
              if (data?.data) {
                setPopup({
                  status: true,
                  data: data[0],
                  dataArray: data,
                  loaderImage :reader.result, 
                });
                setassetLoader(false);
              } else {
                console.log("bg not removed");

                setassetLoader(false);
              }
            }
          };
          reader.readAsDataURL(selectedFile);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  const handleRemoveFile = () => {
    setFile(null);
  };
  function slideName(name: string) {
    const maxLength = 8;
    let displayedName;

    if (name.length <= maxLength) {
      displayedName = name;
    } else {
      const firstPart = name.slice(0, 15);
      const lastPart = name.slice(-15);
      displayedName = firstPart + "..." + lastPart;
    }

    return displayedName;
  }

  return (
    <InputFile1>
      <div>
        {assetLoader ? (
          <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
            <TextLoaderNoRevove />
          </label>
        ) : (
          <>
            <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Vector"
                  d="M4.33791 10.3325C3.50597 10.3331 2.70384 10.0228 2.08892 9.4627C1.474 8.90257 1.09067 8.13295 1.01415 7.30486C0.937623 6.47677 1.17343 5.64998 1.67529 4.98672C2.17715 4.32346 2.90885 3.8716 3.72681 3.7198C3.87049 2.95535 4.2769 2.26511 4.87577 1.76847C5.47464 1.27183 6.22831 1 7.00644 1C7.78458 1 8.53825 1.27183 9.13712 1.76847C9.73599 2.26511 10.1424 2.95535 10.2861 3.7198C11.1013 3.87469 11.8296 4.32764 12.3287 4.99027C12.8279 5.65291 13.0622 6.47769 12.9858 7.30367C12.9095 8.12965 12.5281 8.89757 11.9159 9.45759C11.3037 10.0176 10.5048 10.3295 9.67498 10.3325M5.00504 6.99815L7.00644 4.99753M7.00644 4.99753L9.00784 6.99815M7.00644 4.99753V13"
                  stroke="#888888"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {title}
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".webp, .png, .jpeg, .jpg"
              disabled={loader}
            />
          </>
        )}
      </div>
    </InputFile1>
  );
};

export const FileUpload3D = ({
  type,
  title,
  uerId,
}: {
  type: any;
  title: string;
  uerId: any;
}) => {
  const {
    file3d,
    setFile3d,
    uploadedProductlist,
    setUploadedProductlist,
    setLoader,
    addimgToCanvas,
    setPopup,
    projectId,
    setloadercarna,
    assetLoader,
    setassetLoader,
    assetL3doader,
    setasset3dLoader,
    file3dUrl,
    setFile3dUrl,
    tdFormate,
    filsizeMorethan10,
    setfilsizeMorethan10,
    file3dName,
    setFile3dName,
  } = useAppState();
  const [file, setFile] = useState(null);

  const handleFileChange = (event: any) => {
    setFile3dUrl(null);
    const selectedFile = event.target.files[0];
    if (selectedFile.size > 20 * 1024 * 1024) {
      // Check if the file size is greater than 10MB

      // event.target.value = null; // Clear the file input
      setfilsizeMorethan10(true);
    } else {
      setfilsizeMorethan10(false);
    }

    const fileSize = event.target.files[0].size;
    const maxSize = 100 * 1024 * 1024; // 1MB
    const filename = event.target.files[0].name;
    const format = filename.split(".").pop();

    const removeFirstLetter = (input: string) => {
      if (input.length > 1) {
        return input.substring(1);
      } else {
        return "";
      }
    };
    if (fileSize > maxSize) {
      toast.error("File size must be less than 25MB");

      return false;
    } else if (format !== removeFirstLetter(tdFormate)) {
      toast.error("Format not supported");
    } else {
      setasset3dLoader(true);

      const url = URL.createObjectURL(selectedFile);
      if (url) {
        setFile3dName(selectedFile);
        setFile3d(url);
        setFile3dUrl(null);
      } else {
        setasset3dLoader(false);
      }
    }
  };
  const handleRemoveFile = () => {
    setFile(null);
  };
  function slideName(name: string) {
    const maxLength = 8;
    let displayedName;

    if (name.length <= maxLength) {
      displayedName = name;
    } else {
      const firstPart = name.slice(0, 15);
      const lastPart = name.slice(-15);
      displayedName = firstPart + "..." + lastPart;
    }

    return displayedName;
  }

  return (
    <InputFile1>
      <div>
        {assetL3doader ? (
          <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
            <TextLoaderNoRevove />
          </label>
        ) : (
          <>
            <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Vector"
                  d="M4.33791 10.3325C3.50597 10.3331 2.70384 10.0228 2.08892 9.4627C1.474 8.90257 1.09067 8.13295 1.01415 7.30486C0.937623 6.47677 1.17343 5.64998 1.67529 4.98672C2.17715 4.32346 2.90885 3.8716 3.72681 3.7198C3.87049 2.95535 4.2769 2.26511 4.87577 1.76847C5.47464 1.27183 6.22831 1 7.00644 1C7.78458 1 8.53825 1.27183 9.13712 1.76847C9.73599 2.26511 10.1424 2.95535 10.2861 3.7198C11.1013 3.87469 11.8296 4.32764 12.3287 4.99027C12.8279 5.65291 13.0622 6.47769 12.9858 7.30367C12.9095 8.12965 12.5281 8.89757 11.9159 9.45759C11.3037 10.0176 10.5048 10.3295 9.67498 10.3325M5.00504 6.99815L7.00644 4.99753M7.00644 4.99753L9.00784 6.99815M7.00644 4.99753V13"
                  stroke="#888888"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {title}
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept={tdFormate}
            />
          </>
        )}
      </div>
      {/* )} */}
    </InputFile1>
  );
};
