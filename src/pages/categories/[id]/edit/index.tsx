import { CategoryForm } from "@/components/categories/category-form";
import { useParams } from "next/navigation";

interface EditCategoryPageProps {
  params: { id: string };
}

export default function EditCategoryPage() {
  const params = useParams();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Edit Category
        </h1>
        <p className="text-muted-foreground">Update category information</p>
      </div>
      <CategoryForm categoryId={params?.id as string} />
    </div>
  );
}
