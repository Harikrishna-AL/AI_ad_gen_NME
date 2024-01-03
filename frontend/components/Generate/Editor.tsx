// @ts-nocheck

import React from "react";
import { Row } from "../common/Row";

import Label from "../common/Label";

import "react-range-slider-input/dist/style.css";

import { useAppState } from "@/context/app.context";
import { styled } from "styled-components";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

import { motion } from "framer-motion";


const EditorSection = () => {
  const {
    selectResult,
    setSelectedresult,
    activeSize,
    setActiveSize,

    changeRectangleSize,
    loader,
  } = useAppState();

  const sizeList = [
    {
      id: 1,
      title: "Default",
      subTittle: "512X512",
      h: 512,
      w: 512,
      l: 50,
      t: 170,
      gl: 592,
      gt: 170,
      
    },
    {
      id: 2,
      title: "Instagram Post",
      subTittle: "560✕560",
      h: 560,
      w: 560,
      l: 50,
      t: 170,
      gl: 640,
      gt: 170,
    },
    {
      id: 3,
      title: "Instagram Story",
      subTittle: "560✕720",
      h: 720,
      w: 560,
      l: 50,
      t: 170,
      gl: 640,
      gt: 170,
    },
    {
      id: 4,
      title: "Facebook Post",
      subTittle: "440✕520",
      h: 520,
      w: 440,
      l: 50,
      t: 170,
      gl: 520,
      gt: 170,
    },
    {
      id: 5,
      title: "16:9",
      subTittle: "712✕560",
      h: 560,
      w: 712,
      l: 50,
      t: 170,
      gl: 792,
      gt: 170,
    },
    {
      id: 6,
      title: "9:16",
      subTittle: "520✕720",
      h: 720,
      w: 520,
      l: 50,
      t: 170,
      gl: 600,
      gt: 170,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
      <BoxOff className="boxof">
        {loader ? <div className="dis"></div> : null}
        <div className="gaps">
          <div className="two">
            <Label>No. of images to generate</Label>
            <div className="rangeValue">
              <Label> {selectResult}</Label>
            </div>
          </div>
          <div className="rangebox">
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={selectResult}
              onChange={(e) => setSelectedresult(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
        <div className="gap">
          <Label>Canvas size</Label>

          <div className="sixBox">
            {sizeList?.map((item, i) => (
              <div
                key={i}
                className={`items ${
                  activeSize?.id === item.id ? "actives" : ""
                }`}
                onClick={() => {
                  setActiveSize(item);
                  changeRectangleSize();
                }}
              >
                <div className="tittl">{item.title}</div>
               
                  <div className="sub">{item.subTittle}</div>
               
              </div>
            ))}
          </div>
        </div>
      </BoxOff>
    </motion.div>
  );
};

export default EditorSection;
export const BoxOff = styled.div`
  position: relative;
  .dis {
    background: transparent !important;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .gaps {
    margin-top: 20px;
  }
  .two {
    display: flex;
    justify-content: space-between;
  }
  .rangeValue {
    background: rgba(249, 208, 13, 1);
    padding: 5px 12px;
    border-radius: 5px;
  }
  .sixBox {
    border: 1px solid #d9d9d9;
    border-radius: 6px;

    .items {
      border-bottom: 1px solid #d9d9d9;
      padding: 10px;
      font-size: 16px;
      transition: all 0.3s ease-in-out;
      display: flex;
      justify-content: space-between;
      /* align-items: center; */
      .sub {
        opacity: 0;
        transition: all 0.5s ease-in-out;
        color: #7a7979;
      }

      &:hover {
        background-color: rgba(249, 208, 13, 0.23);

        .sub {
          opacity: 1;
        }
      }

      .tittl {
        font-weight: 500;
      }
      .input {
        display: flex;
        gap: 5px;

        input {
          width: 60px;
          background-color: #fff;
          color: #7a7979;
          padding: 0 5px;
          border: 1px solid #d9d9d9;
          &:hover {
            border: 1px solid #d9d9d9;
          }
          &:focus-visible {
            border: 1px solid #d9d9d9;
          }
        }
      }
    }
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
    overflow: hidden;
    width: 100%;
    accent-color: rgba(249, 208, 13, 1);
    /* -webkit-appearance: none; */
    background-color: #9a905d;
    outline: none;
    border: none;
  }

  input[type="range"]:focus {
    outline: none;
    border: none;
  }
`;
export const ResponsiveRowWraptwo = styled(Row)`
  display: grid !important;
  gap: 1rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(2, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(2, 1fr);
   `}
`;
