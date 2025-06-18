import { useState, useEffect } from "react";
import logo from "../assets/images/logo.svg";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:10000";

const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('deviceId', deviceId);
    }

    return deviceId;
};

export default function MasterPassword({ onUnlock }) {
    const deviceId = getDeviceId();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isNewPassword, setIsNewPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const checkMasterExists = async () => {
            try {
                const res = await fetch(`${API_BASE}/master/exists/${deviceId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await res.json();
                setIsNewPassword(!data.exists);
            } catch {
                setIsNewPassword(true);
            }
        };

        checkMasterExists();
    }, [deviceId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isNewPassword) {
            if (password.length >= 8 && password === confirmPassword) {
                await fetch(`${API_BASE}/master/set`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password, deviceId })
                });

                toast.success(
                    <div className="flex items-center gap-2">Master password created!</div>,
                    {
                        style: { background: '#9afecd', color: '#064E3B' },
                        position: "top-center",
                        autoClose: 3000,
                        transition: Bounce
                    }
                );

                setPassword('');
                setConfirmPassword('');
                setIsNewPassword(false);
            } else {
                toast.error(
                    <div className="flex items-center gap-2">
                        {password.length < 8 ? "Password must be at least 8 characters." : "Passwords do not match."}
                    </div>,
                    {
                        style: { background: '#fcdcde', color: '#7F1D1D' },
                        position: "top-center",
                        autoClose: 3000,
                        transition: Bounce
                    }
                );
            }
        } else {
            const res = await fetch(`${API_BASE}/master/verify`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, deviceId })
            });

            const data = await res.json();

            if (data.valid) {
                onUnlock(password);
            } else {
                toast.error(
                    <div className="flex items-center gap-2">Incorrect master password.</div>,
                    {
                        style: { background: '#fcdcde', color: '#7F1D1D' },
                        position: "top-center",
                        autoClose: 3000,
                        transition: Bounce
                    }
                );
            }
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const res = await fetch(`${API_BASE}/master/reset`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword: password, deviceId })
        });

        const data = await res.json();

        if (data.reset) {
            setIsNewPassword(false);
            setPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
            setIsResetting(false);
            setErrorMessage('');

            toast.success(
                <div className="flex items-center gap-2">Master password reset successfully!</div>,
                {
                    style: { background: '#9afecd', color: '#064E3B' },
                    position: "top-center",
                    autoClose: 3000,
                    transition: Bounce
                }
            );
        } else {
            setErrorMessage("Incorrect current password. Cannot reset.");

            toast.error(
                <div className="flex items-center gap-2">Incorrect current password. Cannot reset.</div>,
                {
                    style: { background: '#fcdcde', color: '#7F1D1D' },
                    position: "top-center",
                    autoClose: 3000,
                    transition: Bounce
                }
            );
        }
    };

    if (isResetting) {
        return (
            <div className="min-h-[85vh] flex flex-col justify-center items-center relative w-full overflow-x-hidden">
                <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),_linear-gradient(to_bottom,#0000000a_1px,transparent_1px),#F9FAFB] bg-[size:14px_24px]" />
                <div className="mx-auto text-center rounded-lg py-12 relative max-w-5xl px-4 box-border">
                    <div className="flex flex-col items-center gap-2">
                        <img src={logo} alt="Logo" className="absolute top-[-120px] w-48 h-48" />
                        <p className="text-lg text-[#1F2937] absolute top-[-10px] py-3">Your Password Manager</p>
                    </div>
                    <form onSubmit={handleResetPassword} className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow w-full max-w-sm">
                        <h2 className="text-xl font-semibold mb-4 text-center">Reset Master Password</h2>
                        <input
                            type="password"
                            placeholder="Enter current master password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-2 rounded border border-blue-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded border border-blue-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 rounded border border-blue-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 rounded"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
                <ToastContainer />
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] flex flex-col justify-center items-center relative w-full overflow-x-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),_linear-gradient(to_bottom,#0000000a_1px,transparent_1px),#F9FAFB] bg-[size:14px_24px]" />
            <div className="mx-auto text-center rounded-lg py-12 relative max-w-5xl px-4 box-border">
                <div className="flex flex-col items-center gap-2">
                    <img src={logo} alt="Logo" className="absolute top-[-120px] w-48 h-48" />
                    <p className="text-lg text-[#1F2937] absolute top-[-10px] py-3">Your Password Manager</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow w-full max-w-sm">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        {isNewPassword ? "Create Master Password" : "Enter Master Password"}
                    </h2>
                    <input
                        type="password"
                        placeholder={isNewPassword ? "Create a new master password" : "Enter your master password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded border border-blue-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {isNewPassword && (
                        <input
                            type="password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 rounded border border-blue-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 rounded cursor-pointer hover:scale-102"
                    >
                        {isNewPassword ? "Set Password" : "Unlock"}
                    </button>
                    {!isNewPassword && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsResetting(true);
                                setPassword('');
                                setConfirmPassword('');
                                setCurrentPassword('');
                                setErrorMessage('');
                            }}
                            className="w-full bg-red-600 hover:bg-red-800 text-white font-semibold py-2 mt-4 rounded cursor-pointer hover:scale-102"
                        >
                            Reset Password
                        </button>
                    )}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}