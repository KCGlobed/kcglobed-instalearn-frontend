import React, { useEffect, useState } from 'react';
import { notificationSettingsGetApi, notificationSettingsUpdateApi } from '../../utils/service';
import toast from 'react-hot-toast';

const NotificationTab = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        promotional: false,
        announcements: false,
        reminders: false,
        instructor_notification: false,
        new_login: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response: any = await notificationSettingsGetApi();
                if (response.success && response.data) {
                    setSettings({
                        promotional: response.data.promotional,
                        announcements: response.data.announcements,
                        reminders: response.data.reminders,
                        instructor_notification: response.data.instructor_notification,
                        new_login: response.data.new_login
                    });
                }
            } catch (error) {
                console.error("Failed to fetch notification settings:", error);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                promotional: settings.promotional ? 1 : 0,
                announcements: settings.announcements ? 1 : 0,
                reminders: settings.reminders ? 1 : 0,
                instructor_notification: settings.instructor_notification ? 1 : 0,
                new_login: settings.new_login ? 1 : 0
            };
            const response: any = await notificationSettingsUpdateApi(payload);
            if (response.success) {
                toast.success("Settings updated successfully");
            } else {
                toast.error(response.message || "Failed to update settings");
            }
        } catch (error) {
            console.error("Failed to update notification settings:", error);
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5624D0] mx-auto mb-4"></div>
                <p className="text-[#6E7485]">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* <div>
                <h2 className="text-2xl font-bold text-[#1D2026]">Notification preferences</h2>
                <p className="text-[#6E7485] mt-1">Manage the types of communications you receive.</p>
            </div> */}

            <div className="space-y-6">
                {/* Updates and Offerings Section */}
                <section className="p-6 border border-[#E9EAF0] rounded-xl bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-[#1D2026]">Updates and offerings</h3>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group" onClick={() => handleToggle('announcements')}>
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${settings.announcements ? 'border-[#5624D0] bg-[#5624D0]' : 'border-[#E9EAF0] group-hover:border-[#5624D0]'}`}>
                                {settings.announcements && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                            </div>
                            <span className="text-[14px] text-[#4E5566]">Product launches and announcements</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group" onClick={() => handleToggle('promotional')}>
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${settings.promotional ? 'border-[#5624D0] bg-[#5624D0]' : 'border-[#E9EAF0] group-hover:border-[#5624D0]'}`}>
                                {settings.promotional && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                            </div>
                            <span className="text-[14px] text-[#4E5566]">Offers and promotions</span>
                        </label>
                    </div>
                </section>

                {/* Your Learning Section */}
                <section className="p-6 border border-[#E9EAF0] rounded-xl bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-[#1D2026]">Your learning</h3>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group" onClick={() => handleToggle('reminders')}>
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${settings.reminders ? 'border-[#5624D0] bg-[#5624D0]' : 'border-[#E9EAF0] group-hover:border-[#5624D0]'}`}>
                                {settings.reminders && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                            </div>
                            <span className="text-[14px] text-[#4E5566]">Learning stats and reminders</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group" onClick={() => handleToggle('instructor_notification')}>
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${settings.instructor_notification ? 'border-[#5624D0] bg-[#5624D0]' : 'border-[#E9EAF0] group-hover:border-[#5624D0]'}`}>
                                {settings.instructor_notification && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                            </div>
                            <span className="text-[14px] text-[#4E5566]">Notifications from instructors</span>
                        </label>
                    </div>
                </section>

                {/* Security Section */}
                <section className="p-6 border border-[#E9EAF0] rounded-xl bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-[#1D2026]">Account Security</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] text-[#4E5566]">New login alerts</span>
                            <div
                                onClick={() => handleToggle('new_login')}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 p-1 ${settings.new_login ? 'bg-[#5624D0]' : 'bg-[#E9EAF0]'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute transition-all duration-200 ${settings.new_login ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className={`px-8 py-3 bg-[#5624D0] text-white font-bold rounded-lg hover:bg-[#461DA5] transition-all shadow-md flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {saving ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                    </>
                ) : 'Save Changes'}
            </button>
        </div>
    );
};

export default NotificationTab;
