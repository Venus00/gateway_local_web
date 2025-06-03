/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-provider";
import { useSocket } from "@/features/socket/SockerProvider";
import { GaugeWidgetData, Widget } from "@/utils";
import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useLocation } from "react-router";
import FlvPlayer from "./FlvPlayer";
import videojs from "video.js";
import YouTubePlayer from "./YoutubePlayer";

type Data = {
  name: string;
  url: string;
};

export default function VideoWidget(props: Widget) {
  // const gaugeData = props.attributes as GaugeWidgetData;
  const { url, videoType } = props.attributes as Data;

  const playerRef = useRef(null);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      // videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      // videojs.log("player will dispose");
    });
  };
  return (
    <div className=" flex h-full w-full overflow-hidden ">
      {videoType === "stream" ? (
        <FlvPlayer
          onReady={handlePlayerReady}
          src={
            url ??
            "https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8"
          }
        />
      ) : (
        <YouTubePlayer src={url} />
      )}
    </div>
  );
}
