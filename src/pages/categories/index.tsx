import { CategoryList } from "@/components/categories/category-list";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
      </div>
      <CategoryList />
    </div>
  );
}
