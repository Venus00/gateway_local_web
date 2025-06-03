import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddWidgetStore } from "@/pages/dynamic/widget-store";

export default function TextOption() {
  const { data, setAttribute } = useAddWidgetStore();
  const content = (data.attributes?.content || "") as string;
  const setCardContent = (content: string) => {
    setAttribute("content", content);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="content">content</Label>
      <Input
        id="content"
        placeholder="content"
        value={content}
        onChange={(e) => {
          e.preventDefault();
          setCardContent(e.currentTarget.value);
        }}
      />
    </div>
  );
}
