"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../lib/api";
import { Store, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../../store/useAuthStore";

function VerifyEmailHandler() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email address...");
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        const verifyToken = async () => {
            try {
                const { data } = await api.get(`/auth/verify-email/${token}`);
                if (data.success) {
                    setStatus("success");
                    setMessage("Your email has been verified successfully!");
                    // Implicitly log them in since token establishes session!
                    login(data.user);

                    // Redirect based on role
                    setTimeout(() => {
                        if (data.user.role === 'shop_owner') {
                            router.push('/seller/dashboard');
                        } else {
                            router.push('/shops');
                        }
                    }, 3000);
                }
            } catch (err: any) {
                setStatus("error");
                setMessage(err.response?.data?.message || "Verification failed. The link may have expired.");
            }
        };

        verifyToken();
    }, [token, login, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-xl shadow-primary-500/5 sm:rounded-2xl sm:px-10 border border-gray-100 text-center flex flex-col items-center">

                    {status === "loading" && (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mb-6"></div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying...</h2>
                            <p className="text-gray-500">{message}</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h2>
                            <p className="text-gray-500 mb-6">{message}</p>
                            <p className="text-sm text-gray-400">Redirecting automatically...</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                                <XCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Error</h2>
                            <p className="text-gray-500 mb-8">{message}</p>
                            <Link href="/login" className="w-full h-12 flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all items-center">
                                Back to Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        }>
            <VerifyEmailHandler />
        </Suspense>
    );
}
