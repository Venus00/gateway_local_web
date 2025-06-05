import { useEffect, useRef, useState } from "react"
import { Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWebSocket } from "@/features/websocket/WebSocketProvider"

type SettingsRendererProps = {
  id: string
  settingsHtml: string
  settingsJs?: string
  settingsCss?: string
  config: any
  onConfigChange: (newConfig: any) => void
}

export const SettingsRenderer = ({
  id,
  settingsHtml,
  settingsJs,
  settingsCss,
  config,
  onConfigChange,
}: SettingsRendererProps) => {
  console.log("SettingsRenderer", id, settingsJs)
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const localConfig = useRef({ ...config })
  const [formValues, setFormValues] = useState({ ...config })
  const [brokers, setBrokers] = useState<Array<{ id: string; name: string }>>([])
  const callbacksRef = useRef<Record<string, (data: any) => void>>({})
  const socket = useWebSocket();

  // Function to generate a unique callback ID
  const generateCallbackId = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  // Function to send WebSocket messages
  const sendWebSocketMessage = (type: string, id: string, data: any = null, callbackId?: string) => {
    if (socket) {
      const message = {
        TYPE: type,
        id: id,
        data: data,
        callbackid: callbackId,
      }
      socket.send(JSON.stringify(message))
      return true
    }
    return false
  }

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data)

        // Handle flow/call responses
        if (message.TYPE === "flow/call" && message.callbackid && callbacksRef.current[message.callbackid]) {
          callbacksRef.current[message.callbackid](message.data)
          delete callbacksRef.current[message.callbackid]
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    socket.addEventListener("message", handleMessage)

    return () => {
      if (socket) {
        socket.removeEventListener("message", handleMessage)
      }
    }
  }, [socket])

  // Function to handle MQTT subscribe configuration
  useEffect(() => {
    if (settingsJs && settingsJs.includes("ON('configure_") && socket) {
      const callbackId = generateCallbackId()

      // Store the callback function
      callbacksRef.current[callbackId] = (data) => {
        setBrokers(data)

        // Update the config with the brokers data
        const newConfig = { ...localConfig.current }
        newConfig["%brokers"] = data
        localConfig.current = newConfig
        setFormValues(newConfig)
        onConfigChange(newConfig)
      }

      // Send the WebSocket message
      sendWebSocketMessage("call", `@${id}`, null, callbackId)
    }
  }, [id, settingsJs, socket])

  // Parse and clean the HTML
  const parseSettings = (html: string) => {
    if (!html) return []

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const components = doc.querySelectorAll("ui-component")

    const fields: Array<{
      name: string
      path: string
      type: string
      label: string
      placeholder?: string
      required?: boolean
      options?: Array<{ value: string; text: string }>
      dirsource?: string
      dirraw?: boolean
    }> = []

    components.forEach((comp) => {
      const name = comp.getAttribute("name") || ""
      const path = comp.getAttribute("path") || ""
      const configAttr = comp.getAttribute("config") || ""
      const label = comp.textContent?.trim() || name

      const configObj: any = {}
      configAttr.split(";").forEach((part) => {
        const [key, value] = part.split(":")
        if (key && value) configObj[key.trim()] = value.trim()
      })

      let type = "text"
      if (configObj.type === "number") type = "number"
      if (configObj.type === "javascript") type = "code"
      if (configObj.type === "dropdown" || name === "dropdown" || configObj.dirsource) type = "dropdown"
      if (configObj.type === "checkbox" || name === "checkbox") type = "checkbox"
      if (configObj.type === "textarea" || name === "textarea") type = "textarea"

      const cleanPath = path.replace("?.", "")

      fields.push({
        name: name,
        path: cleanPath,
        type,
        label,
        placeholder: configObj.placeholder,
        required: configObj.required === "1",
        options: type === "dropdown" ? parseOptions(configObj.items || configObj.dirsource) : undefined,
        dirsource: configObj.dirsource,
        dirraw: configObj.dirraw === "1",
      })
    })

    return fields
  }

  const parseOptions = (itemsStr?: string) => {
    if (!itemsStr) return []

    // Handle special case for %brokers
    if (itemsStr === "%brokers" && formValues["%brokers"]) {
      return formValues["%brokers"].map((broker: any) => ({
        value: broker.id,
        text: broker.name,
      }))
    }

    try {
      return itemsStr.split(",").map((item) => {
        const [value, text] = item.split("=")
        return { value: value.trim(), text: (text || value).trim() }
      })
    } catch (e) {
      return []
    }
  }

  // Handle value changes
  const handleValueChange = (path: string, value: any) => {
    const newConfig = { ...localConfig.current }

    // Handle nested paths (e.g. "settings.apiKey")
    if (path.includes(".")) {
      const parts = path.split(".")
      let current = newConfig

      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {}
        }
        current = current[parts[i]]
      }

      current[parts[parts.length - 1]] = value
    } else {
      newConfig[path] = value
    }

    localConfig.current = newConfig
    setFormValues(newConfig)
    onConfigChange(newConfig)
  }

  useEffect(() => {
    if (!settingsJs || !containerRef.current) return

    // Skip execution if it's an MQTT subscription script
    if (settingsJs.includes("ON('configure_mqttsubscribe'")) {
      console.log("MQTT subscription script detected, skipping direct execution")
      return
    }

    try {
      const exportObj: any = {
        config: { ...config },
        configure: (newConfig: any) => {
          localConfig.current = { ...newConfig }
          setFormValues({ ...newConfig })
          onConfigChange(newConfig)
        },
        settings: () => { },
        // Add a mock ON function to prevent errors
        ON: (event: string, callback: Function) => {
          console.log(`Event handler registered for: ${event}`)
        },
        SET: (key: string, value: any) => {
          console.log(`Setting ${key}`)
          const newConfig = { ...localConfig.current }
          newConfig[key] = value
          localConfig.current = newConfig
          setFormValues((prev) => ({ ...prev, [key]: value }))
          onConfigChange(newConfig)
        },
      }

      const TOUCH = (fn: (exports: any) => void) => {
        fn(exportObj)
        if (typeof exportObj.settings === "function") {
          exportObj.settings()
        }
      }

      const script = new Function("TOUCH", settingsJs)
      script(TOUCH)
    } catch (err) {
      console.error("Error executing settings JS:", err)
      // Don't set error for MQTT subscription scripts
      if (!settingsJs.includes("ON('configure_mqttsubscribe'")) {
        setError("Failed to execute settings script")
      }
    }
  }, [settingsJs, config])

  // Apply custom CSS if provided
  useEffect(() => {
    if (!settingsCss) return

    const styleElement = document.createElement("style")
    styleElement.textContent = settingsCss
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [settingsCss])

  // Debug output for MQTT brokers
  useEffect(() => {
    if (brokers.length > 0) {
      console.log("MQTT Brokers loaded:", brokers)

      // If broker field is empty and we have brokers, set the first one as default
      const newConfig = { ...localConfig.current }
      if (!newConfig.broker && brokers.length > 0) {
        newConfig.broker = brokers[0].id
        localConfig.current = newConfig
        setFormValues((prev) => ({ ...prev, broker: brokers[0].id }))
        onConfigChange(newConfig)
      }
    }
  }, [brokers])
  const fields = parseSettings(settingsHtml)

  // When no fields are found but HTML exists
  if (fields.length === 0 && settingsHtml) {
    return (
      <div className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>This component has custom settings that cannot be rendered automatically.</AlertDescription>
        </Alert>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 overflow-auto max-h-96 font-mono">
          {JSON.stringify(config, null, 2) || "No configuration available"}
        </pre>
      </div>
    )
  }

  // Fallback for components with no settings
  if (fields.length === 0) {
    return (
      <div>
        <p className="text-sm text-gray-500 mb-4">This component doesn't have any configurable settings.</p>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 overflow-auto max-h-96 font-mono">
          {JSON.stringify(config, null, 2) || "{}"}
        </pre>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {fields.map((field) => {
          const value = field.path.includes(".")
            ? field.path.split(".").reduce((obj, key) => obj?.[key], formValues)
            : formValues[field.path]

          return (
            <div key={field.path} className="space-y-2">
              <label htmlFor={field.path} className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  id={field.path}
                  value={value || ""}
                  placeholder={field.placeholder}
                  onChange={(e) => handleValueChange(field.path, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  required={field.required}
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  id={field.path}
                  value={value || 0}
                  placeholder={field.placeholder}
                  onChange={(e) => handleValueChange(field.path, e.target.valueAsNumber)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  required={field.required}
                />
              )}

              {field.type === "checkbox" && (
                <input
                  type="checkbox"
                  id={field.path}
                  checked={!!value}
                  onChange={(e) => handleValueChange(field.path, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  id={field.path}
                  value={value || ""}
                  placeholder={field.placeholder}
                  onChange={(e) => handleValueChange(field.path, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  required={field.required}
                  rows={5}
                />
              )}

              {field.type === "dropdown" && (
                <select
                  id={field.path}
                  value={value || ""}
                  onChange={(e) => handleValueChange(field.path, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  required={field.required}
                >
                  <option value="">Select an option</option>
                  {field.dirsource === "%brokers" && brokers.length > 0
                    ? brokers.map((broker) => (
                      <option key={broker.id} value={field.dirraw ? broker.id : broker.name}>
                        {broker.name}
                      </option>
                    ))
                    : field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                </select>
              )}

              {field.type === "code" && (
                <textarea
                  id={field.path}
                  value={value || ""}
                  placeholder={field.placeholder || "Enter code here..."}
                  onChange={(e) => handleValueChange(field.path, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-black"
                  required={field.required}
                  rows={8}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
