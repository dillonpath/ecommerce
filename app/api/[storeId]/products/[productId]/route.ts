import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    _req: Request,
    { params }: { params: {productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse("Product id is required", {status: 400});
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: (await params).productId

            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { 
            name,
            price,
            categoryId,
            sizeId,
            colorId,
            images,
            isFeatured,
            isArchived
         } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if (!images || !images.length) {
            return new NextResponse("Images is required", {status: 400});
        }

        if (!price) {
            return new NextResponse("Price is required", {status: 400});
        }

        if (!categoryId) {
            return new NextResponse("Category ID is required", {status: 400});
        }

        if (!colorId) {
            return new NextResponse("Color ID is required", {status: 400});
        }

        if (!sizeId) {
            return new NextResponse("Size ID is required", {status: 400});
        }

        if (!(await params).productId) {
            return new NextResponse("Product ID is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: (await params).storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        await prismadb.product.update({
            where: {
                id: (await params).productId
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: (await params).productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    _req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse("Product id is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: (await params).storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }        

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId

            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}