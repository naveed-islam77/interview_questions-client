import { CategoryDetail } from "@/components/categories/category-detail";
import { useParams } from "next/navigation";

export default function CategoryDetailPage({}) {
  const params = useParams();
  return <CategoryDetail categoryId={params?.id as string} />;
}
