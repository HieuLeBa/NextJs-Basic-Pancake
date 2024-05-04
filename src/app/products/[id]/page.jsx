import productApiRequest from "@/apiRequests/product";
import Image from "next/image";
import { cache } from "react";

const getDetail = cache(productApiRequest.getDetail);
export default async function ProductDetail({ params, searchParams }) {
  console.log("params", params);
  let product = null;
  try {
    const { payload } = await getDetail(Number(params.id));
    product = payload.data;
  } catch (error) {}

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && (
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={180}
            height={180}
            className="w-32 h-32 object-cover"
          />

          <h3>{product.name}</h3>
          <div>{product.price}</div>
        </div>
      )}
    </div>
  );
}
