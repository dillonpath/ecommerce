import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout(
    props: {
        children: React.ReactNode
        params: Promise<{storeId: string}>
    }
) {
    const params = await props.params;

    const {
        children
    } = props;

    const { userId } = await auth();
    if (!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
        id: params.storeId,
        userId
        }
    });

    if (!store) {
        redirect('/');
    }

    return (
        <>
        <Navbar />
        {children}
        </>
    )
}