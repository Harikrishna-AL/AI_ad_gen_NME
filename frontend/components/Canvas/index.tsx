// use client
/// <reference no-default-lib="true"/>
import React, { useRef, useState } from "react";
import { useAppState } from "@/context/app.context";
import { useEffect, useLayoutEffect, useCallback } from "react";
import { fabric } from "fabric";
import { styled } from "styled-components";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "../Loader";
import { setInterval } from "timers";
import { saveAs } from "file-saver";
import PopupCanvas from "./MagicPopupCanvas";
import CropperBox from "./Cropper";

export default function CanvasBox({
  proid,
  userId,
}: {
  proid: any;
  userId: string;
}) {
  const { query, isReady } = useRouter();
  const router = useRouter();

  const id = (query.id as string[]) || [];
  const {
    setSelectedImg,
    canvasInstance,
    getBase64FromUrl,
    activeTab,
    setActiveTab,

    downloadImg,
    setDownloadImg,
    RegenerateImageHandeler,

    isMagic,
    setEditorBox,
    bringImageToFront,
    sendImageToBack,
    PosisionbtnRef,
    regenerateRef,
    setRegeneratePopup,
    previewBox,
    canvasHistory,
    currentCanvasIndex,
    generateBox,
    GetProjexts,
    SaveProjexts,
    project,
    loadercarna,
    setloadercarna,
    saveCanvasToDatabase,
    setRegenratedImgsJobid,
    positionBtn,
    newEditorBox,
    imageGenRect,
    zoom,
    setZoomCanvas,
    activeSize,
    downloadeImgFormate,
    setActiveSize,
    crop,
    setCrop,
    canvasDisable,
    setCanvasDisable,
    loader,
    setregeneraatingId,
  } = useAppState();

  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  /* eslint-disable */

  useEffect(() => {
    canvasInstance.current = new fabric.Canvas(canvasRef?.current, {
      width: window.innerWidth,
      height: window.innerHeight + 30,
      preserveObjectStacking: true,
    });

    const canvasInstanceRef = canvasInstance.current;
    if (canvasInstanceRef) {
      var zoomLevel = zoom;

      canvasInstanceRef.setZoom(zoom);
      // Resize canvas when the window is resized
      window.addEventListener("resize", () => {
        canvasInstanceRef?.setDimensions({
          width: window?.innerWidth,
          height: window?.innerHeight + 30,
        });
      });
    }

    setTimeout(() => {
      setStar(true);
    }, 1000);

    return () => {
      saveCanvasToDatabase();
      setTimeout(() => {
        canvasInstanceRef?.dispose();
      }, 500);
    };
  }, [isReady, canvasInstance]);


  const [state, setStar] = useState(false);

  useEffect(() => {
    if (canvasInstance?.current && state && isReady) {
      const canvasInstanceRef = canvasInstance?.current;
      const btn = PosisionbtnRef.current;
      const rebtn = regenerateRef.current;
      const preBox = previewBox.current;

      canvasInstance?.current.renderAll();

      // When a user clicks on an image on the canvas
      canvasInstanceRef.on("mouse:down", function (options) {
        if (options.target && options.target.type === "image") {
          let selectedObject;
          if (options.target._element instanceof Image) {
            const img = new Image();
            img.src = options.target._element.src;
            // Resize the image to 712x712 pixels
            const canvas = document.createElement("canvas");
            let containerWidth = 712;
            let containerHeight = 712;

            const imageWidths = img ? img.width : 0;
            const imageHeights = img ? img.height : 0;
            let scales = 1;

            if (
              imageWidths > containerWidth ||
              imageHeights > containerHeight
            ) {
              const widthScale = containerWidth / imageWidths;
              const heightScale = containerHeight / imageHeights;
              scales = Math.min(widthScale, heightScale);
            }
            const scaledWidth = imageWidths * scales;
            const scaledHeight = imageHeights * scales;

            canvas.width = scaledWidth;
            canvas.height = scaledHeight ;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

            // Convert the canvas to a data URL
            selectedObject = canvas.toDataURL("image/png");
          } else if (options.target._element instanceof HTMLCanvasElement) {
            selectedObject = options.target._element.toDataURL();
          }

          if (selectedObject) {
            if (options.target.id) {
              setregeneraatingId(options.target.id);
            }
            setDownloadImg(selectedObject);
          
          }
        }
      });

      // Create the newEditorBox when the component mounts
      const EditorBoxText = new fabric.Text("Place Your Product Here", {
        left: newEditorBox.left + 20, 
        top: newEditorBox.top + 20, 
        fontSize: 24,
        selectable: false,
        excludeFromExport: true,
        fill: "rgba(0, 0, 0, 1)",
      });
      canvasInstanceRef.add(EditorBoxText);

      const imageGenText = new fabric.Text("Generated image will appear here", {
        left: 450 + 20,
        top: 200 + 20,
        fontSize: 16,
        // originX: "center",
        // originY: "center",
        selectable: false, // Make it non-selectable
        evented: false, // Make it non-selectable
        hasControls: false,
        fill: "rgba(0, 0, 0, 1)",
      });

      const objects = canvasInstanceRef.getObjects();

      objects.forEach((object) => {
        // If the object is a mask, add it to the mask objects array
        if (object.category === "mask") {
          positionBtn(object);
        }
        // If the object is a subject, add it to the subject objects array
        if (object.category === "subject") {
          // subjectObjects.push(object);
          positionBtn(object);
        }
      });

      canvasInstanceRef.on("object:moving", function (event) {
        const movedObject = event.target;
        const e = event.e;
        if (movedObject.category === "subject") {
          if (
            e.layerX >= newEditorBox.left &&
            e.layerX <= newEditorBox.left + newEditorBox.width &&
            e.layerY >= newEditorBox.top &&
            e.layerY <= newEditorBox.top + newEditorBox.height
          ) {
            // Remove the EditorBoxText if the image is inside the newEditorBox
            canvasInstanceRef.remove(EditorBoxText).renderAll();
          }
        }
      });

      canvasInstanceRef.on("object:selected", function (event) {
   
        const selectedObject = event.target;
        if (selectedObject === newEditorBox) {
          // Hide the border by setting stroke to transparent
          selectedObject.set("stroke", "transparent");
          selectedObject.set("strokeWidth", 0);
          canvasInstanceRef.renderAll();
        }
      });

      canvasInstanceRef.on("selection:created", (e) => {
        var selectedObjects = e.target;
        btn.style.display = "flex";
      });

      canvasInstanceRef.on("selection:cleared", function (e) {
        var selectedObjects = e.target;
        btn.style.display = "none";
        rebtn.style.display = "none";
        setDownloadImg(null);
        if (activeTab === 5) {
          setActiveTab(1);
        }
      });

      document.addEventListener("keydown", (e) => {
        // Check if the pressed key is 'Delete' (code: 46) or 'Backspace' (code: 8) for wider compatibility
        if (e.keyCode === 46 || e.keyCode === 8) {
          // Check if the focus is NOT on an input or textarea
          if (
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA"
          ) {
            const activeObject = canvasInstanceRef?.getActiveObject();
            if (activeObject) {
              canvasInstanceRef?.remove(activeObject);
              canvasInstanceRef?.renderAll();
            }
          }
        }
      });
    }

  }, [canvasInstance.current, state, activeSize]);

  const DeletIrem = () => {
    const activeObject = canvasInstance?.current?.getActiveObject();
    if (activeObject) {
      canvasInstance?.current?.remove(activeObject);
      canvasInstance?.current?.renderAll();
    }
  };

  useEffect(() => {
    if (canvasInstance?.current && loadercarna) {
      const canvasInstanceRef = canvasInstance?.current;

      fabric.Object.prototype.transparentCorners = false;

      var zoomLevel = zoom;

      canvasInstanceRef.setZoom(zoom);
      var zooms = canvasInstanceRef.getZoom();



      // Set the zooming point (x, y) coordinates
      var zoomPointX = 100; // X-coordinate of the zooming point
      var zoomPointY = 100; // Y-coordinate of the zooming point

      // Calculate the zoom origin based on the zooming point
      var zoomOriginX = canvasInstanceRef.width / 2 - zoomPointX * zoom;
      var zoomOriginY = canvasInstanceRef.height / 2 - zoomPointY * zoom;

      // Set the zoom origin
      canvasInstanceRef.zoomToPoint(
        new fabric.Point(zoomOriginX, zoomOriginY),
        zoom
      );

      fabric.Canvas.prototype.getAbsoluteCoords = function (object) {
        return {
          left: object.left * zoom,
          top: object.top * zoom,
        };
      };
      setZoomCanvas(zooms);
    }
  }, [canvasInstance.current]);



  useEffect(() => {
    // Fetch canvas data from your API and load it into the canvas
    const canvasInstanceRef = canvasInstance?.current;
    setloadercarna(true);
    if (isReady && userId) {
 
      axios
        .get(`/api/project?user_id=${userId}&project_id=${proid}`)
        .then((response) => {

          if (canvasInstanceRef) {
            canvasInstanceRef.loadFromJSON(
              response?.data[0].canvasHistory,
              canvasInstanceRef.renderAll.bind(canvasInstanceRef),
              function (o, object) {
          
              }
            );
            setloadercarna(false);

          }
        })
        .catch((error) => {
          console.error(error);
          setloadercarna(false);
          return error;
        });
  
    }
  }, [isReady, userId]);

  useEffect(() => {
    return () => {
      return () => {
        router.events.off("routeChangeStart", saveCanvasToDatabase);
        saveCanvasToDatabase();
      };
    };
  }, []);

  const generationBoxStyle = {
    
    left: `${activeSize?.l * zoom}px`,
    top: `${activeSize?.t * zoom}px`,
    width: `${activeSize?.w * zoom}px`, // Adjust the width based on canvas zoom
    height: `${activeSize?.h * zoom}px`, // Adjust the height based on canvas zoom
    
  };
  const PreviewBoxStyle = {
    left: `${activeSize.gl * zoom}px`,
    top: `${activeSize.gt * zoom}px`,
    width: `${activeSize.w * zoom}px`, // Adjust the width based on canvas zoom
    height: `${activeSize.h * zoom}px`, // Adjust the height based on canvas zoom
    backgroundColor: "rgba(249, 208, 13, 0.23)",
  };

  const handelRegenrate = () => {
    if (downloadImg !== null) {
      RegenerateImageHandeler(userId, proid, downloadImg);
      setRegenratedImgsJobid([]);
      setTimeout(() => {
        setRegeneratePopup({ status: true, url: downloadImg });
      
      }, 500);
    }
  };

  const downlaedImf = () => {
    if (downloadImg) {
      const url = downloadImg;
      saveAs(url, `image${Date.now()}.${downloadeImgFormate}`);
    } 
  };

  return (
    <Wrapper canvasDisable={loader} activeSize ={activeSize} zoom>
      {loadercarna ? <Loader /> : null}
      {isMagic ? <PopupCanvas /> : null}
      {crop ? <CropperBox /> : null}
      {loader ? <div className="divovelay"></div> : null}

      <div className="convas-continer">
        <div className="generationBox">
          <div
            className="leftbox"
            ref={generateBox}
            style={generationBoxStyle}
          ></div>
          <div
            className="rightbox"
            ref={previewBox}
            style={PreviewBoxStyle}
          ></div>
        </div>
        <div id="inline-btn" ref={PosisionbtnRef}>
          <button className="selectone" onClick={() => bringImageToFront()}>
            Front
          </button>
          <button className="selectone" onClick={() => sendImageToBack()}>
            Back
          </button>
          <button className="selectone" onClick={() => DeletIrem()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="delet"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              ></path>
            </svg>
          </button>
          <button className="selectone" onClick={() => downlaedImf()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="delet"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          id="inline-btn"
          className="regenrat"
          ref={regenerateRef}
          style={{ display: "none" }}
          onClick={() => {
            handelRegenrate();
          }}
        >
          <button className="selectone yello">Regenerate Product</button>
        </div>

  
        <canvas ref={canvasRef} />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
.yello{
  width: 150px;
}
  .divovelay {
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  canvas {
    pointer-events: ${(props) => (props.canvasDisable ? "none" : "auto")};
  }
  .convas-continer {
    overflow: auto;
  }
  .delet {
    min-width: 20px;
    height: 20px;
  }
  .ss {
    position: absolute;
    bottom: 10px;
    left: 20px;
    z-index: 400;
    cursor: pointer;
    width: 25px;
    height: 25px;

    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.1);
    }
    img {
      width: 25px;
    }
  }
  .rightbox {
  }
  .leftbox,
  .rightbox {
    border: 1px solid rgba(249, 208, 13, 1);
    pointer-events: none;
    user-select: none;
    width: 100px;
    position: absolute;
  }
  .generationBox {
    margin-bottom: 30px;
    position: absolute;
    display: flex;
    gap: 20px;
    height:  ${(props) => (`${(props.activeSize.h *props.zoom )+ 30}px`)}
    /* height: {activeSize.h * zoom}; */
  }
  #inline-btn {
    position: absolute;
    z-index: 8;
    display: flex;
    justify-content: center;
  }
  .selectone {
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid rgba(249, 208, 13, 1);
    padding: 5px 8px;
    background: rgba(249, 208, 13, 1) !important;

    color: #000;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3 ease;
    margin-right: 3px;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }

`;
