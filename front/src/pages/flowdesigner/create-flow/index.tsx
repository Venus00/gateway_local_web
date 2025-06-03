import type React from "react";
import { useState } from "react";
import { X, Search, Check, ArrowLeft, FileText, LinkIcon, Tag, Hash, Clock, Palette, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { apiClient } from "@/features/api";
import { useSelector } from "react-redux";
import { RootState } from "@/features/auth/store";

// Types
interface Icon {
    id: string;
    name: string;
}

interface Color {
    id: string;
    name: string;
    hex: string;
}

interface FormData {
    name: string;
    url: string;
    group: string;
    reference: string;
    version: string;
    icon: string;
    color: string;
    author: string;
    readme: string;
}

interface FormErrors {
    name?: string;
    icon?: string;
    [key: string]: string | undefined;
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
];

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
];

// Icon component to render icons
interface IconDisplayProps {
    iconId: string;
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
            {!["chip", "card", "bulb", "home", "settings", "star", "heart", "bell", "mail", "ad", "user"].includes(iconId) && (
                <span className="text-xl">📄</span>
            )}
        </div>
    );
};

// Icon selector component
interface IconSelectorProps {
    selectedIcon: string;
    onSelectIcon: (iconId: string) => void;
    error?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon, error }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const filteredIcons = icons.filter((icon) => icon.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`w-full h-12 justify-start gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 ${error ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all`}
                >
                    {selectedIcon ? (
                        <>
                            <IconDisplay iconId={selectedIcon} />
                            <span className="text-base font-medium">{icons.find((i) => i.id === selectedIcon)?.name || selectedIcon}</span>
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
            <PopoverContent className="w-96 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg" align="start">
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
                                onSelectIcon(icon.id);
                                setOpen(false);
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
    );
};

