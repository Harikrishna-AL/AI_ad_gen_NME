// @ts-nocheck


import React, { useState, useRef, useEffect } from "react";
import { Row } from "../common/Row";
import Label from "../common/Label";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";

const MagicEraser: React.FC = () => {
  const { viewMore, addimgToCanvas,canvasInstance } = useAppState();
  const [size, setsize] = useState(40);

  const [isEraseMode, setIsEraseMode] = useState(false);
  const history = useRef([]);
  const historyIndex = useRef(-1);
  useEffect(() => {
    canvasInstance.current.on("object:added", () => {
        history.current.push(JSON.stringify(canvasInstance.current.toJSON()));
        historyIndex.current += 1;
      });
  }, [size,canvasInstance])
  

  const toggleEraseMode = () => {
    setIsEraseMode(!isEraseMode);
    if (isEraseMode) {
      // code to enable eraser
      canvasInstance.current.isDrawingMode = true;
      canvasInstance.current.freeDrawingBrush.color = "#f8f8f8"; // Assuming background is white
      canvasInstance.current.freeDrawingBrush.width = size; // Set the width of the eraser
    } else {
      // code to disable eraser
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
    const objects = canvasInstance.current.getObjects();
    objects.forEach((object) => {
      if (object.type === "path") {
        // Assuming paths are used for free drawing and erasing
        canvasInstance.current.remove(object);
      }
    });
  };


  return (
    <div className="accest">
      <div className="gap">
        <div className="gap">
          <div className="selectbox">
            <div className={"selectone"} onClick={() => toggleEraseMode()}>
              Erase
            </div>
            <div className={"selectone"} onClick={() => undoAction()}>
              Undo
            </div>
            <div className={"selectone"} onClick={() => clearDrawing()}>
              Clear
            </div>
          </div>
        </div>
        <div className="gap">
          <Linreow className="rowlin">
            <Label>Brush Size</Label>

            <input
              type="number"
              className="inputN"
              name=""
              id=""
              value={size}
              onChange={(e) => setsize(e.target.value)}
            />
            <input
              type="range"
              value={size}
              onChange={(e) => setsize(e.target.value)}
            />
          </Linreow>
        </div>

        <ResponsiveRowWraptwo>
          {viewMore?.list?.map((test: string, i: number) => (
            <div
              key={i}
              className={"imageBox"}
              onClick={() => {
                addimgToCanvas(test);
              }}
            >
              <picture>
                <img src={test} alt="" />
              </picture>
            </div>
          ))}
        </ResponsiveRowWraptwo>
      </div>
    </div>
  );
};

export const ResponsiveRowWraptwo = styled(Row)`
  display: grid !important;
  gap: 0.5rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(3, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(3, 1fr);
   `}
`;
export const Linreow = styled.div`
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 20px;

  .inputN {
    width: 80px;
    padding: 5px 10px;
    border-radius: 4px;
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
    height: 25px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: rgba(249, 208, 13, 1);
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type="range"]::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid rgba(249, 208, 13, 1);
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: #dac149;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -7px;
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
    box-shadow: 0px 0px 0px #000000;
  }
  input[type="range"]::-ms-fill-upper {
    background: rgba(249, 208, 13, 1);
    border: 0px solid #000000;
    border-radius: 2px;
    box-shadow: 0px 0px 0px #000000;
  }
  input[type="range"]::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px #000000;
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

export default MagicEraser;
