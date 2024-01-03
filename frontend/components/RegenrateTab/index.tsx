// @ts-nocheck


import React from "react";
import { styled } from "styled-components";
import { Row } from "../common/Row";
import TextLoader from "../Loader/text";
import Button from "../common/Button";
import { useAppState } from "@/context/app.context";
import { DisabledLabel } from "../common/Label";
import DropdownInput from "../common/Dropdown";
import SuggetionInput from "../Generate/SuggetionInput";
import { productSuggestions } from "@/data/dropdown";

const RegenratTab = () => {
  const {
    product,
    placementTest,
    backgroundTest,
    surroundingTest,
    generationLoader,
    setGenerationLoader,
    selectPlacement,
    selectSurrounding,
    selectBackground,
    getBase64FromUrl,
    addimgToCanvasGen,
    canvasInstance,
    setGeneratedImgList,
    generatedImgList,
    setSelectedImg,
    setLoader,
    selectedImg,

    setModifidImageArray,
    selectResult,
    editorBox,
    loader,
    jobId,
    setProduct,

    setJobId,
    setSelectedresult,
    generateImageHandeler,
  } = useAppState();

  const ProductSuggestionsFilter = productSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(product.toLowerCase())
  );
  return (
    <Wrappers>
      <div className="filde gap">
        <DisabledLabel>Product</DisabledLabel>
        <SuggetionInput
          value={product}
          setValue={setProduct}
          suggetion={ProductSuggestionsFilter}
        />
      </div>
      <div className="gap">
        <Row></Row>
        <Row>
          {loader ? (
            <TextLoader />
          ) : (
            <Button
              onClick={() => generateImageHandeler()}
              disabled={product === "" ? true : false}
            >
              {generationLoader ? "Loading..." : "Generate"}
            </Button>
          )}
        </Row>
      </div>
    </Wrappers>
  );
};

export default RegenratTab;

export const Wrappers = styled.div`
  /* max-height: 600px;
  overflow-y: scroll; */
`;
