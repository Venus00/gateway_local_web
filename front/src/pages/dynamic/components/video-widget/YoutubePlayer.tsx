import React, { useEffect } from "react";

// Extend the Window interface to include onYouTubeIframeAPIReady
declare global {
  interface Window {
    onYouTubeIframeAPIReady: (() => void) | null;
    YT: any;
  }
}

const YouTubePlayer = ({ src }: any) => {
  useEffect(() => {
    // Load YouTube API script
    const loadYouTubeAPI = () => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    };

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player("youtube-iframe", {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    // Player ready callback
    const onPlayerReady = (event) => {
      const iframe = document.getElementById("youtube-iframe");
      if (iframe) iframe.style.borderColor = "#FF6D00";
    };

    // Player state change callback
    const onPlayerStateChange = (event) => {
      changeBorderColor(event.data);
    };

    // Change border color based on player state
    const changeBorderColor = (playerStatus) => {
      const iframe = document.getElementById("youtube-iframe");
      if (!iframe) return;

      let color;
      switch (playerStatus) {
        case -1:
          color = "#37474F";
          break; // unstarted = gray
        case 0:
          color = "#FFFF00";
          break; // ended = yellow
        case 1:
          color = "#33691E";
          break; // playing = green
        case 2:
          color = "#DD2C00";
          break; // paused = red
        case 3:
          color = "#AA00FF";
          break; // buffering = purple
        case 5:
          color = "#FF6D00";
          break; // video cued = orange
        default:
          color = null;
      }

      if (color) iframe.style.borderColor = color;
    };

    loadYouTubeAPI();

    // Cleanup
    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  return (
    <iframe
      id="youtube-iframe"
      width="100%"
      height="100%"
      src={src}
      style={{ overflow: "hidden" }}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default YouTubePlayer;
