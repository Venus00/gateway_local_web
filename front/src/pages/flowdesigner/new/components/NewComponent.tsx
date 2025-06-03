import { useSearchParams } from "react-router-dom"
import CodeEditor from "../../components/CodeEditor"

export default function NewComponent() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get("flowId")

  return (
    <div className="container w-full h-full ">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Create New Component</h1>
        <p className="text-muted-foreground mb-6">
          Flow ID: {flowId || "Not specified"}
        </p>
        <CodeEditor flowId={flowId || ""} />
      </div>
    </div>
  )
}