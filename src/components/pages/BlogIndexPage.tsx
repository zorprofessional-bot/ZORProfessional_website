import { DeckPage } from "@/components/deck/DeckPage";
import {
  BlogCardsVisual,
  DeckCardGrid,
} from "@/components/deck/DeckVisuals";
import { blogDeck, chapterLabels } from "@/content/deck";
import { getPosts } from "@/content/blog";
import { routes, type Locale } from "@/content/site";

export function BlogIndexPage({ locale }: { locale: Locale }) {
  const copy = blogDeck[locale];
  const posts = getPosts(locale);
  const isHr = locale === "hr";

  return (
    <DeckPage
      activeKey="blog"
      chapterLabel={chapterLabels[locale].blog}
      locale={locale}
      slides={[
        {
          ...copy[0],
          background: "theme",
          layout: "split",
          primaryCta: {
            label: isHr ? "Pogledaj proizvode" : "View products",
            href: routes[locale].products,
          },
          visual: <BlogCardsVisual locale={locale} posts={posts.slice(0, 2)} />,
        },
        {
          ...copy[1],
          background: "editorial",
          layout: "splitReverse",
          visual: (
            <BlogCardsVisual
              locale={locale}
              posts={posts.filter((post) => post.id === "paper-planning" || post.id === "apartments")}
            />
          ),
        },
        {
          ...copy[2],
          background: "light",
          layout: "split",
          visual: (
            <DeckCardGrid
              columns="two"
              iconSet="none"
              items={[
                {
                  meta: isHr ? "Proizvodnja" : "Production",
                  title: isHr ? "Lokalna proizvodnja i opskrba" : "Local production and supply",
                  body: isHr
                    ? "Kratko objašnjenje zašto blizina pogona pomaže kupcu."
                    : "A short explanation of why nearby production helps the buyer.",
                  href: posts.find((post) => post.id === "local-production")?.href,
                },
                {
                  meta: isHr ? "Kupnja" : "Buying",
                  title: isHr ? "Kako postaviti bolji upit" : "How to ask a better question",
                  body: isHr
                    ? "Količina, prostor i rok su važniji od dugog formulara."
                    : "Quantity, space, and timing matter more than a long form.",
                },
              ]}
            />
          ),
        },
      ]}
      theme="blog"
    />
  );
}
