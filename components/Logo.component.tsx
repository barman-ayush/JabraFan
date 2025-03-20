import { Fragment } from "react";
import Image from "next/image";
import LogoImage from "../public/Logo.png";

const Logo = () => {
    return (
        <Fragment>
            <div className="flex items-center gap-3">
                <Image 
                    src={LogoImage} 
                    alt="Jabra Fan Logo" 
                    width={100}
                    className="object-contain"
                />
                <h1 className="text-3xl hidden md:block font-bold text-white dark:text-yellow-400 drop-shadow-md">
                    Jabra Fan
                </h1>
            </div>
        </Fragment>
    );
}

export default Logo;