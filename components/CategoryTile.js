import Link from "next/link";

export default function CategoryTile({ slug, title, emoji, href }) {
  return (
    <Link href={href || `/quiz/${slug}`} className="category-tile">
      <span className="emoji">{emoji}</span>
      <span>{title}</span>
    </Link>
  );
}
