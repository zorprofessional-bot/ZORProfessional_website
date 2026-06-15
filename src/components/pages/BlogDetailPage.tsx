import { DeckPage } from "@/components/deck/DeckPage";
import {
  ArticleReader,
  BlogCardsVisual,
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
          layout: "center",
          primaryCta: {
            label: isHr ? "Svi Älanci" : "All articles",
            href: routes[locale].blog,
            variant: "secondary",
          },
        },
        {
          id: "reader",
          eyebrow: isHr ? "ÄŒlanak" : "Article",
          title: isHr
            ? "Reader panel se skrola, deck shell ostaje stabilan."
            : "The reader panel scrolls, the deck shell stays stable.",
          body: isHr
            ? "Ovo je jedina dopuÅ¡tena scroll iznimka na javnim prezentacijskim stranicama."
            : "This is the allowed scroll exception on public presentation pages.",
          background: "editorial",
          layout: "splitReverse",
          visual: (
            <ArticleReader
              body={post.body[locale]}
              date={post.date}
              locale={locale}
              postTitle={post.title[locale]}
            />
          ),
        },
        {
          id: "povezano",
          eyebrow: isHr ? "Povezano" : "Related",
          title: isHr ? "Nastavite kroz kratke vodiÄe." : "Continue through short guides.",
          body: isHr
            ? "Svaki tekst treba pomoÄ‡i kupcu postaviti bolji sljedeÄ‡i upit."
            : "Each post should help a buyer ask a better next question.",
          background: "light",
          layout: "split",
          visual: <BlogCardsVisual locale={locale} posts={related} />,
        },
      ]}
      theme={deckData?.chapter.theme ?? "blog"}
    />
  );
}
