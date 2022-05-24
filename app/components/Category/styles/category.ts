import styled from "@emotion/styled";

interface Props {
  numberOfItems: number;
}

export const Container = styled.div`
  margin: 50px 0;
  width: 100%;
`;

export const Title = styled.h1`
  color: #fff;
  font-weight: bold;
  margin-bottom: 2rem;
`;

export const ItemsContainer = styled.div<Props>`
  display: flex;
  flex-direction: row;
  gap: 35px;
  align-items: center;
  justify-content: ${({ numberOfItems }) =>
    numberOfItems > 6 ? "space-between" : "flex-start"};
  flex-wrap: wrap;
  width: 100%;
`;
