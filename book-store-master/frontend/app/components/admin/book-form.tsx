"use client";

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

interface BookFormData {
    title: string;
    description: string;
    category: string;
    trending: boolean;
    coverImage: FileList;
    oldPrice: number;
    newPrice: number;
}

const BookForm = () => {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<BookFormData>();

    const onSubmit = async (data: BookFormData) => {
        console.log(data);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('trending', data.trending);
        formData.append('old_price', data.oldPrice);
        formData.append('new_price', data.newPrice);
        formData.append('cover_image', data.coverImage[0]);

        try {
            await axios.post(`${process.env.BACKEND_BASE_URL}/api/books`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Book created successfully!');
            await router.push('/dashboard/manage-books');
        } catch (error) {
            console.error(error);
            alert('Failed to create the book.');
        }
    };

    // Handle file selection and update the image preview
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file); // Convert file to base64 URL
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}
              className="max-w-lg mx-auto p-8 space-y-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    className={`mt-1 block w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register('title', {required: 'Title is required'})}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    className={`mt-1 block w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register('description', {required: 'Description is required'})}
                    rows={7}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <input
                    type="text"
                    id="category"
                    className={`mt-1 block w-full p-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register('category', {required: 'Category is required'})}
                />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            {/* Trending */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="trending"
                    className="mr-2"
                    {...register('trending')}
                />
                <label htmlFor="trending" className="block text-sm font-medium text-gray-700">
                    Trending
                </label>
            </div>

            {/* Cover Image */}
            <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                    Cover Image
                </label>
                <input
                    type="file"
                    id="coverImage"
                    className={`mt-1 block w-full p-2 border ${errors.coverImage ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register('coverImage', {required: 'Cover image is required'})}
                    onChange={handleImageChange}
                />
                {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage.message}</p>}

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mt-4">
                        <Image src={imagePreview} alt="Selected Preview" className="h-auto rounded-md" width={100} height={100}/>
                    </div>
                )}
            </div>

            {/* Old Price */}
            <div>
                <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700">
                    Old Price
                </label>
                <input
                    type="number"
                    step="0.01"
                    id="oldPrice"
                    className={`mt-1 block w-full p-2 border ${errors.oldPrice ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register('oldPrice', {required: 'Old price is required'})}
                />
                {errors.oldPrice && <p className="text-red-500 text-sm mt-1">{errors.oldPrice.message}</p>}
            </div>

            {/* New Price */}
            <div>
                <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700">
                    New Price
                </label>
                <input
                    type="number"
                    step="0.01"
                    id="newPrice"
                    className={`mt-1 block w-full p-2 border ${errors.newPrice ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register('newPrice', {required: 'New price is required'})}
                />
                {errors.newPrice && <p className="text-red-500 text-sm mt-1">{errors.newPrice.message}</p>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                Submit
            </button>
        </form>
    )
};

export default BookForm;