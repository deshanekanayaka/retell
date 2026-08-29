import { notFound } from "next/navigation";
import { Chip } from "@/components/ui/Chip";
import { TranscriptRail } from "@/components/ui/TranscriptRail";
import { RAIL_LABELS } from "@/lib/rail-labels";
import { isTooShortToScore } from "@/lib/signals";
import { getAttempt } from "@/lib/supabase/attempts";
import { getLatestEvaluation } from "@/lib/supabase/evaluations";
import { toTranscriptSegments } from "@/lib/transcript";

// FR-22, in this order and one column at every viewport: the question, the
// transcript with its parts marked, the gap as a question, the angle labels.
// No score anywhere (FR-23, ADR-011) and no duration or pace (ADR-016). The
// read path cannot return a score, so neither can this page.
//
// Nothing follows the labels. A "next question" control would be inert until
// there is a question bank, and the spec puts that after S3.

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const attempt = await getAttempt(attemptId);

  if (!attempt || !attempt.transcript) {
    notFound();
  }

  const evaluation = await getLatestEvaluation(attempt.id);

  // No evaluation means the model call failed, not that the answer did. The
  // screen drops to the transcript and whatever else survives rather than
  // showing an error, and the line under it blames us (docs/04 section 5).
  const rails = evaluation
    ? { situation: evaluation.situation, action: evaluation.action, result: evaluation.result }
    : { situation: null, action: null, result: null };

  const segments = toTranscriptSegments(attempt.wordTimings ?? [], rails);

  return (
    <div className="mx-auto flex min-h-screen max-w-155 flex-col justify-center gap-8 px-12 py-16">
      {attempt.questionText && (
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[17px] leading-[1.4] text-muted">
            {attempt.questionText}
          </h1>
          <div className="h-px bg-rule" />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
          What you said
        </span>
        <div className="flex flex-col gap-3">
          {segments.map((segment, index) => (
            <TranscriptRail
              key={index}
              label={segment.label ? RAIL_LABELS[segment.label] : null}
              text={segment.text}
            />
          ))}
        </div>
      </div>

      {evaluation ? (
        <div className="flex flex-col gap-2 border-t border-rule pt-6">
          <p className="max-w-[28ch] font-serif text-[34px] leading-tight text-ink">
            {evaluation.gap}
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <p className="font-sans text-[15px] leading-[1.4] text-muted">
              There is no right answer to this. Just say what you personally did.
            </p>
            <a
              href="/record"
              className="inline-flex min-h-11 items-center self-start font-sans text-base font-medium text-ink-soft"
            >
              Have another go at this one
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 border-t border-rule pt-6">
          <p className="font-sans text-[15px] leading-[1.4] text-muted">
            {isTooShortToScore(attempt.durationMs ?? 0)
              ? "Let's give this one another go."
              : "We couldn't finish reading this one back. Your answer is saved."}
          </p>
        </div>
      )}

      {evaluation && evaluation.angles.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-rule pt-6">
          <span className="font-sans text-[13px] font-medium uppercase tracking-wide text-muted">
            This story already answers
          </span>
          <div className="flex flex-wrap gap-2">
            {evaluation.angles.map((angle) => (
              <Chip key={angle}>{angle}</Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
