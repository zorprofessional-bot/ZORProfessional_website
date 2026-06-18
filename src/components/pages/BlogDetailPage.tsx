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
          background: "theme",
          layout: "split",
          primaryCta: {
            label: isHr ? "Svi clanci" : "All articles",
            href: routes[locale].blog,
            variant: "secondary",
          },
          visual: (
            <ImagePanel
              alt={isHr ? "Prakticni vodic prije upita" : "Practical guide before inquiry"}
              src="/visuals/deck/blog-featured.png"
            />
          ),
        },
        {
          id: "reader",
          eyebrow: isHr ? "Clanak" : "Article",
          title: isHr
            ? "Reader panel se skrola, deck shell ostaje stabilan."
            : "The reader panel scrolls, the deck shell stays stable.",
          body: (
            <SlideBody
              body={
                isHr
                  ? "Ovo je jedina dopustena scroll iznimka na javnim prezentacijskim stranicama."
                  : "This is the allowed scroll exception on public presentation pages."
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
          background: "editorial",
          layout: "splitReverse",
          visual: (
            <ImagePanel
              alt={isHr ? "Jednostavno citanje prakticnog vodica" : "Simple practical guide reading"}
              src="/visuals/deck/blog-guides.png"
            />
          ),
        },
        {
          id: "povezano",
          eyebrow: isHr ? "Povezano" : "Related",
          title: isHr ? "Nastavite kroz kratke vodice." : "Continue through short guides.",
          body: (
            <SlideBody
              body={
                isHr
                  ? "Svaki tekst treba pomoci kupcu postaviti bolji sljedeci upit."
                  : "Each post should help a buyer ask a better next question."
              }
              support={<BlogCardsVisual locale={locale} posts={related} />}
            />
          ),
          background: "light",
          layout: "split",
          visual: (
            <ImagePanel
              alt={isHr ? "Povezani vodici za opskrbu" : "Related supply guides"}
              src="/visuals/deck/blog-advice.png"
            />
          ),
        },
      ]}
      theme={deckData?.chapter.theme ?? "blog"}
    />
  );
}
