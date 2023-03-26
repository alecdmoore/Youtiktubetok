import React from "react";

const TikTok = ({ link }) => {
  // useEffect(() => {
  //     const arr = link.split("/");
  //     setEmbedLink(`${arr[0]}//${arr[2]}/embed/${arr[5]}`);
  //   }, [link]);

  return (
    <>
      <iframe
        width="100%"
        height="750px"
        src={link}
        title="TikTok video player"
        frameBorder="0"
        allow="encrypted-media;"
        allowFullScreen
      ></iframe>
    </>
  );
};

export default TikTok;
