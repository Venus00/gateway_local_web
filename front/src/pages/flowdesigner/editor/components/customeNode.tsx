
"use client"

import type React from "react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  Play,
  Settings,
  Share2,
  Send,
  MessageSquare,
  Code,
  Printer,
  Edit,
  ListOrdered,
  MessageCircle,
  Bug,
  Box,
  Copy,
  Trash2,
  InfoIcon,
  FileText,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { type Node, Handle, Position } from "reactflow"
import "reactflow/dist/style.css"
import { SettingsRenderer } from "./settingRender"
import CodeEditor1 from "./editCode"
import { useToast } from "@/hooks/use-toast"
import { CustomDialog } from "./customeDialog"
import { useWebSocket } from "@/features/websocket/WebSocketProvider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Define types for our flow data
export type FlowComponent = {
  id: string
  name: string
  type: string
  category?: string
  group?: string
  icon?: string
  outputs?: Array<{ id: string; name: string }>
  inputs?: Array<{ id: string; name: string }>
  config?: any
  html?: string
  css?: string
  js?: string
  author?: string
  readme?: string
  version?: string
  settings?: string
}

type FlowNode = Node<{
  label: string
  type: string
  status?: string
  note?: string
  icon?: string
  component: FlowComponent
  outputs?: Array<{ id: string; name: string }>
  inputs?: Array<{ id: string; name: string }>
}>

type CustomNodeProps = {
  data: FlowNode["data"]
  id: string
  activeNodes: Set<string>
  onTriggerRun: (nodeId: string) => void
  onDeleteNode: (nodeId: string) => void
}

type DialogContentType = {
  title: string
  content: ReactNode
}

