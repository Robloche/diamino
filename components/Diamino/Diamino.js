import React from "react";
import clsx from "clsx";
import styles from "./Diamino.module.css";

const Diamino = ({ diamino }) => {
  const { number, points, state } = diamino;

  const diamonds = [];
  for (let i = 0; i < points; ++i) {
    diamonds.push("💎");
  }

  return (
    <div className={clsx(styles.diamino, styles[state])}>
      <div className={styles.number}>{number}</div>
      <div className={styles.points}>
        {diamonds.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </div>
  );
};

export default Diamino;
