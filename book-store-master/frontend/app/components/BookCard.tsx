"use client";

import React from 'react';
import { FiPenTool, FiShoppingCart } from 'react-icons/fi';
import Link from "next/link";
import { Book } from "@/app/types/book.type";
import Image from "next/image";
import { useDispatch } from'react-redux'
import { addToCart } from "@/app/store/reducers/cart/cartSlice";


interface BookCardProps {
    book: Book;
    canEdit: boolean;
}

const BookCard: React.FC<BookCardProps> = ({book, canEdit}) => {
    const dispatch =  useDispatch();

    const handleAddToCart = (book: Book) => {
        dispatch(addToCart(book))
    }

    const getImgUrl = () => {
        return `${process.env.BACKEND_BASE_URL}/${book.cover_image}`;
    }
    return (
        <div className="rounded-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
                <div className="sm:flex-shrink-0 border rounded-md">
                    <Link href={`/books/${book.id}`}>
                        <Image
                            src={`${getImgUrl()}`}
                            alt="book"
                            className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
                            height={300}
                            width={200}
                            priority={true}
                        />
                    </Link>
                </div>

                <div>
                    <Link href={`/books/${book.id}`}>
                        <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
                            {book.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 mb-5">{book.description.length > 80 ? `${book.description.slice(0, 80)}...` : book.description}</p>
                    <p className="font-medium mb-5">
                        ${book.new_price} <span className="line-through font-normal ml-2">$ {book.old_price}</span>
                    </p>
                    <button
                        onClick={() => handleAddToCart(book)}
                        className="btn-primary px-6 space-x-1 flex items-center gap-1 !text-sm">
                        <FiShoppingCart/>
                        <span>Add to Cart</span>
                    </button>
                    {canEdit && (
                        <Link
                            href={`/dashboard/manage-books/edit/${book.id}`}
                            className="link-btn-blue mt-2 flex items-center gap-1 !text-sm inline-block">
                            <FiPenTool/>
                            <span>Edit</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookCard;