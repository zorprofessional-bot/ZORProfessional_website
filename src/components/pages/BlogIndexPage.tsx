import { DeckPage } from "@/components/deck/DeckPage";
import {
  BlogCardsVisual,
  ImagePanel,
  SlideBody,
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

  return (
    <DeckPage
      activeKey="blog"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].blog}
      locale={locale}
      menuFlow
      slides={[
        {
          ...slides[0],
          body: (
            <SlideBody
              body={slides[0]?.body ?? copy[0].body}
              support={<BlogCardsVisual locale={locale} posts={posts.slice(0, 2)} />}
            />
          ),
          background: slides[0]?.background ?? "theme",
          layout: slides[0]?.layout ?? "split",
          primaryCta: slides[0]?.primaryCta ?? {
            label: isHr ? "Pogledaj proizvode" : "View products",
            href: routes[locale].products,
          },
          visual: (
            <ImagePanel
              alt={isHr ? "Kratki vodici prije upita" : "Short guides before inquiry"}
              src={slides[0]?.imageUrl ?? "/visuals/deck/blog-featured.png"}
            />
          ),
        },
        {
          ...slides[1],
          body: (
            <SlideBody
              body={slides[1]?.body ?? copy[1].body}
              support={<BlogCardsVisual locale={locale} posts={guideVisualPosts} />}
            />
          ),
          background: slides[1]?.background ?? "editorial",
          layout: slides[1]?.layout ?? "splitReverse",
          visual: (
            <ImagePanel
              alt={isHr ? "Jednostavno planiranje potrosnje" : "Simple consumption planning"}
              src={slides[1]?.imageUrl ?? "/visuals/deck/blog-guides.png"}
            />
          ),
        },
        {
          ...slides[2],
          body: slides[2]?.body ?? copy[2].body,
          background: slides[2]?.background ?? "light",
          layout: slides[2]?.layout ?? "split",
          visual: (
            <ImagePanel
              alt={isHr ? "Savjeti povezani s opskrbom" : "Advice connected to supply"}
              src={slides[2]?.imageUrl ?? "/visuals/deck/blog-advice.png"}
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "blog"}
    />
  );
}
