import styled from "@emotion/styled";
import { Link } from "@remix-run/react";

export const Container = styled.div`
  width: 100%;
  height: 100px;
  color: #fff;
  background-color: #032541;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
`;

export const ItemsContainer = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 50px;
  @media (max-width: 1000px) {
    width: 80%;
  }
`;

export const ItemLink = styled(Link)`
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
`;

export const ItemText = styled.p`
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
`;
