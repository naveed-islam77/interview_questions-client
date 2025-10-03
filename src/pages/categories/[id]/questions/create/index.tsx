import { QuestionForm } from "@/components/questions/question-form";
import { useParams } from "next/navigation";

export default function CreateQuestionPage() {
  const params = useParams();
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Create Question
        </h1>
        <p className="text-muted-foreground">Add a new interview question</p>
      </div>
      <QuestionForm categoryId={params?.id as string} />
    </div>
  );
}
