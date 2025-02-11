import { Fragment } from "react";
interface LImageProps {
  src: string;
  height: string;
  width: string;
  isFirst: boolean;
  classes : string;
  rank : string;
}

const LImage = ({ src, height, width, isFirst , classes , rank }: LImageProps) => {
  return (
    <Fragment>
      <div className={`relative profile-image-container ${classes}`} style={{height , width}}>
        <img
          src={src}
          style={{height , width}}
          className="rounded-full object-cover object-center border-4 border-dark-primary border-solid"
        />
        {isFirst && (
          <img
            src="/crown.png"
            className="absolute"
            style={{ top: "-27%", left: "30%" }}
            alt=""
          />
        )}
        <span className="rank-container rounded-full relative bg-white dark:bg-black p-2" style={{top : "-20%" , width : "10px" , height : "10px" , borderRadius : "50%"}}>
            {rank}
        </span>
      <p>Ayush</p>
      </div>
    </Fragment>
  );
};
export default LImage;
