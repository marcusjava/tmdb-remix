import styled from "@emotion/styled";

export const ErrorContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  place-items: center;
`;

export const Card = styled.div`
  width: 40%;
  height: 200px;
  padding-left: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  border: 6px solid #fff;
  border-radius: 5px;
`;

export const ErrorMessage = styled.h2`
  color: #fff;
  font-weight: bold;
`;
