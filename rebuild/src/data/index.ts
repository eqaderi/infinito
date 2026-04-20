/**
 * Page copy for the home page (`/`). Centralizes all editable strings,
 * asset paths, and structured collections (portfolio, team, pricing, etc.)
 * so a buyer can rebrand the demo by editing a single file.
 *
 * Each block matches the props of the matching component in
 * `src/components/sections/`.
 */

import type { FeaturedItem } from "../components/sections/Featured.astro";
import type { ServiceItem } from "../components/sections/Services.astro";
import type { PortfolioItem } from "../components/sections/Portfolio.astro";
import type { ProcessStep } from "../components/sections/ProcessCarousel.astro";
import type { TeamMember } from "../components/sections/TeamGrid.astro";
import type { Stat } from "../components/sections/CtaStrip.astro";
import type { BlogPost } from "../components/sections/BlogPreview.astro";
import type { PricingPlan } from "../components/sections/Pricing.astro";
import type { Quote } from "../components/sections/Testimonials.astro";
import type { ClientLogo } from "../components/sections/LogoCloud.astro";

export const meta = {
  title: "Infinito — modern creative agency & portfolio template",
  description:
    "Infinito is a modern, animation-rich Astro template for creative agencies, designers, and portfolios.",
  brand: "infinito",
};

export const hero = {
  title: "Denouement.",
  subtitle: "The resolution of a mystery",
  background: "/img/backgrounds/hero.jpg",
  scrollTarget: "#about",
};

export const about = {
  eyebrow: "Est. 2018",
  title: "Infinito; The ultimate theme",
  body: "We design award-winning, functional, and beautiful web sites. Our designers craft a User Experience with web sites that are both technically compliant and aesthetically perfect.",
  ctaLabel: "see our works",
  ctaHref: "#portfolio",
};

export const featured: FeaturedItem[] = [
  {
    number: "01",
    title: "Modern Approach",
    subtitle: "used latest technology",
    body: "Aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.",
    image: "/img/featured/featured-1.jpg",
    imageAlt: "Modern approach",
  },
  {
    number: "02",
    title: "Flexible Design",
    subtitle: "infinite available options",
    body: "Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image: "/img/featured/featured-2.jpg",
    imageAlt: "Flexible design",
  },
  {
    number: "03",
    title: "Quality Design",
    subtitle: "High standard coding",
    body: "Voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/img/featured/featured-3.jpg",
    imageAlt: "Quality design",
  },
];

export const services: ServiceItem[] = [
  {
    title: "Web Applications",
    body: "From a business catalog to an administrative system.",
    icon: "web",
  },
  {
    title: "Ecommerce",
    body: "A refined shopping experience that gets you an optimal conversion rate.",
    icon: "cart",
  },
  {
    title: "Websites",
    body: "From an educational platform to an enterprise level website.",
    icon: "site",
  },
  {
    title: "Consultancy",
    body: "Advice on user experience and other web related subjects.",
    icon: "consult",
  },
  {
    title: "Branding",
    body: "Memorable, distinct identities that scale across every channel.",
    icon: "brand",
  },
];

export const videoStrip = {
  background: "/img/backgrounds/parallax-strip.jpg",
  videoHref: "https://vimeo.com/40234826",
  caption: "watch our awesome story 2019.",
};

export const portfolio: PortfolioItem[] = [
  {
    title: "red sky",
    subtitle: "we fought hard for this one",
    image: "/img/portfolio/red-sky.jpg",
    span: "md",
    categories: ["print", "photography"],
  },
  {
    title: "silver nail",
    subtitle: "check this one out!",
    image: "/img/portfolio/silver-nail.jpg",
    span: "sm",
    categories: ["branding", "print"],
  },
  {
    title: "golden tail",
    subtitle: "a little project done right",
    image: "/img/portfolio/golden-tail.jpg",
    span: "lg",
    categories: ["branding", "photography"],
  },
  {
    title: "death rose",
    subtitle: "absolutely gorgeous",
    image: "/img/portfolio/death-rose.jpg",
    span: "xl",
    categories: ["print", "photography"],
  },
  {
    title: "shining star",
    subtitle: "the state of art",
    image: "/img/portfolio/shining-star.gif",
    span: "lg",
    categories: ["branding", "photography"],
  },
];

export const process: ProcessStep[] = [
  {
    label: "1997: Est.",
    position: 0,
    body: "Quam impedit nisi aliquid veritatis praesentium nesciunt a quia cupiditate repellat doloribus.",
    bodyRight:
      "Sed minima eius earum qui, corrupti. Maiores amet digni nisi autem quia ipsum non sint enim pariatur porro sunt totam nobis.",
  },
  {
    label: "2001: growing",
    position: 0.18,
    body: "Quam impedit nisi aliquid veritatis praesentium nesciunt a quia cupiditate repellat doloribus.",
    bodyRight:
      "Sed minima eius earum qui, corrupti. Maiores amet digni nisi autem quia ipsum non sint enim pariatur porro sunt totam nobis.",
  },
  {
    label: "2006: reputation",
    position: 0.53,
    body: "Quam impedit nisi aliquid veritatis praesentium nesciunt a quia cupiditate repellat doloribus.",
    bodyRight:
      "Sed minima eius earum qui, corrupti. Maiores amet digni nisi autem quia ipsum non sint enim pariatur porro sunt totam nobis.",
  },
  {
    label: "2018: success",
    position: 1,
    body: "Quam impedit nisi aliquid veritatis praesentium nesciunt a quia cupiditate repellat doloribus.",
    bodyRight:
      "Sed minima eius earum qui, corrupti. Maiores amet digni nisi autem quia ipsum non sint enim pariatur porro sunt totam nobis.",
  },
];

