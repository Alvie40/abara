"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Register = () => {
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm();

    const onSubmit = async (data) => {
        setMessage("");
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: data.name, email: data.email, password: data.password}),
            });

            if (!response.ok) {
                const data = await response.json();
                setMessage(data.message || 'Something went wrong');
            } else {
                const data = await response.json();
                setMessage('');
                toast.success("Signup was successful");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
        }
    }

    const handleGoogleSignIn = async () => {
        console.log("Google Sign In");
    }

    return (
        <div className="h-[calc(100vh-120px)] flex justify-center items-center ">
            <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">Please Register</h2>

                <form onSubmit={handleSubmit(onSubmit)} method="POST">
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            {...register("name", {required: true})}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            {...register("email", {required: true})}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email Address"
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            {...register("password", {required: true})}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                            required
                        />
                    </div>
                    {message && (
                        <p className="text-red-500 text-xs italic mb-3">{message}</p>
                    )}
                    <div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none">
                            Register
                        </button>
                    </div>
                </form>
                <p className="align-baseline font-medium mt-4 text-sm">
                    Have an account? Please{" "}
                    <Link href="/login" className="text-blue-500 hover:text-blue-700">
                        Login
                    </Link>
                </p>

                {/* google sign in */}
                <div className="mt-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex flex-wrap gap-1 items-center justify-center bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                    >
                        <FaGoogle className="mr-2"/>
                        Sign in with Google
                    </button>
                </div>

                <p className="mt-5 text-center text-gray-500 text-xs">
                    ©2025 Book Store. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Register;