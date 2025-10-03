"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { questionApi } from "@/lib/api/questions";
import { categoryApi } from "@/lib/api/categories";
import { useToast } from "@/hooks/use-toast";
import { Code, FileText, Terminal } from "lucide-react";

const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.object({
    definition: z.string().min(1, "Answer definition is required"),
    code_example: z.string().optional(),
    output: z.string().optional(),
  }),
  category: z.string().min(1, "Category is required"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  questionId?: string;
  categoryId?: string;
}

export function QuestionForm({ questionId, categoryId }: QuestionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ _id: string; category: string }>
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      answer: {
        definition: "",
        code_example: "",
        output: "",
      },
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response);

        if (categoryId && !questionId) {
          setValue("category", categoryId);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, [categoryId, questionId, setValue, toast]);

  useEffect(() => {
    if (questionId) {
      const fetchQuestion = async () => {
        try {
          const response = await questionApi.getById(questionId);
          const question = response;
          reset({
            question: question.question,
            answer: {
              definition: question.answer.definition,
              code_example: question.answer.code_example || "",
              output: question.answer.output || "",
            },
            category: question.category,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load question",
            variant: "destructive",
          });
        }
      };
      fetchQuestion();
    }
  }, [questionId, reset, toast]);

  const onSubmit = async (data: QuestionFormData) => {
    setLoading(true);
    try {
      const cleanData = {
        ...data,
        answer: {
          definition: data.answer.definition,
          ...(data.answer.code_example && {
            code_example: data.answer.code_example,
          }),
          ...(data.answer.output && { output: data.answer.output }),
        },
      };

      if (questionId) {
        await questionApi.update(questionId, cleanData);
        toast({
          title: "Success",
          description: "Question updated successfully",
        });
      } else {
        await questionApi.create(cleanData);
        toast({
          title: "Success",
          description: "Question created successfully",
        });
      }

      // Navigate back to category detail page
      const targetCategoryId = categoryId || data.category;
      router.push(`/categories/${targetCategoryId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${questionId ? "update" : "create"} question`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{questionId ? "Edit" : "Create"} Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!categoryId && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                {...register("category")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="question" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Question
            </Label>
            <Textarea
              id="question"
              {...register("question")}
              placeholder="Enter your interview question"
              rows={3}
            />
            {errors.question && (
              <p className="text-sm text-destructive">
                {errors.question.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="definition" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Answer Definition *
            </Label>
            <Textarea
              id="definition"
              {...register("answer.definition")}
              placeholder="Provide a detailed answer/definition"
              rows={4}
            />
            {errors.answer?.definition && (
              <p className="text-sm text-destructive">
                {errors.answer.definition.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code_example" className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Code Example (Optional)
            </Label>
            <Textarea
              id="code_example"
              {...register("answer.code_example")}
              placeholder="Add a code example if applicable"
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="output" className="flex items-center">
              <Terminal className="h-4 w-4 mr-2" />
              Output (Optional)
            </Label>
            <Textarea
              id="output"
              {...register("answer.output")}
              placeholder="Expected output or result"
              rows={3}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading && <LoadingSpinner className="mr-2 h-4 w-4" />}
              {questionId ? "Update" : "Create"} Question
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
