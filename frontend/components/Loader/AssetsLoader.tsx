
// @ts-nocheck

import React, { useEffect } from "react";
import { styled } from "styled-components";
import $ from "jquery";
import Button from "../common/Button";
export const AssetsLoader = () => {
  const isLast = (word) => {
    return $(word).next().length > 0 ? false : true;
  };

  const getNext = (word) => {
    return $(word).next();
  };

  const getVisible = () => {
    return document.getElementsByClassName("is-visible");
  };

  const getFirst = () => {
    const node = $(".words-wrapper").children().first();
    return node;
  };

  const switchWords = (current, next) => {
    $(current).removeClass("is-visible").addClass("is-hidden");
    $(next).removeClass("is-hidden").addClass("is-visible");
  };

  const getStarted = () => {
    // We start by getting the visible element and its sibling
    const first = getVisible();
    const next = getNext(first);

    // If our element has a sibling, it's not the last of the list. We switch the classes
    if (next.length !== 0) {
      switchWords(first, next);
    } else {
      // The element is the last of the list. We remove the visible class of the current element
      $(first).removeClass("is-visible").addClass("is-hidden");

      // And we get the first element of the list, and we give it the visible class. And it starts again.
      const newEl = getFirst();
      $(newEl).removeClass("is-hidden").addClass("is-visible");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(getStarted, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <LoaderWrapper>
      <label
        className="createbox"

      >
        <DaoderWarpper>
      <div className="jumping-dots-loader">
        {" "}
        <span></span> <span></span> <span></span>{" "}
      </div>
      <div className="moving-gradient"></div>
    </DaoderWarpper>
        <div className="testcreat">
        <div className="text">
        <div>
          <span className="words-wrapper">
            <b className="is-visible">Uploading...</b>
            {/* <b>Removing background...</b> */}

            {/* <b>Refreshing objects...</b>
            <b>Refredsfsdfdsfsdfshing objects...</b> */}
          </span>
        </div>
      </div>
        </div>
      </label>
     

      
    </LoaderWrapper>
  );
};

const LoaderWrapper = styled.div`
  @-webkit-keyframes Gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @-moz-keyframes Gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes Gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .text {
    position: relative;
    /* top: 26%; */
    left: 0;
    color: rgb(0, 0, 0);

    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  h1 {
    text-align: center;
  }

  .words-wrapper {
    display: inline-block;
    position: relative;
    text-align: center;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    b {
      opacity: 0;
      display: inline-block;
      position: absolute;
      white-space: nowrap;
      left: 0;
      top: 0;

      font-weight: 400;

      font-size: 13px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .is-visible {
      position: relative;
      opacity: 1;
      -webkit-animation: push-in 0.5s;
      -moz-animation: push-in 0.5s;
      animation: push-in 0.5s;
    }

    .is-hidden {
      -webkit-animation: push-out 0.5s;
      -moz-animation: push-out 0.5s;
      animation: push-out 0.5s;
    }
  }

  @-webkit-keyframes push-in {
    0% {
      opacity: 0;
      -webkit-transform: translateY(-100%);
    }
    70% {
      opacity: 1;
      -webkit-transform: translateY(10%);
    }
    100% {
      opacity: 1;
      -webkit-transform: translateY(0);
    }
  }
  @-moz-keyframes push-in {
    0% {
      opacity: 0;
      -moz-transform: translateY(-100%);
    }
    60% {
      opacity: 1;
      -moz-transform: translateY(10%);
    }
    100% {
      opacity: 1;
      -moz-transform: translateY(0);
    }
  }
  @keyframes push-in {
    0% {
      opacity: 0;
      -webkit-transform: translateY(-100%);
      -moz-transform: translateXY(-100%);
      -ms-transform: translateY(-100%);
      -o-transform: translateY(-100%);
      transform: translateY(-100%);
    }
    60% {
      opacity: 1;
      -webkit-transform: translateY(10%);
      -moz-transform: translateY(10%);
      -ms-transform: translateY(10%);
      -o-transform: translateY(10%);
      transform: translateY(10%);
    }
    100% {
      opacity: 1;
      -webkit-transform: translateY(0);
      -moz-transform: translateY(0);
      -ms-transform: translateY(0);
      -o-transform: translateY(0);
      transform: translateY(0);
    }
  }
  @-webkit-keyframes push-out {
    0% {
      opacity: 1;
      -webkit-transform: translateY(0);
    }
    60% {
      opacity: 0;
      -webkit-transform: translateY(110%);
    }
    100% {
      opacity: 0;
      -webkit-transform: translateY(100%);
    }
  }
  @-moz-keyframes push-out {
    0% {
      opacity: 1;
      -moz-transform: translateY(0);
    }
    60% {
      opacity: 0;
      -moz-transform: translateY(110%);
    }
    100% {
      opacity: 0;
      -moz-transform: translateY(100%);
    }
  }
  @keyframes push-out {
    0% {
      opacity: 1;
      -webkit-transform: translateY(0);
      -moz-transform: translateY(0);
      -ms-transform: translateY(0);
      -o-transform: translateY(0);
      transform: translateY(0);
    }
    60% {
      opacity: 0;
      -webkit-transform: translateX(110%);
      -moz-transform: translateY(110%);
      -ms-transform: translateY(110%);
      -o-transform: translateY(110%);
      transform: translateY(110%);
    }
    100% {
      opacity: 0;
      -webkit-transform: translateY(100%);
      -moz-transform: translateY(100%);
      -ms-transform: translateY(100%);
      -o-transform: translateY(100%);
      transform: translateY(100%);
    }
  }
`;

const DaoderWarpper = styled.div`
display: flex;
justify-content: center;
  /* position: absolute; */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* position: absolute; */
  /* z-index: 100000; */
  /* background-color: #ffffff; */
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
    /* width: 100px; */
    /* height: 100px; */
    border-radius: 100%;
    position: relative;
    margin: 0 auto;
  }

  .jumping-dots-loader span {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    background-color: #f9d00d;
    margin: 35px 3px;
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