export const CustomNode = ({ data, id, activeNodes, onTriggerRun, onDeleteNode }: CustomNodeProps) => {
  const component = data.component || ({} as FlowComponent)

  const outputs = component.outputs || []
  const inputs = component.inputs || []
  const { toast } = useToast()
  const socket = useWebSocket()
  const [matchingResponse, setMatchingResponse] = useState<any>()
  // État pour le dialogue
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [dialogContent, setDialogContent] = useState<DialogContentType>({ title: "", content: null })
  const [config, setConfig] = useState<any>({ ...(component.config || {}) })
  const tst = useRef<any>(null)
  // État pour les formulaires
  const [editedCode, setEditedCode] = useState<string>("")
  const noteRef = useRef<string>("")
  const configRef = useRef(config)
  const handleConfigChange = (newConfig: any) => {
    setConfig(newConfig)
    configRef.current = newConfig
  }
console.log("input et output:", inputs, outputs)
  const handleRunClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    console.log("Run button clicked")
    if (component.id === "trigger") {
      if (socket) {
        socket.send(
          JSON.stringify({
            TYPE: "trigger",
            id: id,
          }),
        )
        console.log("Trigger message sent")
        if (e.currentTarget !== e.target) return
        const result = onTriggerRun(id)
        console.log("Trigger run function called", result)
      } else {
        console.error("WebSocket not connected")
        toast({
          variant: "destructive",
          title: "Error",
          description: "WebSocket not connected",
        })
      }
    }
  }

  const handleClearClick = () => {
    console.log("Clear button clicked for node:", id)
    if (socket) {
      socket.send(
        JSON.stringify({
          TYPE: "trigger",
          id: id,
        }),
      )
      toast({
        title: "Success",
        description: "Clear command sent",
      })
    } else {
      console.error("WebSocket not connected")
      toast({
        variant: "destructive",
        title: "Error",
        description: "WebSocket not connected",
      })
    }
  }

  const getIcon = ({ className }:any) => {
    const iconType = component.id || "";
    switch (iconType) {
      case "trigger":
        return <Play className={className || "h-4 w-4 fill-teal-400"} />;
      case "mqttbroker":
        return <Share2 className={className || "h-4 w-4 fill-teal-400"} />;
      case "mqttpublish":
        return <Send className={className || "h-4 w-4 fill-teal-400"} />;
      case "mqttsubscribe":
        return <MessageSquare className={className || "h-4 w-4 fill-teal-400"} />;
      case "code":
        return <Code className={className || "h-4 w-4 fill-teal-400"} />;
      case "print":
      case "printjson":
        return <Printer className={className || "h-4 w-4 fill-teal-400"} />;
      case "modify":
        return <Edit className={className || "h-4 w-4 fill-teal-400"} />;
      case "queue":
        return <ListOrdered className={className || "h-4 w-4 fill-teal-400"} />;
      case "comment":
        return <MessageCircle className={className || "h-4 w-4 fill-teal-400"} />;
      case "debug":
        return <Bug className={className || "h-4 w-4 fill-teal-400"} />;
      case "delay":
        return <Box className={className || "h-4 w-4 fill-teal-400"} />;
      default:
        return <Box  className={className || "h-4 w-4 fill-teal-400"} />;
    }
  };

  const handleCopyComponent = () => {
    const componentData = {
      id: component.id,
      name: component.name,
      type: component.type,
      config: component.config,
      html: component.html,
      css: component.css,
      js: component.js,
      group: component.group,
      version: component.version,
      readme: component.readme,
    }
    navigator.clipboard.writeText(JSON.stringify(componentData, null, 2))
    toast({
      title: "Success",
      description: "Component copied to clipboard",
    })
  }

  const handleSaveNote = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          TYPE: "note",
          id: id,
          data: noteRef.current,
        }),
      )
      toast({
        title: "Success",
        description: "Note saved",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "WebSocket not connected",
      })
    }
    setIsDialogOpen(false)
  }

  const handleSaveConfig = () => {
    if (socket) {
      console.log("Saving config:", configRef.current)
      socket.send(
        JSON.stringify({
          TYPE: "reconfigure",
          id: id,
          data: configRef.current,
        }),
      )
      socket.send(
        JSON.stringify({
          TYPE: "flow/config",
          id: id,
          data: configRef.current,
        }),
      )
      toast({
        title: "Success",
        description: "Configuration updated",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "WebSocket not connected",
      })
    }
    setIsDialogOpen(false)
  }

  const handleSaveCode = () => {
    const codeToSave = tst.current || editedCode

    console.log("Saving code:", codeToSave)

    if (socket) {
      socket.send(
        JSON.stringify({
          TYPE: "component_save",
          callbackid: "hzx3gigj79",
          data: codeToSave,
          id: component.id,
        }),
      )
      toast({
        title: "Success",
        description: "Code updated",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: socket ? "No code changes to save" : "WebSocket not connected",
      })
    }
    setIsDialogOpen(false)
  }

  const parseSettings = (settings: string): Array<{ name: string; type: string; config?: string }> => {
    if (!settings) return []
    const parser = new DOMParser()
    const doc = parser.parseFromString(settings, "text/html")
    const components = doc.querySelectorAll("ui-component")
    const fields: Array<{ name: string; type: string; config?: string }> = []
    components.forEach((comp) => {
      const name = comp.getAttribute("name") || ""
      const path = comp.getAttribute("path") || ""
      const config = comp.getAttribute("config") || ""
      let type = "text"
      if (config.includes("type:number")) type = "number"
      if (config.includes("type:javascript")) type = "code"
      fields.push({ name: name || path.replace("?.", ""), type, config })
    })
    return fields
  }

  const readComponentData = () => {
    if (socket) {
      // Generate a unique callback ID
      const callbackId = `cb_${Math.random().toString(36).substring(2, 15)}`

      // Send the component_read message
      socket.send(
        JSON.stringify({
          TYPE: "component_read",
          id: id,
          callbackid: callbackId,
        }),
      )

      // Set up a one-time listener for the response
      const messageHandler = (event: MessageEvent) => {
        try {
          const response = JSON.parse(event.data)

          // Check if this is the response to our request
          if (response.TYPE === "flow/component_read" && response.callbackid === callbackId) {
            // Store the component data in the ref
            tst.current = response.data

            // Update the edited code state
            setEditedCode(response.data)

            // Open the dialog to show the editor
            setIsDialogOpen(true)

            // Remove this one-time listener
            socket?.removeEventListener("message", messageHandler)
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      // Add the temporary message handler
      socket.addEventListener("message", messageHandler)

      toast({
        title: "Loading component",
        description: "Fetching component data...",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "WebSocket not connected",
      })
    }
  }

  const handleOpenDialog = (title: string, contentType: "info" | "config" | "code" | "note") => {
    let content: ReactNode = null

    switch (contentType) {
      case "info":
        content = (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Component ID:</h3>
              <p className="text-sm text-gray-600">{component.id || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Component Name:</h3>
              <p className="text-sm text-gray-600">{component.name || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Group:</h3>
              <p className="text-sm text-gray-600">{component.group || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Author:</h3>
              <p className="text-sm text-gray-600">{component.author || "N/A"}</p>
            </div>
            {component.version && (
              <div>
                <h3 className="font-medium text-gray-900">Version:</h3>
                <p className="text-sm text-gray-600">{component.version}</p>
              </div>
            )}
            {component.readme && (
              <div>
                <h3 className="font-medium text-gray-900">Description:</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{component.readme}</p>
              </div>
            )}
          </div>
        )
        break
      case "config":
        console.log(component)
        content = (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Configuration</h3>
            {component.settings ? (
              <SettingsRenderer
                id={component.id}
                settingsHtml={component.settings}
                settingsJs={component.js}
                settingsCss={component.css}
                config={config}
                onConfigChange={handleConfigChange}
              />
            ) : (
              <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 overflow-auto max-h-96 font-mono">
                {JSON.stringify(config, null, 2) || "No configuration available"}
              </pre>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveConfig} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                Save
              </Button>
            </div>
          </div>
        )
        break
        case "code":
          readComponentData();
          content = (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-600">Edit Flow Code</h3>
              {component.settings ? (
                <CodeEditor1
                  component={component}
                  onCodeChange={(newCode) => setEditedCode(newCode)}
                  tst={tst}
                />
              ) : (
                <pre className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 overflow-auto max-h-96 font-mono">
                  {JSON.stringify(config, null, 2) || "No configuration available."}
                </pre>
              )}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-5 py-2 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCode}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Code
                </Button>
              </div>
            </div>
          );
          break;
      case "note":
        content = (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Note</h3>
            <textarea
              className="w-full h-40 p-2 border border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500"
              defaultValue={noteRef.current}
              onChange={(e) => (noteRef.current = e.target.value)}
              placeholder="Add your note here..."
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveNote} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                Save
              </Button>
            </div>
          </div>
        )
        break
      default:
        content = <p className="text-sm text-gray-600">No information available.</p>
    }

    setDialogContent({ title, content })
    setIsDialogOpen(true)
  }

  const nodeClasses = `custom-node bg-primary dark:bg-orange-800 text-white dark:text-gray-100 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
    activeNodes.has(id) ? "ring-2 ring-green-500 dark:ring-green-400 ring-opacity-80" : ""
  }`

  useEffect(() => {
    if (socket) {
      const handleMessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data)
          if (message.TYPE === "flow/status") {
            if (message.id === id) {
              setMatchingResponse(message)
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      socket.addEventListener("message", handleMessage)
      return () => {
        socket.removeEventListener("message", handleMessage)
      }
    }
  }, [socket, id])

  useEffect(() => {
    console.log("idddddddddddddddddddddddddddd:", matchingResponse)
  }, [matchingResponse, id])

  console.log("xxxxxxxxxxxxxxxxxxxxxxxxx:", data)

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="relative">
            {/* Main Node Container */}
            <div className="node-container bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[200px] max-w-[300px]">
              {/* Header Section */}
              <div className="node-header bg-gray-50 dark:bg-gray-700/50 p-3 rounded-t-lg">
                <div className="flex items-center justify-start space-x-2">
                  <div className="border-2 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 p-1.5 rounded-md">
                    {getIcon({ className: "h-5 w-5 text-blue-500 dark:text-blue-400" })}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {data.type}
                  </span>
                </div>
              </div>
  
              {/* Main Content Section */}
              <div className="p-4">
                {/* Input/Output Labels with Handles */}
                <div className="flex justify-between items-start mb-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col gap-2">
                    {component.id !== "trigger" && inputs.length > 0 && inputs.map((input, i) => (
                      <div key={input.id || `input-${i}`} className="flex items-center ml-[-4px]">
                        <Handle
                          type="target"
                          position={Position.Left}
                          id={input.id}
                          className="w-3 h-3 rounded-full border-2 border-white shadow-sm mr-[-24px]" 
                          style={{
                            background: "#6366f1",
                            position: "relative",
                            transform: "none",
                          }}
                        />
                        <span className="ml-8">
                          {input.name || `Input ${i + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    {outputs.length > 0 ? (
                      outputs.map((output, i) => (
                        <div key={output.id || `output-${i}`} className="flex items-center justify-end mr-[-4px]">
                          <span className="mr-8">
                            {output.name || `Output ${i + 1}`}
                          </span>
                          <Handle
                            type="source"
                            position={Position.Right}
                            id={output.id}
                            className="w-3 h-3 rounded-full ml-[-24px]" 
                            style={{
                              background: "#22c55e",
                              border: "none",
                              position: "relative",
                              transform: "none",
                            }}
                          />
                        </div>
                      ))
                    ) : component.id !== "print" && component.id !== "printjson" ? (
                      <div className="flex items-center justify-end mr-[-4px]"> 
                        <span className="mr-8">Output</span>
                        <Handle
                          type="source"
                          position={Position.Right}
                          id="output"
                          className="w-3 h-3 rounded-full ml-[-24px]"
                          style={{
                            background: "#22c55e",
                            border: "none",
                            position: "relative",
                            transform: "none",
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
  
                {/* Action Buttons */}
                {(component.id === "trigger" || component.id === "print" || component.id === "printjson") && (
                  <div className="mb-3">
                    {component.id === "trigger" && (
                      <button
                        onClick={handleRunClick}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors duration-150 flex items-center justify-center"
                      >
                       
                        Run
                      </button>
                    )}
                    {(component.id === "print" || component.id === "printjson") && (
                      <button
                        onClick={handleClearClick}
                        className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors duration-150 flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Clear
                      </button>
                    )}
                  </div>
                )}
  
                {/* Response Data Viewer */}
                {matchingResponse && (
                  <div className="mb-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-between">
                          <span>
                            {matchingResponse?.data ? "View response data" : "No data available"}
                          </span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl overflow-hidden"
                        align="start"
                        sideOffset={8}
                      >
                        <div className="p-1 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <span className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Response Data
                          </span>
                          <button className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-4 max-h-[400px] overflow-auto">
                          <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md">
                            {JSON.stringify(matchingResponse?.data, null, 2)}
                          </pre>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
  
              {/* Footer Section - Status Info */}
              {data.status && (
                <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-b-lg">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Status</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">{data.status}</span>
                    </div>
                    
                    {component.id === "mqttbroker" && (
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Host</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">
                          {component.config?.host || "localhost"}
                        </span>
                      </div>
                    )}
                    
                    {component.id === "mqttsubscribe" && (
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Topic</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">
                          {component.config?.topic || "--"}
                        </span>
                      </div>
                    )}
                    
                    {component.id === "delay" && (
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Timeout</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">
                          {component.config?.delay || 1000}ms
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ContextMenuTrigger>
  
        {/* Context Menu - Unchanged */}
        <ContextMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md py-2 text-gray-800 dark:text-gray-100">
          <ContextMenuItem
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            onClick={() => handleOpenDialog("Component Information", "info")}
          >
            <InfoIcon className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            Read information
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            onClick={() => handleOpenDialog("Add Note", "note")}
          >
            <FileText className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            Set a note
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            onClick={() => handleOpenDialog("Configure Component", "config")}
          >
            <Settings className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            Configure
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            onClick={() => console.log("Settings clicked copy")}
          >
            <Copy className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            Clone
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            onClick={() => handleOpenDialog("Edit Component Code", "code")}
          >
            <Edit className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            onClick={handleCopyComponent}
          >
            <Copy className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            Copy
          </ContextMenuItem>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          <ContextMenuItem
            className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            onClick={() => onDeleteNode(id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
            Remove
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
  
      <CustomDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={dialogContent.title}
        onClose={() => setIsDialogOpen(false)}
      >
        {dialogContent.content}
      </CustomDialog>
    </>
  );
}
