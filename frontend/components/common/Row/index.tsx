import styled from "styled-components";

export const Row = styled.div<{
    width?: string;
    align?: string;
    justify?: string;
    padding?: string;
    border?: string;
    borderRadius?: string;
    gap?: string;
  }>`
    width: ${({ width }) => width ?? "100%"};
    display: flex;
    padding: 0;
    align-items: ${({ align }) => align ?? "center"};
    justify-content: ${({ justify }) => justify ?? "flex-start"};
    padding: ${({ padding }) => padding};
    border: ${({ border }) => border};
    border-radius: ${({ borderRadius }) => borderRadius};
    gap: ${({ gap }) => gap};
  `;

export const RowBetween = styled(Row)`
justify-content: space-between;
`;

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    row-gap: 1rem;
  `};
`;
export const ResponsiveRowWrap = styled(Row)`
  display: grid;
  gap: 1rem;
  ${({ theme }) => theme.minMediaWidth.atleastSmall`
      grid-template-columns: repeat(2, 1fr);
  `}
  ${({ theme }) => theme.minMediaWidth.atleastLarge`
    grid-template-columns: repeat(2, 1fr);
   `}
`;
export const GridAutoWrap = styled(Row)<{ minWidth?: number }>`
  display: grid;
  grid-template-columns: ${({ minWidth }) =>
    `repeat(auto-fill, minmax(${minWidth ?? 300}px, 1fr))`};
  align-items: stretch;
  gap: 1rem;
`;

