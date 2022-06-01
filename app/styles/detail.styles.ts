import styled from "@emotion/styled";

type Props = {
  imageUrl?: string;
};

export const Container = styled.div<Props>`
  position: relative;
  display: flex;
  width: 100%;
  padding: 50px 0;
  gap: 50px;

  &:before {
    content: " ";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.1;
    background-image: url(${(props) => props.imageUrl});
    background-repeat: no-repeat;
    background-position: 50% 0;
    background-size: cover;
  }
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const DetailContainer = styled.div`
  padding: 25px 0;
  width: 70%;
  z-index: 2;
`;

export const Thumbnail = styled.img`
  border-radius: 10px;
  width: 30%;
  z-index: 2;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

export const FavButton = styled.button`
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

export const Title = styled.h1`
  font-size: 50px;
`;

export const SubTitle = styled.h3``;

export const Description = styled.h2`
  margin: 30px 0;
`;

export const GenresContainer = styled.div`
  display: flex;
  gap: 5px;
`;

export const Tag = styled.span`
  display: inline-block;
  min-width: 16px; /* pixel unit */
  padding: 15px 30px; /* pixel unit */
  border-radius: 15%;
  font-size: 15px;
  text-align: center;
  background: #032541;
  color: #fefefe;
`;
