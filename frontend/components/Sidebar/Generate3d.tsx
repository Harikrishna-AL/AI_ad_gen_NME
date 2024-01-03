// @ts-nocheck


import React, { useRef, useEffect, useState } from 'react';
import { styled } from "styled-components";
import Image from "next/image";
import assets from "@/public/assets";
import { useAppState } from "@/context/app.context";
import { motion } from "framer-motion";
import ListOf from "../List OfProduct";
import Assets3d from "../Assets/Assets3d";
import Edit3d from "../Edit/Edit3d";
import Generate3d from "../Generate/generate3d.tsx";
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const TabData = [
  {
    id: 1,
    image: assets.icons.assets_icon,

    tittle: "3D Assets",
  },
  {
    id: 2,

    image: assets.icons.generate_icon,
    tittle: "Generate",
  },

  {
    id: 3,

    image: assets.icons.edit_icon,
    tittle: "Edit",
    disable: assets.icons.edit_icon_diable,
  },
];

const Sidebar3d: React.FC = () => {

  const {
    activeTab,
    setActiveTab,
    viewMore,
    setViewMore,
    downloadImg,
    setIsMagic,
  } = useAppState();

  const outerDivRef = useRef(null);
  const innerDivRef = useRef(null);
  const [outerWidth, setOuterWidth] = useState(0);

  useEffect(() => {
    const outerDiv = outerDivRef.current;
    const innerDiv = innerDivRef.current;

    const updateWidth = () => {
      if (outerDiv && innerDiv) {
        // Get the width of the outer div
        const newOuterWidth = outerDiv.clientHeight;

        // Set the width of the inner div to match the outer div
        innerDiv.style.height = `${newOuterWidth}px`;

        // Update the state with the new outer width
        setOuterWidth(newOuterWidth);
      }
    };

    // Initial update
    updateWidth();

    // Add a resize event listener to update the width when the window is resized
    window.addEventListener('resize', updateWidth);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  });

  return (
    <SideBar ref={outerDivRef}>
      <motion.div className="new" ref={innerDivRef} >
        <div className="columWrapper" >
          {TabData.map((elemenmt, i) =>
            !downloadImg && elemenmt?.id === 5 ? (
              <div key={i} className={"tabBox disable"}>
                <Image src={elemenmt.disable} alt="" width={16} />
                <span>{elemenmt.tittle}</span>
              </div>
            ) : (
              <div
                key={i}
                className={
                  activeTab === elemenmt.id ? "active tabBox " : "tabBox"
                }
                onClick={() => {
                  setActiveTab(elemenmt.id);
                  setViewMore({ status: false });
                  setIsMagic(false);
                }}
              >
                <Image src={elemenmt.image} alt="" width={16} />
                <span>{elemenmt.tittle}</span>
              </div>
            )
          )}
        </div>
        <div className="larfer">
          <motion.div
            className={
              activeTab != null ? "tapExpanded dispaySlid" : "tapExpanded"
            }
          >
            <div className="closs" onClick={() => setActiveTab(null)}>
              <div className="x">X</div>
            </div>
            <div className="tittle">
              {activeTab === 1 ? (
                "Product Assets"
              ) : activeTab === 2 && viewMore?.status == true ? (
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    gap: "0px",
                    justifyContent: "start",
                    alignItems: "center",
                  }}
                  onClick={() => setViewMore({ status: false })}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-left"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>{" "}
                  {viewMore.title}{" "}
                </div>
              ) : activeTab === 2 ? (
                "Create Product Photoshoot "
              ) : activeTab === 3 ? (
                "Edit Image"
              ) : null}
            </div>
            {activeTab === 1 ? (
              <Assets3d />
            ) : activeTab === 2 && viewMore?.status == true ? (
              <ListOf />
            ) : activeTab === 2 ? (
              <Generate3d />
            ) : activeTab === 3 ? (
              <Edit3d />
            ) : null}
          </motion.div>
        </div>
      </motion.div>
    </SideBar>
  );
};

