// @ts-nocheck

"use client";

import Head from "next/head";
import styled from "styled-components";
import Header from "@/components/Header";
import { useAppState } from "@/context/app.context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import OnMobile from "@/components/OnMobile/OnMobile";

const LayoutContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { setUserID } = useAppState();
  const router = useRouter();

  const isSignInPage = router.pathname === "/sign-in/[[...index]]";

  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    // Check if we're in a browser environment before using window
    if (typeof window !== "undefined") {
      // Initial check on mount
      handleResize();

      // Add event listener for window resize
      window.addEventListener("resize", handleResize);

      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserID(data.session.user.id);
      } else {
        if (!isSignInPage) {
          router.push("/sign-in");
        }
      }
    };
    checkSession();
  }, [router, setUserID]);
  return (
    <>
      <Head>
        <title>Flipkart AI</title>
        <meta name="description" content="Flipkart AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutContentWrapper>
        <ToastContainer />
        <>
          <Header />
          {isMobile ? <OnMobile /> : children}
        </>
      </LayoutContentWrapper>
    </>
  );
};

export default Layout;
