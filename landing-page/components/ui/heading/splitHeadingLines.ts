/** Very short titles stay on one line. */
const SINGLE_LINE_MAX_LENGTH = 28

/** Split on whitespace; keep explicit newlines from locale strings. */
function splitWords(heading: string): string[] {
  return heading.trim().split(/\s+/).filter(Boolean)
}

export function getHeadingMaxLines(heading: string): number {
  const trimmed = heading.trim()
  if (trimmed.includes("\n")) {
    return Math.min(
      trimmed.split("\n").filter((line) => line.trim()).length,
      2
    )
  }

  const words = splitWords(trimmed)

  if (words.length <= 2 || trimmed.length <= SINGLE_LINE_MAX_LENGTH) {
    return 1
  }

  return 2
}

function lineLength(words: string[], start: number, end: number): number {
  if (end <= start) return 0
  return words.slice(start, end).join(" ").length
}

/** Split at word boundaries into exactly two balanced lines. */
function splitIntoTwoBalancedLines(words: string[]): string[] {
  const n = words.length

  if (n <= 1) {
    return [words.join(" ")]
  }

  let bestIndex = 1
  let bestScore = Number.POSITIVE_INFINITY

  for (let i = 1; i < n; i++) {
    const score = Math.max(lineLength(words, 0, i), lineLength(words, i, n))
    if (score < bestScore) {
      bestScore = score
      bestIndex = i
    }
  }

  return [words.slice(0, bestIndex).join(" "), words.slice(bestIndex).join(" ")]
}

/** Heading: max 2 lines only (word-safe, balanced width). */
export function splitHeadingLines(
  heading: string,
  maxLines?: number
): string[] {
  const trimmed = heading.trim()
  if (!trimmed) return []

  const cap = Math.min(maxLines ?? getHeadingMaxLines(trimmed), 2)

  if (trimmed.includes("\n")) {
    return trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, cap)
  }

  const words = splitWords(trimmed)

  if (cap <= 1 || words.length <= 1) {
    return [trimmed]
  }

  return splitIntoTwoBalancedLines(words)
}
