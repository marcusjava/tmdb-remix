import styled from "@emotion/styled";
import { Form as RemixForm } from "@remix-run/react";

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
`;

export const SignContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 60px;
  justify-content: space-evenly;
  margin: 60px 0;
  @media (max-width: 1190px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const Card = styled.div`
  width: 40%;
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

export const Form = styled(RemixForm)`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`;

export const Title = styled.h2`
  font-weight: bold;
`;

export const SubTitle = styled.h4`
  font-weight: 100;
`;

export const Error = styled.p`
  margin: 5px;
  font-weight: bold;
  color: #e72749;
`;
