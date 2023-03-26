import React from "react";

const YouTube = ({ link }) => {
  return (
    <>
      <iframe
        width="100%"
        height="750px"
        src={link}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </>
  );
};

export default YouTube;
