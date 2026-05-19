import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateUserProfileApi } from '../../utils/service';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface ProfileTabProps {
    profileData: any;
    refreshProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profileData, refreshProfile }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { register, handleSubmit, setValue, reset, formState: { errors, isValid } } = useForm({
        mode: 'onChange',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone_1: '',
            phone_2: '',
            address: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
        }
    });

    // Pre-fill data using reset and format phone number
    useEffect(() => {
        if (profileData) {
            const formattedPhone1 = profileData.phone1?.replace(/^\+91/, '') || '';
            const formattedPhone2 = profileData.phone2?.replace(/^\+91/, '') || '';

            reset({
                first_name: profileData.first_name || '',
                last_name: profileData.last_name || '',
                email: profileData.email || '',
                phone_1: formattedPhone1,
                phone_2: formattedPhone2,
                address: profileData.address || '',
                city: profileData.city || '',
                state: profileData.state || '',
                country: profileData.country || '',
                pincode: profileData.pincode || '',
            });
        }
    }, [profileData, reset]);

    const onSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            // Ensure phone numbers are sent without +91 if that's what the API expects, 
            // or add it back if required. The user said "Remove +91 prefix from API response", 
            // implying they want to edit it cleanly.
            const response = await updateUserProfileApi(data);
            if (response.success || response.status === 200 || response.status === 201) {
                toast.success("Profile updated successfully");
                refreshProfile();
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error.message || "An error occurred while updating profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="grid gap-2">
                        <label className="text-[14px] font-bold text-[#1D2026]">First Name</label>
                        <input
                            {...register('first_name', {
                                required: 'First name is required',
                                minLength: { value: 2, message: 'Minimum 2 characters required' },
                                pattern: { value: /^[A-Za-z\s]+$/, message: 'Only alphabets are allowed' }
                            })}
                            type="text"
                            className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 transition-all ${errors.first_name ? 'border-red-500' : 'border-[#E9EAF0] focus:border-[#5624D0]'}`}
                            placeholder="Enter first name"
                        />
                        {errors.first_name && <span className="text-red-500 text-xs font-medium">{errors.first_name.message as string}</span>}
                    </div>

                    {/* Last Name */}
                    <div className="grid gap-2">
                        <label className="text-[14px] font-bold text-[#1D2026]">Last Name</label>
                        <input
                            {...register('last_name', {
                                required: 'Last name is required',
                                minLength: { value: 2, message: 'Minimum 2 characters required' },
                                pattern: { value: /^[A-Za-z\s]+$/, message: 'Only alphabets are allowed' }
                            })}
                            type="text"
                            className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 transition-all ${errors.last_name ? 'border-red-500' : 'border-[#E9EAF0] focus:border-[#5624D0]'}`}
                            placeholder="Enter last name"
                        />
                        {errors.last_name && <span className="text-red-500 text-xs font-medium">{errors.last_name.message as string}</span>}
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <label className="text-[14px] font-bold text-[#1D2026]">Email</label>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                            })}
                            type="email"
                            className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 transition-all ${errors.email ? 'border-red-500' : 'border-[#E9EAF0] focus:border-[#5624D0]'}`}
                            placeholder="Enter email address"
                        />
                        {errors.email && <span className="text-red-500 text-xs font-medium">{errors.email.message as string}</span>}
                    </div>

                    {/* Phone 1 */}
                    <div className="grid gap-2">
                        <label className="text-[14px] font-bold text-[#1D2026]">Phone Number</label>
                        <input
                            {...register('phone_1', {
                                required: 'Phone number is required',
                                pattern: { value: /^\d{10}$/, message: 'Exactly 10 digits required' },
                                onChange: (e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setValue('phone_1', value);
                                }
                            })}
                            type="text"
                            maxLength={10}
                            className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 transition-all ${errors.phone_1 ? 'border-red-500' : 'border-[#E9EAF0] focus:border-[#5624D0]'}`}
                            placeholder="9999999999"
                        />
                        {errors.phone_1 && <span className="text-red-500 text-xs font-medium">{errors.phone_1.message as string}</span>}
                    </div>

                    {/* Address */}
                    <div className="grid gap-2 md:col-span-2">
                        <label className="text-[14px] font-bold text-[#1D2026]">Address</label>
                        <textarea
                            {...register('address', { required: 'Address is required' })}
                            rows={2}
                            className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 transition-all ${errors.address ? 'border-red-500' : 'border-[#E9EAF0] focus:border-[#5624D0]'}`}
                            placeholder="Enter address"
                        ></textarea>
                        {errors.address && <span className="text-red-500 text-xs font-medium">{errors.address.message as string}</span>}
                    </div>

                    {/* City */}
                    <div className="grid gap-2">
                        <label className="text-[14px] font-bold text-[#1D2026]">City</label>
                        <input
                            {...register('city', { required: 'City is required' })}
                            type="text"
                            className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 transition-all ${errors.city ? 'border-red-500' : 'border-[#E9EAF0] focus:border-[#5624D0]'}`}
                            placeholder="Enter city"
                        />
                        {errors.city && <span className="text-red-500 text-xs font-medium">{errors.city.message as string}</span>}
                    </div>

                    {/* State */}
                    <div className="grid gap-2">
                        <label className="text-[14px] font-bold text-[#1D2026]">State</label>
                        <input
                            {...register('state')}
                            type="text"
                            className="w-full px-4 py-2.5 border border-[#E9EAF0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 focus:border-[#5624D0] transition-all"
                            placeholder="Enter state"
                        />
                    </div>

                    {/* Country */}
                    <div className="grid gap-2">
                        <label className="text-[14px] font-bold text-[#1D2026]">Country</label>
                        <input
                            {...register('country')}
                            type="text"
                            className="w-full px-4 py-2.5 border border-[#E9EAF0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 focus:border-[#5624D0] transition-all"
                            placeholder="Enter country"
                        />
                    </div>

                    {/* Pincode */}
                    <div className="grid gap-2">
                        <label className="text-[14px] font-bold text-[#1D2026]">Pincode</label>
                        <input
                            {...register('pincode')}
                            type="text"
                            className="w-full px-4 py-2.5 border border-[#E9EAF0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5624D0]/20 focus:border-[#5624D0] transition-all"
                            placeholder="Enter pincode"
                        />
                    </div>
                </div>

                <div className="flex justify-start pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className="px-10 py-3.5 bg-[#5624D0] text-white font-bold rounded-md hover:bg-[#461DA5] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#5624D0]/20"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;