export const team: TeamMember[] = [
  {
    name: "John Conley",
    role: "Front-end Developer",
    image: "/img/team/john.jpg",
  },
  {
    name: "Rebeca Jones",
    role: "President + Creative Director",
    image: "/img/team/rebeca.jpg",
  },
  {
    name: "Stephen Dorff",
    role: "Project Manager",
    image: "/img/team/stephen.jpg",
  },
];

export const stats: Stat[] = [
  { value: 999999, label: "lines of code", display: "~1 Million+" },
  { value: 9235, label: "users" },
  { value: 53, label: "apps" },
];

export const blog: BlogPost[] = [
  {
    title: "Graphic Romance",
    date: "September 17, 2016",
    author: "Joe Biden",
    category: "Lifestyle",
    authorImage: "/img/blog/author-01.jpg",
    excerpt:
      "It's a great way to kick off Preen's 20th year in business; the couple met aged 18 while studying on the Isle of Man.",
  },
  {
    title: "Tacos & Paint",
    date: "July 17, 2016",
    author: "Linda Jobs",
    category: "Technology",
    authorImage: "/img/blog/author-02.jpg",
    excerpt:
      "Why do we love tacos so? No reason really except that they are easy to make, come in a unique shape that you can dress up colorfully.",
  },
  {
    title: "We've moved into our new office.",
    date: "December 28, 2015",
    author: "Tony Montana",
    category: "News",
    authorImage: "/img/blog/author-03.jpg",
    excerpt:
      "We have now moved into our brand new office in Tamworth at Relay Point. We are located at the roundabout just off junction 10.",
  },
];

export const pricing: PricingPlan[] = [
  {
    name: "Individuals",
    description: "Single user license",
    monthlyPrice: 29,
    yearlyPrice: 299,
    features: ["256MB Memory", "Free Hosting", "Unlimited Bandwidth"],
  },
  {
    name: "Small Team",
    description: "Up to 5 users",
    monthlyPrice: 89,
    yearlyPrice: 899,
    features: [
      "512MB Memory",
      "Free Hosting",
      "Unlimited Bandwidth",
      "Small Social media package",
    ],
    featured: true,
  },
  {
    name: "Organization",
    description: "Unlimited users",
    monthlyPrice: 469,
    yearlyPrice: 4599,
    features: [
      "Unlimited Memory",
      "Free Hosting",
      "Unlimited Bandwidth",
      "Full Social media package",
      "Analytics Integration",
    ],
  },
];

export const testimonials: Quote[] = [
  {
    quote:
      "Balanced between ease of use and power features to hire effectively, it provides a great applicant experience.",
    author: "Justin Ronaldo",
    role: "Talent Unit",
  },
  {
    quote:
      "Everyone I've worked with, from my account manager to technical support, has proven they really care about my success.",
    author: "James Mattis",
    role: "US Marines",
  },
  {
    quote:
      "Infinito has given us a simple way to reach tons of job seekers and a quick process to filter through them for the best candidates.",
    author: "Tess Brighton",
    role: "Clomedia Group Inc.",
  },
];

export const logos: ClientLogo[][] = [
  [
    { src: "/img/clients/logo-1.png", alt: "Client 1" },
    { src: "/img/clients/logo-14.png", alt: "Client 14" },
    { src: "/img/clients/logo-13.png", alt: "Client 13" },
    { src: "/img/clients/logo-8.png", alt: "Client 8" },
    { src: "/img/clients/logo-15.png", alt: "Client 15" },
  ],
  [
    { src: "/img/clients/logo-6.png", alt: "Client 6" },
    { src: "/img/clients/logo-16.png", alt: "Client 16" },
    { src: "/img/clients/logo-4.png", alt: "Client 4" },
    { src: "/img/clients/logo-17.png", alt: "Client 17" },
    { src: "/img/clients/logo-10.png", alt: "Client 10" },
  ],
];

export const contact = {
  eyebrow: "contact us",
  title: "write us / visit us",
  body: "The work is as important as the pleasure we get from doing it. When people who love creating, learning and growing get together, forming a team with ties that transcend the workplace.",
  info: {
    text: {
      label: "text us",
      primary: [
        { text: "hello@infinito.com", href: "mailto:hello@infinito.com" },
        { text: "join@infinito.com", href: "mailto:join@infinito.com" },
      ],
    },
    call: {
      label: "call us",
      primary: [{ text: "Tel: +44 775 988 988", href: "tel:+44775988988" }],
    },
    visit: {
      label: "visit us",
      primary: [{ text: "6 Greswell St," }, { text: "London SW6 6PP, UK" }],
      mapHref:
        "https://www.google.co.uk/maps/place/6+Greswell+St,+Fulham,+London+SW6+6PP",
    },
  },
  mapAddress: "6 Greswell St, Fulham, London SW6 6PP",
};
