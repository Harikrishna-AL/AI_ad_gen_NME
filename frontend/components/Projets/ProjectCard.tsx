// @ts-nocheck

import React, { useState, useRef } from "react";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import { useRouter } from "next/router";

const ProjectCard = ({
  data,
  handleDelet,
  handleEdite,
  setprojectsLoader,
}) => {
  const [open, setopen] = useState(false);
  const [rename, setRename] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  const [projectName, setProjectName] = useState(data.title);
  const { setFilteredArray } = useAppState();

  const handleRename = () => {
    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.select();
    }, 100);

    setopen(false);
  };
  const onChangeHandle = (e, id) => {
    setProjectName(e.target.value);

    handleEdite(id, e.target.value);
  };

  const handleDeletFun = async (id) => {

    await handleDelet(id);
    setopen(false);
  };

  const navigate = () => {
    setFilteredArray([]);

    setprojectsLoader(true);
    router.push(`/generate/${data.project_id}`);
  };

  return (
    <CardWrapper className="projectfile link">
      <div className="img" onClick={() => navigate()}>
        {data?.previewImage !== "" ? (
          <img src={data?.previewImage} alt="" />
        ) : null}
      </div>

      <div className="testcreat">
        <div className="pro-name">
          <input
            ref={inputRef}
            type="text"
            value={projectName}
            onChange={(e) => onChangeHandle(e, data.project_id)}
            disabled={rename !== true ? true : false}
          />
        </div>
        <div className="edit">
          <div onClick={() => setopen(!open)}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 16a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3zm0 13a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3zm0-26a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3z"
                fill="#747474"
              />
            </svg>
          </div>
          {open && (
            <div className="openbox">
              <div
                className="items"
                onClick={() => {
                  setRename(true);
                  handleRename();
                }}
              >
                <div className="icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className="text">Rename</div>
              </div>
              <div className="items" onClick={() => handleDeletFun(data.project_id)}>
                <div className="icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-zinc-300"
                  >
                    <path
                      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className="text">Delete</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

export default ProjectCard;

const CardWrapper = styled.div`
  cursor: pointer;
  .link {
    cursor: pointer;
  }
  .img {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 99.9%;
      object-fit: cover;
      height: 99.9%;
    }
  }
  width: 100%;
  height: 200px;
  border-radius: 16px;
  border: 1px solid #d9d9d9;
  position: relative;
  transition: all 0.3s;
  overflow: hidden;

  &:hover {
    border: 1px solid #f9d00d;
  }

  input {
    background-color: transparent;
    width: 120px;
    border: none;
    color: #000;
    &:focus {
      color: #000;
    }
    &:hover {
      border: none;
      background-color: transparent;
      outline: none;
    }
    &:focus-visible {
      border: none !important;
    }
  }
  .testcreat {
    border-radius: 0px 0px 16px 16px;
    background: #e3e3e3;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 16px;
    font-size: 14px;
    transition: all 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .edit {
    position: relative;
    cursor: pointer;
    svg {
      width: 15px !important;
      height: 15px !important;
    }

    img {
      width: 30px;
      height: 30px;
    }

    .openbox {
      border: 1px solid #d9d9d9;
      width: max-content;
      padding: 5px;
      border-radius: 7px;

      position: absolute;
      right: -17px;
      bottom: 30px;
      background: #ffffff;

      .items {
        display: flex;
        border-radius: 7px;
        transition: all 0.3s ease;
        gap: 10px;
        padding: 10px 10px;
        &:hover {
          background: #e3e3e3;
        }
      }
    }
  }
`;
