import { Fragment } from "react";
import Image from "next/image";
import LogoImage from "../public/Logo.png";

interface LogoProps {
  isSidebar?: boolean;
  width? : number
}

const Logo = ({ isSidebar = false , width = 100 }: LogoProps) => {
  return (
    <Fragment>
      <div className="flex items-center gap-3">
        <Image
          src={LogoImage}
          alt="Jabra Fan Logo"
          width={width}
          className="object-contain"
        />
        <h1
          className={`text-2xl ${
            !isSidebar ? "hidden" : ""
          } md:block font-bold  text-indigo-700 dark:text-yellow-400 drop-shadow-md`}
        >
          Jabra Fan
        </h1>
      </div>
    </Fragment>
  );
};

export default Logo;
