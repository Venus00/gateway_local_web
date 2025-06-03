/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
const FlvPlayer = (props: any) => {
  const options = {
    autoplay: true,
    controls: true,
    responsive: true,
    // height: 100,
    fluid: true,
    sources: [
      {
        src: props.src,
        //type: 'application/x-mpegURL'
      },
    ],
  };

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { onReady } = props;

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-default-skin");
      videoElement.classList.add("vjs-big-play-centered");

      // videoElement.height = 100;
      videoRef?.current.appendChild(videoElement);
      const player = (playerRef.current = videojs(videoElement, options, () => {
        // videojs.log("player is ready");
        onReady && onReady(player);
      }));
      player.muted(true);
      player.on("error", () => {
        // console.log("test", player.error()); //Gives MEDIA_ERR_SRC_NOT_SUPPORTED error
        //player.src(urls[0]);
      });
      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;
      player.src(props.src);

      player.autoplay(options.autoplay);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div
      data-vjs-player
      className=" flex w-full h-full  justify-center items-center "
    >
      <div
        className=" video-js w-full h-auto "
        // className="overflow-hidden debug"
        // style={{ width: "100%", height: "100%", maxHeight: "100%" }}
        ref={videoRef}
      />
    </div>
  );
};

export default FlvPlayer;
