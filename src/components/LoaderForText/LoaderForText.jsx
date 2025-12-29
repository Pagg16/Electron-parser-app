import React from "react";
import styles from "./LoaderForText.module.scss";

function LoaderForText() {
  return (
    <div className={styles.loading}>
      <span>з</span>
      <span>а</span>
      <span>г</span>
      <span>р</span>
      <span>у</span>
      <span>з</span>
      <span>к</span>
      <span>а&nbsp;</span>
      <span>.&nbsp;</span>
      <span>.&nbsp;</span>
      <span>.</span>
    </div>
  );
}

export default LoaderForText;
