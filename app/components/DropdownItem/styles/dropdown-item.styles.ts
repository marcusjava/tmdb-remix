import styled from "@emotion/styled";

export const Item = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 0;
  cursor: pointer;
  background-color: transparent;
  gap: 10px;
  &:hover {
    opacity: 0.8;
  }
`;

export const AvatarContainer = styled.div`
  width: 30%;
`;

export const Avatar = styled.img`
  height: 150px;
  width: 100%;
`;

export const Description = styled.div`
  width: 70%;
`;
