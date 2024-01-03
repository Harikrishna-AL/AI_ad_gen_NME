// @ts-nocheck

import React from "react";
import { styled } from "styled-components";
import {
  useState,
} from "react";
import Button from "../common/Button";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Line,
} from "react-konva";
import useImage from "use-image";
import { useAppState } from "@/context/app.context";
import { saveAs } from "file-saver";

const PopupCanvas = () => {

  const {
    setIsMagic,
    downloadImg,
    brushSize,
    linesHistory,
    setLinesHistory,
    lines,
    setLines,
    mode,
    stageRef,
    TDMode,
    downloadeImgFormate,
    addimgToCanvasSubject,
    canvasInstance,
  } = useAppState();

  const [containerWidth, setImageWidth] = useState(350);
  const [containerHeight, setImageHeight] = useState(350);
  const [drawing, setDrawing] = useState(false);

  const [img, status] = useImage(downloadImg, "Anonymous");

  const imageWidths = img ? img.width : 0;
  const imageHeights = img ? img.height : 0;
  let scales = 1;

  if (imageWidths > containerWidth || imageHeights > containerHeight) {
    const widthScale = containerWidth / imageWidths;
    const heightScale = containerHeight / imageHeights;
    scales = Math.min(widthScale, heightScale);
  }



  const scaledWidth = imageWidths * scales;
  const scaledHeight = imageHeights * scales;

  const handleMouseDown = () => {
    setDrawing(true);
    const pos = stageRef.current.getPointerPosition();
    setLinesHistory([...linesHistory, lines]);

    setLines([
      ...lines,
      { mode, points: [pos.x, pos.y], brushSize: brushSize },
    ]);
  };
  const handleMouseMove = (e) => {
    if (!drawing) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    if (lastLine) {
      lastLine.points = [...lastLine.points, point.x, point.y];
      setLines([...lines.slice(0, -1), lastLine]);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };



  const closeHanddler = () => {
    setLinesHistory([]);
    setLines([]);
    setIsMagic(false);
  };

  const saveImage = () => {
    const stage = stageRef?.current;
    const dataURL = stage.toDataURL();
    DeletIrem();
    addimgToCanvasSubject(dataURL);
    setLinesHistory([]);
    setLines([]);
    setIsMagic(false);
  };
  const downloadH = () => {
    const stage = stageRef.current;
    const dataURL = stage.toDataURL();
    saveAs(dataURL, `image${Date.now()}.${downloadeImgFormate}`);

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
      <div className="rr">
        <div className="tgrideOne">
          <div className="clo" onClick={() => closeHanddler()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 30 30"
            >
              <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
            </svg>
          </div>

          <div style={{ margin: "20px" }}>

            <Stage
              width={containerWidth}
              height={containerHeight}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              ref={stageRef}
            >
              <Layer>
                <KonvaImage
                  image={img}
                  x={(containerWidth - scaledWidth) / 2}
                  y={(containerHeight - scaledHeight) / 2}
                  width={scaledWidth}
                  height={scaledHeight}
                />

                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.mode !== "pen" ? "white" : "white"}
                    strokeWidth={line.brushSize}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation={
                      line.mode === "pen" ? "destination-out" : "source-over"
                    }
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
        <div className="bvtns">
          {TDMode ? (
            <Button onClick={() => downloadH()}>Download</Button>
          ) : (
            <Button onClick={() => saveImage()}>Done</Button>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default PopupCanvas;
const Wrapper = styled.div`
  .bvtns {
    display: flex;
    margin-top: 20px;
  }
  .rr {
    position: absolute;
    top: 110px;
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
  background-color: #fff;
  .tgrideOne {
    position: relative !important;

    display: grid;
    grid-template-columns: 1fr;

    background: rgba(249, 208, 13, 0.23);

    .magicPrevie {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 500px;
      width: 100%;

      canvas {
        z-index: 30000;
      }
    }
  }
  .tools {
    display: flex;
    gap: 10px;
    justify-content: start;
    align-items: center;
    .btn {
      padding: 10px 30px !important;
      background: transparent;
      border: 1px solid ${({ theme }) => theme.btnPrimary};
      font-weight: 500;
    }
    .button {
      padding: 10px 80px !important;
      width: max-content;
    }
    input[type="range"] {
      /* overflow: hidden; */
      width: 250px;
      height: 15px;
      -webkit-appearance: none;
      background-color: ${({ theme }) => theme.btnPrimary};
      border-radius: 12px;
    }

    input[type="range"]::-webkit-slider-runnable-track {
      height: 20px;
      -webkit-appearance: none;
      color: #13bba4;
      margin-top: -10px;
    }

    input[type="range"]::-webkit-slider-thumb {
      width: 30px;
      -webkit-appearance: none;
      height: 30px;
      border-radius: 50%;
      cursor: ew-resize;
      background: #434343;
    }
    input {
      /* color: ; */
    }
    .activeTool {
      background: ${({ theme }) => theme.btnPrimary};
    }
  }
  .clo {
    position: absolute;
    right: -20px;
    top: -20px;
    font-size: 28px;
    cursor: pointer;
    svg {
      width: 20px;
    }
  }
`;
