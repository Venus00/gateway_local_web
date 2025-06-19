"use client"

import type React from "react"
import { useState } from "react"
import { X, Search, Check, FileText, LinkIcon, Tag, Hash, Clock, Palette, User, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { SketchPicker, type ColorResult } from "react-color"
import { apiClient } from "@/features/api"
import { useSelector } from "react-redux"
import { RootState } from "@/features/auth/store"

// Types
interface Icon {
  id: string
  name: string
}

interface FormData {
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
]

// Icon component to render icons
interface IconDisplayProps {
  iconId: string
}

const IconDisplay: React.FC<IconDisplayProps> = ({ iconId }) => {
  return (
    <div className="flex items-center justify-center w-8 h-8">
      {iconId === "chip" && <span className="text-xl">🔌</span>}
      {iconId === "card" && <span className="text-xl">📇</span>}
      {iconId === "bulb" && <span className="text-xl">💡</span>}
      {iconId === "home" && <span className="text-xl">🏠</span>}
      {iconId === "settings" && <span className="text-xl">⚙️</span>}
      {iconId === "star" && <span className="text-xl">⭐</span>}
      {iconId === "heart" && <span className="text-xl">❤️</span>}
      {iconId === "bell" && <span className="text-xl">🔔</span>}
      {iconId === "mail" && <span className="text-xl">✉️</span>}
      {iconId === "ad" && <span className="text-xl">📢</span>}
      {iconId === "user" && <span className="text-xl">👤</span>}
      {!["chip", "card", "bulb", "home", "settings", "star", "heart", "bell", "mail", "ad", "user"].includes(
        iconId,
      ) && <span className="text-xl">📄</span>}
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
          className={`w-full h-12 justify-start gap-3 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 border-2 ${error ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all`}
        >
          {selectedIcon ? (
            <>
              <IconDisplay iconId={selectedIcon} />
              <span className="text-base font-medium">
                {icons.find((i) => i.id === selectedIcon)?.name || selectedIcon}
              </span>
            </>
          ) : (
            <span className="text-base text-gray-500 dark:text-gray-400">Select an icon</span>
          )}
          <span className="ml-auto text-gray-400 dark:text-gray-500">
            <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor" />
            </svg>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg"
        align="start"
      >
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900">
            <Search size={18} className="text-gray-400 dark:text-gray-500 mr-2" />
            <Input
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-gray-100 bg-transparent"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="h-80 overflow-auto grid grid-cols-6 gap-2 p-3 bg-white dark:bg-gray-800">
          {filteredIcons.map((icon) => (
            <button
              key={icon.id}
              className={`
                flex items-center justify-center p-2 rounded-lg cursor-pointer
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-all
                ${selectedIcon === icon.id ? "bg-blue-100 dark:bg-blue-900" : ""}
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
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" />
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

// Color selector component with react-color
interface ColorSelectorProps {
  selectedColor: string
  onSelectColor: (color: string) => void
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onSelectColor }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [displayColor, setDisplayColor] = useState<string>(selectedColor || "#3b82f6")

  const handleColorChange = (color: ColorResult) => {
    setDisplayColor(color.hex)
  }

  const handleColorChangeComplete = (color: ColorResult) => {
    onSelectColor(color.hex)
    setDisplayColor(color.hex)
  }

  const getColorName = (hex: string) => {
    // Fonction pour obtenir un nom approximatif de la couleur
    const colorNames: { [key: string]: string } = {
      "#ff0000": "Red",
      "#00ff00": "Green",
      "#0000ff": "Blue",
      "#ffff00": "Yellow",
      "#ff00ff": "Magenta",
      "#00ffff": "Cyan",
      "#000000": "Black",
      "#ffffff": "White",
      "#808080": "Gray",
      "#3b82f6": "Blue",
    }

    return colorNames[hex.toLowerCase()] || hex.toUpperCase()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 justify-start gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
        >
          <div
            className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
            style={{ backgroundColor: selectedColor || displayColor }}
          />
          <span className="text-base font-medium">
            {selectedColor ? getColorName(selectedColor) : "Select a color"}
          </span>
          <span className="ml-auto text-gray-400 dark:text-gray-500">
            <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor" />
            </svg>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg overflow-hidden"
        align="start"
        side="bottom"
      >
        <div className="p-3">
          <SketchPicker
            color={selectedColor || displayColor}
            onChange={handleColorChange}
            onChangeComplete={handleColorChangeComplete}
            disableAlpha={false}
            presetColors={[
              "#FF6B6B",
              "#4ECDC4",
              "#45B7D1",
              "#96CEB4",
              "#FFEAA7",
              "#DDA0DD",
              "#98D8C8",
              "#F7DC6F",
              "#BB8FCE",
              "#85C1E9",
              "#F8C471",
              "#82E0AA",
              "#F1948A",
              "#85C1E9",
              "#D7BDE2",
              "#A3E4D7",
              "#F9E79F",
              "#FADBD8",
              "#D5DBDB",
              "#2C3E50",
            ]}
            styles={{
              default: {
                picker: {
                  backgroundColor: "var(--background)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "none",
                  fontFamily: "inherit",
                },
              },
            }}
          />
        </div>
        <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between pt-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Selected: {selectedColor || displayColor}</span>
            <Button size="sm" onClick={() => setOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface CreateFlowDialogProps {
  onFlowCreated?: () => void
}

export function CreateFlowDialog({ onFlowCreated }: CreateFlowDialogProps = {}) {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "https://",
    group: "",
    reference: "",
    version: "",
    icon: "",
    color: "#3b82f6", // Couleur par défaut
    author: "",
    readme: "",
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

  const handleSelectColor = (color: string) => {
    setFormData((prev) => ({ ...prev, color }))
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
    const { tenant } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const payload = {
        schema: "streams_save",
        data: {
          name: formData.name,
          url: formData.url,
          icon: `fas fa-${formData.icon}`,
          color: formData.color, // Inclure la couleur sélectionnée
        },
      }

      const payloadData = payload.data as {
        name: string
        url: string
        icon: string
        color: string
        group?: string
        reference?: string
        version?: string
        author?: string
        readme?: string
      }

      if (formData.group) payloadData.group = formData.group
      if (formData.reference) payloadData.reference = formData.reference
      if (formData.version) payloadData.version = formData.version
      if (formData.author) payloadData.author = formData.author
      if (formData.readme) payloadData.readme = formData.readme

      console.log("API payload:", payload)
      const response = await apiClient.post("workflow", {
                tenantId: tenant.id,
                ...payload,
            });

            console.log("API response:", response.data);
      setOpen(false)

      setFormData({
        name: "",
        url: "https://",
        group: "",
        reference: "",
        version: "",
        icon: "",
        color: "#3b82f6",
        author: "",
        readme: "",
      })

      if (onFlowCreated) {
        onFlowCreated()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to save flow. Please try again.")
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-black hover:bg-gray-100 px-3 py-2 dark:hover:bg-neutral-700"
        >
          <Plus size={16} className="mr-3" />
          Create new flow
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-2xl rounded-3xl">
        {/* Header */}
        <div className="bg-gray-900 text-white dark:bg-neutral-900">
          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white dark:text-gray-200">Create New Flow</h1>
                <p className="text-gray-300 dark:text-gray-400 mt-1">Define your workflow configuration</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-neutral-700/10 dark:hover:bg-neutral-700/20 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            >
              <X size={20} className="text-white dark:text-gray-200" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-gray-200 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-blue-600 dark:bg-blue-700">
                  <FileText size={18} className="text-white dark:text-gray-200" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Basic Information</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span className="text-red-500 dark:text-red-400 mr-2 text-lg">*</span>
                    <FileText size={14} className="mr-2 text-gray-700 dark:text-gray-300" />
                    Flow Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border-2 transition-all duration-200 font-medium
                      ${
                        errors.name
                          ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-red-400 dark:bg-red-900/50 dark:focus:border-red-600 dark:focus:ring-red-800/50"
                          : "border-gray-200 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:border-neutral-600 dark:bg-neutral-800 dark:focus:border-blue-500 dark:focus:ring-blue-800/50"
                      }
                      hover:border-gray-300 dark:hover:border-neutral-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500
                    `}
                    placeholder="Enter a descriptive name for your flow"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <LinkIcon size={14} className="mr-2 text-gray-700 dark:text-gray-300" />
                    URL Address
                  </label>
                  <input
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 hover:border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:focus:border-blue-500 dark:focus:ring-blue-800/50 dark:hover:border-neutral-500 focus:outline-none transition-all duration-200 font-medium placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Configuration Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-gray-200 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-emerald-600 dark:bg-emerald-700">
                  <Tag size={18} className="text-white dark:text-gray-200" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Configuration</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Tag size={14} className="mr-2 text-gray-700 dark:text-gray-300" />
                    Group
                  </label>
                  <input
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 hover:border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:focus:border-blue-500 dark:focus:ring-blue-800/50 dark:hover:border-neutral-500 focus:outline-none transition-all duration-200 font-medium placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="e.g., Production"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Hash size={14} className="mr-2 text-gray-700 dark:text-gray-300" />
                    Reference
                  </label>
                  <input
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 hover:border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:focus:border-blue-500 dark:focus:ring-blue-800/50 dark:hover:border-neutral-500 focus:outline-none transition-all duration-200 font-medium placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="e.g., REF-001"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Clock size={14} className="mr-2 text-gray-700 dark:text-gray-300" />
                    Version
                  </label>
                  <input
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 hover:border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:focus:border-blue-500 dark:focus:ring-blue-800/50 dark:hover:border-neutral-500 focus:outline-none transition-all duration-200 font-medium placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="1.0.0"
                  />
                </div>
              </div>
            </div>

            {/* Visual & Metadata Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-gray-200 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-purple-600 dark:bg-purple-700">
                  <Palette size={18} className="text-white dark:text-gray-200" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Visual & Metadata</h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5 items-start">
                  <div className="min-h-[80px]">
                    <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 h-6">
                      <span className="text-red-500 dark:text-red-400 mr-2 text-lg">*</span>
                      <Palette size={14} className="mr-2 text-gray-700 dark:text-gray-300" />
                      Icon
                    </label>
                    <div className="mb-2">
                      <IconSelector selectedIcon={formData.icon} onSelectIcon={handleSelectIcon} error={errors.icon} />
                    </div>
                    {errors.icon && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.icon}
                      </p>
                    )}
                  </div>

                  <div className="min-h-[80px]">
                    <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 h-6">
                      <div className="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 mr-2"></div>
                      Color
                    </label>
                    <div className="mb-2">
                      <ColorSelector selectedColor={formData.color} onSelectColor={handleSelectColor} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <User size={14} className="mr-2 text-gray-700 dark:text-gray-300" />
                    Author
                  </label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 hover:border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:focus:border-blue-500 dark:focus:ring-blue-800/50 dark:hover:border-neutral-500 focus:outline-none transition-all duration-200 font-medium placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Your name"
                  />
                </div>
              </div>
            </div>

            {/* Documentation Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-gray-200 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-amber-600 dark:bg-amber-700">
                  <FileText size={18} className="text-white dark:text-gray-200" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Documentation</h2>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FileText size={14} className="mr-2 text-gray-700 dark:text-gray-300" />
                  Readme
                </label>
                <textarea
                  name="readme"
                  value={formData.readme}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 hover:border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:focus:border-blue-500 dark:focus:ring-blue-800/50 dark:hover:border-neutral-500 focus:outline-none transition-all duration-200 font-medium placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  placeholder="Enter additional information about this flow (Markdown format)"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Supports Markdown formatting for rich documentation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 dark:bg-neutral-800 px-6 py-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="text-red-500 dark:text-red-400">*</span> Required fields
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 dark:hover:border-neutral-500 dark:focus:ring-neutral-700/50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800/50 transition-all duration-200 flex items-center gap-2"
              >
                <Check size={16} />
                Save Flow
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
