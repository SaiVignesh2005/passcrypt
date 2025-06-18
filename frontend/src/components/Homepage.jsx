import React, { useEffect, useRef, useState } from 'react';
import logo from "../assets/images/logo.svg";
import add from "../assets/images/add.svg";
import visibleEye from "../assets/images/visibleEye.svg";
import hiddenEye from "../assets/images/hiddenEye.svg";
import copy from "../assets/images/copy.svg";
import edit from "../assets/images/edit.svg";
import deleteIcon from "../assets/images/delete.svg";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';
import { encrypt, decrypt } from '../encyption';
const API_BASE = import.meta.env.VITE_API_URL;

const Homepage = () => {
    const passwordRef = useRef();
    const [userInfo, setUserInfo] = useState({ site: '', username: '', password: '', id: '' });
    const [database, setDatabase] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    const deviceId = localStorage.getItem('deviceId');

    useEffect(() => {
        if (!deviceId) {
            toast.error('Device ID not found. Please set up your master password.');
        } else {
            fetchPasswords();
        }
    }, [deviceId]);

    const fetchPasswords = async () => {
        try {
            const res = await fetch(`${API_BASE}/passwords?deviceId=${deviceId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch passwords');
            const data = await res.json();
            const decrypted = (data.passwords || []).map(item => ({
                ...item,
                password: decrypt(item.password)
            }));
            setDatabase(decrypted);
        } catch (err) {
            console.error(err);
            toast.error('Error fetching passwords.');
        }
    };

    const showToast = message => {
        toast(message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark',
            transition: Bounce,
            style: { maxWidth: '60%' }
        });
    };

    const togglePassword = () => setShowPassword(prev => !prev);

    const handleSavePassword = async () => {
        if (!userInfo.site || !userInfo.username || !userInfo.password) {
            alert('Please fill all the fields.');
            return;
        }

        const encrypted = encrypt(userInfo.password);
        const id = userInfo.id || uuidv4();
        const payload = { ...userInfo, password: encrypted, id };

        try {
            const url = userInfo.id
                ? `${API_BASE}/passwords/${id}?deviceId=${deviceId}`
                : `${API_BASE}/passwords?deviceId=${deviceId}`;
            const method = userInfo.id ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Save failed');
            showToast(userInfo.id ? 'Password updated!' : 'Password saved!');
            setUserInfo({ site: '', username: '', password: '', id: '' });
            fetchPasswords();
        } catch (err) {
            console.error(err);
            toast.error('Error saving password.');
        }
    };

    const handleEditPassword = id => {
        const item = database.find(d => d.id === id);
        if (item) setUserInfo(item);
    };

    const handleDeletePassword = async id => {
        if (!confirm('Are you sure you want to delete this password?')) return;
        try {
            const res = await fetch(
                `${API_BASE}/passwords/${id}?deviceId=${deviceId}`,
                { method: 'DELETE', credentials: 'include' }
            );
            if (!res.ok) throw new Error('Delete failed');
            showToast('Password deleted!');
            fetchPasswords();
        } catch (err) {
            console.error(err);
            toast.error('Error deleting password.');
        }
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const copyText = text => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
    };

    const inputClass = extra =>
        `border-blue-600 h-10 p-2 rounded-xl placeholder-gray-500 bg-white text-[#1F2937] border ${extra}`;

    return (
        <div className="py-10 relative w-full max-w-screen box-border overflow-x-hidden">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
                style={{ maxWidth: '40%' }}
            />

            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),_linear-gradient(to_bottom,#0000000a_1px,transparent_1px),#F9FAFB] bg-[size:14px_24px]" />

            <div className="mx-auto text-center rounded-lg py-12 relative max-w-5xl px-4 box-border">
                <img src={logo} alt="Logo" className="absolute top-[-60px] w-48 h-48" />
                <p className="text-lg text-[#1F2937] py-3">Your Password Manager</p>

                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleSavePassword();
                    }}
                    className="flex flex-col items-center space-y-4 w-full"
                >
                    <input
                        name="site"
                        type="text"
                        placeholder="Enter Website URL"
                        className={inputClass('w-full')}
                        value={userInfo.site}
                        onChange={handleInputChange}
                        autoComplete="url"
                    />

                    <div className="flex flex-col md:flex-row items-center w-full space-y-4 md:space-y-0 md:space-x-4">
                        <input
                            name="username"
                            type="text"
                            placeholder="Enter Username"
                            className={inputClass('w-full md:w-1/2')}
                            value={userInfo.username}
                            onChange={handleInputChange}
                            autoComplete="username"
                        />

                        <div className="relative w-full md:w-1/2">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter Password"
                                className={inputClass('w-full')}
                                value={userInfo.password}
                                onChange={handleInputChange}
                                autoComplete="current-password"
                            />
                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <img
                                    ref={passwordRef}
                                    src={showPassword ? visibleEye : hiddenEye}
                                    alt="Toggle Password"
                                    className="w-5 h-5 cursor-pointer hover:scale-110"
                                    onClick={togglePassword}
                                />
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="border border-blue-600 bg-sky-500 hover:bg-sky-300 flex rounded-xl h-10 cursor-pointer gap-2 text-black py-2 px-4 w-fit justify-center items-center hover:scale-105"
                    >
                        <img src={add} alt="Add" className="w-6" />
                        Save Password
                    </button>
                </form>

                <div className="passwordDatabase my-8 w-full">
                    <h2 className="font-bold text-xl mb-4 text-left">Your Passwords</h2>
                    {database.length === 0 ? (
                        <div>No passwords to show</div>
                    ) : (
                        <div className="overflow-x-auto max-w-full">
                            <table className="table-auto w-full rounded-md overflow-hidden">
                                <thead className="bg-sky-700 text-white">
                                    <tr>
                                        <th className="py-2 px-3 text-left">Website</th>
                                        <th className="py-2 px-3 text-left">Username</th>
                                        <th className="py-2 px-3 text-left">Password</th>
                                        <th className="py-2 px-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-sky-100">
                                    {database.map((info, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="py-2 px-4 text-left">
                                                <div className="flex items-center space-x-2">
                                                    <a
                                                        href={info.site.startsWith('http') ? info.site : `https://${info.site}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="truncate flex-1 max-w-[200px] text-blue-700 hover:underline"
                                                    >
                                                        {info.site}
                                                    </a>
                                                    <button onClick={() => copyText(info.site)}>
                                                        <img src={copy} alt="Copy site" className="w-5 h-5 hover:scale-110" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 text-left">
                                                <div className="flex items-center space-x-2">
                                                    <span className="truncate flex-1 max-w-[200px]">{info.username}</span>
                                                    <button onClick={() => copyText(info.username)}>
                                                        <img src={copy} alt="Copy username" className="w-5 h-5 hover:scale-110" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 text-left">
                                                <div className="flex items-center space-x-2">
                                                    <span className="truncate flex-1 max-w-[200px]">{info.password}</span>
                                                    <button onClick={() => copyText(info.password)}>
                                                        <img src={copy} alt="Copy password" className="w-5 h-5 hover:scale-110" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 text-left">
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleEditPassword(info.id)}>
                                                        <img src={edit} alt="Edit" className="w-5 h-5 hover:scale-110" />
                                                    </button>
                                                    <button onClick={() => handleDeletePassword(info.id)}>  
                                                        <img src={deleteIcon} alt="Delete" className="w-5 h-5 hover:scale-110" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
