import BookForm from "@/app/components/admin/book-form";

export const metadata = {
    title: "Add New Book",
    description: "Add new book page",
}

const Page = () => {
    return (
        <BookForm/>
    )
};

export default Page;