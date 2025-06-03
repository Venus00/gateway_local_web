import type React from "react"
import { startTransition, useState } from "react"
import { Search, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import type { IoTCard } from "@/lib/types"
import { useNavigate } from "react-router"

// Types
interface Icon {
    id: string
    name: string
}

interface Color {
    id: string
    name: string
    hex: string
}

interface FormData {
    id: string
    name: string
    url: string
    group: string
    reference: string
    version: string
    icon: string
    color: string
    author: string
    readme: string
}

interface FormErrors {
    name?: string
    icon?: string
    [key: string]: string | undefined
}

// Define our icon set
const icons: Icon[] = [
    { id: "ad", name: "Ad" },
    { id: "user", name: "User" },
    { id: "card", name: "Card" },
    { id: "sun", name: "Sun" },
    { id: "moon", name: "Moon" },
    { id: "chip", name: "Chip" },
    { id: "bulb", name: "Bulb" },
    { id: "home", name: "Home" },
    { id: "settings", name: "Settings" },
    { id: "chart", name: "Chart" },
    { id: "key", name: "Key" },
    { id: "lock", name: "Lock" },
    { id: "unlock", name: "Unlock" },
    { id: "star", name: "Star" },
    { id: "heart", name: "Heart" },
    { id: "bell", name: "Bell" },
    { id: "mail", name: "Mail" },
    { id: "phone", name: "Phone" },
    { id: "message", name: "Message" },
    { id: "cloud", name: "Cloud" },
    { id: "download", name: "Download" },
    { id: "upload", name: "Upload" },
    { id: "trash", name: "Trash" },
    { id: "warning", name: "Warning" },
    { id: "info", name: "Info" },
    { id: "alert", name: "Alert" },
    { id: "calendar", name: "Calendar" },
    { id: "clock", name: "Clock" },
    { id: "tag", name: "Tag" },
    { id: "bookmark", name: "Bookmark" },
    { id: "flag", name: "Flag" },
    { id: "image", name: "Image" },
    { id: "video", name: "Video" },
    { id: "music", name: "Music" },
    { id: "file", name: "File" },
    { id: "folder", name: "Folder" },
    { id: "link", name: "Link" },
    { id: "globe", name: "Globe" },
    { id: "map", name: "Map" },
    { id: "compass", name: "Compass" },
    { id: "location", name: "Location" },
    { id: "microchip", name: "Microchip" },
    { id: "cogs", name: "Cogs" },
    { id: "server", name: "Server" },
    { id: "database", name: "Database" },
    { id: "bullhorn", name: "Bullhorn" },
]

// Define our color palette
const colors: Color[] = [
    { id: "slate", name: "Slate", hex: "#64748b" },
    { id: "gray", name: "Gray", hex: "#6b7280" },
    { id: "zinc", name: "Zinc", hex: "#71717a" },
    { id: "neutral", name: "Neutral", hex: "#737373" },
    { id: "stone", name: "Stone", hex: "#78716c" },
    { id: "red", name: "Red", hex: "#ef4444" },
    { id: "orange", name: "Orange", hex: "#f97316" },
    { id: "amber", name: "Amber", hex: "#f59e0b" },
    { id: "yellow", name: "Yellow", hex: "#eab308" },
    { id: "lime", name: "Lime", hex: "#84cc16" },
    { id: "green", name: "Green", hex: "#22c55e" },
    { id: "emerald", name: "Emerald", hex: "#10b981" },
    { id: "teal", name: "Teal", hex: "#14b8a6" },
    { id: "cyan", name: "Cyan", hex: "#06b6d4" },
    { id: "sky", name: "Sky", hex: "#0ea5e9" },
    { id: "blue", name: "Blue", hex: "#3b82f6" },
    { id: "indigo", name: "Indigo", hex: "#6366f1" },
    { id: "violet", name: "Violet", hex: "#8b5cf6" },
    { id: "purple", name: "Purple", hex: "#a855f7" },
    { id: "fuchsia", name: "Fuchsia", hex: "#d946ef" },
    { id: "pink", name: "Pink", hex: "#ec4899" },
    { id: "rose", name: "Rose", hex: "#f43f5e" },
]

// Icon component to render icons
interface IconDisplayProps {
    iconId: string
}

const IconDisplay: React.FC<IconDisplayProps> = ({ iconId }) => {
    // This is a simplified version - in a real implementation, you would use a proper icon library
    return (
        <div className="flex items-center justify-center w-6 h-6">
            {iconId === "chip" && <span className="text-lg">🔌</span>}
            {iconId === "card" && <span className="text-lg">📇</span>}
            {iconId === "bulb" && <span className="text-lg">💡</span>}
            {iconId === "home" && <span className="text-lg">🏠</span>}
            {iconId === "settings" && <span className="text-lg">⚙️</span>}
            {iconId === "star" && <span className="text-lg">⭐</span>}
            {iconId === "heart" && <span className="text-lg">❤️</span>}
            {iconId === "bell" && <span className="text-lg">🔔</span>}
            {iconId === "mail" && <span className="text-lg">✉️</span>}
            {iconId === "ad" && <span className="text-lg">📢</span>}
            {iconId === "user" && <span className="text-lg">👤</span>}
            {iconId === "microchip" && <span className="text-lg">🖥️</span>}
            {iconId === "cogs" && <span className="text-lg">⚙️</span>}
            {iconId === "server" && <span className="text-lg">🖧</span>}
            {iconId === "database" && <span className="text-lg">🗃️</span>}
            {iconId === "bullhorn" && <span className="text-lg">📣</span>}
            {/* Default icon for any icon not explicitly handled */}
            {![
                "chip",
                "card",
                "bulb",
                "home",
                "settings",
                "star",
                "heart",
                "bell",
                "mail",
                "ad",
                "user",
                "microchip",
                "cogs",
                "server",
                "database",
                "bullhorn",
            ].includes(iconId) && <span className="text-lg">📄</span>}
        </div>
    )
}

// Icon selector component
interface IconSelectorProps {
    selectedIcon: string
    onSelectIcon: (iconId: string) => void
    error?: string
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon, error }) => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)

    const filteredIcons = icons.filter((icon) => icon.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`w-full justify-start gap-2 bg-white text-gray-700 ${error ? "border-red-500" : "border-gray-300"}`}
                >
                    {selectedIcon ? (
                        <>
                            <IconDisplay iconId={selectedIcon} />
                            <span className="text-gray-700">{icons.find((i) => i.id === selectedIcon)?.name || selectedIcon}</span>
                        </>
                    ) : (
                        <span className="text-gray-500">Select an icon</span>
                    )}
                    <span className="ml-auto text-gray-400">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor" />
                        </svg>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-white border border-gray-200 shadow-lg" align="start">
                <div className="p-2 border-b border-gray-200 bg-white">
                    <div className="flex items-center border border-gray-300 rounded-md px-2 bg-white">
                        <Search size={16} className="text-gray-400 mr-2" />
                        <Input
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 bg-white"
                            placeholder="Search icons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ backgroundColor: "white", color: "#374151" }}
                        />
                    </div>
                </div>
                <div className="h-80 overflow-auto grid grid-cols-6 gap-1 p-2 bg-white">
                    {filteredIcons.map((icon) => (
                        <button
                            key={icon.id}
                            className={`
                flex items-center justify-center p-2 rounded-md cursor-pointer
                hover:bg-gray-50 transition-colors bg-white
                ${selectedIcon === icon.id ? "bg-blue-50" : ""}
              `}
                            onClick={() => {
                                onSelectIcon(icon.id)
                                setOpen(false)
                            }}
                            title={icon.name}
                        >
                            <div className="relative">
                                <IconDisplay iconId={icon.id} />
                                {selectedIcon === icon.id && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Check size={8} className="text-white" />
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

// Color selector component
interface ColorSelectorProps {
    selectedColor: string
    onSelectColor: (colorId: string) => void
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onSelectColor }) => {
    const [open, setOpen] = useState<boolean>(false)

    // Find the color object that matches the hex value
    const findColorByHex = (hex: string): Color | undefined => {
        return colors.find((c) => c.hex === hex || c.id === hex)
    }

    // Get the current color object
    const currentColor = findColorByHex(selectedColor)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 bg-white text-gray-700 border-gray-300">
                    {selectedColor ? (
                        <>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentColor?.hex || selectedColor }} />
                            <span className="text-gray-700">{currentColor?.name || selectedColor}</span>
                        </>
                    ) : (
                        <span className="text-gray-500">Select a color</span>
                    )}
                    <span className="ml-auto text-gray-400">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor" />
                        </svg>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 bg-white border border-gray-200 shadow-lg" align="start">
                <div className="grid grid-cols-5 gap-2 bg-white">
                    {colors.map((color) => (
                        <button
                            key={color.id}
                            className={`
                w-8 h-8 rounded-md cursor-pointer flex items-center justify-center
                hover:ring-2 hover:ring-gray-200 transition-all
                ${selectedColor === color.id || selectedColor === color.hex ? "ring-2 ring-blue-500" : ""}
              `}
                            style={{ backgroundColor: color.hex }}
                            onClick={() => {
                                onSelectColor(color.id)
                                setOpen(false)
                            }}
                            title={color.name}
                        >
                            {(selectedColor === color.id || selectedColor === color.hex) && (
                                <Check size={16} className="text-white" />
                            )}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

interface EditFlowFormProps {
    onRefetch?: () => void
    card: IoTCard
    onClose: () => void

}

export default function EditFlowForm({ onRefetch, card, onClose }: EditFlowFormProps) {

    // Extract icon name from "fas fa-" or "fa fa-" prefix
    const iconName = card.iconType.replace("fas fa-", "").replace("fa fa-", "")
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        id: card.id,
        name: card.title,
        url: card.url || "https://",
        icon: iconName,
        group: card.group || "",
        reference: card.reference || "",
        version: card.version || "",
        color: card.color || "",
        author: card.createdBy || "",
        readme: card.readme || "",
    })

    const [errors, setErrors] = useState<FormErrors>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSelectIcon = (iconId: string) => {
        setFormData((prev) => ({ ...prev, icon: iconId }))

        // Clear error
        if (errors.icon) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors.icon
                return newErrors
            })
        }
    }

    const handleSelectColor = (colorId: string) => {
        setFormData((prev) => ({ ...prev, color: colorId }))
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!formData.icon) {
            newErrors.icon = "Icon is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        try {
            // Prepare basic payload with required fields
            const payload = {
                schema: "streams_save",
                data: {
                    id: formData.id, // Include the ID for update
                    name: formData.name,
                    url: formData.url,
                    icon: `fas fa-${formData.icon}`, // Convert to Font Awesome format
                },
            }

            // If needed, you can add any additional properties to the data object by type assertion
            const payloadData = payload.data as {
                id: string
                name: string
                url: string
                icon: string
                group?: string
                reference?: string
                version?: string
                color?: string
                author?: string
                readme?: string
            }

            // Add optional fields if they have values
            if (formData.group) payloadData.group = formData.group
            if (formData.reference) payloadData.reference = formData.reference
            if (formData.version) payloadData.version = formData.version
            if (formData.color) payloadData.color = formData.color
            if (formData.author) payloadData.author = formData.author
            if (formData.readme) payloadData.readme = formData.readme

            // Send data to API
            const response = await fetch("/api/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`)
            }

            const result = await response.json()
            console.log("API response:", result)
            onRefetch?.();

            onClose?.()
            await navigate('/')

            startTransition(() => {
                navigate('')
            })
        } catch (error) {
            console.error("Error submitting form:", error)
            // You could add error handling UI here
            alert("Failed to save flow. Please try again.")
        }
    }

    return (
        <div className="bg-white">
            <div className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                        <span className="text-red-500 mr-1">*</span> Name
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`h-10 bg-white ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                        placeholder="Enter name"
                        style={{ backgroundColor: "white", color: "#374151" }}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-3">
                    <Label htmlFor="url" className="text-sm font-medium text-gray-700">
                        URL address
                    </Label>
                    <Input
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        className="h-10 focus:ring-blue-500 bg-white"
                        placeholder="https://"
                        style={{ backgroundColor: "white", color: "#374151" }}
                    />
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="group" className="text-sm font-medium text-gray-700">
                            Group
                        </Label>
                        <Input
                            id="group"
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            className="h-10 focus:ring-blue-500 bg-white"
                            placeholder="Enter group"
                            style={{ backgroundColor: "white", color: "#374151" }}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="reference" className="text-sm font-medium text-gray-700">
                            Reference
                        </Label>
                        <Input
                            id="reference"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            className="h-10 focus:ring-blue-500 bg-white"
                            placeholder="Enter reference"
                            style={{ backgroundColor: "white", color: "#374151" }}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="version" className="text-sm font-medium text-gray-700">
                            Version
                        </Label>
                        <Input
                            id="version"
                            name="version"
                            value={formData.version}
                            onChange={handleChange}
                            className="h-10 focus:ring-blue-500 bg-white"
                            placeholder="1.0.0"
                            style={{ backgroundColor: "white", color: "#374151" }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="icon" className="flex items-center text-sm font-medium text-gray-700">
                            <span className="text-red-500 mr-1">*</span> Icon
                        </Label>
                        <IconSelector selectedIcon={formData.icon} onSelectIcon={handleSelectIcon} error={errors.icon} />
                        {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="color" className="text-sm font-medium text-gray-700">
                            Color
                        </Label>
                        <ColorSelector selectedColor={formData.color} onSelectColor={handleSelectColor} />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                            Author
                        </Label>
                        <Input
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="h-10 focus:ring-blue-500 bg-white"
                            placeholder="Your name"
                            style={{ backgroundColor: "white", color: "#374151" }}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="readme" className="text-sm font-medium text-gray-700">
                        Readme
                    </Label>
                    <Textarea
                        id="readme"
                        name="readme"
                        value={formData.readme}
                        onChange={handleChange}
                        className="min-h-[120px] focus:ring-blue-500 bg-white"
                        placeholder="Enter additional information about this flow (Markdown format)"
                        style={{ backgroundColor: "white", color: "#374151" }}
                    />
                    <p className="text-xs text-gray-500">Markdown format</p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="h-10 px-5 text-gray-700 border-gray-300 hover:bg-gray-100 bg-white"
                >
                    Cancel
                </Button>
                <Button onClick={handleSubmit} className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white">
                    <Check size={18} className="mr-2" /> Save Flow
                </Button>
            </div>
        </div>
    )
}
