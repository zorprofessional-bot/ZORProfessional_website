import { DeckPage } from "@/components/deck/DeckPage";
import {
  ArticleReader,
  BlogCardsVisual,
} from "@/components/deck/DeckVisuals";
import type { BlogPost } from "@/content/blog";
import { getPosts } from "@/content/blog";
import { chapterLabels } from "@/content/deck";
import { getLanguageHrefs, routes, type Locale } from "@/content/site";

type BlogDetailPageProps = {
  locale: Locale;
  post: BlogPost;
};

export function BlogDetailPage({ locale, post }: BlogDetailPageProps) {
  const isHr = locale === "hr";
  const relatedPosts = getPosts(locale).filter((item) => item.id !== post.id).slice(0, 2);

  return (
    <DeckPage
      activeKey="blog"
      chapterLabel={chapterLabels[locale].blog}
      languageHrefs={getLanguageHrefs("blog", post.slugs)}
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
            label: isHr ? "Svi članci" : "All articles",
            href: routes[locale].blog,
            variant: "secondary",
          },
        },
        {
          id: "reader",
          eyebrow: isHr ? "Članak" : "Article",
          title: isHr ? "Reader panel se skrola, deck shell ostaje stabilan." : "The reader panel scrolls, the deck shell stays stable.",
          body: isHr
            ? "Ovo je jedina dopuštena scroll iznimka na javnim prezentacijskim stranicama."
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
          title: isHr ? "Nastavite kroz kratke vodiče." : "Continue through short guides.",
          body: isHr
            ? "Svaki tekst treba pomoći kupcu postaviti bolji sljedeći upit."
            : "Each post should help a buyer ask a better next question.",
          background: "light",
          layout: "split",
          visual: <BlogCardsVisual locale={locale} posts={relatedPosts} />,
        },
      ]}
      theme="blog"
    />
  );
}
