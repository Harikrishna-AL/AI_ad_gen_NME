// @ts-nocheck

import { styled } from "styled-components";
import HomeSidebar from "@/components/Sidebar/HomeSidebar";
import Projects from "@/components/Projets/Projects";
import { useAppState } from "@/context/app.context";
import Tools from "@/components/Tools/Tools";
import Gellery from "@/components/Gellery/Gellery";
import AssetsDir from "@/components/AssetsDirectory";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import PopupCard from "@/components/Popup/PopupCard";
import axios from "axios";
import { useRouter } from "next/router";
import MainLoader from "@/components/Loader/main";
import PopupUpload from "@/components/Popup";
import { supabase } from "@/utils/supabase";


export default function Home() {
  const session = useSession();
  const router = useRouter();
  const { query, isReady } = router;
  const {
    activeTabHome,
    setActiveTabHome,
    activeTab,
    popupImage,
    projectlist,
    setMainLoader,
    setprojectlist,
    setElevatedSurface,
    mainLoader,
    setFilteredArray,
    setActiveTab,
    setpromtFull,
    setActiveTemplet,
    setcategory,
    setDownloadeImgFormate,
    setProduct,
    setpromt,
    setLoader,
    fetchAssetsImages,
    popup,
    setSelectedImg,
    userId,
    setUserID,
    setListOfAssetsById,
    GetProjexts,
    setActiveSize,
    setListOfAssets,
  } = useAppState();

  const [rerenter, setre] = useState(1);

  useEffect(() => {
    if (isReady) {
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setUserID(data.session.user.id);
          GetProjexts(data.session.user.id);
        } else {
        }
      };
      checkSession();
    }
  }, [session]);

  useEffect(() => {
    if (rerenter <= 6) {
      setre(rerenter + 1);
    }
    setSelectedImg(null);

    if (isReady && userId) {
      setElevatedSurface(false);

      setActiveTab(1);
      setcategory(null);
      setListOfAssets(null);
      setpromtFull("");
      setActiveTemplet(null);
      setDownloadeImgFormate("png");
      setProduct("");
      setpromt("");
      setListOfAssetsById([]);
      setLoader(false);
      setActiveSize({
        id: 1,
        title: "Default",
        subTittle: "1024✕1024",
        h: 512,
        w: 512,
        l: 50,
        t: 160,
        gl: 592,
        gt: 160,
      });

      fetchAssetsImages(userId, null);
      setFilteredArray(null);

      (async () => {
        try {
          const responses = await axios.get(`/api/project?user_id=${userId}`);
          if (responses.data) {
            setprojectlist(responses.data);
            setMainLoader(false);
          }
        } catch (e) {
          setMainLoader(false);
        }
      })();
    }
  }, [userId]);

  return (
    <MainPage>
      {popup?.status ? <PopupUpload /> : null}
      {mainLoader ? <MainLoader /> : null}
      <div className="new">
        {popupImage.status ? <PopupCard /> : null}
        <HomeSidebar />
        <div className="dashbaord">
          {activeTabHome === 1 ? (
            <Projects />
          ) : activeTabHome === 2 ? (
            <AssetsDir />
          ) : activeTabHome === 3 ? (
            <Gellery />
          ) : (
            <Tools />
          )}
        </div>
      </div>
    </MainPage>
  );
}

const MainPage = styled.div`
  .new {
    display: flex;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
.sidebar{
  display: none;;
}
`}

  .dashbaord {
    position: relative;
    background: #f8f8f8;
    width: 100%;
    max-height: 100vh;
    padding: 40px 30px;
    padding-top: ${({ theme }) => theme.paddings.paddingTop};
    overflow: auto;

    ${({ theme }) => theme.mediaWidth.upToMedium`
.gridebox {
   
      grid-template-columns: 1fr 1fr ;
      gap: 12px;

      .createbox {
        cursor: pointer;
        width: 100%;
        height: 185px;
        border-radius: 16px;
        background: #f8f8f8;
        border-radius: 16px;
        border: 1px solid #585858;
        position: relative;
        display: flex;
        justify-content: center;
        /* align-items: center; */
        transition: all 0.3s;
        svg {
          margin: 60px;
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
     
  }
`}
  }
`;
