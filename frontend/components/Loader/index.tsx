// @ts-nocheck


import React from "react";
import { styled } from "styled-components";

const Loader = ({h}) => {
  return (
    <DaoderWarpper h={h}>
      <div className="jumping-dots-loader">
        {" "}
        <span></span> <span></span> <span></span>{" "}
      </div>
      <div className="moving-gradient"></div>
    </DaoderWarpper>
  );
};

export default Loader;

const DaoderWarpper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: ${({h})=> h? "100%": "100vh"};
  position: absolute;
  z-index: 1000;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  .loader-demo-box {
    border-radius: 0.25rem !important;
  }

  .loader-demo-box {
    width: 100%;
    height: 200px;
  }

  .jumping-dots-loader {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    position: relative;
    margin: 0 auto;
  }

  .jumping-dots-loader span {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background-color: #f9d00d;
    margin: 35px 5px;
  }

  .jumping-dots-loader span:nth-child(1) {
    animation: bounce 1s ease-in-out infinite;
  }

  .jumping-dots-loader span:nth-child(2) {
    animation: bounce 1s ease-in-out 0.33s infinite;
  }

  .jumping-dots-loader span:nth-child(3) {
    animation: bounce 1s ease-in-out 0.66s infinite;
  }

  @keyframes bounce {
    0%,
    75%,
    100% {
      -webkit-transform: translateY(0);
      -ms-transform: translateY(0);
      -o-transform: translateY(0);
      transform: translateY(0);
    }

    25% {
      -webkit-transform: translateY(-20px);
      -ms-transform: translateY(-20px);
      -o-transform: translateY(-20px);
      transform: translateY(-20px);
    }
  }
`;
