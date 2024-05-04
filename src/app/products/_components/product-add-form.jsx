"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { useRef, useState } from "react";
import productApiRequest from "@/apiRequests/product";
import { Textarea } from "@/components/ui/textarea";
import { CreateProductBody } from "@/schemaValidations/product.schema";
import Image from "next/image";

const ProductAddForm = ({ product }) => {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ?? 0,
      description: product?.description ?? "",
      image: product?.image ?? "",
    },
  });
  const image = form.watch("image");
  const createProduct = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadImageResult = await productApiRequest.uploadImage(formData);
      const imageUrl = uploadImageResult.payload.data;
      const result = await productApiRequest.create({
        ...values,
        image: imageUrl,
      });

      toast({
        description: result.payload.message,
      });
      router.push("/products");
      router.refresh();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (_values) => {
    if (!product) return;
    setLoading(true);
    let values = _values;
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadImageResult = await productApiRequest.uploadImage(formData);
        const imageUrl = uploadImageResult.payload.data;
        values = {
          ...values,
          image: imageUrl,
        };
      }

      const result = await productApiRequest.update(product.id, values);

      toast({
        description: result.payload.message,
      });
      router.refresh();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setLoading(false);
    }
  };
  async function onSubmit(values) {
    if (loading) return;
    if (product) {
      await updateProduct(values);
    } else {
      await createProduct(values);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log(error);
          console.log(form.getValues("image"));
        })}
        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      field.onChange("http://localhost:3000/" + file.name);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(file || image) && (
          <div>
            <Image
              src={file ? URL.createObjectURL(file) : image}
              alt="preview"
              width={200}
              height={200}
              className="w-32 h-32 object-cover"
            />
            <Button
              type="button"
              variant={"destructive"}
              size={"sm"}
              onClick={() => {
                setFile(null);
                form.setValue("image", "");
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
            >
              Xóa hình ảnh
            </Button>
          </div>
        )}
        <Button type="submit" className="!mt-8 w-full">
          {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </Button>
      </form>
    </Form>
  );
};

export default ProductAddForm;
