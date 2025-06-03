import { Node, Edge } from "reactflow"

// Types pour les données de flux
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
}
export type IoTCard = {
    id: string;
    title: string;
    subtitle: string;
    iconType: string;
    size: number;
    color: string;
    url: string;
    reference: string;
    readme: string;
    group: string;
    stats: {
        paused: boolean;
        messages: number;
        pending: number;
        memory: number;
        minutes: number;
        errors: number;
        mm: number;
    };
    createdAt: Date;       // Mapped from dtcreated
    errors: boolean;       // Whether there are errors
    version: string;       // Version information
    createdBy?: string;    // Author field
};
export type FlowStatus = {
    id: string
    data: {
        status: string
        name: string
        topic?: string
    }
}

export type FlowStats = {
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

export type FlowNode = Node<{
    label: string
    type: string
    status?: string
    icon?: string
    component: FlowComponent
    outputs?: Array<{ id: string; name: string }>
    inputs?: Array<{ id: string; name: string }>
}>

export type FlowEdge = Edge

// Type pour les données de conception de flux
export type FlowDesignData = {
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
        connections?: {
            [key: string]: string[]
        }
        component?: string
        name?: string
        config?: any
    }
}