const URL_PATTERN = /(https?:\/\/[^\s]+)/g

function linkify(text: string) {
  return text.split(URL_PATTERN).map((part, index) =>
    index % 2 === 1 ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="text-brand-600 underline decoration-brand-600/30 hover:decoration-brand-600 break-all"
      >
        {part}
      </a>
    ) : (
      part
    ),
  )
}

/** Plain text with paragraphs and clickable links. */
export function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-sm leading-6 text-slate-700">
      {text.split(/\n{2,}/).map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {linkify(paragraph)}
        </p>
      ))}
    </div>
  )
}
