// @ts-nocheck

import React, { useState } from "react";
import { styled } from "styled-components";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};
const PopupCard = () => {
  const {
    popupImage,
    setPopupImage,
    handleDownload,
    GetProjexts,

    AssetsActivTab,
  } = useAppState();

  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(popupImage.index);
  const showPrevious = currentIndex > 0;
  const showNext = currentIndex < popupImage.list.length - 1;

  const handletBtn = async () => {
    if (popupImage.generat) {
      try {
        if (popupImage?.userId) {
          const response = await fetch(
            `/api/project?user_id=${popupImage.userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
              }),
            }
          );
          const resData = await response.json();
          if (resData?.success) {
            GetProjexts(popupImage.userId);
            setPopupImage({ statu: false });
            router.push(`/generate/${resData?.project_id}`);
            setTimeout(() => {}, 1000);
          }
        }
      } catch (error) {
        console.log(error)

      }
    } else {
      if (popupImage?.list[currentIndex]?.modified_image_url) {
        handleDownload(popupImage?.list[currentIndex]?.modified_image_url);
      } else {
        handleDownload(popupImage?.list[currentIndex]?.image_url);
      }
    }
  };

  const handlePrevious = () => {
    if (showPrevious) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (showNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDelet = async () => {
    try {
      let deletfrom;
      if (popupImage.type === "product") {
        deletfrom = null;
      } else {
        deletfrom = "brand";
      }

      const response = await fetch(`/api/deleteimage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: popupImage?.list[currentIndex]?.image_url,
          type: deletfrom,
        }),
      });

      if (response.status === 200) {
        toast.success("Deleted successfully");
        if (showNext) handleNext();
        else setPopupImage({ statu: false });
      } else {
        toast.error("Failed to delete");
      }

    } catch (error) {
      toast.error("something went wrong");


    }
  };
  const redirectToAnotherSite = () => {
    window.open(popupImage?.list[currentIndex]?.image_url, "_blank");
  };
  return (
  

    <PopupWrapper2>
      <div className="wrapper">
        {showPrevious ? (
          <div
            onClick={handlePrevious}
            className=" btn left"
            disabled={!showPrevious}
          >
            <picture>
              <img
                className="img"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADc0lEQVR4nO2ay0tVURTGf5LpDSPzqiWNahhG9VeYYg9zVtmssEkm1rTH2BoJgn9HIWJRIfSyhylEZtaobBDZrKtiYSz8DizqXr333HPPPYofHLi691n7sdZej28f2MLmRRroAG4Dw8AH4CewpMd+T6vN+pwC6kgIUsB54D7wB1gp8PkNjAJdQHU5FrADuAp8c5NaBB4B16WZg9rx7Xrq9D9ruwE81jvB+3NAnzYnFrQDn90EXgEXgNoQsnYDF4HXTt4noI0SwnZqyA34BmiJUH4r8NbJHyyFdpo0cRvgF3AZ2Bb1IKzKvAJknLb3RiX8gNS9Iq9ziNLjMDCjMWc1h6LQ6AS+BBqID3XAE439WVYRCilnTs+AGuJHDfDCmVmoMzPkzMmCXblQ76zCHEDBLjY42HGciXzOTEZzMu+Wd7AL4oR5p6Sg1x3+vEzsmosTUbrYJgW+5yHfrwQmNTdb1JpIubSjJeJFTEvuBFARUk6bZHxdLzfrch6iFIuYLsaNsroBgSc9u1bHB+pkuVMUsKj8TjItrd8XgcxuyRvJ1SGttHoxZAJYSk38GyitvlnONc/TGvQhydSEx5hknyAL7qjR6okkasLjluT3kwXDajxJcjXxr/XcJQs+qtGquKRqIkCz26z/MK/GdII1EaBBY30nC5bUWEXhmIpJEwGqHU+weRcyX4Rp7XGmNRODaTWuZVqb5rAPq9EYwLCISzOda7nfICAaebahA2KHGo0tLBal1syYZB/PlYwFSaMxgCRUM2mXNO7K1WlUAxuNSUI1c0ny7EznxDl1spI0qYXVhGSdWa/UnVPHY5RmMVZ3h0W7ZHzJ5xqiz9XWUZMPkyLcwpIPU5pbTz4vpBzXa4RyUtDnzlp1oWxFRuRYuXEUWAjL7gy6HTDaslxoFClncxkIIyAlWmhFdl0OEnsnMK45jBdzz9ioxCy4VrC/40IaeOqu44q+8DngVGtmdoR4zsSsxrSsfH9Ugvc6M8uIezV3GDUq5Z0WnDlZdhApUs4BBIEtqtvXCgW7KSd/oNR3761O7QFr3x3yK4a0cqcg7ViRKUVJoK+rnV6x4sEElpRe3xTv1Cy3XaWnXpdGneoz5niCIO3oKdcXENVixUdUAhT6Cceystgz5VpANtSKi7Wq7Z6SxB/uoxr7/V7lab/65qwntsAGx1+7t04xbgmu8QAAAABJRU5ErkJggg=="
              />
            </picture>
          </div>
        ) : null}

        {showNext ? (
          <div onClick={handleNext} className="btn right" disabled={!showNext}>
            <picture>
              <img
                className="img"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADdElEQVR4nO2ayWsUQRTGf6JmRhRjxsSIJz1KRP0r1BD3m9tNiRdjiF5dztGTEMjfoYQQRUVQcY0LotGYk8tBjDcnBpWRh1/DQ2cmMz3VPZ2QD5pZXvWrqn5LvfqqYRELFwVgP3AJGAEmgG/ArC77/kYya7MPaCMjyAPHgOvAb6BU5/ULGAOOArlmTGAFcAb47Ab1A7gFnJNlNuuJL9fVpv9Mdh64rXui+z8BA3o4qaAHmHIDeAwcB1pj6FoDnACeOH3vgW4ShD2pYdfhU2BHQP27gGdO/1AS1lmvgVsH34FTwNLQnfBX52mg6KzdGUr5Jpm7pKyzheSxFXirPic1hobQ4RQ+AtpJD23AXfU9Ja+Ihbxzp/vAStLHSuCBc7NYMTPs3MkWu2ZhrfMKSwB1p9gosNOIiVpipqgxWXarebGL1gnLTllBvwv+mlzsrFsn4qbYceBlIwFaBsuA5xqbTaoq8q7saGSxe+HiK+RkuqX341y12VGXIRrBek0i9GSWuEx6uFrDG2pktVOjWAe8kj7LOhsIg17pHK3UoKCy+kfMAjAty7Rpf/Oz0jgPqMObhEUSlrkjfXvKCS9LaPuJ0AhtmYvSNVhOOCLhXpJBSMsckJ6r5YTvJLRdXFIIZZku6TBe4D9MS5h0XRXCMu26/0s54ayELSQPbxlbPOtFzvEEmZmIlR1BJzKdkmt1OteaiOlaHdVca8EE+4iExgBm1RIRDlZLv9GCaOTZvF4Q90tobGFWLfFvibKbCsVYVDQaA5jVorHgisbVlRqNqVOjMbNoCcNJ6bSYrogjamRcbFY3VuPSe2iure4nNdyZwa1uj/R+qOUYYkCNxxsgHx6KkA5NPrzQ2PpquSHvuF4jlLOCAVdo5uplK4oix5qN7cBMXHZnyD0Boy2bhQ6RcjaWK3EU5EULlUQkN4PEXqV4K+kz18jTmHDHCvY7LRSAe+44ruEDn03OtOZm20gnJibVp1XlG0Mp7nRuVhT3aukwNJYpO804d7KtcVDkXQKIdnbdAVdsW+yidSIK7ETP3nc5s0esfW/MtxgKqp2isqMkVwp5WjyndfrFikcDmFV5fUG8U5fSdouutTo0Oqg2dxxPEJUdfc16AyInVnxUW4B6X+H4qSr2ULMmUA6t4mJt13ZNBeNX91KNfX+t7emg2lbcTyyCeY4/F5VOQDaUwpAAAAAASUVORK5CYII="
              />
            </picture>
          </div>
        ) : null}

        <div className="close" onClick={() => setPopupImage({ statu: false })}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 30 30"
          >
            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
          </svg>
        </div>

        {popupImage.generat ? (
          <picture>
            <img src={popupImage?.list[currentIndex]?.image_url} alt="image" />
          </picture>
        ) : (
          <picture>
            {popupImage?.list[currentIndex]?.modified_image_url ? (
              <img
                src={popupImage?.list[currentIndex]?.modified_image_url}
                alt="image"
              />
            ) : (
              <img
                src={popupImage?.list[currentIndex]?.image_url}
                alt="image"
              />
            )}
          </picture>
        )}

        <div className="btns">
          {popupImage.generat ? (
         
            <>
              <div className="we">
                <div className="btnsd">
                  <button className="selectone" onClick={() => handleDelet()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="delet"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      ></path>
                    </svg>
                  </button>
                  <button
                    className="selectone"
                    onClick={() => redirectToAnotherSite()}
                  >
                    <picture className="delet">
                      <img
                        className="delet"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACGElEQVR4nO2Zy0rDQBSGv67VuvMFVHTlbeOiCEpbd30i9TGEWjfi1voM3kAR3VlofQQr9VrErioDJ3Ao2iZNzExCPgi0IZk5f3POmflTyMjISAJl4BBoAV05zOcaUCIBzAOXQH/EcQ7M4SibwIsE+gTsAMvAhBwrwC7Qlms6wAaOUQS+JMATYGrItXngVImZc1FEFcj5uCcH1FWaJVKEfjJempWSKsJjV+433cwKWxGIQBpAX1pz7CwCrxGIQJqCGeeDmDFBX6nuFEaEVSFltU4Ma7FBU6tJzBzLxGaxi4I9Ge+AmHmUiZciGGtatV/TAWPlWyaeDDlOTq3uZ1jgXSY3eyfNDHANXPgUUVVblFks0JAATJFqEQ9y/jaAiC/ZaFrBBNED1n8R8SDf/YooYpECUEm6CI3TIsoD9vRdauJAnsQ4IvKqO/27iFH2tOcjnUzNrCo3uCaL3bPqTpu27emowq6I2L9+iLP/brFB7OmwdCpIDTQkHbuydzIpWXTJFAWpiVgpRiCiMtAAEiliXWrC3J8Ie3r3RzqtqvOxs6C6k197egPc/1ITkzLOGxa4SIM93U6LPT1Kiz1tpsWe9tJiTz8jEGJE7Nt+g94KmVrO2NOaBGFeGAfFKWdXGrP9OiXC41wCqgf4I8Y5EUhxdpQYY0GdsKfjsKHEtKVmrNrTsE/GS7O+TXsaZQOoyarfjdueZmRkEJofMI0LxuO9LrIAAAAASUVORK5CYII="
                      />
                    </picture>
                  </button>
                </div>
              </div>

              <Button onClick={() => handletBtn()}> {popupImage.btn} </Button>
            </>
          ) : (
        
            <Button onClick={() => handletBtn()}> {popupImage.btn} </Button>
          )}
        </div>
      </div>
    </PopupWrapper2>

  );
};

export default PopupCard;

const PopupWrapper2 = styled.div`
  .we {
    margin-bottom: 10px;
  }
  .btnsd {
    /* position: absolute; */
    right: -3px;
    z-index: 10;
  }

  .delet {
    width: 15px !important;
    height: 15px !important;
  }
  .selectone {
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid rgba(249, 208, 13, 1);
    padding: 5px 8px;
    background: rgba(249, 208, 13, 1) !important;

    color: #000;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3 ease;
    margin-right: 3px;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }
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
  .btns {
    width: 50%;
  }

  .wrapper {
    position: relative;
    width: 50vw !important;
    height: 80vh !important;
    border: 2px solid #d9d9d9;
    border-radius: 8px !important;
    padding: 40px;
    padding-top: 50px;
    background-color: #fffefe;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    img {
      /* width: 450px; */
      height: 50vh;
      margin: auto;
      margin-bottom: 30px;
      border-radius: 8px !important;
    }
    .test {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .btn {
      position: absolute;
      cursor: pointer;

      .img {
        width: 50px !important;
        height: 50px !important;
      }
    }
    .left {
      left: 50px;
    }
    .right {
      right: 50px;
    }
  }
`;
