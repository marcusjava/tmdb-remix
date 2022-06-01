import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
  margin-top: 50px;
`;

export const MovieCard = styled.div`
  width: 60%;
  min-height: 200px;
  border: 1px solid #e3e3e3;
  border-radius: 5px;

  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

export const Image = styled.img`
  width: 150px;
  height: 100%;
  cursor: pointer;
`;

export const Content = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2``;

export const ReleaseDate = styled.p`
  color: #adadad;
`;

export const Description = styled.p`
  font-size: 20px;
`;
