import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const CustomLoader = ({ loader, message }) => {
  return (
    <>
      {loader && (
        <Dimmer active style={{ borderRadius: "16px" }}>
          <Loader content={message} />
        </Dimmer>
      )}
    </>
  );
};

export default CustomLoader;
