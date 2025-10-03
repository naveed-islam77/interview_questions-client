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

      {/* Category Image */}
      {category.category_image && (
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
              <Image
                src={category.category_image || "/placeholder.svg"}
                alt={category.category}
                fill
                className="object-cover"
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

      {/* Questions */}
      {filteredQuestions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "No questions found" : "No questions yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Add your first question to this category"}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href={`/categories/${categoryId}/questions/create`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-relaxed">
                    {question.question}
                  </CardTitle>
                  <div className="flex gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/questions/${question._id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(question._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Answer:</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {question.answer.definition}
                  </p>
                </div>

                {question.answer.code_example && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Code Example:
                    </h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{question.answer.code_example}</code>
                    </pre>
                  </div>
                )}

                {question.answer.output && (
                  <div>
                    <h4 className="font-medium mb-2">Output:</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{question.answer.output}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
