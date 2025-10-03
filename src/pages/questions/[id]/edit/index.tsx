import { QuestionForm } from "@/components/questions/question-form";
import { useParams } from "next/navigation";

interface EditQuestionPageProps {
  params: { id: string };
}

export default function EditQuestionPage() {
  const params = useParams();
  console.log("params", params);
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Edit Question
        </h1>
        <p className="text-muted-foreground">Update question information</p>
      </div>
      <QuestionForm questionId={params?.id as string} />
    </div>
  );
}
