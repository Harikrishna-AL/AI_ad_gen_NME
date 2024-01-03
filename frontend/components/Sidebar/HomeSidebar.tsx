
// @ts-nocheck


import { useAppState } from "@/context/app.context";
import assets from "@/public/assets";
import Image from "next/image";
import React from "react";
import { styled } from "styled-components";
import { useRouter } from "next/router";

const HomeSidebar = () => {

    const {
        activeTabHome,
        setActiveTabHome
      } = useAppState();

  const router = useRouter();
   
  const TabData = [
    {
      id: 1,
      image: assets.icons.project_icon,
      tittle: "Projects",
    },
    {
      id: 2,

      image: assets.icons.project_icon,
      tittle: "Asset Directory",
    },
    {
      id: 3,

      image: assets.icons.project_icon,
      tittle: "Gallery",
    },
    {
      id: 4,
      disable:false,

      image: assets.icons.user_icon,
      tittle: "Tools",
      url: "/tools"
    },
  ];
  return (
    <HomSideWrapper className="sidebar">
      {TabData?.map((tab) => (
        tab?.disable ?
        <div key={tab.id} className={ activeTabHome === tab.id ? " disable" :"disable" } >
        <Image src={tab.image} alt="" />
        {tab.tittle} 
        <div className="sson">coming soon</div>
      </div>

        :
        tab?.url ?
        <div key={tab.id} className={ activeTabHome === tab.id ? "tab active-tab" :"tab" } onClick={()=>     {setActiveTabHome(tab.id); router.push(tab?.url)   }   }>
        <Image src={tab.image} alt="" />
        {tab.tittle}
      </div>

        :
        <div key={tab.id} className={ activeTabHome === tab.id ? "tab active-tab" :"tab" } onClick={()=>   {setActiveTabHome(tab.id); router.push("/")   }}>
          <Image src={tab.image} alt="" />
          {tab.tittle}
        </div>
      ))}
    </HomSideWrapper>
  );
};

const HomSideWrapper = styled.div`

.sson{
  font-size: 10px;
  background-color: #d6d5d5;
  padding: 2px 4px;
  color: #000000; 
  white-space: nowrap;
  border-radius: 3px;

}
  border-right: 1px solid rgba(238, 238, 238, 1);
  min-height: 100vh;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: ${({ theme }) => theme.paddings.paddingTop};
  gap: 10px;
  display: flex;
  flex-direction: column;

  .tab {
    display: flex;
    justify-items: start;
    align-items: center;
    gap: 10px;
    width: 183px;
    border-radius: 6px;
    background: #eee;
    padding: 8px 26px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;

    transition: all 0.3s;
    &:hover{
    background-color: ${({ theme }) => theme.btnPrimaryHover};

    }
  }
  .disable{
    cursor: default;
    display: flex;
    justify-items: start;
    align-items: center;
    gap: 10px;
    width: 183px;
    border-radius: 6px;
    background: #eee;
    padding: 8px 26px;
    font-size: 14px;

    font-weight: 600;

    transition: all 0.3s;
    &:hover{
    background-color: ${({ theme }) => theme.btnPrimaryHover};

    }
    background: #eee;

    &:hover {
      background: #eee;

    }

  }
  .active-tab {
    background: ${({ theme }) => theme.btnPrimary};
    &:hover {
      background: ${({ theme }) => theme.btnPrimary};
    }
  }
`;

export default HomeSidebar;
