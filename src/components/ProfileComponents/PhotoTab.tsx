import React from 'react';
import { Camera, Loader2, Upload } from 'lucide-react';
import { updateProfilePictureApi } from '../../utils/service';
import toast from 'react-hot-toast';

interface PhotoTabProps {
    profileData: any;
    refreshProfile: () => void;
}

const PhotoTab: React.FC<PhotoTabProps> = ({ profileData, refreshProfile }) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > 1024 * 1024) {
            toast.error("File size should be less than 1MB");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            setIsUploading(true);
            const response = await updateProfilePictureApi(formData);
            if (response.success || response.status === 200 || response.status === 201) {
                toast.success("Profile photo updated successfully");
                refreshProfile();
            } else {
                toast.error(response.message || "Failed to update photo");
            }
        } catch (error: any) {
            console.error("Error uploading photo:", error);
            toast.error(error.message || "An error occurred while uploading photo");
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-12 border-2 border-dashed border-[#E9EAF0] rounded-2xl flex flex-col items-center justify-center space-y-6 bg-[#F8F9FB] transition-all hover:border-[#5624D0]/30">
                <div className="relative group">
                    <div className="w-40 h-40 bg-[#E9EAF0] rounded-full flex items-center justify-center text-[#8C94A3] overflow-hidden border-4 border-white shadow-xl">
                        {profileData?.image ? (
                            <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-12 h-12" />
                        )}
                    </div>
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                        </div>
                    )}
                </div>

                <div className="text-center space-y-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png"
                        className="hidden"
                    />
                    <button
                        onClick={triggerFileInput}
                        disabled={isUploading}
                        className="px-8 py-3 bg-white border border-[#E9EAF0] text-[#1D2026] font-bold rounded-md hover:bg-[#F5F4FF] hover:border-[#5624D0] transition-all flex items-center gap-2 mx-auto disabled:opacity-50 shadow-sm"
                    >
                        <Upload className="w-4 h-4" />
                        {isUploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                    <div className="space-y-1">
                        <p className="text-[13px] text-[#1D2026] font-medium">Image requirements:</p>
                        <p className="text-[12px] text-[#6E7485]">Maximum file size: 1MB. Allowed: JPG, PNG.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoTab;
