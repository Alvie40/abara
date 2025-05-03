import { Metadata } from "next";
import Banner from "../components/Banner";
import TopSellers from "../components/TopSellers";
import Recommended from "../components/Recommended";
import { Book } from "../types/book.type";

export const metadata: Metadata = {
    title: "Home | Book Store",
};

interface ApiResponse {
    data: {
        top_seller_books: Book[];
        recommended_books: Book[];
    };
    status: boolean;
}

export default async function Home() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home-books`, {
            cache: "no-cache",
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();

        if (!result.status || !result.data) {
            throw new Error('Invalid API response format');
        }

        return (
            <main>
                <Banner/>
                <TopSellers books={result.data.top_seller_books || []}/>
                <Recommended books={result.data.recommended_books || []}/>
            </main>
        );
    } catch (error) {
        console.error('Error fetching books:', error);
        return (
            <main>
                <Banner/>
                <TopSellers books={[]}/>
                <Recommended books={[]}/>
            </main>
        );
    }
}
