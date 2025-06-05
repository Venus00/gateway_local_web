/* eslint-disable */
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useNavigate } from "react-router"

interface CodeEditorProps {
  flowId: string
  componentId?: string
}

export default function CodeEditor({ flowId, componentId }: CodeEditorProps) {
  const navigate = useNavigate()
  const wsRef = useRef<WebSocket | null>(null)
  const callbackIdRef = useRef<string>(null)

  const [code, setCode] = useState(`// Write your code here // Flow ID: ${flowId}

<script total>
  exports.id = '${componentId || generateComponentId()}';
  exports.name = 'Your component name';
  exports.icon = 'ti ti-code';
  exports.author = 'Total.js';
  exports.version = '1';
  exports.group = 'Common';
  exports.config = {};
  exports.inputs = [{ id: 'input', name: 'Input' }];
  exports.outputs = [{ id: 'output', name: 'Output' }];

  exports.make = function(instance, config) {
    instance.message = function($) {
      var data = $.data;
      $.send('output', data);
    };

    instance.configure = function() {
      // "config" is changed
    };

    instance.close = function() {
      // this instance is closed
    };

    instance.variables = function(variables) {
      // FlowStream variables are changed
    };

    instance.variables2 = function(variables) {
      // Global variables are changed
    };

    instance.configure();
  };
</script>

<readme>
Markdown readme

\`\`\`js
var total = 'Hello world!';
\`\`\`
</readme>

<settings>
  <div class="padding">
    SETTINGS for this component (optional)
  </div>
</settings>

<style>
  .CLASS footer { padding: 10px; font-size: 12px; }
</style>

<script>
  // Client-side script
  // Optional, you can remove it

  // A custom helper for the component instances
  // The method below captures each instance of this component
  TOUCH(function(exports, reinit) {
    var name = exports.name + ' --> ' + exports.id;
    console.log(name, 'initialized' + (reinit ? ' : UPDATE' : ''));

    exports.settings = function(meta) {
      // Triggered when the user opens settings
      console.log(name, 'settings', meta);
    };

    exports.configure = function(config, isinit) {
      // Triggered when the config is changed
      console.log(name, 'configure', config);
    };

    exports.status = function(status, isinit) {
      // Triggered when the status is changed
      console.log(name, 'status', status);
    };

    exports.note = function(note, isinit) {
      // Triggered when the note is changed
      console.log(name, 'note', note);
    };

    exports.variables = function(variables) {
      // Triggered when the variables are changed
      console.log(name, 'variables', variables);
    };

    exports.variables2 = function(variables) {
      // Triggered when the variables2 are changed
      console.log(name, 'variables2', variables);
    };

    exports.redraw = function() {
      // Flow design has been redrawn
      console.log(name, 'redraw');
    };

    exports.move = function() {
      // Instance has changed position
      console.log(name, 'move');
    };

    exports.close = function() {
      // Triggered when the instance is closing due to some reasons
      console.log(name, 'close');
    };
  });
</script>

<body>
  <header>
    <i class="$ICON"></i>$NAME
  </header>
  <footer>Learn from existing components</footer>
</body>`)

  function generateComponentId() {
    return 'c' + Math.random().toString(36).substring(2, 10)
  }

  function extractComponentId(code: string): string {
    const match = code.match(/exports\.id(\s*)=(\s*)'([^']+)'/);
    if (match && match[3]) {
      return match[3];
    }
    return componentId || generateComponentId();
  }

  // Generate a random callback ID
  function generateCallbackId() {
    return Math.random().toString(36).substring(2, 12);
  }

  useEffect(() => {
    console.log("socket yrl", import.meta.env.VITE_FLOWS_SOCKET)
    //const wsBase = import.meta.env.VITE_FLOWS_SOCKET || "ws://localhost:8002"
    const wsBase = `${window.location.hostname}:8002` || "ws://localhost:8002"
    const websocket = new WebSocket(`ws://${wsBase}/flows/${flowId}/?openplatform=`)


    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);

        if (data.callbackid === callbackIdRef.current) {
          if (data.success) {
            toast(

              "Component saved successfully",
            );
            navigate(`/editor/${flowId}`);
          } else {
            toast(

              data.error || "Failed to save component",

            );
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // websocket.onerror = (error) => {
    //   console.error('WebSocket error:', error);
    //   toast({
    //     title: "Connection Error",
    //     description: "Failed to connect to the server",
    //     variant: "destructive",
    //   });
    // };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Store WebSocket reference
    wsRef.current = websocket;

    // Cleanup on unmount
    return () => {
      if (websocket.readyState === WebSocket.OPEN ||
        websocket.readyState === WebSocket.CONNECTING) {
        websocket.close();
      }
    };
  }, [flowId]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleSave = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast("WebSocket connection is not open",

      );
      return;
    }

    try {
      // Extract component ID from the code
      const id = extractComponentId(code);

      // Generate a new callback ID for this request
      const callbackId = generateCallbackId();
      callbackIdRef.current = callbackId;

      // Prepare the message payload
      const message = {
        TYPE: "component_save",
        id: id,
        data: code,
        callbackid: callbackId
      };

      // Send the message through WebSocket
      wsRef.current.send(JSON.stringify(message));

      console.log('Component save message sent:', message);
      navigate(`/editor/${flowId}`);


      toast(

        "Saving component...",
      );
    } catch (error) {
      console.error('Error saving component:', error);
      toast(
        "An error occurred while saving the component",
      );
    }
  };

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
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Component</Button>
      </CardFooter>
    </Card>
  )
}