const SideBar = styled.div`
  .tittle {
    margin-left: 15px;
  }
  position: relative;
  z-index: 200;
  background-color: #fff;

  .new {
    min-height: 100vh;
    display: flex;
  }

  .selectbox {
    display: flex;
    gap: 10px;
  }
  .closs {
    display: none;
  }
  .selectone {
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid #d9d9d9;
    padding: 8px 13px;

    font-size: 12px;
    font-weight: bold;
    transition: all 0.3 ease;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }

  .selectTool {
    cursor: pointer;
    border-radius: 7px;
    border: 2px solid #d9d9d9;
    padding: 0.8rem 1.2rem;
    position: relative;
    transition: all 0.3 ease;
    margin-top: 5px;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
    .cardClose {
      position: absolute;
      right: 15px;
      top: 15px;
      z-index: 50;
    }
    p {
      margin-top: 8px;
      color: #b2a4a4;
      font-size: 12px;
      font-weight: 400;
      line-height: 13px;
    }
  }

  .activeTool {
    border: 2px solid rgba(249, 208, 13, 1);
  }
  .rowwothtwo {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
  .bigGap {
    margin-bottom: 25px;
  }
  .clolorpicker {
    display: flex;
    gap: 0.3rem;
    position: relative;
  }
  .pikkeropen {
    position: absolute;
    z-index: 10;
    top: 50px;
    right: 0;
  }
  .colorBox {
    background: #000;
    width: 65px;
    height: 100%;
    border-radius: 7px;
  }
  .columWrapper {
    gap: 28px;
    display: flex;
    flex-direction: column;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 30px;
    border-right: 2px solid ${({ theme }) => theme.bgBorder};
    width: max-content;

    padding-top: ${({ theme }) => theme.paddings.paddingTop};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  .columWrapper{
       padding-left: 10px;
    padding-right: 10px;

  }
  .closs{
    display: block;
    position: absolute;
    right:20px;
    top:100px;
    cursor: pointer;

    .x{
      cursor: pointer;
    //   width:30px;
    // height:30px;
    // border-radius:50%;
    // border-top: 2px solid black;
    // z-index:30;

    }
  }


   `}
  .active {
    background-color: ${({ theme }) => theme.btnPrimary};
  }
  .blure {
    pointer-events: none;

    filter: blur(2px); /* adjust px value to increase or decrease the blur */
    opacity: 0.9;
  }
  .gen {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .two-side {
    display: flex;
    gap: 0.3rem;
  }
  .tabBox {
    /* padding: 13px 15px; */
    /* background-color: ${({ theme }) => theme.btnPrimary}; */
    width: 58px;
    height: 54px;
    display: flex;
    border-radius: 11px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    span {
      font-size: 10px;
      font-weight: 500;
    }
    &:hover {
      background-color: ${({ theme }) => theme.btnPrimaryHover};
    }
  }
  .disable {
    color: #d1c8c8;
    cursor: not-allowed;
    &:hover {
      background-color: transparent;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
.tabBox{
  span{
    font-size: 8px;
  }
}
  `}
  .larfer {
    width: 380px;
  }
  .tapExpanded {
    /* padding-left: 15px;
    padding-right: 15px; */
    padding-top: 30px;
    /* padding-bottom: 70px; */
    border-right: 2px solid ${({ theme }) => theme.bgBorder};
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
    width: 100% !important;
    height: 100%;
    overflow: auto;
  }
  .tapExpanded::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .tapExpanded {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  .tapExpanded{
  display: none;
    position:absolute;
    left: 90px;
    background:#fff;
    z-index:5;
    height:100%;
    width: calc(100% - 90px);
    padding-left: 15px;


  }
  .dispaySlid{
    display: block;
  }
`}

  .imageBox {
    border-radius: 8px;
    border: 2px solid #d9d9d9;
    padding: 10px 10px;
    height: 120px;
    picture {
      width: 100%;
      height: 100%;
    }
    transition: all 0.3s ease-in-out;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: all 0.3s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .ativeimg {
    border-color: ${({ theme }) => theme.btnPrimary};
  }
`;
export default Sidebar3d;
