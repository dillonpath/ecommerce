import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
    params
}: {
    params: { productId: string, storeId: string }
}) => {
    const product = await prismadb.product.findUnique({
        where: {
            id: (await params).productId
        },
        include: {
            images: true
        }
    });

    const categories = await prismadb.category.findMany({
        where: {
            storeId: (await params).storeId,
        }
    })

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: (await params).storeId,
        }
    })

    const colors = await prismadb.color.findMany({
        where: {
            storeId: (await params).storeId,
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm categories={categories} colors = {colors} sizes={sizes} initialData={product}/>
            </div>
        </div>
    );
}

export default ProductPage;
