import React from "react";
import style from "./LoaderForElement.module.scss";

function LoaderForElement() {
  return (
    <div className={style.loaderContainer}>
      <span className={style.loader}></span>
    </div>
  );
}

export default LoaderForElement;
