// @ts-nocheck

import React, { useEffect, useState } from "react";
import { Row } from "../common/Row";
import { useAppState } from "@/context/app.context";
import { styled } from "styled-components";
import { motion } from "framer-motion";
import { TempletList } from "@/data/dropdown";
import { useRouter } from "next/router";
import Label from "../common/Label";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const Tamplates = () => {
  const {
  
  
    project,
    setTemplet,
    setViewMore,

    setpromt,
    loader,
    GetProjextById,
    activeTemplet,
    setActiveTemplet,
    category,
  } = useAppState();

  const { query, isReady } = useRouter();
  const id = (query.id as string[]) || [];

  const [filterRecently, setfilterRecently] = useState();

  useEffect(() => {
    GetProjextById(id);
    setfilterRecently(project?.recently);
  }, [isReady, setfilterRecently]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestedTemplates, setSuggestedTemplates] = useState([]);
  const [otherTemplates, setOtherTemplates] = useState([]);
  useEffect(() => {
    (() => {
      let templetType;
      if (category === "Apparel & Footwear") {
        templetType = "Outdoor Scene";
      } else if (category === "Large Appliances") {
        templetType = "Indoor Scene";
      } else if (category === "Mobile & Laptops") {
        templetType = "On Platforms";
      } else if (category === "Furniture & Decor") {
        templetType = "Indoor Scene";
      } else if (category === "Other") {
        templetType = "Backdrops";
      }

      // Assuming 'TempletList' is the name of your array
      const filtered = TempletList.find((item) => item.title === templetType);
      if (filtered) {
        setSuggestedTemplates(filtered.list);
        
      } else {
        setSuggestedTemplates([]);
      }
      setOtherTemplates(
        TempletList.filter((item) => item.title !== templetType)
      );
     
    })();

    // filterTemplates(category)
  
  }, [category]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="accest"
    >
      <RecentWrapper>
        {filterRecently?.length ? (
          <>
            <div className=" rows">
              <div className="left">
                <Label>Recent Templates </Label>
              </div>
              <div className="right">
                <div
                  className="viewBtn"
                  onClick={() =>
                    setViewMore({
                      status: true,
                      title: "Recently Used Templates",
                      index: 1,
                      list: project?.recently?.reverse(),
                    })
                  }
                >
                  View all
                </div>
              </div>
            </div>
            <div className="horizontaScrollBox">
              {filterRecently
                ?.slice(-10)
                ?.reverse()
                .map((test, i) => (
                  <div
                    key={i}
                    className={`imageBoxs ${
                      activeTemplet === test ? "actives" : ""
                    }`}
                    onClick={() => {
                      if (!loader) {
                        setActiveTemplet(test);
                     
                     
                      

                        setpromt(test.promt);
                      }
                    }}
                  >
                    <picture>
                      <img src={test?.image} alt="" />
                    </picture>
                    <div className="heads">{test?.title}</div>
                  </div>
                ))}
            </div>
          </>
        ) : null}
        {suggestedTemplates.length ? (
          <>
            <div className=" rowsnew">
              <div className="left">
                <Label>Suggested templates:</Label>
              </div>
            </div>

            <ResponsiveRowWraptwo>
              {suggestedTemplates.map((test, i) => (
                <div
                  key={i}
                  className={`imageBoxs ${
                    activeTemplet === test ? "actives" : ""
                  }`}
                  onClick={() => {
                    if (!loader) {
                      setActiveTemplet(test); // Set the current item as active
                      setTemplet(test);
                      
                      setpromt(test.promt);
                    }
                  }}
                >
                  <picture>
                    <img src={test.image} alt="" />
                  </picture>
                  <div className="head">{test?.title}</div>
                </div>
              ))}
            </ResponsiveRowWraptwo>
          </>
        ) : null}

        <div className=" rowsnew">
          <div className="left">
            <Label>Select a Other Template Below:</Label>
          </div>
        </div>
        {otherTemplates.map((testd, i) => (
          <>
            <div className="sub-title">
              <Label>{testd.title}</Label>
            </div>
            <ResponsiveRowWraptwo>
              {testd.list.map((test, i) => (
                <div
                  key={i}
                  className={`imageBoxs ${
                    activeTemplet === test ? "actives" : ""
                  }`}
                  onClick={() => {
                    if (!loader) {
                      setActiveTemplet(test); // Set the current item as active
                      setTemplet(test);
                     

                      setpromt(test.promt);
                    }
                  }}
                >
                  <picture>
                    <img src={test.image} alt="" />
                  </picture>
                  <div className="head">{test?.title}</div>
                </div>
              ))}
            </ResponsiveRowWraptwo>
          </>
        ))}
      </RecentWrapper>
    </motion.div>
  );
};

export default Tamplates;
export const ResponsiveRowWraptwo = styled(Row)`
  display: grid !important;
  gap: 1rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(2, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(2, 1fr);
   `}
`;

export const RecentWrapper = styled(Row)`
  .sub-title {
    text-align: left;
    width: 100%;
    padding: 15px 0;
  }
  margin-bottom: 50px;
  .rowsnew {
    margin-top: 30px !important;
    margin-bottom: 10px !important;

    width: 100%;
  }
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  .accest {
    width: 100%;
  }

  .rows {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 100%;

    .left {
    }

    .viewBtn {
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    }
    .viewBtn:hover {
      color: rgba(249, 208, 13, 1);
    }
  }
  .horizontaScrollBox {
    display: flex;
    gap: 10px;
    overflow-x: scroll;
    width: 100%;

    -ms-overflow-style: none !important; /* IE and Edge */
    scrollbar-width: none !important; /* Firefox */
  }
  .horizontaScrollBox::-webkit-scrollbar {
    display: none !important;
  }

  .imageBoxs {
    border-radius: 8px;
    border: 2px solid #d9d9d9;
    padding: 10px 10px !important;

    min-width: 150px !important;
    height: 180px;
    overflow: hidden;

    picture {
      width: 100%;
      height: 80%;
    }
    .head {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      margin-top: 10px;
      font-weight: 500;
    }
    .heads {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      margin-top: 10px;
      font-weight: 500;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      object-fit: cover;
      transition: all 0.3s ease-in-out;
      &:hover {
        transform: scale(1.1);
      }
    }
    transition: all 0.3s ease-in-out;

    &:hover {
      border: 2px solid rgba(249, 208, 13, 1);
    }
  }
  .actives {
    border: 2px solid rgba(249, 208, 13, 1);
    background-color: rgba(249, 208, 13, 0.23);
    img {
      transform: scale(1.1);
    }
  }
`;
