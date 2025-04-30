"use client";

import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useGetBookQuery } from "@/app/store/reducers/books/booksApi";
import { Book } from "@/app/types/book.type";

interface BookFormData {
    title: string;
    description: string;
    category: string;
    trending: boolean;
    cover_image: FileList;
    old_price: number;
    new_price: number;
}

const EditBookForm = () => {
    const params = useParams();
    const {data, isLoading} = useGetBookQuery(params.id, {
        skip: !params.id,
    });
    const book = data?.data as Book;

    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<BookFormData>();

    useEffect(() => {
        if (book) {
            setValue('title', book.title);
            setValue('description', book.description);
            setValue('category', book.category);
            setValue('trending', book.trending);
            setValue('old_price', book.old_price);
            setValue('new_price', book.new_price);
            setImagePreview(`${process.env.BACKEND_BASE_URL}/${book.cover_image}`);
        }
    }, [book, setValue]);

    const onSubmit = async (data: BookFormData) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('trending', data.trending);
        formData.append('old_price', data.old_price);
        formData.append('new_price', data.new_price);
        if (data.cover_image[0]) {
            // Append the new cover image if it's selected
            formData.append('cover_image', data.cover_image[0]);
        } else {
            // Append the existing cover image if it's not changed
            formData.append('cover_image', book.cover_image);
        }

        try {
            await axios.patch(`${process.env.BACKEND_BASE_URL}/api/books/${book.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Book updated successfully!');
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
            <h2 className="text-xl font-semibold mb-4">Update Book</h2>
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
                <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">
                    Cover Image
                </label>
                <input
                    type="file"
                    id="cover_image"
                    className={`mt-1 block w-full p-2 border ${errors.cover_image ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register('cover_image')}
                    onChange={handleImageChange}
                />
                {errors.cover_image && <p className="text-red-500 text-sm mt-1">{errors.cover_image.message}</p>}

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mt-4">
                        <Image src={imagePreview} alt="Selected Preview" className="h-auto rounded-md" width={100} height={100}/>
                    </div>
                )}
            </div>

            {/* Old Price */}
            <div>
                <label htmlFor="old_price" className="block text-sm font-medium text-gray-700">
                    Old Price
                </label>
                <input
                    type="number"
                    step="0.01"
                    id="old_price"
                    className={`mt-1 block w-full p-2 border ${errors.old_price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register('old_price', {required: 'Old price is required'})}
                />
                {errors.old_price && <p className="text-red-500 text-sm mt-1">{errors.old_price.message}</p>}
            </div>

            {/* New Price */}
            <div>
                <label htmlFor="new_price" className="block text-sm font-medium text-gray-700">
                    New Price
                </label>
                <input
                    type="number"
                    step="0.01"
                    id="new_price"
                    className={`mt-1 block w-full p-2 border ${errors.new_price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    {...register('new_price', {required: 'New price is required'})}
                />
                {errors.new_price && <p className="text-red-500 text-sm mt-1">{errors.new_price.message}</p>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                Submit
            </button>
        </form>
    )
};

export default EditBookForm;