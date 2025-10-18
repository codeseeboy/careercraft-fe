/**
 * Utilities for handling resume scores and matching
 */

/**
 * Normalize a resume score to a 0-100 scale
 * 
 * @param score The raw score from the API (could be 0-10 or 0-100)
 * @returns A normalized score between 0-100
 */
export function normalizeScore(score: number | undefined | null): number {
  if (score === undefined || score === null) return 0;
  
  // If score is already in 0-100 range, return as is
  if (score > 10) return Math.round(score);
  
  // If score is in 0-10 range, convert to 0-100
  return Math.round(score * 10);
}

/**
 * Get the verdict category based on a normalized score
 * 
 * @param score A normalized score (0-100)
 * @returns A verdict string: "Good match", "Partial match", or "Not recommended"
 */
export function getScoreVerdict(score: number): "Good match" | "Partial match" | "Not recommended" {
  if (score >= 70) return "Good match";
  if (score >= 30) return "Partial match";
  return "Not recommended";
}

/**
 * Get appropriate UI styling classes based on a verdict
 * 
 * @param verdict The match verdict
 * @returns CSS classes for styling the verdict
 */
export function getVerdictClasses(verdict: string): {
  container: string;
  text: string;
  progress: string;
} {
  switch (verdict) {
    case "Good match":
      return {
        container: "bg-green-50 border-green-200",
        text: "text-green-700",
        progress: "bg-green-600"
      };
    case "Partial match":
      return {
        container: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-700",
        progress: "bg-yellow-500"
      };
    case "Not recommended":
    default:
      return {
        container: "bg-red-50 border-red-200",
        text: "text-red-700",
        progress: "bg-red-500"
      };
  }
}