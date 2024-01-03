// @ts-nocheck

import React, { useEffect, useRef } from "react";
import Label, { DisabledLabel } from "../common/Label";
import { Row } from "../common/Row";
import { DropdownNOBorder } from "../common/Dropdown";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import { ImgFormate } from "@/data/dropdown";
import { useRouter } from "next/router";
import { styled } from "styled-components";
import { toast } from "react-toastify";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const Edit = () => {
  const {
    previewLoader,
    downloadImg,
    canvasInstance,
    addimgToCanvasGen,
    addimgToCanvasSubject,
    isMagic,
    setIsMagic,
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
    setLinesHistory,
    setLines,
    crop,
    setCrop,
    loader,
    userId,
    regenratingId,
  } = useAppState();

  const { query, isReady } = useRouter();
  const id = (query.id as string[]) || [];

  const handleDownload = () => {
    if (downloadImg) {
      const url = downloadImg;
      saveAs(url, `image${Date.now()}.${downloadeImgFormate}`);
    }
  };

  const HandelBG = async () => {
    setIsMagic(false);

    setLoader(true);
    try {
      const response = await fetch("/api/removebg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataUrl: downloadImg,
          user_id: userId,
          project_id: id,
          add_to_db: false
        }),
      });
      const data = await response.json();
      if (data) {
   
        addimgToCanvasSubject(data?.imageUrl);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("BG remove failed");

    }

    setLoader(false);
  };

  const upSacle = async (photo: string, filename: string): Promise<string> => {
    try {
      const response = await fetch("/api/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: regenratingId,
          user_id: userId,
          project_id: id,
        }),
      });

      const data = await response.json();

      if (data) {
        addimgToCanvasGen(data.image_url);
        setSelectedImg({ status: true, image: data.image_url });
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);

      toast.error("Sorry, you can only upscale originally generated images");
    }
  };

  const UpscaleBG = async () => {
    setIsMagic(false);
    setLoader(true);
    const data = await upSacle(downloadImg, "imger");
  };

  const history = useRef([]);
  const historyIndex = useRef(-1);
  useEffect(() => {
    canvasInstance.current.on("object:added", () => {
      history.current.push(JSON.stringify(canvasInstance.current.toJSON()));
      historyIndex.current += 1;
    });
  }, [canvasInstance]);

  const HandelCrop = () => {
    setCrop(true);
    setIsMagic(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={downloadImg && !loader ? "accest" : "accest blure"}
      style={{ paddingBottom: "50px" }}
    >
      <AllWrapper>
        <WrapperEdit>
          <div className="gaps">
            <Label>Arrange</Label>
            <div className="selectbox">
              <div className={"selectone"} onClick={() => bringImageToFront()}>
                Bring to Front
              </div>
              <div className={"selectone"} onClick={() => sendImageToBack()}>
                Send to back
              </div>
            </div>
          </div>

          <div className="gap">
            <Label>Tools</Label>

            <div className="gaps">
              <div
                className={isMagic ? "selectTool activeTool" : "selectTool"}
                onClick={() => {
                  setIsMagic(true);
                  setCrop(false);
                }}
              >
                <div className="mageic">
                  <div className="gaps">
                    <Label>Erase</Label>
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
                        className={`btnq ${
                          mode === "eraser" ? "activBtn" : ""
                        }`}
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
      </AllWrapper>
    </motion.div>
  );
};

export default Edit;
export const AllWrapper = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;
const WrapperEdit = styled.div`
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
    &:hover {
    }
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
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-webkit-slider-thumb {
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
