/// <reference no-default-lib="true"/>

import { useAppState } from "@/context/app.context";
import assets from "@/public/assets";
import Image from "next/image";
import React, { useState } from "react";
import { styled } from "styled-components";

const BottomTab = () => {
  const {
    canvasInstance,

    modifidImageArray,
    setModifidImageArray,
    setSelectedImg,
    currentStep,
    setCurrentStep,
    canvasHistoryRef,
    canvasHistory,
    currentCanvasIndex,
    zoom,
    loader,
    setZoomCanvas,
  } = useAppState();

  const handileUndo = () => {
    if (!loader) {
      if (currentCanvasIndex.current > 0) {
        currentCanvasIndex.current--;
        canvasInstance.current.loadFromJSON(
          canvasHistory.current[currentCanvasIndex.current]
        );
        canvasInstance.current.renderAll();
      }
    }
  };
  const handilePre = () => {
    if (!loader) {
      if (currentCanvasIndex.current < canvasHistory.current.length - 1) {
        currentCanvasIndex.current++;
        canvasInstance.current.loadFromJSON(
          canvasHistory.current[currentCanvasIndex.current]
        );
        canvasInstance.current.renderAll();
      }
    }
  };
  const handileCleav = () => {
    if (!loader) {
      canvasInstance.current.clear();
      canvasHistory.current = []; // Clear the canvasHistory array
      currentCanvasIndex.current = -1; // Reset the current index
      canvasInstance.current.clear(); // Clear the canvas content

    }
  };

  return (
    <BottomTabWtapper>
      <div className="bottomTab">
        <div className="right">
          <div className="clare" onClick={handileCleav}>
            <Image src={assets.icons.clean} width={20} height={20} alt="" />
          </div>
        </div>
      </div>
    </BottomTabWtapper>
  );
};

const BottomTabWtapper = styled.div`
  position: absolute;
  top: 75px;
  right: 0;
  display: flex;
  justify-content: start;
  align-items: center;
  height: 50px;
  width: max-content;
  padding: 0 30px;
  z-index: 100;

  .serch {
    width: 20px;
    height: 20px;
  }
  .left {
    display: flex;
    justify-content: start;
    align-items: center;
    width: 100%;

    .zoom {
      display: flex;
      gap: 10px;

      svg {
        cursor: pointer;
      }
    }
  }

  .bottomTab {
    width: 100%;
    display: flex;
  }
  .right {
    width: 100%;

    display: flex;
    gap: 20px;
    justify-content: end;

    svg {
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        transform: scale(1.2);
      }
    }
  }
  .undo {
  }
  .clare {
    cursor: pointer;
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

export default BottomTab;
