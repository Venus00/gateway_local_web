import type React from "react"
import { useEffect, useState, useRef, useMemo, ReactNode, useCallback } from "react"
import {
    Loader2,
    X,
    Save,
    Play,
    Pause,
    Settings,
    Search,
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
    RefreshCw,
    Copy,
    Trash2,
    Unlink,
    InfoIcon,
    FileText,
    Plus,
    Download,
    FileSymlink,
    ArrowBigLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    type Edge,
    type Node,
    Handle,
    Position,
    type NodeTypes,
    ReactFlowProvider,
    useReactFlow,
    ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"
import { Textarea } from "@/components/ui/textarea"
import { CustomNode } from "./components/customeNode"
import ComponentDownloadDialog from "./components/downloadComponentDialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import { useWebSocket, WebSocketProvider } from "@/features/websocket/WebSocketProvider"
import { ComponentContextMenu } from "./components/componentContextMenu"
import { useFlowStore } from "@/lib/useFlowStore"
import { useToast } from "@/hooks/use-toast"

// Define types for our flow data
type FlowComponent = {
    id: string
    name: string
    type: string
    category?: string
    group?: string
    icon?: string
    note?: string
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

type FlowStatus = {
    id: string
    data: {
        status: string
        name: string
        topic?: string
    }
}

type FlowStats = {
    messages: number
    pending: number
    traffic: {
        priority: any[]
    }
    mm: number
    minutes: number
    memory: number
    errors: number
    paused: boolean
}

type FlowNode = Node<{
    label: string
    type: string
    status?: string
    icon?: string
    note?: string
    component: FlowComponent
    outputs?: Array<{ id: string; name: string }>
    inputs?: Array<{ id: string; name: string }>
}>

type FlowEdge = Edge

// Type for flow/design data
type FlowDesignData = {
    [nodeId: string]: {
        x: number
        y: number
        stats?: {
            pending: number
            input: number
            output: number
            duration: number
            destroyed: number
        }
        note?: string
        outputs?: any
        inputs?: any
        connections?: {
            [key: string]: string[]
        }
        component?: string
        name?: string
        config?: any
    }
}

export default function Editor() {
    const params = useParams()
    const flowId = (params.id as string) || "default-flow"
    const wsBase = `${window.location.hostname}:8002`;
    //const wsBase = `192.168.10.80:8002`;
    const wsUrl = `ws:${wsBase}/flows/${flowId}/?openplatform=`;

    return (
        <WebSocketProvider url={wsUrl}>
            <ReactFlowProvider>
                <FlowEditor />
            </ReactFlowProvider>
        </WebSocketProvider>
    )
}
export function FlowEditor() {


    const components = useRef([]);
    const params = useParams()
    const flowId = (params.id as string) || "default-flow"
    // const wsBase = import.meta.env.VITE_FLOWS_SOCKET || '';
    // const wsUrl = `${wsBase}/flows/${flowId}/?openplatform=`;
    const socket = useWebSocket();
    const [loading, setLoading] = useState(true)
    // const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState<FlowStats | null>(null)
    const [statuses, setStatuses] = useState<Record<string, FlowStatus["data"]>>({})
    const [searchTerm, setSearchTerm] = useState("")
    const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode["data"]>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    // const [selectedNode, setSelectedNode] = useState<string | null>(null)
    const selectedNode = useRef<string | null>(null)
    const [, forceUpdate] = useState(0)

    const [componentCategories, setComponentCategories] = useState<Record<string, FlowComponent[]>>({})
    const [isPaused, setIsPaused] = useState(false)
    const [isLoadingFlow, setIsLoadingFlow] = useState(false)
    const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
    const [animationTimeouts, setAnimationTimeouts] = useState<Record<string, NodeJS.Timeout>>({})
    const [animatedEdges, setAnimatedEdges] = useState<Set<string>>(new Set())
    const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean
        x: number
        y: number
        component: any | null
    }>({
        visible: false,
        x: 0,
        y: 0,
        component: null,
    })

    const { zoom, setReactFlowInstance } = useFlowStore();
    const { setViewport } = useReactFlow();

    // Gérer l'initialisation de React Flow
    const onInit = (instance: ReactFlowInstance) => {
        setReactFlowInstance(instance);
        instance.setViewport({ x: 0, y: 0, zoom });
    };
    const nodeConnectionsMap = useRef<Record<string, Array<{ sourceId: string; edgeId: string }>>>({})
    useEffect(() => {
        console.log("Building connection map with edges:", edges)
        const connectionMap: Record<string, Array<{ sourceId: string; edgeId: string }>> = {}

        edges.forEach((edge) => {
            if (!connectionMap[edge.target]) {
                connectionMap[edge.target] = []
            }
            connectionMap[edge.target].push({
                sourceId: edge.source,
                edgeId: edge.id,
            })
        })

        nodeConnectionsMap.current = connectionMap
        console.log("Connection map built:", connectionMap)
    }, [edges])
    const handleDownloadComponent = () => {
        setDownloadDialogOpen(true)
    }

    const handleComponentSelect = (component: any) => {
        console.log("Selected component:", component)
    }



    const animateEdge = useCallback((edgeId: string, duration = 1500) => {
        console.log("Animating edge:", edgeId)
        setAnimatedEdges((prev) => {
            const newSet = new Set(prev)
            newSet.add(edgeId)
            return newSet
        })
        setTimeout(() => {
            setAnimatedEdges((prev) => {
                const newSet = new Set(prev)
                newSet.delete(edgeId)
                return newSet
            })
        }, duration)
    }, [])

    // CORRECTION 4: Ajouter useCallback pour triggerAnimation
    const triggerAnimation = useCallback(
        (nodeId: string) => {
            console.log("Triggering animation for node:", nodeId)
            selectedNode.current = nodeId

            if (animationTimeouts[nodeId]) {
                clearTimeout(animationTimeouts[nodeId])
            }

            setActiveNodes((prev) => {
                const newActiveNodes = new Set(prev)
                newActiveNodes.add(nodeId)
                console.log("Added node to active nodes:", nodeId, "Active nodes:", newActiveNodes)
                return newActiveNodes
            })

            const timeout = setTimeout(() => {
                setActiveNodes((prev) => {
                    const newActiveNodes = new Set(prev)
                    newActiveNodes.delete(nodeId)
                    console.log("Removed node from active nodes:", nodeId)
                    return newActiveNodes
                })
            }, 1000)

            setAnimationTimeouts((prev) => ({
                ...prev,
                [nodeId]: timeout,
            }))

            const connectedEdges = edges.filter((edge) => edge.source === nodeId)
            console.log("Connected edges for", nodeId, ":", connectedEdges)

            connectedEdges.forEach((edge, index) => {
                setTimeout(() => {
                    animateEdge(edge.id)
                    setTimeout(() => {
                        triggerAnimation(edge.target)
                    }, 300)
                }, 200 * index)
            })
        },
        [edges, animationTimeouts, animateEdge],
    )
    const animateAntecedents = useCallback(
        (targetNodeId: string) => {
            console.log("Animating antecedents for node:", targetNodeId)
            const sourcePaths = nodeConnectionsMap.current[targetNodeId] || []
            console.log("Source paths found:", sourcePaths)

            if (sourcePaths.length === 0) {
                console.log("No source paths found for node:", targetNodeId)
                return
            }

            // Animer chaque chemin séquentiellement
            let index = 0
            const animateNext = () => {
                if (index >= sourcePaths.length) {
                    console.log("All animations complete, activating target node:", targetNodeId)
                    // Toutes les animations sont terminées, activer le nœud cible
                    setActiveNodes((prev) => {
                        const newSet = new Set(prev)
                        newSet.add(targetNodeId)
                        return newSet
                    })

                    setTimeout(() => {
                        setActiveNodes((prev) => {
                            const newSet = new Set(prev)
                            newSet.delete(targetNodeId)
                            return newSet
                        })
                    }, 500)
                    return
                }

                const currentPath = sourcePaths[index]
                console.log("Animating path:", currentPath)

                // Activer le nœud source
                setActiveNodes((prev) => {
                    const newSet = new Set(prev)
                    newSet.add(currentPath.sourceId)
                    return newSet
                })

                // Animer l'edge
                animateEdge(currentPath.edgeId, 1000)

                // Après l'animation
                setTimeout(() => {
                    // Désactiver le nœud source
                    setActiveNodes((prev) => {
                        const newSet = new Set(prev)
                        newSet.delete(currentPath.sourceId)
                        return newSet
                    })

                    // Passer au suivant
                    index++
                    animateNext()
                }, 1000)
            }

            // Commencer l'animation
            animateNext()
        },
        [animateEdge],
    )
    useEffect(() => {
        if (!socket) return

        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data)
                console.log("WebSocket message received:", message)

                // Quand un nœud reçoit un message via flow/status
                if (message.TYPE === "flow/status" && message.id) {
                    console.log("Flow status message received for node:", message.id)
                    console.log("Current connection map:", nodeConnectionsMap.current)

                    // Déclencher l'animation des antécédents
                    animateAntecedents(message.id)
                }
            } catch (error) {
                console.error("Erreur lors du parsing du message WebSocket:", error)
            }
        }

        socket.addEventListener("message", handleMessage)

        return () => {
            socket.removeEventListener("message", handleMessage)
        }
    }, [socket])
    const handleTriggerRun = useCallback((nodeId: string) => {
        triggerAnimation(nodeId);
    }, [triggerAnimation]);

    const handleDeleteNode = (nodeId: string) => {
        setNodes((nodes) => nodes.filter((node) => node.id !== nodeId))
        setEdges((edges) => edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))

        // Réinitialiser selectedNode si c'est le nœud supprimé
        if (selectedNode.current === nodeId) {
            selectedNode.current = null
        }

        console.log(`Deleted node: ${nodeId}`)
    }

    useEffect(() => {
        requestFlowDesign();
    }, [components]);

    useEffect(() => {
        console.log("Selected node changed:", selectedNode.current)
        if (selectedNode.current?.startsWith("trigger")) {
            triggerAnimation(selectedNode.current)
        }
    }, [selectedNode.current])


    const nodeTypes = useMemo<NodeTypes>(
        () => ({
            default: (props) => (
                <CustomNode
                    {...props}
                    activeNodes={activeNodes}
                    onTriggerRun={handleTriggerRun}
                    onDeleteNode={handleDeleteNode}
                />
            ),
        }),
        [],
    )

    const loadFlowFromDesign = (designData: FlowDesignData) => {
        try {
            setIsLoadingFlow(true)
            console.log("Loading flow from design data:", designData)
            const newNodes: FlowNode[] = []
            const newEdges: FlowEdge[] = []
            Object.entries(designData).forEach(([nodeId, nodeData]) => {
                const componentId = nodeData.component || "unknown"
                const component = components.current.find((c) => c.id === componentId) || {
                    id: componentId,
                    name: nodeData.name || nodeId,
                    type: componentId,
                    outputs: [],
                    icon: "",
                }
                const newNode: FlowNode = {
                    id: nodeId,
                    type: "default",
                    position: { x: nodeData.x || 0, y: nodeData.y || 0 },
                    data: {
                        label: nodeData.name || component.name,
                        type: component.type || component.id,
                        status: statuses[nodeId]?.status,
                        icon: component.icon,
                        note: nodeData.note || "",
                        component: {
                            ...component,
                            config: nodeData.config || component.config || {},
                        },
                        outputs: nodeData.outputs || component.outputs,
                        inputs: nodeData.inputs || component.inputs,
                    },
                }
                newNodes.push(newNode)
            })
            Object.entries(designData).forEach(([sourceNodeId, nodeData]) => {
                if (nodeData.connections) {
                    Object.entries(nodeData.connections).forEach(([outputId, targets]) => {
                        if (Array.isArray(targets)) {
                            targets.forEach((target: any, index) => {
                                console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", target)
                                let targetNodeId = ""
                                let targetInputId = ""
                                console.log(typeof (target))
                                if (typeof target === "string") {
                                    console.log("weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", target)
                                    targetNodeId = target
                                } else if (target && typeof target === "object") {
                                    targetNodeId = target.id || target.node || ""
                                    targetInputId = target.index
                                }

                                if (targetNodeId) {
                                    const edge: FlowEdge = {
                                        id: `e-${sourceNodeId}-${outputId}-${targetNodeId}-${index}`,
                                        source: sourceNodeId,
                                        target: targetNodeId,
                                        sourceHandle: outputId,
                                        targetHandle: targetInputId,
                                        className: "",
                                    }
                                    newEdges.push(edge)
                                }
                            })
                        }
                    })
                }
            })
            console.log("Created edges:", newEdges)
            setNodes(newNodes)
            setEdges(newEdges)
            console.log("Flow loaded successfully:", { nodes: newNodes, edges: newEdges })
        } catch (err) {
            console.error("Error loading flow from design data:", err)
            // setError(`Error loading flow: ${err instanceof Error ? err.message : String(err)}`)
        } finally {
            setIsLoadingFlow(false)
        }
    }


    const sendMessage = (message: string) => {
        if (socket) {
            socket.send(message)
        } else {
            console.error("WebSocket is not open. Unable to send message.")
        }
    }
    const requestFlowDesign = () => {
        setIsLoadingFlow(true)
        sendMessage(
            JSON.stringify({
                TYPE: "flow/design",
            }),
        )

    }
    const handleDeleteComponent = (componentId: string) => {
        if (socket) {
            const message = {
                TYPE: "component_remove",
                id: componentId,
            }
            socket.send(JSON.stringify(message))
            closeContextMenu()
        } else {
            console.error("WebSocket is not connected")
        }
    }

    const handleEditComponent = (componentId: string) => {
        // Implement edit functionality
        console.log("Edit component:", componentId)
        closeContextMenu()
    }

    const handleCloneComponent = (component: any) => {
        // Implement clone functionality
        console.log("Clone component:", component)
        closeContextMenu()
    }

    const handleCopySource = (component: any) => {
        // Implement copy source functionality
        console.log("Copy source code for:", component)
        closeContextMenu()
    }

    const handlePublishComponent = (component: any) => {
        // Implement publish functionality
        console.log("Publish component:", component)
        closeContextMenu()
    }

    const handleReadInfo = (component: any) => {
        // Implement read info functionality
        console.log("Read info for:", component)
        closeContextMenu()
    }

    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const { project } = useReactFlow();
    const onDrop = (event: React.DragEvent) => {
        event.preventDefault();

        // Récupérer les données du composant depuis l'événement drag
        const componentData = event.dataTransfer.getData("application/reactflow");
        if (!componentData) return;

        // Parser les données du composant
        const component: FlowComponent = JSON.parse(componentData);

        // Obtenir la position de la souris dans le canevas
        const reactFlowBounds = event.currentTarget.getBoundingClientRect();
        const position = project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        // Créer un nouveau nœud
        const newNodeId = `${component.id}_${Date.now()}`;
        const newNode: FlowNode = {
            id: newNodeId,
            type: "default",
            position,
            data: {
                label: component.name,
                type: component.type || component.id,
                icon: component.icon,
                component,
                outputs: component.outputs,
            },
        };

        // Ajouter le nœud à l'état
        setNodes((nds) => [...nds, newNode]);
        selectedNode.current = newNodeId;

        // Envoyer la mise à jour via WebSocket
        sendMessage(
            JSON.stringify({
                TYPE: "flow/add-node",
                node: {
                    id: newNodeId,
                    component: component.id,
                    name: component.name,
                    position: newNode.position,
                },
            })
        );

        console.log(`Dropped component: ${component.name} (${component.id}) at position:`, position);
    };

    useEffect(() => {
        if (socket === null) return
        const handleMessage = (event: MessageEvent) => {

            console.log("socket conneciton")
            try {
                const message = JSON.parse(event.data as string);

                console.log("TYPE reçu :", message.TYPE);

                switch (message.TYPE) {
                    case "flow/components": {
                        const comps = message.data || [];
                        components.current = comps;

                        const categories: Record<string, FlowComponent[]> = {};
                        comps.forEach((comp: FlowComponent) => {
                            const category = comp.category || comp.group || "Other";
                            (categories[category] ??= []).push(comp);
                        });

                        setComponentCategories(categories);
                        break;
                    }

                    case "flow/status": {
                        setStatuses((prev) => ({
                            ...prev,
                            [message.id]: message.data,
                        }));

                        setNodes((nodes) =>
                            nodes.map((node) =>
                                node.id === message.id
                                    ? {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            status: message.data.status,
                                        },
                                    }
                                    : node
                            )
                        );
                        break;
                    }

                    case "flow/stats": {
                        setStats(message);
                        setIsPaused(message.paused);
                        break;
                    }

                    case "flow/nodes": {
                        // const flowNodes = (message.nodes || []).map((node: any) => {
                        //     const component =
                        //         components.current?.find((c) => c.id === node.component || c.id === node.type) || {
                        //             id: node.type,
                        //             name: node.name || node.id,
                        //             type: node.type,
                        //             outputs: [],
                        //             icon: "",
                        //         };

                        //     return {
                        //         id: node.id,
                        //         type: "default",
                        //         note: node.note || "",
                        //         position: { x: node.position?.x || 0, y: node.position?.y || 0 },
                        //         data: {
                        //             label: node.name || component.name,
                        //             type: node.type || component.type,
                        //             status: statuses[node.id]?.status,
                        //             icon: component.icon,
                        //             component: component,
                        //             outputs: component.outputs,
                        //         },
                        //     };
                        // });

                        // const flowEdges = (message.edges || []).map((edge: any) => ({
                        //     id: edge.id,
                        //     source: edge.source,
                        //     target: edge.target,
                        //     sourceHandle: edge.sourceHandle,
                        //     targetHandle: edge.targetHandle,
                        // }));

                        // setNodes(flowNodes);
                        // setEdges(flowEdges);
                        break;
                    }

                    case "flow/design": {
                        console.log("Received flow/design data:", message.data);
                        loadFlowFromDesign(message.data);
                        break;
                    }

                    case "flow/config": {
                        console.log("update configuration");
                        setNodes((nodes) =>
                            nodes.map((node) =>
                                node.id === message.id
                                    ? {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            component: {
                                                ...node.data.component,
                                                config: message.data,
                                            },
                                        },
                                    }
                                    : node
                            )
                        );
                        break;
                    }

                    default:
                        console.warn("Type de message WebSocket inconnu :", message.TYPE);
                }
            } catch (err) {
                console.error("Erreur lors du traitement des messages WebSocket :", err);
                const categories: Record<string, FlowComponent[]> = {};
                setComponentCategories(categories);
                setLoading(false);
            }
        }



        socket.addEventListener('message', handleMessage);
        return () => socket.removeEventListener('message', handleMessage);
    }, [socket]);

    useEffect(() => {
        if (components.current.length > 0 && nodes.length > 0) {
            setNodes((currentNodes) =>
                currentNodes.map((node) => {
                    const componentId = node.data.component?.id
                    if (componentId) {
                        const updatedComponent = components.current.find((c) => c.id === componentId)
                        if (updatedComponent) {
                            return {
                                ...node,
                                data: {
                                    ...node.data,
                                    component: updatedComponent,
                                    outputs: updatedComponent.outputs,
                                },
                            }
                        }
                    }
                    return node
                }),
            )
        }
    }, [components, setNodes])

    useEffect(() => {
        setEdges((edges) =>
            edges.map((edge) => ({
                ...edge,
                className: animatedEdges.has(edge.id) ? "edge-animated" : "",
            })),
        )
    }, [animatedEdges, setEdges])

    const handleAddComponent = (component: FlowComponent) => {
        const newNodeId = `${component.id}_${Date.now()}`
        const newNode = {
            id: newNodeId,
            type: "default",
            position: {
                x: window.innerWidth / 2 - 100,
                y: window.innerHeight / 2 - 100,
            },
            data: {
                label: component.name,
                type: component.type || component.id,
                icon: component.icon,
                component: component,
                outputs: component.outputs,
            },
        }
        setNodes((nodes) => [...nodes, newNode])
        selectedNode.current = newNodeId
        // if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendMessage(
            JSON.stringify({
                TYPE: "flow/add-node",
                node: {
                    id: newNodeId,
                    component: component.id,
                    name: component.name,
                    position: newNode.position,
                },
            }),
        )
        //}
        console.log(`Added component: ${component.name} (${component.id})`)
    }

    const onConnect = (connection: Connection) => {
        console.log("connnnnnnnnnnnnnnnnnnnnnnnnnnnnnection*************************************", connection)
        const newEdge = {
            id: `e-${connection.source}-${connection.sourceHandle}-${connection.target}-${Date.now()}`,
            source: connection.source || "",
            target: connection.target || "",
            sourceHandle: connection.sourceHandle,
            targetHandle: connection.targetHandle,
        }
        setEdges((edges) => addEdge(newEdge, edges))
        // if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendMessage(
            JSON.stringify({
                TYPE: "flow/add-edge",
                edge: newEdge,
            }),
        )
        // }
    }


    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        selectedNode.current = node.id
        forceUpdate((x) => x + 1)
    }
    useEffect(() => {
        console.log('Selected node changed:', selectedNode.current)
    }, [selectedNode.current])
    useEffect(() => {
    }, [selectedNode.current])
    const handleBackHome = () => {
        window.location.href = '/flow';
    };

    const togglePause = () => {
        // if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendMessage(
            JSON.stringify({
                TYPE: "flow/toggle-pause",
            }),
        )
        // }
    }
    const { toast } = useToast();
    const saveFlow = () => {
        if (socket) {
            const flowData: Record<string, any> = {}
            nodes.forEach((node) => {
                const nodeComponent = node.data.component
                const nodeId = node.id
                const nodeData: Record<string, any> = {
                    id: nodeId,
                    component: nodeComponent.id,
                    config: nodeComponent.config || {},
                    x: node.position.x,
                    y: node.position.y,
                    connected: true,
                    connections: {},
                }
                if (nodeComponent.outputs && nodeComponent.outputs.length > 0) {
                    nodeData.outputs = nodeComponent.outputs.map((output) => ({
                        id: output.id,
                        name: output.name,
                    }))
                }
                if (nodeComponent.inputs && nodeComponent.inputs.length > 0) {
                    nodeData.inputs = nodeComponent.inputs.map((input) => ({
                        id: input.id,
                        name: input.name,
                    }))
                }
                flowData[nodeId] = nodeData
            })
            edges.forEach((edge) => {
                const sourceId = edge.source
                const targetId = edge.target
                const sourceHandle = edge.sourceHandle || "output"
                const targetHandle = edge.targetHandle || "input"
                if (flowData[sourceId]) {
                    if (!flowData[sourceId].connections) {
                        flowData[sourceId].connections = {}
                    }
                    if (!flowData[sourceId].connections[sourceHandle]) {
                        flowData[sourceId].connections[sourceHandle] = []
                    }
                    flowData[sourceId].connections[sourceHandle].push({
                        id: targetId,
                        index: targetHandle,
                    })
                }
            })
            console.log("Saving flow data:", flowData)
            socket.send(
                JSON.stringify({
                    TYPE: "save",
                    data: flowData,
                }),
            )
            toast({
                title: "Success",
                className: "bg-green-500 text-white",
                description: "Flow saved successfully",
            });

            setTimeout(() => {
                requestFlowDesign()
            }, 500)

        }
    }
    const handleContextMenu = (e: React.MouseEvent, component: any) => {
        e.preventDefault()
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            component,
        })
    }

    const closeContextMenu = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            component: null,
        })
    }

    const filteredComponents = Object.entries(componentCategories)
        .map(([category, comps]) => ({
            category,
            components: comps.filter(
                (comp) =>
                    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    comp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    category.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        }))
        .filter((group) => group.components.length > 0)

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center h-screen bg-gray-100">
    //             <div className="flex flex-col items-center">
    //                 <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
    //                 <p className="mt-2 text-gray-600">Connecting to flow server...</p>
    //             </div>
    //         </div>
    //     )
    // }

    // if (error) {
    //     return (
    //         <div className="flex items-center justify-center h-screen bg-gray-100">
    //             <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
    //                 <h2 className="text-xl font-bold text-red-600 mb-4">Connection Error</h2>
    //                 {/* <p className="text-gray-700">{error}</p> */}
    //                 <button
    //                     onClick={() => window.location.reload()}
    //                     className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    //                 >
    //                     Retry Connection
    //                 </button>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search components"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-8 py-2 text-sm text-black dark:bg-black dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {components.current.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 p-6 mt-12">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="h-10 w-10 text-gray-400 dark:text-gray-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 22v-5" />
                                    <path d="M9 7V2" />
                                    <path d="M15 7V2" />
                                    <path d="M6 13V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3Z" />
                                </svg>
                            </div>

                            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                                You don't have installed<br />
                                any FlowStream<br />
                                components
                            </p>

                            <button
                                onClick={handleDownloadComponent}
                                className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    ) : (
                        filteredComponents.map((group) => (
                            <div key={group.category} className="mb-2">
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                    {group.category}
                                </div>
                                <div className="p-2">
                                    {group.components.map((component) => (
                                        <div
                                            key={component.id}
                                            className="p-2 mb-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            onClick={() => handleAddComponent(component)}
                                            onContextMenu={(e) => handleContextMenu(e, component)}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData("application/reactflow", JSON.stringify(component));
                                                e.dataTransfer.effectAllowed = "move";
                                            }}
                                        >
                                            <div className="w-6 h-6 mr-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded text-xs">
                                                {(() => {
                                                    const iconType = component.id;
                                                    switch (iconType) {
                                                        case "trigger":
                                                            return <Play className="h-4 w-4 text-black dark:text-white" />;
                                                        case "mqttbroker":
                                                            return <Share2 className="h-4 w-4 text-black dark:text-white" />;
                                                        case "mqttpublish":
                                                            return <Send className="h-4 w-4 text-black dark:text-white" />;
                                                        case "mqttsubscribe":
                                                            return <MessageSquare className="h-4 w-4 text-black dark:text-white" />;
                                                        case "code":
                                                            return <Code className="h-4 w-4 text-black dark:text-white" />;
                                                        case "print":
                                                        case "printjson":
                                                            return <Printer className="h-4 w-4 text-black dark:text-white" />;
                                                        case "modify":
                                                            return <Edit className="h-4 w-4 text-black dark:text-white" />;
                                                        case "queue":
                                                            return <ListOrdered className="h-4 w-4 text-black dark:text-white" />;
                                                        case "comment":
                                                            return <MessageCircle className="h-4 w-4 text-black dark:text-white" />;
                                                        case "debug":
                                                            return <Bug className="h-4 w-4 text-black dark:text-white" />;
                                                        default:
                                                            return <Box className="h-4 w-4 text-black dark:text-white" />;
                                                    }
                                                })()}
                                            </div>
                                            <span className="text-sm text-black dark:text-white">{component.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                    {contextMenu.visible && contextMenu.component && (
                        <ComponentContextMenu
                            x={contextMenu.x}
                            y={contextMenu.y}
                            component={contextMenu.component}
                            onClose={closeContextMenu}
                            onDelete={handleDeleteComponent}
                            onEdit={handleEditComponent}
                            onClone={handleCloneComponent}
                            onCopySource={handleCopySource}
                            onPublish={handlePublishComponent}
                            onReadInfo={handleReadInfo}
                        />
                    )}
                    <div className="mt-4 p-2 flex flex-col gap-2">
                        <ComponentDownloadDialog
                            open={downloadDialogOpen}
                            onOpenChange={setDownloadDialogOpen}
                            onComponentSelect={handleComponentSelect}
                            flowId={flowId}
                        />
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col">
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="bg-primary dark:bg-orange-700" size="sm" onClick={handleBackHome}>
                            <ArrowBigLeft className="h-4 w-4 mr-1" />
                            Home
                        </Button>
                        <Button variant="outline" className="bg-primary dark:bg-orange-700" size="sm" onClick={saveFlow}>
                            <Save className="h-4 w-4 mr-1" />
                            Apply
                        </Button>
                        <Button variant={isPaused ? "destructive" : "outline"} size="sm" onClick={togglePause} className="bg-primary dark:bg-orange-700">
                            {isPaused ? (
                                <>
                                    <Play className="h-4 w-4 mr-1" />
                                    Resume
                                </>
                            ) : (
                                <>
                                    <Pause className="h-4 w-4 mr-1" />
                                    Pause
                                </>
                            )}
                        </Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-primary dark:bg-orange-700">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Plus
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-0" align="start">
                                <div className="flex flex-col">
                                    <Link to={`/components/new?flowId=${flowId}`} className="w-full">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start rounded-none h-10 px-3 font-medium text-gray-800 dark:text-gray-200 bg-primary dark:bg-orange-700"
                                        >
                                            <FileSymlink className="h-4 w-4 mr-2" />
                                            Create Component
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start rounded-none h-10 px-3 font-medium bg-primary dark:bg-orange-700"
                                        onClick={handleDownloadComponent}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Component
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button
                            variant="outline"
                            className="bg-primary dark:bg-orange-700"
                            size="sm"
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            <RefreshCw className={`h-4 w-4 mr-1 }`} />
                            {"Reload Flow"}
                        </Button>

                        <Button variant="outline" size="sm" className="bg-primary dark:bg-orange-700">
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                        </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        {stats && (
                            <>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500 dark:text-gray-400">Memory:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {(stats.memory / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500 dark:text-gray-400">Messages:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{stats.messages}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500 dark:text-gray-400">Pending:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{stats.pending}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-1 h-full">

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        edgesFocusable={false}
                        edgesUpdatable={false}
                        fitView
                        fitViewOptions={{ maxZoom: 1, minZoom: 0.1, duration: 800 }}
                        defaultViewport={{ x: 0, y: 0, zoom }}
                        onInit={onInit}
                        className="bg-white dark:bg-gray-900"
                        onDragOver={onDragOver} // Ajouter le gestionnaire drag over
                        onDrop={onDrop} // Ajouter le gestionnaire drop

                    >
                        <Background color="white" />

                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </div>
            </div>

            {/* Properties Panel */}
            {selectedNode.current && (
                <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 dark:text-white">Properties</h3>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => selectedNode.current = ""}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-3">
                        {nodes.find((node) => node.id === selectedNode.current) && (
                            <Card className="p-3">
                                <div className="mb-2">
                                    <label className="text-xs text-gray-500 dark:text-gray-400">ID</label>
                                    <div className="text-sm font-mono text-gray-900 dark:text-white">{selectedNode.current}</div>
                                </div>
                                <div className="mb-2">
                                    <label className="text-xs text-gray-500 dark:text-gray-400">Type</label>
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {nodes.find((node) => node.id === selectedNode.current)?.data.type}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="text-xs text-gray-500 dark:text-gray-400">Status</label>
                                    <div className="text-sm flex items-center text-gray-900 dark:text-white">
                                        <span
                                            className={`inline-block w-2 h-2 rounded-full mr-1 ${nodes.find((node) => node.id === selectedNode.current)?.data.status === "reconnecting"
                                                ? "bg-yellow-500"
                                                : nodes.find((node) => node.id === selectedNode.current)?.data.status === "connected"
                                                    ? "bg-green-500"
                                                    : "bg-gray-500"
                                                }`}
                                        />
                                        {nodes.find((node) => node.id === selectedNode.current)?.data.status || "unknown"}
                                    </div>
                                </div>
                                {nodes.find((node) => node.id === selectedNode.current)?.data.component && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Component Properties</div>
                                        {nodes.find((node) => node.id === selectedNode.current)?.data.component.author && (
                                            <div className="mt-2">
                                                <label className="text-xs text-gray-500 dark:text-gray-400">Author</label>
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {nodes.find((node) => node.id === selectedNode.current)?.data.component.author}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
