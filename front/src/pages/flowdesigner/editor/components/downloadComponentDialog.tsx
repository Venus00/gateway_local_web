import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { apiClient } from "@/features/api"
import { useSelector } from "react-redux"
import { RootState } from "@/features/auth/store"

type Component = {
  id: string
  group: string
  name: string
  url: string
  author: string
  icon: string
  color: string
  version: string
  kind?: string
  readme?: string
}

type ComponentDownloadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComponentSelect: (component: Component) => void
  flowId: string
}

export default function ComponentDownloadDialog({
  open,
  onOpenChange,
  onComponentSelect,
  flowId,
}: ComponentDownloadDialogProps) {
  const { tenant } = useSelector((state: RootState) => state.auth);

  const [components, setComponents] = useState<Component[]>([])
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [groups, setGroups] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [installing, setInstalling] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const callbackIdRef = useRef<string | null>(null)

  // Generate a random callback ID
  function generateCallbackId() {
    return Math.random().toString(36).substring(2, 12)
  }

  useEffect(() => {
    const wsBase = `ws://${window.location.hostname}:4000` || "ws://localhost:8002"
    console.log(`${wsBase}/flows/${flowId}/?openplatform=`, "reconnect")

    const websocket = new WebSocket(`${wsBase}/flows/${flowId}/?openplatform=`)

    websocket.onopen = () => {
      console.log("WebSocket connected for component download")
    }

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("WebSocket message received:", data)

        if (data.callbackid === callbackIdRef.current) {
          setInstalling(false)
          toast({
            title: "Success",
            description: "Component installed successfully",
          })
          onOpenChange(false)


        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    // websocket.onerror = (error) => {
    //   console.error("WebSocket error:", error)
    //   toast({
    //     title: "Connection Error",
    //     description: "Failed to connect to the server",
    //     variant: "destructive",
    //   })
    // }

    websocket.onclose = (e) => {
      console.log("WebSocket disconnected", e)
    }

    // Store WebSocket reference
    wsRef.current = websocket

    // Cleanup on unmount
    return () => {
      if (websocket.readyState === WebSocket.OPEN || websocket.readyState === WebSocket.CONNECTING) {
        websocket.close()
      }
    }
  }, [flowId, onOpenChange])

  // Fetch components from CDN
  useEffect(() => {
    async function fetchComponents() {
      setLoading(true)
      try {
        const response = await apiClient.get('workflow/flowscomponents', {
          params: {
            tenantId: tenant.id
          }
        })
        console.log(response.data)
        const data: Component[] = JSON.parse(JSON.stringify(response.data).replaceAll('server.url', 'http://' + window.location.hostname + '4000' || ''));
        //const data: Component[] = JSON.parse(JSON.stringify(response.data).replaceAll('server.url', "http://192.168.10.80:4000" || ''));

        console.log(data)
        setComponents(data)
        setFilteredComponents(data)

        // Extract unique groups
        const uniqueGroups = [...new Set(data.map((item) => item.group))]
        setGroups(uniqueGroups)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching components:", error)
        toast({
          title: "Error",
          description: "Failed to load components",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    if (open) {
      fetchComponents()
    }
  }, [open])

  // Filter components based on search term and selected group
  useEffect(() => {
    let filtered = components

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (component) =>
          component.name.toLowerCase().includes(term) ||
          component.id.toLowerCase().includes(term) ||
          component.author.toLowerCase().includes(term) ||
          (component.readme && component.readme.toLowerCase().includes(term)),
      )
    }

    if (selectedGroup !== "all") {
      filtered = filtered.filter((component) => component.group === selectedGroup)
    }

    setFilteredComponents(filtered)
  }, [searchTerm, selectedGroup, components])

  const handleComponentSelect = async (component: Component) => {
    setSelectedComponent(component)
  }

  const handleInstallComponent = async () => {

    if (!selectedComponent || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "Error",
        description: "Cannot install component. Connection issue.",
        variant: "destructive",
      })
      return
    }

    setInstalling(true)

    try {
      // Fetch the component content from the URL
      console.log("fetch", selectedComponent.url)
      const response = await fetch(selectedComponent.url)
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch component content")
      }
      const componentCode = await response.text()

      // Generate a callback ID
      const callbackId = generateCallbackId()
      callbackIdRef.current = callbackId

      // Prepare the message payload
      const message = {
        TYPE: "component_save",
        id: selectedComponent.id,
        data: componentCode,
        callbackid: callbackId,
      }

      // Send the message through WebSocket
      wsRef.current.send(JSON.stringify(message))

      console.log("Component installation message sent:", message)
    } catch (error) {
      console.error("Error installing component:", error)
      setInstalling(false)
      toast({
        title: "Error",
        description: "Failed to install component",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black dark:text-white">Download Components</DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300 font-medium">
            Browse and install components from the Digisense repository
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 my-4">
          <div className="flex items-center gap-2 flex-col sm:flex-row">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search components..."
                className="pl-8 border-gray-400 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <p className="text-sm font-bold mb-1 text-black dark:text-white">Catégorie:</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow overflow-hidden">
          <ScrollArea className="h-[400px] md:col-span-2 border-2 border-gray-300 dark:border-gray-600 rounded-md">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
              </div>
            ) : filteredComponents.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-700 dark:text-gray-300 font-medium">
                No components found
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 p-2">
                {filteredComponents.map((component) => (
                  <Card
                    key={component.id}
                    className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${selectedComponent?.id === component.id
                      ? "border-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/50"
                      : "border-2 border-gray-300 dark:border-gray-600"
                      }`}
                    onClick={() => handleComponentSelect(component)}
                  >
                    <CardHeader className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`${component.icon || "ti ti-box"} text-lg text-black dark:text-white`}></span>
                          <CardTitle className="text-base font-bold text-black dark:text-white">{component.name}</CardTitle>
                        </div>
                        <CardDescription className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          v{component.version}
                        </CardDescription>
                      </div>
                      <CardDescription className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {component.author} · {component.group}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="md:col-span-1">
            {selectedComponent ? (
              <Card className="h-full flex flex-col border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-black dark:text-white">{selectedComponent.name}</CardTitle>
                    <span className={`${selectedComponent.icon || "ti ti-box"} text-xl text-black dark:text-white`}></span>
                  </div>
                  <CardDescription className="text-gray-700 dark:text-gray-300 font-medium">ID: {selectedComponent.id}</CardDescription>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded font-medium">
                      {selectedComponent.group}
                    </span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded font-medium">
                      v{selectedComponent.version}
                    </span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded font-medium">
                      {selectedComponent.author}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                  <ScrollArea className="h-[250px]">
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      {selectedComponent.readme ? (
                        <div className="prose prose-sm max-w-none">
                          {selectedComponent.readme.split("\n").map((line, i) => (
                            <p key={i} className="text-gray-800 dark:text-gray-200">
                              {line}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 italic font-medium">No description available</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                <div className="p-3 border-t mt-auto border-gray-300 dark:border-gray-600">
                  <Button
                    variant="default"
                    className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium"
                    onClick={handleInstallComponent}
                    disabled={installing}
                  >
                    {installing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Install Component
                      </>
                    )}
                  </Button>

                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="text-center p-4">
                  <div className="mb-2 font-medium">Select a component to view details</div>
                  <Download className="h-8 w-8 mx-auto opacity-70 text-gray-700 dark:text-gray-300" />
                </div>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 border-t pt-4 border-gray-300 dark:border-gray-600">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-2 border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

