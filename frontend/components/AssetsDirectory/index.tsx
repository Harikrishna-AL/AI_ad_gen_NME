// @ts-nocheck

import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { motion } from "framer-motion";
import { useAppState } from "@/context/app.context";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { AssetsLoader } from "../Loader/AssetsLoader";
import { useSession } from "@supabase/auth-helpers-react";

import Loader from "../Loader";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const AssetsDir = () => {
  const session = useSession();

  const {
    setPopupImage,
    listofassets,
    setListOfAssets,
    fetchAssetsImages,
    AssetsActivTab,
    setassetsActiveTab,
    popup,
    uploadedProductlist,
    brandassetLoader,
    setbrandassetLoader,
    fetchAssetsImagesWithProjectId,
    setPopup,
    fetchAssetsImagesBrant,

    setProduct,
    addimgToCanvasSubject,
    listofassetsBarand,
    setListOfAssetsBrand,
    userId,
    setUserId,
  } = useAppState();

  const [assers, setAssets] = useState();
  const { query, isReady } = useRouter();
  const { id } = query;
  const [laoder, setlaoder] = useState(true);

  useEffect(() => {
    setListOfAssets(null);

    setTimeout(() => {
      setlaoder(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAssetsImagess(userId, null);
      const filterData = listofassets?.filter((item) => {
        if (AssetsActivTab === "product") {
          return (
            item.AssetType === undefined || item.AssetType === AssetsActivTab
          );
        } else {
          return item.AssetType === AssetsActivTab;
        }
      });
    }
  }, [isReady, userId, AssetsActivTab, listofassets, listofassetsBarand]);

  const fetchAssetsImagess = async () => {
    try {
      if (AssetsActivTab === "product") {
        fetchAssetsImages(userId, null, true);

        setAssets(listofassets);
      } else {
        fetchAssetsImagesBrant(userId, null);

        setAssets(listofassetsBarand);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleFileChange = (event) => {
    const fileSize = event.target.files[0].size;
    const maxSize = 25 * 1024 * 1024; // 1MB
    const filename = event.target.files[0].name;
    const format = filename.split(".").pop();

    if (fileSize > maxSize) {
      toast.error("File size must be less than 25MB");
      return false;
    } else if (format !== "png" && format !== "webp" && format !== "jpg") {
      toast.error("Format not supported");
    } else {
      setbrandassetLoader(true);
      const selectedFile = event.target.files?.[0] || null;
      try {
        if (selectedFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const response = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                dataUrl: reader.result,
                user_id: userId,
                project_id: null,
                type: "brand",
              }),
            });

            if (response?.status === 413) {
              toast.error("Image exceeded 4mb limit");

              setbrandassetLoader(false);
            } else if (response?.status === 400) {
              toast.error("Image is corrupted or unsupported dimensions");

              setbrandassetLoader(false);
            } else if (
              response?.status !== 200 &&
              response?.status !== 413 &&
              response?.status !== 201
            ) {
              toast.error("uploading failed");

              setbrandassetLoader(false);
            }
            const data = await response.json();

            if (data?.data) {
              fetchAssetsImages(userId, null, true);
              fetchAssetsImagesWithProjectId(userId, id);
              setbrandassetLoader(false);
              // }
            } else {
              console.log("bg not removed");
            }
          };
          reader.readAsDataURL(selectedFile);
        }
      } catch (e) {
        console.log(e);
        setbrandassetLoader(false);
      }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <GelleryWrapper>
        <div className="hederbox">
          <div className="headerText">Assets</div>
          <div className="small-tabs">
            <div
              className={AssetsActivTab === "product" ? "tab activeTAb" : "tab"}
              onClick={() => {
                setassetsActiveTab("product");
              }}
            >
              Product Assets{" "}
            </div>
            {/* <div
              className={AssetsActivTab === "brand" ? "tab activeTAb" : "tab"}
              onClick={() => {
                setassetsActiveTab("brand");
              }}
            >
              Brand Assets{" "}
            </div> */}
          </div>
        </div>

        <div className="imageBox">
          {laoder ? (
            <Loader h={true}></Loader>
          ) : (
            <div className="grid-img">
              {AssetsActivTab === "brand" ? (
                <>
                  {brandassetLoader ? (
                    <AssetsLoader />
                  ) : (
                    <>
                      <label
                        className="createbox"
                        onClick={"handleCreate"}
                        htmlFor="fileInputAssets"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7 0C7.26522 0 7.51957 0.105357 7.70711 0.292893C7.89464 0.48043 8 0.734784 8 1V6H13C13.2652 6 13.5196 6.10536 13.7071 6.29289C13.8946 6.48043 14 6.73478 14 7C14 7.26522 13.8946 7.51957 13.7071 7.70711C13.5196 7.89464 13.2652 8 13 8H8V13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13V8H1C0.734784 8 0.48043 7.89464 0.292893 7.70711C0.105357 7.51957 0 7.26522 0 7C0 6.73478 0.105357 6.48043 0.292893 6.29289C0.48043 6.10536 0.734784 6 1 6H6V1C6 0.734784 6.10536 0.48043 6.29289 0.292893C6.48043 0.105357 6.73478 0 7 0Z"
                            fill="#585858"
                          />
                        </svg>
                        <div className="testcreat">Upload New Photo</div>
                      </label>
                      <input
                        type="file"
                        id="fileInputAssets"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept=".webp, .png, .jpg"
                      />
                    </>
                  )}
                </>
              ) : null}

              {assers?.map((image, i) => (
                <div className="We" key={i}>
                  <div
                    className="img"
                    onClick={() =>
                      setPopupImage({
                        id: i,
                        url: image?.image_url,
                        status: true,
                        userId: userId,
                        btn: "Use to generate",
                        generat: true,
                        index: i,
                        list: assers,
                        type: AssetsActivTab,
                      })
                    }
                  >
                    <picture>
                      <img src={image?.image_url} alt="" loading="lazy" />
                    </picture>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GelleryWrapper>
    </motion.div>
  );
};

export default AssetsDir;

const GelleryWrapper = styled.div`
  .We {
    position: relative;
  }
  .btns {
    position: absolute;
    right: -3px;
    z-index: 10;
  }

  .delet {
    width: 15px !important;
    height: 15px;
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

  height: 100%;
  .headerText {
    font-size: 32px;
    font-weight: 700;
  }
  .hederbox {
    display: flex;
    gap: 50px;

    .small-tabs {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: start;
    }
    .tab {
      font-size: 16px;
      font-weight: 500;
      background: #ececec;
      height: max-content;
      padding: 4px 15px;
      border-radius: 7px;
      cursor: pointer;
    }
    .activeTAb {
      background-color: ${({ theme }) => theme.btnPrimary};
    }
  }
  .imageBox {
    margin-top: 20px;
    border-radius: 7px;
    border: 1px solid #d9d9d9;
    min-height: 75vh;

    .grid-img {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 20px;
      padding: 20px;
      min-height: 100%;
    }
    .img {
      width: 100%;
      height: 180px;
      background-color: #d9d9d9;
      border-radius: 7px;
      overflow: hidden;
      border: 1px solid #d9d9d9;
      transition: all 0.3s ease-in-out;
      &:hover {
        border: 3px solid rgba(249, 208, 13, 1);
        transform: scale(1.1);
      }
    }
    img {
      width: 100%;
      height: 180px;
      object-fit: contain;
    }
  }
  .createbox {
    cursor: pointer;
    width: 100%;
    min-height: 180px;
    border-radius: 16px;
    background: #f8f8f8;
    border-radius: 16px;
    border: 1px solid #d9d9d9;
    position: relative;
    display: flex;
    justify-content: center;
    /* align-items: center; */
    transition: all 0.3s;
    svg {
      margin: 80px;
    }
    &:hover {
      border: 1px solid #f9d00d;
    }

    &:hover .testcreat {
      background: rgba(249, 208, 13, 0.08);
    }

    .testcreat {
      border-radius: 0px 0px 16px 16px;
      background: #e3e3e3;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      padding: 16px;
      font-size: 14px;
      transition: all 0.3s;
    }
  }
`;
