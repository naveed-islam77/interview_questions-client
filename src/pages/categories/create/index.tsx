import { CategoryForm } from "@/components/categories/category-form";

export default function CreateCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Create Category
        </h1>
        <p className="text-muted-foreground">
          Add a new category for interview questions
        </p>
      </div>
      <CategoryForm />
    </div>
  );
}
