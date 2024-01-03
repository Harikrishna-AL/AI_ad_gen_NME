// @ts-nocheck

import React, { useState } from "react";
import { styled } from "styled-components";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { useAppState } from "@/context/app.context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const Projects = () => {
  const router = useRouter();

  const { setFilteredArray, projectlist, GetProjexts, renameProject, userId } =
    useAppState();
  const [projectsLoader, setprojectsLoader] = useState(false);

  const handleCreate = async () => {
    try {
      setprojectsLoader(true);
      if (userId) {
        const response = await fetch(`/api/project?user_id=${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // title: "Untitled",
            // id: userId,
          }),
        });

        const resData = await response.json();

        if (resData?.success) {
          setFilteredArray([]);

          router.push(`/generate/${resData?.project_id}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdite = async (id: string, name: string) => {
    try {
      renameProject(userId, id, name);
      GetProjexts(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelet = async (id: string) => {
    try {
      const data = await fetch(`/api/project?should_delete=${true}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: id,
          // id: userId,
        }),
      });
      if (data.status === 200) {
        toast.success("Project Deleted successfully ");
        GetProjexts(userId);
      } else {
        toast.error("failed Deleting Project ");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <>
      {projectsLoader ? (
        <DaoderWarpper>
          <div className="jumping-dots-loader">
            {" "}
            <span></span> <span></span> <span></span>{" "}
          </div>
          <div className="moving-gradient"></div>
        </DaoderWarpper>
      ) : null}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="new"
      >
        <ProjectWrapper className="gridebox">
          <div className="createbox" onClick={handleCreate}>
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

            <div className="testcreat">Create new project</div>
          </div>

          {projectlist?.map((item: any, i: number) => (
            <ProjectCard
              key={item._id}
              data={item}
              handleDelet={handleDelet}
              handleEdite={handleEdite}
              setprojectsLoader={setprojectsLoader}
            />
          ))}
        </ProjectWrapper>
      </motion.div>
    </>
  );
};

export default Projects;

const DaoderWarpper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 100;
  background-color: #ffffff;
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

const ProjectWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  /* grid-template-columns: 1fr 1fr 1fr 1fr; */
  grid-template-rows: 1fr 1fr;
  /* grid-template-rows: repeat(auto-fill, minmax(100px, 1fr)); */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;

  .createbox {
    cursor: pointer;
    width: 100%;
    height: 100%;
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
