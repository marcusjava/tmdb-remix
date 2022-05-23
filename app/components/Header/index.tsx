import { SiThemoviedatabase } from "react-icons/si";
import { BsDoorClosedFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { Link } from "@remix-run/react";

export const Header = () => {
  return (
    <div className="container">
      <Link to="/home">
        <IconContext.Provider
          value={{ style: { color: "#fff", fontSize: 60 } }}
        >
          <SiThemoviedatabase />
        </IconContext.Provider>
      </Link>
    </div>
  );
};
