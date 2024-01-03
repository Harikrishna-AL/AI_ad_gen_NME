
// @ts-nocheck

import React from "react";
import { styled } from "styled-components";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";

const PopupCardGenerate = () => {
  const { popupImage, setPopupImage ,handleDownload} = useAppState();

  return (
    // <motion.div initial="hidden" animate="visible" variants={fadeIn}>

    <PopupWrapper2>
      <div className="wrapper">
        <div className="close" onClick={()=> setPopupImage({statu: false})}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 30 30"
          >
            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
          </svg>
        </div>
        <picture>
          <img
            src={popupImage?.url}
            alt="image"
          />
        </picture>
        <div className="btns">
          
          <Button onClick={()=> handleDownload(popupImage?.url)}>{popupImage.btn} </Button>
        </div>
      </div>
    </PopupWrapper2>
    // </motion.div>

  );
};

export default PopupCardGenerate;

const PopupWrapper2 = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background-color: #c9c5c59f;
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    svg {
      width: 18px;
    }
  }
  .wrapper {
    position: relative;
    width: 700px !important;
    width: 500px !important;
    border: 2px solid #d9d9d9;
    border-radius: 8px !important;
    padding: 40px;
    padding-top: 50px;
    background-color: #fffefe;

    img {
      /* width: 450px; */
      height: 300px;
      margin: auto;
      margin-bottom: 30px;
      border-radius: 8px !important;
    }
    .test {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }
`;
