import RequireStudent from "../../components/RequireStudent";
import FeedbackForm from "../../components/FeedbackForm";

export default function FeedbackPage() {
  return (
    <RequireStudent>
      <FeedbackForm />
    </RequireStudent>
  );
}
