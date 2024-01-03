import React, { useState } from "react";
import { Row } from "../common/Row";
import Label, { DisabledLabel } from "../common/Label";
import { FileUpload3D, Input } from "../common/Input";
import { styled } from "styled-components";
import { useAppState } from "@/context/app.context";
import Button from "../common/Button";
import { formate3d } from "@/data/format";

const Assets3d = () => {
  const {
    loader,
    setFile3dUrl,
    setFile3d,
    file3dName,
    tdFormate,
    assetL3doader,
    setFile3dName,
    setTdFormate,
    userId,
  } = useAppState();

  const [url, setUrl] = useState(null);
  function slideName(name: string) {
    const maxLength = 8;
    let displayedName;

    if (name.length <= maxLength) {
      displayedName = name;
    } else {
      const firstPart = name.slice(0, 15);
      const lastPart = name.slice(-15);
      displayedName = firstPart + "..." + lastPart;
    }

    return displayedName;
  }
  const addUrl = (e: any) => {
    setUrl(e.target.value);
  };
  const HandileUrl = () => {
    setUrl(null);
    setFile3d(null);
    setFile3dUrl(url);
    if (url) {
      const name = slideName(url);
      setFile3dName({ name: name });
    }
  };

  function truncateString(inputString: string) {
    if (inputString.length >= 11) {
      const firstPart = inputString.slice(0, 15);
      const lastPart = inputString.slice(-15);
      const truncatedString = `${firstPart}...${lastPart}`;
      return truncatedString;
    } else {
      return inputString;
    }
  }

  return (
    <div className="accest">
      <AllWrapper>
        {file3dName?.name && !assetL3doader ? (
          <Selectd className="gap">
            <div className="boxFile">
              <div className="filenamer">
                {truncateString(file3dName?.name)}
              </div>
              <div
                className="colse"
                onClick={() => {
                  if (!loader) {
                    setFile3d(null);
                    setFile3dUrl(null);
                    setFile3dName(null);
                  }
                }}
              >
                x
              </div>
            </div>
            <div className="gap" style={{ marginTop: "10px" }}>
              <DisabledLabel>
                The model was uploaded successfully. You can rotate it using the
                mouse pointer and move it using Ctrl + mouse pointer.
              </DisabledLabel>
              <div></div>
            </div>
          </Selectd>
        ) : (
          <div className="gap">
            <Row>
              <Label>Select your file format</Label>
            </Row>
            <FormateBtnBox>
              <div className="formatfox">
                {formate3d.map((formate, i) => (
                  <div
                    key={i}
                    className={
                      tdFormate === formate.formate
                        ? "formatebtn activFormate"
                        : "formatebtn"
                    }
                    onClick={() => {
                      setTdFormate(formate.formate);
                      setFile3d(null);
                      setFile3dUrl(null);
                    }}
                  >
                    {formate.tittle}
                  </div>
                ))}
              </div>
            </FormateBtnBox>

            <Row>
              <FileUpload3D
                type={"product"}
                title={` Upload 3D Object (eg: tree${tdFormate})`}
                uerId={userId}
              />
            </Row>
            <div
              style={{
                textAlign: "center",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Label>Or</Label>
            </div>
            <Row>
              <Input
                type="text"
                value={url ? url : ""}
                onChange={(e) => addUrl(e)}
                placeholder={` 3D Object  URL (file type should be ${tdFormate})`}
              />
            </Row>
            <Row>
              <Button onClick={HandileUrl} disabled={url ? false : true}>
                Add 3D Object{" "}
              </Button>
            </Row>
          </div>
        )}
      </AllWrapper>
    </div>
  );
};

export const AllWrapper = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;

export const Selectd = styled.div`
  .boxFile {
    border-radius: 8px;
    padding: 8px 15px;
    border: 2px solid rgba(249, 208, 13, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .filenamer {
    }
    .colse {
      cursor: pointer;
    }
  }
`;
export const FormateBtnBox = styled.div`
  .formatfox {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .formatebtn {
    border: 2px solid rgba(249, 208, 13, 1);
    padding: 3px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3 ease;
    background: #ffffff !important;

    &:hover {
      background: rgba(249, 208, 13, 1) !important;
    }
  }
  .activFormate {
    background: rgba(249, 208, 13, 1) !important;
  }
`;

export const ResponsiveRowWraptwo = styled(Row)`
  display: grid !important;
  gap: 0.5rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(3, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(3, 1fr);
   `}
`;

export default Assets3d;
