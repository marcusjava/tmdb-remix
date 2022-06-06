import styled from "@emotion/styled";

export const DropdownCustom = styled.div`
  position: absolute;
  width: 350px;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  background-color: #141a29;
  border-radius: 5px;
  border: 2px solid #3f66ab;
  top: 85px;
  right: 42px;
  z-index: 5;
`;

export const Items = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
`;

export const NoItems = styled.span`
  margin: auto;
  color: #ef5350;
`;
