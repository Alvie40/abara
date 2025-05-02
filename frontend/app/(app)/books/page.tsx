'use client';

import React from "react";
import BookList from "@/app/components/BookList";
import { useSession } from "next-auth/react";

const Page: React.FC = () => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.is_admin || false;

    return <BookList canEdit={isAdmin} />;
};

export default Page;