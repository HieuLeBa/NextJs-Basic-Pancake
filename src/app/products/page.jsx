import productApiRequest from "@/apiRequests/product";
// import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import ProductAddButton from "@/app/products/_components/product-add-button";
import ProductEditButton from "./_components/product-edit-button";

export default async function ProductListPage() {
  const { payload } = await productApiRequest.getList();
  const productList = payload.data;
  return (
    <div className="space-y-3">
      <h1>Product List</h1>
      <ProductAddButton />

      <div className="space-y-5">
        {productList.map((product) => (
          <div key={product.id} className="flex space-x-4">
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={180}
                height={180}
                className="w-32 h-32 object-cover"
              />
            </Link>

            <h3>{product.name}</h3>
            <div>{product.price}</div>
            <ProductEditButton product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
