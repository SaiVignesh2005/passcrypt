import { useState, useEffect } from "react";
import logo from "../assets/images/logo.svg";
import bcrypt from "bcryptjs";

export default function MasterPassword({ onUnlock }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isNewPassword, setIsNewPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedHashedPassword = localStorage.getItem("hashedPassword");
        if (storedHashedPassword) {
            setIsNewPassword(false);
        } else {
            setIsNewPassword(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedHashedPassword = localStorage.getItem("hashedPassword");

        if (isNewPassword) {
            if (password.length >= 8 && password === confirmPassword) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);
                localStorage.setItem("hashedPassword", hashedPassword);
                onUnlock(password);
            } else {
                if(password.length < 8) {
                    alert("Password must be at least 8 characters long.");
                }
                else{
                    alert("Passwords do not match.");
                }
            }
        } else {
            if (bcrypt.compareSync(password, storedHashedPassword)) {
                onUnlock(password);
            } else {
                alert("Incorrect master password.");
            }
        }
    };

    const handleResetPassword = (e) => {
        e.preventDefault();

        const storedHashedPassword = localStorage.getItem("hashedPassword");
        if (bcrypt.compareSync(currentPassword, storedHashedPassword)) {
            localStorage.removeItem("hashedPassword");
            setIsNewPassword(true);
            setPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
            setIsResetting(false);
        } else {
            setErrorMessage("Incorrect current password. Cannot reset.");
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

                    <form
                        onSubmit={handleResetPassword}
                        className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow w-full max-w-sm"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-center">Reset Master Password</h2>
                        <input
                            type="password"
                            placeholder="Enter current master password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-2 rounded border border-blue-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 rounded hover:cursor-pointer hover:font-bold "
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
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

                <form
                    onSubmit={handleSubmit}
                    className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow w-full max-w-sm"
                >
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
                        className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 rounded hover:cursor-pointer hover:font-bold "
                    >
                        {isNewPassword ? "Set Password" : "Unlock"}
                    </button>
                    {!isNewPassword && (
                        <button
                            type="button"
                            onClick={() => setIsResetting(true)}
                            className="w-full bg-red-600 hover:bg-red-800 text-white font-semibold py-2 mt-4 rounded hover:cursor-pointer hover:font-bold "
                        >
                            Reset Password
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
