import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Search, Code, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { categoryApi } from "@/lib/api/categories";
import { questionApi } from "@/lib/api/questions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { useToast } from "@/hooks/use-toast";

interface Category {
  _id: string;
  category: string;
  category_image: string;
}

interface Question {
  _id: string;
  question: string;
  answer: {
    definition: string;
    code_example?: string;
    output?: string;
  };
  category: string;
}

interface CategoryDetailProps {
  categoryId: string;
}

export function CategoryDetail({ categoryId }: CategoryDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!categoryId) return;
    try {
      const [categoryResponse, questionsResponse] = await Promise.all([
        categoryApi.getById(categoryId),
        questionApi.getByCategory(categoryId),
      ]);

      setCategory(categoryResponse);
      setQuestions(questionsResponse);
      setFilteredQuestions(questionsResponse);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load category data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  useEffect(() => {
    const filtered = questions?.filter(
      (question) =>
        question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.answer.definition
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
  }, [searchTerm, questions]);

  const handleDeleteQuestion = async (id: string) => {
    try {
      await questionApi.delete(id);
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Category not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {category.category}
          </h1>
          <p className="text-muted-foreground">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="text-primary">
            <Link href={`/categories/${categoryId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Category
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/categories/${categoryId}/questions/create`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-start">
        {/* Category Image */}
        {category.category_image && (
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <div className="bg-slate-900">
                <Image
                  src={category.category_image || "/placeholder.svg"}
                  alt={category.category}
                  width={500}
                  height={500}
                  className="h-[200px] w-[200px] rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary">
            {filteredQuestions.length} of {questions.length} questions
          </Badge>
        </div>
      </div>

      {/* Questions */}
      <div className="divide-y rounded-lg border">
        {filteredQuestions.map((question) => (
          <div className="flex items-center justify-between">
            <Link
              key={question._id}
              href={`/detail/${question._id}`}
              className="block hover:bg-muted transition w-[90%] border-r"
            >
              <div className="flex items-start justify-between px-4 py-4">
                {/* LEFT CONTENT */}
                <div className="space-y-1 pr-4">
                  <h3 className="font-medium text-base leading-snug">
                    {question.question}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {question.answer.definition}
                  </p>
                </div>
              </div>
            </Link>
            {/* RIGHT ACTIONS */}
            <div
              className="flex items-center gap-2 flex-shrink-0 justify-center w-[10%]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button asChild variant="ghost" size="icon">
                <Link href={`/questions/${question._id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(question._id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDeleteQuestion(deleteId)}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
      />
    </div>
  );
}
