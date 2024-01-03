import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  ${({ theme }) => theme.flexRowNoWrap}
  flex-wrap: initial;
  justify-content: center;
`;

export const HeaderWrapper = styled(Wrapper)`
  background: transparent;
  z-index: 10;
`;