// Color selector component
interface ColorSelectorProps {
    selectedColor: string;
    onSelectColor: (colorId: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onSelectColor }) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full h-12 justify-start gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all"
                >
                    {selectedColor ? (
                        <>
                            <div
                                className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                                style={{ backgroundColor: colors.find((c) => c.id === selectedColor)?.hex || "#64748b" }}
                            />
                            <span className="text-base font-medium">{colors.find((c) => c.id === selectedColor)?.name || selectedColor}</span>
                        </>
                    ) : (
                        <span className="text-base text-gray-500 dark:text-gray-400">Select a color</span>
                    )}
                    <span className="ml-auto text-gray-400 dark:text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor" />
                        </svg>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg" align="start">
                <div className="grid grid-cols-5 gap-3">
                    {colors.map((color) => (
                        <button
                            key={color.id}
                            className={`
                                w-10 h-10 rounded-full cursor-pointer flex items-center justify-center
                                hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-600 transition-all
                                ${selectedColor === color.id ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}
                            `}
                            style={{ backgroundColor: color.hex }}
                            onClick={() => {
                                onSelectColor(color.id);
                                setOpen(false);
                            }}
                            title={color.name}
                        >
                            {selectedColor === color.id && <Check size={18} className="text-white drop-shadow" />}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default function CreateFlowPage() {
    const { tenant } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        url: "https://",
        group: "",
        reference: "",
        version: "",
        icon: "",
        color: "",
        author: "",
        readme: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectIcon = (iconId: string) => {
        setFormData((prev) => ({ ...prev, icon: iconId }));

        // Clear error
        if (errors.icon) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.icon;
                return newErrors;
            });
        }
    };

    const handleSelectColor = (colorId: string) => {
        setFormData((prev) => ({ ...prev, color: colorId }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.icon) {
            newErrors.icon = "Icon is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // Prepare basic payload with required fields
            const payload = {
                schema: "streams_save",
                data: {
                    name: formData.name,
                    url: formData.url,
                    icon: `fas fa-${formData.icon}`, // Convert to Font Awesome format
                },
            };

            // If needed, you can add any additional properties to the data object by type assertion
            const payloadData = payload.data as {
                name: string;
                url: string;
                icon: string;
                group?: string;
                reference?: string;
                version?: string;
                color?: string;
                author?: string;
                readme?: string;
            };

            // Add optional fields if they have values
            if (formData.group) payloadData.group = formData.group;
            if (formData.reference) payloadData.reference = formData.reference;
            if (formData.version) payloadData.version = formData.version;
            if (formData.color) payloadData.color = formData.color;
            if (formData.author) payloadData.author = formData.author;
            if (formData.readme) payloadData.readme = formData.readme;

            // Send data to API
            const response = await apiClient.post("workflow", {
                tenantId: tenant.id,
                ...payload,
            });

            console.log("API response:", response.data);
            // Navigate back to home page on success
            navigate("/flow");
        } catch (error) {
            console.error("Error submitting form:", error);
            // You could add error handling UI here
            alert("Failed to save flow. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate("/flow");
    };

    return (
        <div className="  w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
            <div className="w-full  bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
                    <div className="relative flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleCancel} 
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                            >
                                <ArrowLeft size={20} className="text-white" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                    Create New Flow
                                </h1>
                                <p className="text-slate-300 mt-1">Define your workflow configuration</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleCancel} 
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-8">
                    {/* Basic Information Section */}
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                                <FileText size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div className="lg:col-span-1">
                                <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                                    <span className="text-red-500 mr-2 text-lg">*</span>
                                    <FileText size={16} className="mr-2" />
                                    Flow Name
                                </label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`
                                        w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium
                                        ${errors.name 
                                            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                                            : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                                        }
                                        hover:border-slate-300 focus:outline-none placeholder-slate-400
                                    `}
                                    placeholder="Enter a descriptive name for your flow"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* URL Field */}
                            <div className="lg:col-span-1">
                                <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                                    <LinkIcon size={16} className="mr-2" />
                                    URL Address
                                </label>
                                <input
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300 focus:outline-none transition-all duration-200 font-medium placeholder-slate-400"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Configuration Section */}
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                                <Tag size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Configuration</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Group */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                                    <Tag size={16} className="mr-2" />
                                    Group
                                </label>
                                <input
                                    name="group"
                                    value={formData.group}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300 focus:outline-none transition-all duration-200 font-medium placeholder-slate-400"
                                    placeholder="e.g., Production"
                                />
                            </div>

                            {/* Reference */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                                    <Hash size={16} className="mr-2" />
                                    Reference
                                </label>
                                <input
                                    name="reference"
                                    value={formData.reference}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300 focus:outline-none transition-all duration-200 font-medium placeholder-slate-400"
                                    placeholder="e.g., REF-001"
                                />
                            </div>

                            {/* Version */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                                    <Clock size={16} className="mr-2" />
                                    Version
                                </label>
                                <input
                                    name="version"
                                    value={formData.version}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300 focus:outline-none transition-all duration-200 font-medium placeholder-slate-400"
                                    placeholder="1.0.0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visual & Metadata Section */}
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                                <Palette size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Visual & Metadata</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Icon */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                                    <span className="text-red-500 mr-2 text-lg">*</span>
                                    <Palette size={16} className="mr-2" />
                                    Icon
                                </label>
                                <IconSelector 
                                    selectedIcon={formData.icon} 
                                    onSelectIcon={handleSelectIcon} 
                                    error={errors.icon} 
                                />
                            </div>

                            {/* Color */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500 mr-2"></div>
                                    Color
                                </label>
                                <ColorSelector 
                                    selectedColor={formData.color} 
                                    onSelectColor={handleSelectColor} 
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                                    <User size={16} className="mr-2" />
                                    Author
                                </label>
                                <input
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300 focus:outline-none transition-all duration-200 font-medium placeholder-slate-400"
                                    placeholder="Your name"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Documentation Section */}
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                                <FileText size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Documentation</h2>
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                                <FileText size={16} className="mr-2" />
                                Readme
                            </label>
                            <textarea
                                name="readme"
                                value={formData.readme}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-300 focus:outline-none transition-all duration-200 font-medium placeholder-slate-400 resize-none"
                                placeholder="Enter additional information about this flow (Markdown format)&#10;&#10;## Description&#10;Brief description of what this flow does...&#10;&#10;## Usage&#10;How to use this flow..."
                            />
                            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Supports Markdown formatting for rich documentation
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-t border-slate-200/50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-600">
                            <span className="text-red-500">*</span> Required fields
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 rounded-xl border-2 border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <Check size={18} />
                                Save Flow
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
