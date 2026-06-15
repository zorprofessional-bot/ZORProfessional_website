import { DeckPage } from "@/components/deck/DeckPage";
import {
  BlogCardsVisual,
  DeckCardGrid,
} from "@/components/deck/DeckVisuals";
import { blogDeck, chapterLabels } from "@/content/deck";
import { getPosts, type BlogPost } from "@/content/blog";
import { routes, type Locale } from "@/content/site";
import {
  resolveDeckSlideContent,
  type DeckPageData,
} from "@/lib/data/deck";

type BlogIndexPageProps = {
  deckData?: DeckPageData;
  locale: Locale;
  posts?: Array<BlogPost & { href: string }>;
};

export function BlogIndexPage({
  deckData,
  locale,
  posts = getPosts(locale),
}: BlogIndexPageProps) {
  const copy = blogDeck[locale];
  const isHr = locale === "hr";
  const slides = copy.map((slide) => resolveDeckSlideContent(deckData, slide));
  const guidePosts = posts.filter(
    (post) => post.id === "paper-planning" || post.id === "apartments",
  );
  const guideVisualPosts = guidePosts.length > 0 ? guidePosts : posts.slice(0, 2);
  const productionPostHref =
    posts.find((post) => post.id === "local-production")?.href ?? posts[0]?.href;

  return (
    <DeckPage
      activeKey="blog"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].blog}
      locale={locale}
      menuFlow
      slides={[
        {
          ...slides[0],
          body: slides[0]?.body ?? copy[0].body,
          background: slides[0]?.background ?? "theme",
          layout: slides[0]?.layout ?? "split",
          primaryCta: slides[0]?.primaryCta ?? {
            label: isHr ? "Pogledaj proizvode" : "View products",
            href: routes[locale].products,
          },
          visual: <BlogCardsVisual locale={locale} posts={posts.slice(0, 2)} />,
        },
        {
          ...slides[1],
          body: slides[1]?.body ?? copy[1].body,
          background: slides[1]?.background ?? "editorial",
          layout: slides[1]?.layout ?? "splitReverse",
          visual: (
            <BlogCardsVisual
              locale={locale}
              posts={guideVisualPosts}
            />
          ),
        },
        {
          ...slides[2],
          body: slides[2]?.body ?? copy[2].body,
          background: slides[2]?.background ?? "light",
          layout: slides[2]?.layout ?? "split",
          visual: (
            <DeckCardGrid
              columns="two"
              iconSet="none"
              items={[
                {
                  meta: isHr ? "Proizvodnja" : "Production",
                  title: isHr
                    ? "Lokalna proizvodnja i opskrba"
                    : "Local production and supply",
                  body: isHr
                    ? "Kratko objaÅ¡njenje zaÅ¡to blizina pogona pomaÅ¾e kupcu."
                    : "A short explanation of why nearby production helps the buyer.",
                  href: productionPostHref,
                },
                {
                  meta: isHr ? "Kupnja" : "Buying",
                  title: isHr ? "Kako postaviti bolji upit" : "How to ask a better question",
                  body: isHr
                    ? "KoliÄina, prostor i rok su vaÅ¾niji od dugog formulara."
                    : "Quantity, space, and timing matter more than a long form.",
                },
              ]}
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "blog"}
    />
  );
}
