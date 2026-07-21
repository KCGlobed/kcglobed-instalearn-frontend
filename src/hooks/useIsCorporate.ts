import { useState, useEffect } from 'react';

const checkIsCorporate = (): boolean => {
    try {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            let parsedRole;
            try {
                parsedRole = JSON.parse(storedRole);
            } catch (e) {
                parsedRole = storedRole;
            }
            const roleStr = Array.isArray(parsedRole) ? parsedRole.join("").toLowerCase() : String(parsedRole).toLowerCase();
            return roleStr.includes("corporate");
        }
    } catch (e: any) {
        console.error("Failed to parse userRole for corporate check", e);
    }
    return false;
};

export const useIsCorporate = () => {
    const [isCorporate, setIsCorporate] = useState<boolean>(checkIsCorporate);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsCorporate(checkIsCorporate());
        };
        
        // Listen to storage events across tabs
        window.addEventListener('storage', handleStorageChange);
        
        // Custom event to listen to local updates within the same window if needed
        window.addEventListener('userRoleChanged', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userRoleChanged', handleStorageChange);
        };
    }, []);

    return isCorporate;
};
