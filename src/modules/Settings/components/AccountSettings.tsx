import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from "lucide-react";
import SvgIcon from '@/components/ui/SvgIcon';
import { Loader } from '@/components/ui/loader';
import { ContractService } from '@/api/apiService';
import { NonPasswordUser } from '@/api/contracts';

/**
 * Component for managing user account settings. It allows users to view and update
 * their profile information such as email, name, password, and avatar.
 */
const AccountSettings = () => {
    const [user, setUser] = useState<NonPasswordUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [passwordDots, setPasswordDots] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isSavingEmail, setIsSavingEmail] = useState(false);
    const [isSavingName, setIsSavingName] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Refs for focusing inputs on edit start
    const emailInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingEmail) {
            emailInputRef.current?.focus();
        }
    }, [isEditingEmail]);

    useEffect(() => {
        if (isEditingName) {
            nameInputRef.current?.focus();
        }
    }, [isEditingName]);

    useEffect(() => {
        if (isEditingPassword) {
            passwordInputRef.current?.focus();
        }
    }, [isEditingPassword]);

    useEffect(() => {
        /**
         * Fetches current user's data from the API.
         */
        const fetchUser = async () => {
            try {
                const response = await ContractService.api.getUserApiV2UsersSelfGet();
                setUser(response.data);
                setFormData(prev => ({
                    ...prev,
                    email: response.data.email || '',
                    name: response.data.name || ''
                }));
                const dots = '•'.repeat(Math.floor(Math.random() * 6) + 10);
                setPasswordDots(dots);
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Current form values
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });

    /**
     * Saves the updated user email.
     */
    const handleSaveEmail = async () => {
        if (!user) return;
        setIsSavingEmail(true);
        try {
            const response = await ContractService.api.updateUserApiV2UsersPatch({ email: formData.email });
            setUser(response.data);
            setIsEditingEmail(false);
        } catch (error) {
            setFormData(prev => ({ ...prev, email: user.email || '' }));
        } finally {
            setIsSavingEmail(false);
        }
    };

    /**
     * Saves the updated user name.
     */
    const handleSaveName = async () => {
        if (!user) return;
        setIsSavingName(true);
        try {
            const response = await ContractService.api.updateUserApiV2UsersPatch({ name: formData.name });
            setUser(response.data);
            setIsEditingName(false);
        } catch (error) {
            setFormData(prev => ({ ...prev, name: user.name || '' }));
        } finally {
            setIsSavingName(false);
        }
    };

    /**
     * Saves the new user password.
     */
    const handleSavePassword = async () => {
        if (!formData.password || formData.password !== formData.confirmPassword) return;
        setIsSavingPassword(true);
        try {
            await ContractService.api.updateUserApiV2UsersPatch({ password: formData.password });
            setIsEditingPassword(false);
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error) {
        } finally {
            setIsSavingPassword(false);
        }
    };

    /**
     * Cancels editing the password and clears the fields.
     */
    const handleCancelPassword = () => {
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setIsEditingPassword(false);
    };

    /**
     * Triggers the file input for avatar selection.
     */
    const handleAvatarClick = () => {
        avatarInputRef.current?.click();
    };

    /**
     * Handles the new avatar file selection and sets the preview.
     */
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * Cancels the avatar change and removes the preview.
     */
    const handleCancelAvatar = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent re-opening file dialog
        setAvatarPreview(null);
        if(avatarInputRef.current) {
            avatarInputRef.current.value = "";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Не удалось загрузить данные пользователя.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-7">
                <div 
                    className="w-10 h-10 bg-[#EEEEEE] rounded-md flex items-center justify-center relative cursor-pointer"
                    onClick={handleAvatarClick}
                >
                    <input 
                        type="file" 
                        ref={avatarInputRef} 
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden" 
                    />
                    {avatarPreview ? (
                        <>
                            <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full rounded-sm object-cover" />
                            <button 
                                onClick={handleCancelAvatar}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs leading-none"
                                aria-label="Remove image"
                            >
                                &#x2715;
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full rounded-sm bg-[#3D7EFF] flex items-center justify-center text-white font-bold text-lg">
                            {user.name?.[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <p className="font-normal text-[14px] leading-[21px] tracking-[-0.022em] text-[#2B2B2B]">
                        {user.name}
                    </p>
                    <p className="text-[12px] leading-[18px] tracking-[-0.022em] text-[#2B2B2B]">
                        {user.email}
                    </p>
                </div>
            </div>

            <div className="space-y-3.5 flex-1">
                <div className="w-full">
                    <label className="block text-[14px] font-medium leading-[21px] tracking-[-0.022em] text-[#2B2B2B] mb-1">
                        Email
                    </label>
                    <div className="flex items-center gap-2">
                        {!isEditingEmail ? (
                            <>
                                <div className="flex-1 relative">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full h-6 px-1 text-[12px] leading-[18px] tracking-[-0.022em] text-[#2B2B2B] bg-white border border-[#E8F1FF] rounded-sm disabled:bg-white"
                                    />
                                </div>
                                <button 
                                    className="w-6 h-6 border border-[#E8F1FF] rounded-sm flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
                                    onClick={() => setIsEditingEmail(true)}
                                >
                                    <SvgIcon src="/icons/edit-icon.svg" className="w-3.5 h-3.5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex-1 relative">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full h-6 px-1 text-[12px] leading-[18px] tracking-[-0.022em] text-[#2B2B2B] bg-white border border-[#E8F1FF] rounded-sm focus:outline-none focus:border-[#3D7EFF]"
                                        ref={emailInputRef}
                                    />
                                </div>
                                <button 
                                    className="w-6 h-6 bg-[#3D7EFF] border border-[#3D7EFF] rounded-sm flex items-center justify-center hover:bg-[#3D7EFF]/90 flex-shrink-0"
                                    onClick={handleSaveEmail}
                                    disabled={isSavingEmail}
                                >
                                    {isSavingEmail ? (
                                        <Loader variant="dots" className="text-white" size="xsm" />
                                    ) : (
                                        <SvgIcon src="/icons/edit-icon.svg" className="w-3.5 h-3.5 text-white" />
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="w-full">
                    <label className="block text-[14px] font-medium leading-[21px] tracking-[-0.022em] text-[#2B2B2B] mb-1">
                        Имя
                    </label>
                    <div className="flex items-center gap-2">
                        {!isEditingName ? (
                            <>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        disabled
                                        className="w-full h-6 px-1 text-[12px] leading-[15px] tracking-[-0.02em] text-[#2B2B2B] bg-white border border-[#E8F1FF] rounded-sm disabled:bg-white"
                                    />
                                </div>
                                <button 
                                    className="w-6 h-6 border border-[#E8F1FF] rounded-sm flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    <SvgIcon src="/icons/edit-icon.svg" className="w-3.5 h-3.5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full h-6 px-1 text-[12px] leading-[15px] tracking-[-0.02em] text-[#2B2B2B] bg-white border border-[#E8F1FF] rounded-sm focus:outline-none focus:border-[#3D7EFF]"
                                        ref={nameInputRef}
                                    />
                                </div>
                                <button 
                                    className="w-6 h-6 bg-[#3D7EFF] border border-[#3D7EFF] rounded-sm flex items-center justify-center hover:bg-[#3D7EFF]/90 flex-shrink-0"
                                    onClick={handleSaveName}
                                    disabled={isSavingName}
                                >
                                    {isSavingName ? (
                                        <Loader variant="dots" className="text-white" size="xsm" />
                                    ) : (
                                        <SvgIcon src="/icons/edit-icon.svg" className="w-3.5 h-3.5 text-white" />
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="w-full">
                    <label className="block text-[14px] font-medium leading-[21px] tracking-[-0.022em] text-[#2B2B2B] mb-1">
                        Пароль
                    </label>
                    {!isEditingPassword ? (
                        <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="password"
                                    value={passwordDots}
                                    disabled
                                    className="w-full h-6 px-1 text-[12px] leading-[15px] tracking-[-0.02em] text-[#929292] bg-white border border-[#E8F1FF] rounded-sm disabled:bg-white"
                                />
                            </div>
                            <button 
                                className="w-6 h-6 border border-[#E8F1FF] rounded-sm flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
                                onClick={() => setIsEditingPassword(true)}
                            >
                                <SvgIcon src="/icons/edit-icon.svg" className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        placeholder="Введите новый пароль"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full h-6 px-1 pr-8 text-[12px] leading-[15px] tracking-[-0.02em] text-[#2B2B2B] placeholder-[#929292] bg-white border border-[#E8F1FF] rounded-sm focus:outline-none focus:border-[#3D7EFF]"
                                        ref={passwordInputRef}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                                    >
                                        {isPasswordVisible ? (
                                            <EyeOff size={12} className="text-[#2B2B2B]" />
                                        ) : (
                                            <Eye size={12} className="text-[#2B2B2B]" />
                                        )}
                                    </button>
                                </div>
                                <button 
                                    className="w-6 h-6 border border-[#E8F1FF] rounded-sm flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
                                    onClick={() => {
                                        if (!isEditingPassword) {
                                            setIsEditingPassword(true);
                                        } else {
                                            handleCancelPassword();
                                        }
                                    }}
                                >
                                    <SvgIcon src="/icons/edit-icon.svg" className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            
                            <div className="relative w-[calc(100%-32px)]">
                                <input
                                    type={isConfirmPasswordVisible ? "text" : "password"}
                                    placeholder="Повторите новый пароль"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    className="w-full h-6 px-1 pr-8 text-[12px] leading-[15px] tracking-[-0.02em] text-[#2B2B2B] placeholder-[#929292] bg-white border border-[#E8F1FF] rounded-sm focus:outline-none focus:border-[#3D7EFF]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                                >
                                    {isConfirmPasswordVisible ? (
                                        <EyeOff size={12} className="text-[#2B2B2B]" />
                                    ) : (
                                        <Eye size={12} className="text-[#2B2B2B]" />
                                    )}
                                </button>
                            </div>
                            
                            <div className="flex justify-start mt-2">
                                <button
                                    onClick={handleSavePassword}
                                    disabled={isSavingPassword || !formData.password || formData.password !== formData.confirmPassword}
                                    className="w-[79px] h-6 bg-[#3D7EFF] text-white text-[10px] leading-[12px] tracking-[-0.03em] rounded-sm flex items-center justify-center disabled:opacity-50"
                                >
                                    {isSavingPassword ? <Loader variant="dots" className="text-white" size="sm" /> : "Сохранить"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-6">
                <a 
                    href="https://t.me/explain_info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-[30px] bg-[#3D7EFF] text-white text-[12px] leading-[15px] tracking-[-0.03em] rounded-sm hover:bg-[#3D7EFF]/90 disabled:opacity-50 flex items-center justify-center"
                >
                    Поддержка
                </a>
            </div>
        </div>
    );
};

export default AccountSettings; 