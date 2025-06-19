"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FlowComponent } from "./customeNode"
import { useWebSocket } from "@/features/websocket/WebSocketProvider"

const generateCallbackId = () => {
  return Math.random().toString(36).substring(2, 10)
}

interface CodeEditorProps {
  component?: FlowComponent
  onCodeChange?: (code: string) => void
  tst?: React.RefObject<any>
}

export default function CodeEditor1({  component, onCodeChange, tst }: CodeEditorProps) {
  console.log("CodeEditor1", component?.id)
  const { socket, reconnect } = useWebSocket();
  const [code, setCode] = useState("")
  const initialRenderRef = useRef(true)
  const lastComponentRef = useRef(component)

  useEffect(() => {
    if (!socket) return

    const callbackId = generateCallbackId()

    const message = {
      TYPE: "component_read",
      id: component?.id,
      callbackid: callbackId,
    }
    socket.send(JSON.stringify(message))

    const handleMessage = (event: MessageEvent) => {
      try {
        const response = JSON.parse(event.data)
        if (
          response.TYPE === "flow/component_read" &&
          response.id === component?.id &&
          response.callbackid === callbackId &&
          response.data
        ) {
          setCode(response.data) 
          if (tst) {
            tst.current = response.data
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    socket.addEventListener("message", handleMessage)

    return () => {
      socket?.removeEventListener("message", handleMessage)
    }
  }, [component?.id, socket, tst])

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)
    if (tst) {
      tst.current = newCode
    }
    if (onCodeChange) {
      onCodeChange(newCode) 
    }
  }
console.log("CodeEditor1", code)
  const handleApplyChanges = () => {
    if (onCodeChange) {
      onCodeChange(code)
    }
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Code Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={code}
          onChange={handleCodeChange}
          className="font-mono min-h-[400px] resize-none p-4 bg-slate-900 text-slate-50"
          spellCheck="false"
        />
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button variant="default" onClick={handleApplyChanges}>
          Apply Changes
        </Button>
      </CardFooter> */}
    </Card>
  )
}