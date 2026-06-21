import { DeckPage } from "@/components/deck/DeckPage";
import { BlogCardsVisual, SlideBody } from "@/components/deck/DeckVisuals";
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
  const featured = resolveDeckSlideContent(deckData, copy[0]);
  const guides = resolveDeckSlideContent(deckData, copy[1], ["vodici", "guides"]);

  return (
    <DeckPage
      activeKey="blog"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].blog}
      locale={locale}
      menuFlow
      slides={[
        {
          ...featured,
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Blog ne glumi magazin — **kratki vodiči** pomažu prije upita."
                  : "The blog isn't a magazine — **short guides** help before an inquiry."
              }
              support={<BlogCardsVisual locale={locale} posts={posts.slice(0, 3)} />}
            />
          ),
          primaryCta: featured.primaryCta ?? {
            label: isHr ? "Pogledaj proizvode" : "View products",
            href: routes[locale].products,
          },
          hideVisualOnMobile: true,
          image: {
            src: featured.imageUrl ?? "/visuals/deck/blog-featured.webp",
            alt: isHr ? "Kratki vodiči prije upita" : "Short guides before inquiry",
            priority: true,
          },
        },
        {
          ...guides,
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Najbolji tekstovi vode prema **jasnijoj količini** i **boljem pitanju**."
                  : "The best posts lead to a **clearer quantity** and a **better question**."
              }
              points={[
                {
                  title: isHr ? "Planiranje potrošnje" : "Planning consumption",
                  body: isHr ? "Koliko papira **stvarno** treba mjesečno." : "How much paper you **actually** need monthly.",
                },
                {
                  title: isHr ? "Lokalna proizvodnja" : "Local production",
                  body: isHr ? "Zašto je **blizina** važna za dostupnost." : "Why **proximity** matters for availability.",
                },
              ]}
            />
          ),
          layout: "splitReverse",
          image: {
            src: guides.imageUrl ?? "/visuals/deck/blog-guides.webp",
            alt: isHr ? "Jednostavno planiranje potrošnje" : "Simple consumption planning",
          },
        },
      ]}
      theme={deckData?.chapter.theme ?? "blog"}
    />
  );
}
