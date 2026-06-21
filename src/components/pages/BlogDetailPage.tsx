import { DeckPage } from "@/components/deck/DeckPage";
import {
  ArticleReader,
  BlogCardsVisual,
  ImagePanel,
  SlideBody,
} from "@/components/deck/DeckVisuals";
import type { BlogPost } from "@/content/blog";
import { getPosts } from "@/content/blog";
import { chapterLabels } from "@/content/deck";
import { getLanguageHrefs, routes, type Locale } from "@/content/site";
import type { DeckPageData } from "@/lib/data/deck";

type BlogDetailPageProps = {
  deckData?: DeckPageData;
  languageHrefs?: Record<Locale, string>;
  locale: Locale;
  post: BlogPost;
  relatedPosts?: Array<BlogPost & { href: string }>;
};

export function BlogDetailPage({
  deckData,
  languageHrefs,
  locale,
  post,
  relatedPosts,
}: BlogDetailPageProps) {
  const isHr = locale === "hr";
  const related =
    relatedPosts ??
    getPosts(locale)
      .filter((item) => item.id !== post.id)
      .slice(0, 2);

  return (
    <DeckPage
      activeKey="blog"
      chapterLabel={deckData?.chapter.label ?? chapterLabels[locale].blog}
      languageHrefs={languageHrefs ?? getLanguageHrefs("blog", post.slugs)}
      locale={locale}
      slides={[
        {
          id: "uvod",
          eyebrow: post.eyebrow[locale],
          title: post.title[locale],
          body: post.excerpt[locale],
          primaryCta: {
            label: isHr ? "Svi članci" : "All articles",
            href: routes[locale].blog,
            variant: "secondary",
          },
          image: {
            src: "/visuals/deck/blog-featured.webp",
            alt: isHr ? "Praktični vodič prije upita" : "Practical guide before inquiry",
            priority: true,
          },
        },
        {
          id: "reader",
          eyebrow: isHr ? "Članak" : "Article",
          title: isHr ? "Cijeli članak na jednom mjestu." : "The full article in one place.",
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Tekst je u panelu koji se skrola — ostatak stranice **miruje**."
                  : "The text sits in a panel that scrolls — the rest of the page **stays still**."
              }
              support={
                <ArticleReader
                  body={post.body[locale]}
                  date={post.date}
                  locale={locale}
                  postTitle={post.title[locale]}
                />
              }
            />
          ),
          layout: "splitReverse",
          hideVisualOnMobile: true,
          visual: (
            <ImagePanel
              alt={isHr ? "Jednostavno čitanje praktičnog vodiča" : "Simple practical guide reading"}
              src="/visuals/deck/blog-guides.webp"
            />
          ),
        },
        {
          id: "povezano",
          eyebrow: isHr ? "Povezano" : "Related",
          title: isHr ? "Nastavite kroz kratke vodiče." : "Continue through short guides.",
          body: (
            <SlideBody
              lead={
                isHr
                  ? "Svaki tekst pomaže postaviti **bolji sljedeći upit**."
                  : "Each post helps you ask a **better next question**."
              }
              support={<BlogCardsVisual locale={locale} posts={related} />}
            />
          ),
          hideVisualOnMobile: true,
          visual: (
            <ImagePanel
              alt={isHr ? "Povezani vodiči za opskrbu" : "Related supply guides"}
              src="/visuals/deck/blog-advice.webp"
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "blog"}
    />
  );
}
