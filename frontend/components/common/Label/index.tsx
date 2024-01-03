import React from "react";
import styled from "styled-components";
import { Row } from "../Row";

const Label = ({ children }: { children: React.ReactNode }) => {
  return <LabelWrapper>{children}</LabelWrapper>;
};
const LabelWrapper = styled(Row)`
  font-weight: 500;
  line-height: 24px;
  font-size: 14px;
  border-radius: 0.25rem;
  width: fit-content;
`;
export const DisabledLabel = styled.p`
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  font-size: 12px;
  color: #828282;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export default Label;
