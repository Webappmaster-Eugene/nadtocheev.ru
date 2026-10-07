import { personal } from "../data/personal.ts";
import { BUILD_DATE } from "../data/build-date.ts";
import { getServices } from "../data/services.ts";
import { getStartups } from "../data/projects.ts";
import { getExpertise } from "../data/skills.ts";
import { servicePath, serviceSlugs, type ServiceSlug } from "../data/service-pages.ts";
import type { FaqItem } from "../data/faq.ts";
import { t, type Lang } from "../i18n/translations.ts";

export function structuredData({ lang, title, description, path, image, faq, serviceSlug }: {
  lang: Lang; title: string; description: string; path: string;
  image: string; faq: FaqItem[]; serviceSlug?: ServiceSlug;
}) {
  const site = personal.website;
  const pageURL = new URL(path, site).href;
  const home = new URL(lang === "en" ? "/en/" : "/", site).href;
  const personID = `${site}/#person`;
  const services = getServices(lang).items.map((service, i) => ({
    "@type": "Service",
    "@id": `${site}/#service-${service.icon === "consult" ? "consultation" : "mock"}`,
    name: service.name,
    description: service.description,
    url: new URL(servicePath(serviceSlugs[i], lang), site).href,
    provider: { "@id": personID },
    serviceType: service.name,
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      price: service.price.replace(/\D/g, ""), priceCurrency: "RUB",
      url: new URL(servicePath(serviceSlugs[i], lang), site).href,
      eligibleDuration: { "@type": "QuantitativeValue", value: Number(service.duration.match(/^\d+/)?.[0]), unitCode: "HUR" },
    },
  }));
  const currentService = serviceSlug ? services[serviceSlugs.indexOf(serviceSlug)] : undefined;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person", "@id": personID,
        name: personal.name.full[lang],
        alternateName: personal.name.full[lang === "ru" ? "en" : "ru"],
        givenName: personal.name.first[lang], familyName: personal.name.last[lang],
        url: home, description: t(lang).meta.description,
        jobTitle: lang === "ru" ? "Fullstack-разработчик и ментор" : "Fullstack Developer and Mentor",
        email: `mailto:${personal.email}`, telephone: personal.phone,
        sameAs: [personal.github, personal.habr, personal.telegram, personal.leetcode,
          personal.codewars, personal.mentoring.solvery, personal.mentoring.getmentor, personal.freelance.vsesdal],
        knowsAbout: [...new Set(getExpertise(lang).flatMap(category => category.skills))],
        knowsLanguage: ["Russian", "English"],
        worksFor: { "@type": "Organization", name: "bnmap.pro", url: "https://bnmap.pro" },
        address: { "@type": "PostalAddress", addressLocality: lang === "ru" ? "Москва" : "Moscow", addressCountry: "RU" },
      },
      {
        "@type": "WebSite", "@id": `${site}/#website`,
        url: `${site}/`, name: personal.name.full[lang],
        alternateName: personal.name.full[lang === "ru" ? "en" : "ru"],
        inLanguage: ["ru", "en"], publisher: { "@id": personID },
      },
      {
        "@type": serviceSlug ? "WebPage" : "ProfilePage", "@id": pageURL,
        url: pageURL, name: title, description, inLanguage: lang,
        dateModified: BUILD_DATE.toISOString(),
        isPartOf: { "@id": `${site}/#website` },
        mainEntity: { "@id": currentService?.["@id"] ?? personID },
        about: { "@id": personID },
        primaryImageOfPage: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
      },
      ...(currentService ? [{
        "@type": "BreadcrumbList", "@id": `${pageURL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: lang === "ru" ? "Главная" : "Home", item: home },
          { "@type": "ListItem", position: 2, name: currentService.name, item: pageURL },
        ],
      }] : []),
      {
        "@type": "FAQPage", "@id": `${pageURL}#faq`,
        mainEntity: faq.map(item => ({ "@type": "Question", name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a } })),
      },
      ...(currentService ? [currentService] : services),
      ...(!serviceSlug ? getStartups(lang).map(startup => ({
        "@type": "CreativeWork", "@id": startup.url,
        name: startup.name, url: startup.url, description: startup.description,
        creator: { "@id": personID },
      })) : []),
    ],
  };
}
