/// <reference no-default-lib="true"/>
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { motion } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useAppState } from "@/context/app.context";
import { supabase } from "@/utils/supabase";
import Loader from "../Loader";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};
const toolslist = [
  {
    name: "3D Product Photography",
    route: true,

    discription: "Convert 3D Model into Generated Images",
    url: "/generate-3d/",
    img: "https://media.sketchfab.com/models/724f69d360e24cda99ba84fead2bed88/thumbnails/3bc8180aab6148778a75cde61100e6d4/915356641a0547a6907f0b8c89383780.jpeg",
  },
];

const Tools = ({ loadetool }) => {
  const session = useSession();
  const { userId, setUserID, setMainLoader } = useAppState();
  const router = useRouter();
  const Redirect = (url: string, route: string) => {
    setMainLoader(true);
    if (route) {
      router.push(url + userId);
    } else {
      window.location.href = url + userId;
    }
  };
  return (
    <div >
      <ToolsWrapper>
        <div className="headerText">Tools</div>

        <div className="gridbox">
          {toolslist?.map((tool: any, i: key) => (
            <div
              key={i}
              className="tool-cards"
              onClick={() => Redirect(tool?.url, tool?.route)}
            >
              <div className="imgeWrapper">
                <div className="imgbox">
                  <picture>
                    <img src={tool?.img} alt="" />
                  </picture>
                </div>
              </div>
              <div className="tool-details">
                <div className="name">{tool?.name}</div>
                <div className="discription">{tool?.discription}</div>
              </div>
            </div>
          ))}
        </div>
      </ToolsWrapper>
    </div>
  );
};

export default Tools;

const ToolsWrapper = styled.div`
  position: relative;
  .headerText {
    font-size: 32px;
    font-weight: 700;
  }
  .gridbox {
    margin-top: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    .tool-cards {
      border-radius: 7px;
      border: 1px solid #d9d9d9;
      cursor: pointer;

      .imgeWrapper {
        height: 230px;
        width: 100%;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;

        overflow: hidden;
        .imgbox {
          width: 100%;
          height: 100%;
          background-color: #d9d9d9;
          picture {
            width: 100%;
            height: 100%;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .tool-details {
        padding: 10px;
        border-top: 1px solid #d9d9d9;

        .name {
          font-size: 18px;
          font-weight: 700;
        }
        .discription {
          color: #b1b1b1;
        }
      }
    }
  }
`;
