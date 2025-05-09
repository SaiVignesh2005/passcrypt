import { useState } from "react";
import logo from "../assets/images/logo.svg";

export default function MasterPassword({ onUnlock }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length > 8) {
            onUnlock(password);
        } else {
            alert("Master password must be at least 8 characters long.");
        }
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
                    className=" bg-blue-50 border border-blue-200 p-6 rounded-xl shadow w-full max-w-sm"
                >
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Enter Master Password
                    </h2>

                    <input
                        type="password"
                        placeholder="Master Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded border border-blue-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded hover:cursor-pointer hover:font-bold "
                    >
                        Unlock
                    </button>
                </form>

            </div>


        </div>

    );

}