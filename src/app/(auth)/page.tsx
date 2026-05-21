"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/common/footer";

// ── Data ────────────────────────────────────────────────────────────────────

const services = [
  {
    title: "Integrated Ecosystem",
    description:
      "Providing farmers access to buyers, suppliers and the rest of the agricultural supply chain.",
    image: "/globeImage.jpg",
    alt: "Globe showing integrated ecosystem",
  },
  {
    title: "Smart Market Analytics",
    description:
      "Farmers have access to useful market analytics and insights based on their product sales.",
    image: "/market-analytics.jpg",
    alt: "Market analytics chart",
  },
  {
    title: "Expert Assistance",
    description:
      "Farmers are able to meet with agricultural experts through our platform.",
    image: "/consultingImage.jpg",
    alt: "Two experts in discussion",
  },
];

const missionItems = [
  {
    number: "01",
    title: "Accessibility",
    description:
      "We strive to provide to the agricultural sector an integrated community of farmers, buyers, suppliers, experts etc.",
  },
  {
    number: "02",
    title: "Transparency",
    description:
      "Our users have direct contact with their clients and have access to uninfluenced pricing.",
  },
  {
    number: "03",
    title: "Efficiency",
    description:
      "Processes and interactions on our platform are streamlined by our AI-chatbot assistants.",
  },
];



// ── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f2f0eb]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[560px]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-[url('/landscapeView.jpeg')] bg-cover bg-center"
          aria-hidden="true"
        />
        {/* Gradient overlay — darkens bottom-left for legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative flex h-full flex-col md:justify-end px-5 pb-7 md:pb-32 justify-center max-sm:items-center md:px-14 lg:px-24">
          <h1 className="mb-4 text-5xl font-bold font-alan leading-tight md:text-7xl lg:text-8xl text-green-50">
            Green Market
          </h1>
          <p className="mb-8 max-w-md text-xl font-alan leading-relaxed text-white/85 md:max-w-2xl md:text-base lg:text-2xl">
            Connect directly with Ghanaian farmers and producers for fresh,
            authentic, and traceable African farm products. Join our ecosystem
            bringing farmers, buyers, experts the whole agricultural chain on
            our integrated intelligent platform.
          </p>
          <Button
            asChild
            className="
              w-fit rounded-full
             bg-green-accent px-18 py-6
              text-sm font-semibold text-[#1a3d18]
              hover:bg-[#a3d099]
            "
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* ── Our Services ─────────────────────────────────────────────────── */}
      <section className="px-5 py-20 md:px-14 lg:px-24">
        <h2 className="mb-16 text-center text-4xl font-bold text-gray-900 md:text-5xl">
          Our Services
        </h2>

        <div className="flex flex-col gap-20">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`
                flex flex-col items-center gap-8
                md:flex-row md:items-center md:gap-12
                ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}
              `}
            >
              {/* Text */}
              <div className="w-full md:w-1/2">
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {service.title}
                </h3>
                <p className="mb-6 leading-relaxed text-gray-500">
                  {service.description}
                </p>
                <Button
                  variant="outline"
                  className="
                    rounded-full border-[#a8d5a0]
                    px-6 text-[#2d6b2a]
                    hover:bg-[#eaf5e6] hover:border-[#7cbb73]
                  "
                >
                  Learn More
                </Button>
              </div>

              {/* Image */}
              <div className="w-full overflow-hidden rounded-2xl md:w-5/12">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Mission ──────────────────────────────────────────────────── */}
      <section className="mx-4 my-6 rounded-3xl bg-[#dff0d6] px-6 py-16 md:mx-14 md:px-14 lg:mx-24">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 md:text-5xl">
          Our Mission
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {missionItems.map((item) => (
            <div
              key={item.number}
              className="rounded-2xl bg-[#cce8c2] p-6"
            >
              <p className="mb-5 text-sm text-gray-400">{item.number}</p>
              <h3 className="mb-3 font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About Project ────────────────────────────────────────────────── */}
      <section className="px-5 py-24 text-center md:px-14 lg:px-24">
        <h2 className="mb-8 text-4xl font-bold text-gray-900 md:text-5xl">
          About Project
        </h2>
        <p className="mx-auto max-w-2xl leading-relaxed text-gray-500">
          Green Market is a digital agricultural platform built to connect
          Ghanaian farmers directly with buyers, suppliers, and agricultural
          experts. Our mission is to make the entire farm-to-table supply chain
          transparent, efficient, and accessible through intelligent technology.
        </p>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Footer/>

    </main>
  );
}