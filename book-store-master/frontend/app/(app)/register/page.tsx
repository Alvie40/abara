import Register from "@/app/components/Register";
import { UserSession } from "@/app/types/user-session.type";
import { getServerSession } from "next-auth";
import { permanentRedirect } from "next/navigation";
import { authOptions } from "@/app/lib/authOptions";

export const metadata = {
    title: "Register",
    description: "Register page",
}

const Page = async () => {
    const data: UserSession | null = await getServerSession(authOptions);
    if (data?.user) {
        permanentRedirect('/');
    }

    return (
        <Register/>
    )
};

export default Page;