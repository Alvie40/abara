import Login from "@/app/components/Login";
import { UserSession } from "@/app/types/user-session.type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { permanentRedirect } from "next/navigation";

export const metadata = {
    title: "Login",
    description: "Login page",
}

const Page = async () => {
    const data: UserSession | null = await getServerSession(authOptions);
    if (data?.user) {
        permanentRedirect('/');
    }

    return <Login/>
};

export default Page;