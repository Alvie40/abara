import Banner from "@/app/components/Banner";
import TopSellers from "@/app/components/TopSellers";
import Recommended from "@/app/components/Recommended";

export const metadata = {
    title: "Book Store",
    description: "Home page",
}

export default async function Home() {
    const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/home-books`, {
        cache: "no-cache",
    });
    const result = await response.json();
    const {recommended_books, top_seller_books} = result.data;

    return (
        <>
            <Banner/>
            <TopSellers books={top_seller_books}/>
            <Recommended books={recommended_books}/>
        </>
    );
}
