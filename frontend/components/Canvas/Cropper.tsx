// @ts-nocheck

import React from "react";
import { styled } from "styled-components";
import { useState } from "react";
import { useAppState } from "@/context/app.context";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "../common/Button";
import { saveAs } from "file-saver";

const CropperBox = () => {
  const {
    setCrop,
    downloadImg,
    addimgToCanvasGen,
    TDMode,
    downloadeImgFormate,
    canvasInstance,
  } = useAppState();

  const [cropSize, setCropSize] = useState();

  const HandleCrope = async () => {
    if (cropSize.width && cropSize.height) {
      const canvas = document.createElement("canvas");
      const image = document.getElementById("img");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = cropSize.width;
      canvas.height = cropSize.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        cropSize.x * scaleX,
        cropSize.y * scaleY,
        cropSize.width * scaleX,
        cropSize.height * scaleY,
        0,
        0,
        cropSize.width,
        cropSize.height
      );

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const url = URL.createObjectURL(blob);

      DeletIrem();
      addimgToCanvasGen(url);
      setCrop(false);
    }
  };
  const downloadH = async () => {
    if (cropSize.width && cropSize.height) {
      const canvas = document.createElement("canvas");
      const image = document.getElementById("img");
      image.setAttribute("crossOrigin", "anonymous");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = cropSize.width;
      canvas.height = cropSize.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        cropSize.x * scaleX,
        cropSize.y * scaleY,
        cropSize.width * scaleX,
        cropSize.height * scaleY,
        0,
        0,
        cropSize.width,
        cropSize.height
      );

      const url = canvas.toDataURL();
      saveAs(url, `image${Date.now()}.${downloadeImgFormate}`);
    }
  };

  const DeletIrem = () => {
    const activeObject = canvasInstance?.current?.getActiveObject();
    if (activeObject) {
      canvasInstance?.current?.remove(activeObject);
      canvasInstance?.current?.renderAll();
    }
  };
  return (
    <Wrapper>
      <div className="cropperbox">
        <ReactCrop
          crop={cropSize}
          onChange={(c) => setCropSize(c)}
          minWidth={50}
          minHeight={50}
        >
          <img className="nm" src={downloadImg} id="img" />
        </ReactCrop>

        <div className="flex">
          {TDMode ? (
            <Button
              onClick={() => downloadH()}
              //   disabled={linesHistory.length === 0 ? true : false}
            >
              Download
            </Button>
          ) : (
            <Button onClick={() => HandleCrope()}>Done</Button>
          )}

          <Button onClick={() => setCrop(false)}>Close</Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default CropperBox;

const Wrapper = styled.div`
  .nm {
    object-fit: contain;
    width: 1005;
  }

  .flex {
    display: flex;
    justify-content: end;
    gap: 20px;
    button {
      max-width: fit-content;
    }
  }
  /* border: 1px solid black; */
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  z-index: 400;
  background-color: #ffffff;

  .ReactCrop {
    width: 400px;
    height: 400px;
    position: relative;
  }
  .reactEasyCrop_Container {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
`;
