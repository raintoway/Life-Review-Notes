import React, { useEffect } from "react";
import magic from "./fluid-init.js";
interface IProps {}
const Fluid: React.FC<IProps> = (props: IProps) => {
  const style = {
    color: "white",
    height: "100%", // Canvas is will respond to size changes without resetting fluid!
    width: "100%",
    margin: 0,
  };
  useEffect(() => {
    magic();
    return () => {};
  }, []);
  return <canvas className="fluid-canvas" style={style}></canvas>;
};
export default Fluid;
