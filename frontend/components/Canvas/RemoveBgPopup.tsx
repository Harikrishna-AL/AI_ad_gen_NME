/// <reference no-default-lib="true"/>

import React, { useEffect } from "react";
import { styled } from "styled-components";
import { useState } from "react";
import { useAppState } from "@/context/app.context";
import Button from "../common/Button";
import { saveAs } from "file-saver";
import { AssetsLoader } from "../Loader/AssetsLoader";
import { RemoveLoader } from "../Loader/RemoveLoader";
import { toast } from "react-toastify";
import { arrayBufferToDataURL, dataURLtoFile } from "@/utils/BufferToDataUrl";

const RemoveBox = () => {
  const {
    downloadImg,
    TDMode,
    setremovepopu3d,
    removepopu3d,
    downloadeImgFormate,
    userId,
    regenratingId
  } = useAppState();

  const [loader, setLoader] = useState(false);
  const [updateImg, setupdateImg] = useState<null | any>(null);

  const downloadH = async () => {
    saveAs(updateImg, `image${Date.now()}.${downloadeImgFormate}`);
  };

  const HandelBG = async () => {
    setLoader(true);

    try {
      const response = await fetch("/api/removebg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataUrl: downloadImg,
          user_id: userId,
          project_id: null,
          add_to_db: false

        }),
      });
      const data = await response.json();
      if (data) {
        setupdateImg(data?.imageUrl);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      toast.error("Error removing background");
      setremovepopu3d(false);
      setupdateImg(null);
    }
    // setLoader(false);
  };

  const upSacle = async (photo: string, filename: string): Promise<string> => {
  

    try {
    
      const response = await fetch("/api/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: downloadImg,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (data) {
        setupdateImg(data.image_url);
        // setSelectedImg({ status: true, image: data.image_url });
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      setupdateImg(null);
      setremovepopu3d(false);
      toast.error("something went wrong");

    }
  };

  const UpscaleBG = async () => {
    setLoader(true);
    // try {
      const data = await upSacle(downloadImg, "imger");


  };
  useEffect(() => {
    if (removepopu3d.type === "bgRemove") {
      HandelBG();
    } else {
      UpscaleBG();
    }
  }, []);

  return (
    <Wrapper>
      <div className="cropperbox">
        <div className="imgbox">
          {loader ? (
            <RemoveLoader />
          ) : (
            <picture>
              <img src={updateImg} alt="" />
            </picture>
          )}
        </div>

        <div className="flex">
          {TDMode ? (
            <Button
              onClick={() => downloadH()}
              disabled={updateImg ? false : true}
            >
              Download
            </Button>
          ) : 
          null}

          <Button
            onClick={() => {
              setupdateImg(null);
              setremovepopu3d(false);
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default RemoveBox;

const Wrapper = styled.div`
  .nm {
    object-fit: contain;
    width: 100%;
  }

  .flex {
    display: flex;
    justify-content: end;
    gap: 20px;
    button {
      max-width: fit-content;
    }
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
  background-color: #ffffff;

  .ReactCrop {
    width: 400px;
    height: 400px;
    position: relative;
  }
  .reactEasyCrop_Container {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
  .imgbox {
    width: 400px;
    height: 400px;
    border: 1px solid rgba(249, 208, 13, 1);
    padding: 5px;
    margin-bottom: 10px;
  }
`;
