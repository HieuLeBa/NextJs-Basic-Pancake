import productApiRequest from "@/apiRequests/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import { cache } from "react";

const getDetail = cache(productApiRequest.getDetail);
export default async function ProductEdit({ params }) {
  let product = null;
  try {
    const { payload } = await getDetail(Number(params.id));
    product = payload.data;
  } catch (error) {}

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && <ProductAddForm product={product} />}
    </div>
  );
}
