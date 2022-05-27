import React from "react";
import { PulseLoader } from "react-spinners";
import { Overlay } from "./styles/loader.styles";

// import { Container } from './styles';

const Loader: React.FC = () => {
  return (
    <Overlay>
      <PulseLoader color="#fff" size={60} />
    </Overlay>
  );
};

export default Loader;
