// @ts-nocheck

import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Label, { DisabledLabel } from "../common/Label";
import { Input } from "../common/Input";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Loader } from "three";

const PopupUpload = () => {
  const {
    setPopup,
    popup,
    setProduct,
    addimgToCanvasSubject,
    fetchAssetsImagesWithProjectId,
    fetchAssetsImages,
  } = useAppState();
  const [productnew, setProductnew] = useState("");
  const [btnisable, setbtnisable] = useState(false);

  const session = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [imglaode, setimglaode] = useState<boolean | null>(true);

  useEffect(() => {
    if (session) {
      setUserId(session.user.id);
    }
    setTimeout(() => {
      setimglaode(false);
    }, 3000);
  }, [session]);
  const { query, isReady } = useRouter();
  const { id } = query;

  const HandileUpload = async () => {
    if (productnew !== "") {
      setbtnisable(true);
      try {
        const response = await fetch(`/api/addcaption`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: popup.dataArray.imageUrl,
            caption: productnew,
          }),
        });

        const resData = await response;
        if (resData) {
          addimgToCanvasSubject(popup?.dataArray?.imageUrl);
          fetchAssetsImagesWithProjectId(userId, id);
          setProduct(productnew);
          setPopup({ status: false, data: null });
          fetchAssetsImages(userId, null, true);
        }
      } catch (error) {
        setbtnisable(false);
        setPopup({ status: false, data: null });
      }
    }
  };
  useEffect(() => {
    if (popup?.dataArray?.caption && popup?.dataArray?.caption !== null) {
      setProductnew(popup?.dataArray?.caption);
    }
  }, []);

  return (
    <PopupWrapper>
      <div className="wrapper">
        {/* <Loader/> */}
        {imglaode ? (
        // <div className="bmain">
          <div className={` griteitem`} onClick={() => ""}>
            <div className="newgri" style={!imglaode ? { opacity: 0 } : null}>
              <DaoderWarpperL>
                <div className="jumping-dots-loader">
                  {" "}
                  <span></span> <span></span> <span></span>{" "}
                </div>
                <div className="moving-gradient"></div>
              </DaoderWarpperL>
              {/* <picture className="griteitemLoading">
                <img loading="lazy" src={popup?.loaderImage} alt="image" />
              </picture> */}
            </div>
          </div>
        ) : null}
        <picture className="aa">
          <img loading="lazy" src={popup?.dataArray?.imageUrl} alt="image" />
        </picture>
{/* </div> */}
        <div className="test">
          <div>
            <Label>{"What did you just upload?"}</Label>

            <Input
              type="text"
              value={productnew}
              onChange={(e) => setProductnew(e.target.value)}
              placeholder=" e.g. 'red sofa' or 'blue perfume bottle'"
            />
          </div>
          {btnisable ? (
            <Button disabled onClick={""}>
              Adding...{" "}
            </Button>
          ) : (
            <Button onClick={HandileUpload}>Add image </Button>
          )}
          <Button
            onClick={() => setPopup({ status: false, data: null })}
            style={{ backgroundColor: "rgba(249, 208, 13, 0.23)" }}
          >
            Close{" "}
          </Button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default PopupUpload;

const DaoderWarpperL = styled.div`
  width: 100%;
  height: 200px;
  position: absolute;
  z-index: 10000;
  /* background-color: #e4d8d83b; */
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

const PopupWrapper = styled.div`

.bmain{
  height: 250px;
    /* max-height: 300px; */

}
  .aa {
    /* min-height: 200px;
    max-height: 300px; */
    height: 250px;

    position: relative;
    z-index: 50;
  }
  .griteitemLoading {
    /* min-height: 200px;
    max-height: 300px; */
    /* position: absolute; */
    height: 250px;

    img {
      /* width: 200px; */
       height: 250px;

      margin: auto;
      margin-bottom: 30px;
    }
  }
  .griteitem {
    position: relative;
    /* height: 250px; */

    /* max-height: 300px; */

    width: 100%;
    justify-content: center;
  }
  .newgri {
    position: absolute;
    width: 100%;
  }
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background-color: #c9c5c59f;

  .wrapper {
    max-width: 60vw !important;
    min-width: 50vw !important;
    min-height: 70vh;
    border: 1px solid #555;
    border-radius: 24px !important;
    padding: 40px;
    background-color: #fff;

    img {
      /* width: 200px; */
      max-height: 250px;
      margin: auto;
      margin-bottom: 30px;
    }
    .test {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }
`;
