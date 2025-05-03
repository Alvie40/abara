"use client";

import React from "react";
import { useDispatch } from 'react-redux';
import { useParams } from "next/navigation";
import { addToCart } from "@/app/store/reducers/cart/cartSlice";
import { useGetBookQuery } from "@/app/store/reducers/books/booksApi";
import { FiShoppingCart } from 'react-icons/fi';

interface Props {
}

const SingleBook: React.FC<Props> = () => {
    const {id} = useParams();
    const {data, isLoading, isError} = useGetBookQuery(id);
    const book = data?.data || {};

    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error happening to load book info</div>;

    return (
        <div className="max-w-lg shadow-md p-5">
            <h1 className="text-2xl font-bold mb-6">{book.title}</h1>

            <div className="">
                <div>
                    <img
                        src={`${process.env.BACKEND_BASE_URL}/${book.cover_image}`}
                        alt={book.title}
                        className="mb-8"
                    />
                </div>

                <div className="mb-5">
                    <p className="text-gray-700 mb-2">
                        <strong>Author:</strong> {book.author || "admin"}
                    </p>
                    <p className="text-gray-700 mb-4">
                        <strong>Published:</strong>{" "}
                        {new Date(book?.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-4 capitalize">
                        <strong>Category:</strong> {book?.category}
                    </p>
                    <p className="text-gray-700">
                        <strong>Description:</strong> {book.description}
                    </p>
                </div>

                <button
                    onClick={() => handleAddToCart(book)}
                    className="btn-primary px-6 space-x-1 flex items-center gap-1 "
                >
                    <FiShoppingCart className=""/>
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
};

export default SingleBook;