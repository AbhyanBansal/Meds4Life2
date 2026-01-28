"use client";

import { createListing, State } from "./actions";
import { Upload, Calendar, Package, Type, FileText, X, ChevronDown, Check, Trash2, ImageIcon, Plus, ArrowRight, AlertTriangle } from "lucide-react";
import LocationPicker from "@/components/dashboard/LocationPicker";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform duration-200"
        >
            {pending ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Listing...</span>
                </>
            ) : (
                <>
                    <span>Create Listing</span>
                </>
            )}
        </button>
    );
}

const initialState: State = {
    message: null,
    errors: {},
    success: false,
};

// --- Custom Components ---

// 1. Custom Select Component
interface CustomSelectProps {
    name: string;
    options: string[];
    placeholder?: string;
    value?: string;
    error?: string;
}

function CustomSelect({ name, options, placeholder = "Select...", value, error }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(value || "");
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        setSelected(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Hidden Input for Form Submission */}
            <input type="hidden" name={name} value={selected} />

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left pl-10 pr-10 py-3 border rounded-xl bg-white/50 focus:outline-none transition-all duration-200 flex items-center justify-between ${error ? "border-red-300 ring-2 ring-red-100" : isOpen ? "border-emerald-500 ring-4 ring-emerald-500/10" : "border-gray-200 hover:border-emerald-300"
                    }`}
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className={`h-5 w-5 ${selected ? 'text-emerald-600' : 'text-gray-400'}`} />
                </div>
                <span className={`block truncate ${selected ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                    {selected || placeholder}
                </span>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-auto focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                    <ul className="py-1">
                        {options.map((option) => (
                            <li
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`group cursor-pointer select-none relative py-2.5 pl-10 pr-4 hover:bg-emerald-50 text-gray-900 transition-colors ${selected === option ? 'bg-emerald-50/60 font-medium text-emerald-700' : ''}`}
                            >
                                <span className="block truncate">{option}</span>
                                {selected === option && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                        <Check className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// 2. Custom Image Uploader
interface ImageUploaderProps {
    name: string;
    error?: string;
    onReset?: () => void;
    preview?: string | null; // Controlled preview state
    setPreview?: (val: string | null) => void;
}

function ImageUploader({ name, error, onReset, preview, setPreview }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview?.(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview?.(null);
        }
    };

    const handleRemove = () => {
        setPreview?.(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Medicine Image
            </label>

            <input
                ref={inputRef}
                type="file"
                name={name}
                id={name}
                accept="image/*"
                className="hidden" // Hidden input
                onChange={handleFileChange}
            />

            {!preview ? (
                // Upload State
                <div
                    onClick={() => inputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center cursor-pointer group flex flex-col items-center justify-center gap-3
                        ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 bg-white/40'}
                    `}
                >
                    <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                        <ImageIcon className={`h-8 w-8 ${error ? 'text-red-400' : 'text-emerald-500'}`} />
                    </div>
                    <div>
                        <p className="text-base font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                            Click to upload photo
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG up to 5MB
                        </p>
                    </div>
                </div>
            ) : (
                // Preview State
                <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-100 group">
                    <div className="aspect-video w-full relative bg-gray-900">
                        <Image
                            src={preview}
                            alt="Medicine Preview"
                            fill
                            className="object-cover opacity-90 group-hover:opacity-75 transition-opacity"
                        />
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-white/90 backdrop-blur-sm text-red-600 hover:text-red-700 hover:bg-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
                        >
                            <Trash2 className="h-4 w-4" />
                            Remove Image
                        </button>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-md shadow-sm font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Uploaded
                    </div>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-1 duration-200">
                    <X className="h-3 w-3" />
                    {error}
                </p>
            )}
        </div>
    );
}


export default function NewListingPage() {
    const router = useRouter();
    const [state, formAction] = useActionState(createListing, initialState);
    const [preview, setPreview] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [expiryError, setExpiryError] = useState<string | null>(null);

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            setExpiryError("Expiry date cannot be in the past.");
        } else {
            setExpiryError(null);
        }
    };

    useEffect(() => {
        if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state]);

    const packagingOptions = ["Strip", "Box", "Bottle", "Tubes", "Vial", "Sachet", "Other"];

    if (state.success) {
        return (
            <div className="max-w-xl mx-auto p-6 pt-20 text-center">
                <div className="bg-white/60 backdrop-blur-xl border border-emerald-100 rounded-3xl p-12 shadow-xl ring-1 ring-emerald-900/5 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-100/50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-sm">
                        <Check className="w-10 h-10" strokeWidth={3} />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Your medicine listing has been created successfully. Your contribution will help someone in need.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => window.location.reload()} // Reload to reset server action state completely
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Donate Another Medicine
                        </button>

                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-6 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <Toaster position="top-right" richColors />
            <div className="mb-6 md:mb-8 pl-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Donate Medicine</h1>
                <p className="text-gray-500 text-sm md:text-base">List your unused medicine to help someone in need.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-sm ring-1 ring-gray-900/5">
                <form ref={formRef} action={formAction} className="space-y-6 md:space-y-8">

                    {/* Section 1: Basic Info */}
                    <div className="space-y-6">
                        {/* Medicine Name */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Medicine Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Type className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-base md:text-sm"
                                    placeholder="e.g. Paracetamol"
                                />
                            </div>
                            {state.errors?.title && (
                                <p className="mt-1 text-sm text-red-500 animate-pulse">{state.errors.title}</p>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Salt Name */}
                        <div>
                            <label htmlFor="saltName" className="block text-sm font-medium text-gray-700 mb-2">
                                Salt Name <span className="text-gray-400 font-normal ml-1 text-xs">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="saltName"
                                id="saltName"
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-base md:text-sm"
                                placeholder="e.g. Acetaminophen"
                            />
                        </div>

                        {/* Strength */}
                        <div>
                            <label htmlFor="strength" className="block text-sm font-medium text-gray-700 mb-2">
                                Strength <span className="text-gray-400 font-normal ml-1 text-xs">(mg/ml)</span>
                            </label>
                            <input
                                type="number"
                                name="strength"
                                id="strength"
                                step="any"
                                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-base md:text-sm"
                                placeholder="500"
                            />
                            {state.errors?.strength && (
                                <p className="mt-1 text-sm text-red-500">{state.errors.strength}</p>
                            )}
                        </div>
                    </div>

                    {/* Section 3: Specs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Quantity */}
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Package className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="quantity"
                                    id="quantity"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-base md:text-sm"
                                    placeholder="e.g. 2 strips"
                                />
                            </div>
                            {state.errors?.quantity && (
                                <p className="mt-1 text-sm text-red-500">{state.errors.quantity}</p>
                            )}
                        </div>

                        {/* Packaging Type (Custom Component) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Packaging Type
                            </label>
                            <CustomSelect
                                name="packagingType"
                                options={packagingOptions}
                                placeholder="Select type"
                                error={state.errors?.packagingType?.[0]}
                            />
                            {state.errors?.packagingType && (
                                <p className="mt-1 text-sm text-red-500">{state.errors.packagingType}</p>
                            )}
                        </div>
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                        </label>
                        <div className="relative group max-w-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="date"
                                name="expiryDate"
                                id="expiryDate"
                                required
                                onChange={handleExpiryChange}
                                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white/50 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-base md:text-sm cursor-pointer ${expiryError
                                    ? "border-amber-300 focus:border-amber-400"
                                    : "border-gray-200 focus:border-emerald-500"
                                    }`}
                            />
                            {/* REMOVED inner icon to prevent overlap with native date picker */}
                        </div>
                        {expiryError ? (
                            <p className="mt-1 text-sm text-amber-600 flex items-center gap-1 font-medium animate-in slide-in-from-top-1 duration-200">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                {expiryError}
                            </p>
                        ) : state.errors?.expiryDate && (
                            <p className="mt-1 text-sm text-red-500">{state.errors.expiryDate}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <div className="relative group">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <textarea
                                name="description"
                                id="description"
                                rows={3}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none resize-none"
                                placeholder="Additional details like condition, reason for donation, etc."
                            />
                        </div>
                    </div>


                    {/* Location Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Location
                        </label>
                        <LocationPicker />
                    </div>

                    {/* Single Image Upload (Custom Component) */}
                    <ImageUploader
                        name="images"
                        error={state.errors?.images?.[0]}
                        preview={preview}
                        setPreview={setPreview}
                    />

                    <div className="pt-6 border-t border-gray-100">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
