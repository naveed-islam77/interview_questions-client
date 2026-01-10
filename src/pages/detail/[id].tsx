import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Code } from "lucide-react";
import { useRouter } from "next/router";
import { useGetQuestionByIdQuery } from "@/services/questionApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";
import { questionApi } from "@/lib/api/questions";

const QuestionDetailPage = () => {
  const [question, setQuestion] = useState<any>("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchQuestionDetail() {
      setIsLoading(true);
      const res = await questionApi.getById(id as string);
      console.log("res", res);
      setQuestion(res);
      setIsLoading(false);
    }

    fetchQuestionDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Question not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between cursor-pointer">
        <Button asChild variant="ghost">
          <div onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </div>
        </Button>
      </div>

      {/* QUESTION */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl leading-relaxed">
            {question?.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ANSWER */}
          <div>
            <h3 className="font-semibold mb-2">Answer</h3>
            <p className="text-muted-foreground leading-relaxed">
              {question?.answer?.definition}
            </p>
          </div>

          {/* CODE EXAMPLE */}
          {question?.answer?.code_example && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Code Example
              </h3>

              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{question?.answer?.code_example}</code>
              </pre>
            </div>
          )}

          {/* OUTPUT */}
          {question?.answer?.output && (
            <div>
              <h3 className="font-semibold mb-2">Output</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{question?.answer?.output}</code>
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionDetailPage;
