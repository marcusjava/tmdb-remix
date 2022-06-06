import styled from "@emotion/styled";

export const DropdownContainer = styled.div`
  width: 90px;
  height: 90px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

export const PokeBall = styled.img`
  width: 34px;
  height: 34px;
`;

export const CountContainer = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  color: white;
  display: grid;
  place-items: center;
`;

export const Count = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;
