import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  height: 600px;
  margin: 50px 0;
`;

export const Content = styled.div`
  text-align: center;
  position: relative;
  display: inline-block;
  color: #fff;
  width: 100%;
`;

export const TextContainer = styled.div`
  position: absolute;
  z-index: 999;

  left: 0;
  right: 0;
  top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

export const Title = styled.p`
  font-size: 70px;
  font-weight: bold;
`;

export const Image = styled.img`
  width: 100%;
  height: 600px;
  object-fit: cover;
`;

export const SubTitle = styled.h3`
  font-weight: bold;
  font-size: 30px;
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 50%;
  margin-bottom: 25px;
`;

export const SearchInput = styled.input`
  margin: 0px;
  padding-left: 20px;
  width: 100%;
  outline: none;
  height: 60px;
  border-radius: 25px;
  font-size: 25px;
  color: #787878;
`;

export const SearchButton = styled.button`
  position: absolute;
  top: 0;
  border-radius: 25px;
  padding: 0 50px;
  right: 0px;
  z-index: 2;
  border: none;
  top: 2px;
  height: 60px;
  cursor: pointer;
  color: white;
  background-color: #1e90ff;
  transform: translateX(2px);
  font-size: 30px;
  &:hover {
    opacity: 0.6;
  }
`;
