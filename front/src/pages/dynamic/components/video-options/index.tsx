import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddWidgetStore } from "../../widget-store";
import ColorPicker from "@/components/color-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import FlvPlayer from "../video-widget/FlvPlayer";
import YouTubePlayer from "../video-widget/YoutubePlayer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export default function VideoOptions() {
  const { data } = useAddWidgetStore();
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState(false);

  const { backgroundColor, color } = data;
  const playerRef = useRef(null);
  const url = (data.attributes?.url || "") as string;
  const videoType = (data.attributes?.videoType || "") as string;
  useEffect(() => {}, [url]);
  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    player.on("error", (e: any) => {
      // console.error("Player error:", e);
      setError(true);
    });
    // You can handle player events here, for example:
    player.on("waiting", () => {
      // videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      // videojs.log("player will dispose");
    });
  };

  return (
    <div className="flex flex-col  gap-4 relative z-[9999]">
      <div className={`flex flex-col items-end gap-2 p-3 h-[480px] `}>
        <Button
          variant="ghost"
          size="icon"
          title="Toggle theme"
          className=" items-end hover:bg-transparent w-fit !text-black dark:!text-white dark:hover:text-white hover:text-black"
          onClick={() => {
            setIsDark((prev) => !prev);
            setTheme(isDark ? "light" : "dark");
          }}
        >
          {theme !== "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
          ) : (
            <Moon className=" h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div
          className={
            "flex-1  w-full h-[180px]  overflow-hidden border p-4 rounded-lg"
          }
          style={{
            backgroundColor,
            color,
          }}
        >
          <h3 className="!pb-1  first-letter:uppercase font-semibold truncate">
            {data.title || "New Video Widget"}
          </h3>
          <div className=" flex h-full w-full overflow-hidden ">
            {videoType === "stream" ? (
              <FlvPlayer onReady={handlePlayerReady} src={url} />
            ) : (
              <YouTubePlayer src={url} />
            )}
          </div>
        </div>
      </div>
      <Tabs defaultValue="basic" className="w-full  space-y-4">
        <TabsList className="bg-transparent rounded-none   border-b w-full justify-start p-0 h-fit">
          <TabsTrigger
            value="basic"
            className="border-0 pb-2 rounded-none    shadow-none bg-transparent data-[state=active]:bg-transparent 
        data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
         data-[state=active]:text-blue-500"
          >
            Basics
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="border-0 pb-2 rounded-none    shadow-none bg-transparent data-[state=active]:bg-transparent 
        data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
         data-[state=active]:text-blue-500"
          >
            Data
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="border-0 pb-2 rounded-none    shadow-none bg-transparent data-[state=active]:bg-transparent 
        data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
         data-[state=active]:text-blue-500"
          >
            Appearance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <BasicTab />
        </TabsContent>
        <TabsContent value="data">
          <DataTab />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
function BasicTab() {
  const { data, setTitle } = useAddWidgetStore();
  return (
    <div>
      <Label>title</Label>
      <Input
        autoFocus
        id="title"
        name="title"
        placeholder="title"
        value={data.title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
}
function DataTab() {
  const { data, setAttribute } = useAddWidgetStore();
  const url = (data.attributes?.url || "") as string;
  const videoType = (data.attributes?.videoType || "") as string;
  return (
    <div className="flex flex-col gap-4 relative">
      <div className="">
        <Label>Video Type</Label>
        <RadioGroup
          className="flex items-center gap-2 w-full"
          defaultValue={videoType}
          onValueChange={(value) => {
            setAttribute("videoType", value);
            setAttribute("url", "");
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={"stream"} id={"stream"} />
            <Label htmlFor={"stream"}>Stream</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={"youtube"} id={"youtube"} />
            <Label htmlFor={"youtube"}>Youtube</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label>Url</Label>

        <Input
          className="rounded"
          //   placeholder={t("unit")}
          placeholder="url"
          name="url"
          value={url}
          onChange={(e) => {
            e.preventDefault();
            setAttribute("url", e.currentTarget.value);
          }}
        />
      </div>
    </div>
  );
}
function AppearanceTab() {
  const { data, setBackgroundColor, setColor } = useAddWidgetStore();
  const backgroundColor = data.backgroundColor as string;
  const color = data.color as string;

  return (
    <div className="flex flex-col gap-4  ">
      <div className="grid grid-cols-[10rem,1fr] items-center gap-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <ColorPicker
          className="rounded-md w-24 !e !ring-0 h-6 outline-none border-none"
          color={backgroundColor}
          onChange={setBackgroundColor}
        />
      </div>
      <div className="grid grid-cols-[10rem,1fr] items-center gap-2">
        <Label htmlFor="color">Text Color</Label>
        <ColorPicker
          className="rounded-md w-24 !e !ring-0 h-6 outline-none border-none"
          color={color}
          onChange={setColor}
        />
      </div>
    </div>
  );
}
