import { Link } from "@tanstack/react-router"
import { links } from "@/lib/links"

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-auto w-full max-w-4xl px-6 pt-10 pb-14">
      <div className="hairline mb-6" />
      <div className="text-muted-foreground flex flex-col items-center justify-between gap-3 text-xs sm:flex-row">
        <p>MIT licensed. Not affiliated with OpenAI or Anthropic.</p>
        <nav className="flex items-center gap-5">
          <a href={links.github} className="hover:text-gold transition-colors">
            GitHub
          </a>
          <a href={links.issues} className="hover:text-gold transition-colors">
            Issues
          </a>
          <Link to="/privacy" className="hover:text-gold transition-colors">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  )
}
