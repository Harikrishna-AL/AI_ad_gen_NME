// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { styled } from "styled-components";
import {  RowBetween } from "../common/Row";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/utils/supabase";
import { useAppState } from "@/context/app.context";
import { IconBack, IconFlipcart } from "@/public/assets/Icons";

const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const router = useRouter();
  const isGeneratorRoute = router.pathname === "/generate";
  const [projectName, setProjectName] = useState("Untitled");
  const [back, setBAck] = useState(false);
  const [userData, setuserData] = useState();
  const { userId, setUserID } = useAppState();

  const currentRoute = router.pathname;
  useEffect(() => {
  
    if (currentRoute === "/generate-3d/[id]") {
      setBAck(true);
    } else if (currentRoute === "/quick-generator/[id]") {
      setBAck(true);
    } else {
      setBAck(false);
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [currentRoute, session, userData]);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setuserData(data?.session);
      }
    };
    checkSession();
  }, [session]);

  const logoutH = async () => {
    await supabase.auth.signOut();
    setIsPopupOpen(false);

    setTimeout(() => {
      router.push("/sign-in");
    }, 500);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsPopupOpen((prevIsPopupOpen) => !prevIsPopupOpen);
  };



  return (
    <Headers>
      <RowBetween>
        {back ? (
          <Link href={"/tools"}>
            <div className="backbt">
             <IconBack/>
            </div>
          </Link>
        ) : null}

        <Link href={"/"}>
          <IconFlipcart />
        </Link>

        {isGeneratorRoute ? (
          <div className="pro-name">
            <div className="label">Projects/</div>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
        ) : null}

        <div className="profilbox">
          {userData?.user ? (
            <div className="profilIcon" onClick={handleButtonClick}>
              <div className="profile">{userData?.user?.email[0]}</div>
            </div>
          ) : null}

          {isPopupOpen && (
            <div className="topSpacre" ref={popupRef}>
              <div className="profilcard">
                <div className="propilname">{userData?.user?.email}</div>
                <div className="itemss">
                  <div className="items" onClick={logoutH}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="16"
                      viewBox="0 0 18 16"
                      fill="none"
                      stroke="#585858"
                      className="svg-s"
                    >
                      <path
                        d="M8.11111 11.5L4.55556 8M4.55556 8L8.11111 4.5M4.55556 8H17M12.5556 11.5V12.375C12.5556 13.0712 12.2746 13.7389 11.7745 14.2312C11.2744 14.7234 10.5961 15 9.88889 15H3.66667C2.95942 15 2.28115 14.7234 1.78105 14.2312C1.28095 13.7389 1 13.0712 1 12.375V3.625C1 2.92881 1.28095 2.26113 1.78105 1.76884C2.28115 1.27656 2.95942 1 3.66667 1H9.88889C10.5961 1 11.2744 1.27656 11.7745 1.76884C12.2746 2.26113 12.5556 2.92881 12.5556 3.625V4.5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>Logout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </RowBetween>
    </Headers>
  );
};

const Headers = styled.div`
  .backbt {
    width: 60px;
    height: 60px;
    svg {
      &:hover {
      }
    }
  }
  .pro-name {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(150, 150, 150, 1);
    font-size: 12px;
    font-weight: 500;

    input {
      color: rgba(0, 0, 0, 1);
      border: none;
      outline: none;
      background-color: transparent;

      :active {
        border: none;
        outline: none;
      }
      :focus-visible {
        border: none;
        outline: 0 !important;
      }
      &:focus:not(:focus-visible) {
        outline: none;
      }
    }
  }
  position: absolute;
  top: 0;
  z-index: 999;
  background-color: #fff;
  padding: 0 50px;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.bgBorder};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0 15px;


`}

  .profilbox {
    position: relative;
    font-size: 14px;

    .topSpacre {
      margin-top: 12px;
      position: absolute;
      right: 0px;
      top: 40px;
    }
    .profilIcon {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      cursor: pointer;
      overflow: hidden;
    }
    .profile {
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.btnPrimary};
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      text-transform: uppercase;
      /* font-weight : 600; */
    }
    .profilcard {
      border-radius: 19px;
      background: #fff;
      box-shadow: 0px 0px 30px 2px rgba(0, 0, 0, 0.04);
      border: 1px solid #858585;
      width: 280px;

      .propilname {
        padding: 12px 27px;
        border-bottom: 1px solid rgba(57, 57, 57, 1);
        font-weight: 500;
        /* text-transform: uppercase; */
      }
      .itemss {
        padding: 20px 27px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .items {
        display: flex;
        gap: 0.5rem;
        justify-content: start;
        align-items: center;
        color: rgba(88, 88, 88, 1);
        cursor: pointer;
        transition: all 2s;

        :hover {
          color: rgba(249, 208, 13, 1);
          transition: all 0.3s;
        }
      }
    }
  }
`;

export default Header;
