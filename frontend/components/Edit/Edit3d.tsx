/// <reference no-default-lib="true"/>

import React, { useEffect, useState, useRef } from "react";
import Label, { DisabledLabel } from "../common/Label";
import { Row } from "../common/Row";
import DropdownInput, { DropdownNOBorder } from "../common/Dropdown";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};
import { saveAs } from "file-saver";
import { SketchPicker } from "react-color";
import { motion } from "framer-motion";
import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";
import { ImgFormate, coloreMode } from "@/data/dropdown";
import { Input } from "../common/Input";
import { Console } from "console";
import { useRouter } from "next/router";
import { styled } from "styled-components";
import { fabric } from "fabric";
import TextLoader from "../Loader/text";

const Edit3d = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const {
  
    previewLoader,
    setPriviewLoader,
    downloadImg,
    canvasInstance,
    addimgToCanvasGen,
    addimgToCanvasSubject,
    modifidImageArray,
    isMagic,
    setIsMagic,
    setModifidImageArray,
    setSelectedImg,
    bringImageToFront,
    sendImageToBack,
    setLoader,
    downloadeImgFormate,
    setDownloadeImgFormate,
    mode,
    setMode,
    brushSize,
    setBrushSize,
    linesHistory,
    setLinesHistory,
    lines,
    setLines,
  
    setMagicloder,
    setDownloadImg,
    selectedImg,
    crop,
    setCrop,
    loader,
    setremovepopu3d,
    userId,
  } = useAppState();

  const { query, isReady } = useRouter();
  // const { id } = query;
  const id = (query.id as string[]) || [];
  /* eslint-disable */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsPopupOpen((prevIsPopupOpen) => !prevIsPopupOpen);
  };



  const handleDownload = () => {
    if (downloadImg) {
      const url = downloadImg;
      saveAs(url, `image${Date.now()}.${downloadeImgFormate}`);
    }
  };

  /* eslint-disable */

  const HandelBG = async () => {
    setCrop(false);
    setIsMagic(false);
    setremovepopu3d({ status: true, type: "bgRemove" });
  };

  async function toB64(imgUrl: string): Promise<string> {
    const datas = await fetch(imgUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result;
          return base64data;

          // setBase64Image(base64data);
        };
        reader.readAsDataURL(blob);
      });
  }

  async function toB64New(imgUrl: string): Promise<string> {
    const response = await fetch(imgUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64String = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return base64String;
  }

  const UpscaleBG = async () => {
    setCrop(false);
    setIsMagic(false);

    setremovepopu3d({ status: true, type: "upscale" });
  };




  const [size, setsize] = useState(40);

  const [isEraseMode, setIsEraseMode] = useState(false);
  const history = useRef([]);
  const historyIndex = useRef(-1);

  const toggleEraseMode = () => {
    setIsEraseMode(!isEraseMode);
    const activeObject = canvasInstance.current.getActiveObject();

    if (activeObject && activeObject.type === "image") {
      canvasInstance.current.isDrawingMode = true;
      canvasInstance.current.freeDrawingBrush.color = "black"; // Set brush color
      canvasInstance.current.freeDrawingBrush.width = 2; // Set brush width
      canvasInstance.current.freeDrawingBrush.shadow = null; // Remove shadow

      // Create a mask from the selected image
      const mask = new fabric.Rect({
        width: activeObject.width,
        height: activeObject.height,
        left: activeObject.left,
        top: activeObject.top,
        opacity: 0, // Make the mask invisible
        selectable: false, // Disable selection for the mask
        evented: false, // Disable events for the mask
      });

      // Set the mask as a clipping object to restrict drawing
      activeObject.set({
        clipTo: function (ctx) {
          return function () {
            mask.render(ctx);
          };
        },
      });

      canvasInstance.current.add(mask); // Add the mask to the canvas
    } else {
      canvasInstance.current.isDrawingMode = false;
    }
  };
  const undoAction = () => {
    if (historyIndex.current === 0) return;

    historyIndex.current -= 1;
    const prevState = JSON.parse(history.current[historyIndex.current]);
    canvasInstance.current.loadFromJSON(prevState);
  };

  const clearDrawing = () => {
    setIsEraseMode(false);
    const objects = canvasInstance.current.getObjects();
    objects.forEach((object) => {
      if (object.type === "path") {
        // Assuming paths are used for free drawing and erasing
        canvasInstance.current.remove(object);
      }
    });
  };

  const undoLastDrawing = () => {
    if (linesHistory.length === 0) return;

    const lastVersion = linesHistory[linesHistory.length - 1];
    setLines(lastVersion);

    // Remove the last version from history
    setLinesHistory(linesHistory.slice(0, linesHistory.length - 1));
  };

  const HandelCrop = () => {
    setremovepopu3d({});

    setCrop(true);
    setIsMagic(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={selectedImg && !loader ? "accest" : "accest blure"}
      style={{ paddingBottom: "50px" }}
    >
      <WrapperEdit>
        <div className="gap">
          <Label>Tools</Label>

          <div className="gaps">
            <div
              className={isMagic ? "selectTool activeTool" : "selectTool"}
              onClick={() => {
                setremovepopu3d({});

                setIsMagic(true);
                setCrop(false);
              }}
            >
              <div className="mageic">
                <div className="gaps">
                  <Label> Erase</Label>
                  <DisabledLabel>
                    Erase any unwanted parts of the background.
                  </DisabledLabel>
                </div>
                <div className="gaps">
                  <div className="flex">
                    <Label>Mode</Label>
                  </div>
                  <div className="modeBtns">
                    <div
                      className={`btn ${mode === "pen" ? "activBtn" : ""}`}
                      onClick={() => {
                        setMode("pen");
                      }}
                    >
                      Erase
                    </div>
                    <div
                      className={`btnq ${mode === "eraser" ? "activBtn" : ""}`}
                      onClick={() => {
                        setLinesHistory([]);
                        setLines([]);
                      }}
                    >
                      Restore
                    </div>
                  </div>
                </div>
                <div className="">
                  <Label>Brush size</Label>
                  <div className="rangebox">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="1"
                      value={brushSize}
                      onChange={(e) =>
                        setBrushSize(parseInt(e.target.value, 10))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={"selectTool "} onClick={() => UpscaleBG()}>
              <Label>Upscale</Label>
              <div>
                <p>Upscale image up to 2k resolution</p>
              </div>
            </div>

            <div
              className={"selectTool"}
              onClick={() => {
                HandelBG();
              }}
            >
              <Label>Remove Background</Label>
              <div>
                <p>Remove the background of your image in one click</p>
              </div>
            </div>
            <div
              className={crop ? "selectTool activeTool" : "selectTool"}
              onClick={() => {
                HandelCrop();
              }}
            >
              <Label>Crop Images</Label>
              <div>
                <p>Crop your image </p>
              </div>
            </div>
          </div>
        </div>

        <div className="gaps">
          <div className="rowwothtwo">
            <Label>Select image file formats</Label>
            <div className="two-side">
              <DropdownNOBorder
                data={{
                  list: ImgFormate,
                  action: setDownloadeImgFormate,
                  activeTab: downloadeImgFormate,
                }}
              ></DropdownNOBorder>
            </div>
          </div>
        </div>

        <Row>
          <Button
            disabled={previewLoader === true ? true : false}
            onClick={() => handleDownload()}
          >
            Download
          </Button>
        </Row>
      </WrapperEdit>
    </motion.div>
  );
};

export default Edit3d;

const WrapperEdit = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  .gaps {
    margin-bottom: 10px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .modeBtns {
    display: flex;
    width: 100%;
    border: 1px solid rgba(249, 208, 13, 1);
    border-radius: 6px;
    justify-content: space-between;
  }
  .btn {
    width: 100%;
    padding: 5px;
    cursor: pointer;

    text-align: center;
  }
  .btnq {
    width: 100%;
    padding: 5px;
    cursor: pointer;

    text-align: center;
    &:hover {
      background: #f9d20d3f;
    }
  }

  .activBtn {
    background: rgba(249, 208, 13, 1);
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .actives {
    background-color: #f8d62bfe !important;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input[type="range"] {
    height: 20px;
    -webkit-appearance: none;
    /* margin: 10px 0; */
    width: 100%;
    background: #fff;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    /* box-shadow: 0px 0px 0px #000000; */
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-webkit-slider-thumb {
    /* box-shadow: 0px 0px 0px #000000; */
    border: 1px solid rgba(249, 208, 13, 1);
    height: 15px;
    width: 15px;
    border-radius: 25px;
    background: #dac149;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -6px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: rgba(249, 208, 13, 1);
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid rgba(249, 208, 13, 1);
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: rgba(249, 208, 13, 1);
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: rgba(249, 208, 13, 1);
    border: 0px solid #000000;
    border-radius: 2px;
    /* box-shadow: 0px 0px 0px #000000; */
  }
  input[type="range"]::-ms-fill-upper {
    background: rgba(249, 208, 13, 1);
    border: 0px solid #000000;
    border-radius: 2px;
    /* box-shadow: 0px 0px 0px #000000; */
  }
  input[type="range"]::-ms-thumb {
    margin-top: 1px;
    /* box-shadow: 0px 0px 0px #000000; */
    border: 1px solid rgba(249, 208, 13, 1);
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: rgba(249, 208, 13, 1);
    cursor: pointer;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: rgba(249, 208, 13, 1);
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: rgba(249, 208, 13, 1);
  }
`;
