"use client";

import { useGetBooksQuery } from "@/app/store/reducers/books/booksApi";
import BookCard from "@/app/components/BookCard";
import React, { useEffect, useState } from "react";
import Preloader from "@/app/components/Preloader";

interface Props {
    canEdit: boolean;
}

const BookList: React.FC<Props> = ({canEdit}) => {
    const {data, isLoading} = useGetBooksQuery();
    const [mounted, setMounted] = useState(false);
    const books = data?.data;

    // Ensure the component is only rendered after it's mounted on the client
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Avoid rendering anything during SSR
    }

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4'>All Books</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-12'>
                {books && books.map(book => (
                    <BookCard key={book.id} book={book} canEdit={canEdit}/>
                ))}
            </div>
        </div>
    );
};

export default BookList;