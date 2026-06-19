import { Fragment, type ReactNode } from "react";

// Pretvara **riječ** u naglašeni akcentni span. Autori copyja u content/*.ts
// jednostavno omotaju ključne riječi dvostrukim zvjezdicama; render je centraliziran.
const highlightPattern = /\*\*(.+?)\*\*/g;

export function renderHighlights(text: string): ReactNode {
  if (!text.includes("**")) {
    return text;
  }

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  highlightPattern.lastIndex = 0;
  while ((match = highlightPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>,
      );
    }
    nodes.push(
      <span className="deck-accent" key={key++}>
        {match[1]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return nodes;
}
