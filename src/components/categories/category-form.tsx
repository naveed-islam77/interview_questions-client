"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { categoryApi } from "@/lib/api/categories";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import Image from "next/image";

const categorySchema = z.object({
  category: z.string().min(1, "Category name is required"),
  category_image: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  categoryId?: string;
}

export function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (categoryId) {
      const fetchCategory = async () => {
        try {
          const response = await categoryApi.getById(categoryId);
          const category = response;
          reset({
            category: category.category,
            category_image: category.category_image,
          });
          if (category.category_image) {
            setImagePreview(category.category_image);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load category",
            variant: "destructive",
          });
        }
      };
      fetchCategory();
    }
  }, [categoryId, reset, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setValue("category_image", "");
  };

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      let imageUrl = data.category_image;

      if (imageFile) {
        imageUrl = imagePreview;
      }

      const categoryData = {
        ...data,
        category_image: imageUrl,
      };

      if (categoryId) {
        await categoryApi.update(categoryId, categoryData);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await categoryApi.create(categoryData);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      router.push("/categories");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${categoryId ? "update" : "create"} category`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{categoryId ? "Edit" : "Create"} Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category Name</Label>
            <Input
              id="category"
              {...register("category")}
              placeholder="Enter category name"
            />
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Category preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Click to upload an image or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading && <LoadingSpinner className="mr-2 h-4 w-4" />}
              {categoryId ? "Update" : "Create"} Category
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
