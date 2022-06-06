import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  Count,
  CountContainer,
  DropdownContainer,
} from "./styles/dropdown.styles";
import { AiOutlineStar } from "react-icons/ai";
import DropdownItems from "../DropdownItems";

interface Props {
  userId: number;
}

const Dropdown = () => {
  const [open, setOpen] = useState<Boolean>(false);
  const data = useLoaderData();

  return (
    <>
      <DropdownContainer onClick={() => setOpen(!open)}>
        <AiOutlineStar size={70} style={{ fill: "white" }} />
        <CountContainer>
          <Count>{data.favorites?.length}</Count>
        </CountContainer>
      </DropdownContainer>
      {open ? <DropdownItems favorites={data.favorites} /> : null}
    </>
  );
};

export default Dropdown;
