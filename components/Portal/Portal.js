import React from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const [portalElt, setPortalElt] = React.useState(null);

  React.useEffect(() => {
    const newElt = document.createElement("div");
    document.querySelector("body").append(newElt);
    setPortalElt(newElt);

    return () => {
      newElt.remove();
    };
  }, []);

  if (!portalElt) {
    return null;
  }

  return createPortal(children, portalElt);
};

export default Portal;
