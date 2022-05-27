import styled from "@emotion/styled";

export const ErrorContainer = styled.div`
  width: 200%;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 6px solid #fff;
  border-radius: 5px;
  @media (max-width: 1190px) {
    width: 100%;
  }
`;

export const ErrorMessage = styled.h2`
  color: #fff;
  font-weight: bold;
`;
