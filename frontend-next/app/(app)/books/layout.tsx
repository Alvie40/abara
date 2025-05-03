import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Books list"
};

export default function BooksLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}