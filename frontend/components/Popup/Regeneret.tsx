
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { fabric } from "fabric";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";

const Regeneret = ()=> {
  const session = useSession();
  const { query, isReady } = useRouter();
  const id = (query.id as string[]) || [];

  const {
    regeneratePopup,
    setRegeneratePopup,
    getBase64FromUrl,
    positionBtn,
    canvasInstance,
    generatedImgList,
    GetProjextById,
    regenratedImgsJobId,
    setRegenratedImgsJobid,
    setJobId,
    setActiveTab,
    fetchGeneratedImages,
    setCanvasDisable,
    setLoader,
    userId,
  } = useAppState();


  const [selectedCards, setSelectedCards] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);

  useEffect(()=> {
    const filteredResult = generatedImgList.filter(
      (obj)=> obj?.task_id === regenratedImgsJobId  && obj?.is_regenerated === true
    );
    setFilteredArray(filteredResult);
  

    if (filteredResult?.length) {
      setLoader(false);
    } else {
      setLoader(true);
    }


  }, [generatedImgList, regenratedImgsJobId]);

  useEffect(()=> {
    const time = setInterval(()=> {
      fetchGeneratedImages(userId);
    }, 5000);

    return ()=> {
      clearInterval(time);
    };
  }, []);

  const addimgToCanvasGen = async (url: string[])=> {
    const gridSize = 2;


    const cellWidth = canvasInstance.current.width / gridSize;
    const cellHeight = canvasInstance.current.height / gridSize;
  
    let incr = 0;

    url.forEach(async (imageSrc, index)=> {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
    

      fabric.Image.fromURL(
        await getBase64FromUrl(imageSrc),
        function (img: any) {
          // Set the image's dimensions
          img.scaleToWidth(200);
          const canvasWidth = 440;
          const canvasHeight = 440;
          const imageAspectRatio = img.width / img.height;

          // Calculate the maximum width and height based on the canvas size
          const maxWidth = canvasWidth;
          const maxHeight = canvasHeight;
          // Calculate the scaled width and height while maintaining the aspect ratio
          let scaledWidth = maxWidth;
          let scaledHeight = scaledWidth / imageAspectRatio;

          img.on("moving", ()=> {
            positionBtn(img);
          });

          img.on("scaling", function () {
            positionBtn(img);
          });
          const getRandomPosition = (max)=> Math.floor(Math.random() * max);

          const randomLeft = getRandomPosition(
            canvasInstance?.current?.width / img.width
          );
          const randomTop = getRandomPosition(300);

          // Set the position of the image
          img.set("category", "generated");
          img.set({
            left: 100 + index * 100,
            top: 150 + index * 50,
          });
          img.scaleToWidth(scaledWidth);
          img.scaleToHeight(scaledHeight);

       
          canvasInstance.current.add(img);
          canvasInstance.current.setActiveObject(img);
          canvasInstance.current.renderAll();
        }
      );
      incr = incr + 50;
    });
  };

  const handleCardChange = (image)=> {
    const selectedCard = image;
    if (selectedCards.includes(selectedCard)) {
      setSelectedCards(selectedCards.filter((card)=> card !== selectedCard));
    } else {
      setSelectedCards([...selectedCards, selectedCard]);
    }
  };

  const addImges = async ()=> {
    try {

    

      const response = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          project_id: id,
          type: "regenerate",
          image_urls: selectedCards
        }),
      });
      const data = await response.json();
  
      if (data?.success) {
        setCanvasDisable(false);
        setLoader(false);
        GetProjextById(id);
        addimgToCanvasGen(selectedCards);
        setRegeneratePopup({ statu: false });
        
      } else {
        console.log("bg not removed");
      }
   

    } catch (error) {
      console.log(error);
      toast.error("something went wrong");

    }
  };

  return (
    <WrapperRegenerat>
      <div className="wrapper">
        <div
          className="close"
          onClick={()=> {
            setRegeneratePopup({ statu: false });
            setActiveTab(1);
            setCanvasDisable(false);
            setLoader(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 30 30"
          >
            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
          </svg>
        </div>

        {filteredArray.length  ? (
          <div className="gride">
            <div className={` griteitem`} onClick={() => ""}>
              <DaoderWarpperL></DaoderWarpperL>
              <picture className="">
                <img src={regeneratePopup.url} alt="image" />
              </picture>
            </div>

            {filteredArray.map((item, i) => (
              <div
                key={i}
                className={`griteitem ${
                  selectedCards.includes(item?.modified_image_url)
                    ? "active"
                    : ""
                }`}
                onClick={() => handleCardChange(item?.modified_image_url)}
              >
                <picture>
                  <img src={item?.modified_image_url} alt="image" />
                </picture>
              </div>
            ))}
          </div>
        ) : (
          <div className="gride">
            <div className={` griteitem`} onClick={() => ""}>
              <DaoderWarpperL>
                <div className="moving-gradient"></div>
              </DaoderWarpperL>
              <picture className="">
                <img src={regeneratePopup.url} alt="image" />

               
              </picture>
            </div>
            <div className={` griteitem`} onClick={() => ""}>
              <DaoderWarpperL>
                <div className="jumping-dots-loader">
                  {" "}
                  <span></span> <span></span> <span></span>{" "}
                </div>
                <div className="moving-gradient"></div>
              </DaoderWarpperL>
              <picture className="griteitemLoading">
                <img src={regeneratePopup.url} alt="image" />

           
              </picture>
            </div>
            <div className={` griteitem`} onClick={() => ""}>
              <DaoderWarpperL>
                <div className="jumping-dots-loader">
                  {" "}
                  <span></span> <span></span> <span></span>{" "}
                </div>
                <div className="moving-gradient"></div>
              </DaoderWarpperL>
              <picture className="griteitemLoading">
                <img src={regeneratePopup.url} alt="image" />

             
              </picture>
            </div>
            <div className={` griteitem`} onClick={() => ""}>
              <DaoderWarpperL>
                <div className="jumping-dots-loader">
                  {" "}
                  <span></span> <span></span> <span></span>{" "}
                </div>
                <div className="moving-gradient"></div>
              </DaoderWarpperL>
              <picture className="griteitemLoading">
                <img src={regeneratePopup.url} alt="image" />

              
              </picture>
            </div>
          </div>
        )}
       
        <div className="btns">
          <div>
            {selectedCards?.length > 0 ? (
              <Button onClick={() => addImges()}>
                Add {selectedCards?.length} imges
              </Button>
            ) : (
              <Button disabled={true} onClick={() => ""}>
                No image to add
              </Button>
            )}
          </div>
        </div>
      </div>
    </WrapperRegenerat>
  );
};

export default Regeneret;

const WrapperRegenerat = styled.div`
  .griteitemLoading {
    filter: blur(5px);
  }
  position: absolute;
  padding: 100px;
  z-index: 50000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f55a;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 50vw !important;
    min-height: 70vh;
    border: 2px solid #d9d9d9;
    border-radius: 8px !important;
    padding: 30px;
    padding-top: 50px;
    background-color: #fffefe;

    .gride {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 100%;
    }

    .griteitem {
      border: 2px solid #d9d9d9;
      border-radius: 8px !important;
      position: relative;
      display: flex;
      width: 100%;
      padding: 20px;
      align-items: center;
      justify-content: center;
      &:hover {
      }
    }
    picture {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      object-fit: cover;
      object-position: center;
    }
    .active {
      border: 2px solid rgba(249, 208, 13, 1);
    }

    img {
      height: 22vh;
      width: 100%;
      border-radius: 8px !important;
      object-fit: cover;
      object-position: center;
    }
    .test {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }
  .btns {
    margin-top: 20px;
    display: flex;
    gap: 15px;
    justify-content: end;
    width: 100%;
  }
`;

const DaoderWarpperL = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10000;
  background-color: #e4d8d83b;
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
