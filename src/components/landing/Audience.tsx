"use client";

import Link from "next/link";
import { Building2, GraduationCap, HeartHandshake, Home, LucideIcon } from "lucide-react";
import { type CSSProperties, useState } from "react";

type AudienceCard = {
    title: string;
    description: string;
    cta: string;
    href: string;
    accent: string;
    icon: LucideIcon;
};

const audienceCards: AudienceCard[] = [
    {
        title: "Households",
        description:
            "Families with recovered patients can responsibly share unexpired medicines instead of letting them go to waste.",
        cta: "Join MediShare",
        href: "/register",
        accent: "#10b981",
        icon: Home,
    },
    {
        title: "Students & Seniors",
        description:
            "People managing tight budgets can discover nearby essentials without losing time searching across multiple places.",
        cta: "Create Account",
        href: "/register",
        accent: "#60a5fa",
        icon: GraduationCap,
    },
    {
        title: "Emergency Seekers",
        description:
            "When pharmacies are closed or help is urgent, members can quickly check what is available nearby and request support.",
        cta: "Sign In",
        href: "/login",
        accent: "#f59e0b",
        icon: HeartHandshake,
    },
    {
        title: "Clinics & NGOs",
        description:
            "Community groups and healthcare organizers can coordinate local medicine availability and reduce unnecessary disposal.",
        cta: "Partner Up",
        href: "/register",
        accent: "#a78bfa",
        icon: Building2,
    },
];

export default function Audience() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="fluid-stack-section" id="mission" data-motion="reveal">
            <div className="fs-container">
                <div className="fs-header">
                    <div className="fs-kicker">Who Is MediShare For?</div>
                    <h2>Built for the people most likely to need local medicine access.</h2>
                    <p>
                        This section now uses an interactive fluid card stack so visitors can explore each audience segment
                        without leaving the landing page.
                    </p>
                </div>

                <div
                    className="fs-accordion"
                    role="list"
                    aria-label="MediShare audience groups"
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    {audienceCards.map((card, index) => {
                        const Icon = card.icon;
                        const isActive = activeIndex === index;

                        return (
                            <article
                                key={card.title}
                                className="fs-card"
                                data-active={isActive}
                                role="listitem"
                                tabIndex={0}
                                style={{ "--fs-accent": card.accent } as CSSProperties}
                                onMouseEnter={() => setActiveIndex(index)}
                                onFocus={() => setActiveIndex(index)}
                                onClick={() => setActiveIndex((current) => (current === index ? null : index))}
                            >
                                <div className="fs-card-inner">
                                    <div className="fs-icon-box" style={{ backgroundColor: card.accent }}>
                                        <Icon className="fs-icon" strokeWidth={2.1} />
                                    </div>

                                    <h3 className="fs-title">{card.title}</h3>

                                    <div className="fs-details">
                                        <p>{card.description}</p>
                                        <Link href={card.href} className="fs-button">
                                            {card.cta}
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .fluid-stack-section {
                    padding: 72px 0 96px;
                    width: 100%;
                    position: relative;
                    z-index: 10;
                }

                .fs-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 16px;
                }

                .fs-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .fs-kicker {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 14px;
                    border-radius: 999px;
                    border: 1px solid rgba(16, 185, 129, 0.14);
                    background: rgba(255, 255, 255, 0.7);
                    color: rgb(5, 150, 105);
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    margin-bottom: 16px;
                }

                .fs-header h2 {
                    margin: 0;
                    font-size: clamp(2rem, 4vw, 3rem);
                    line-height: 1.08;
                    font-weight: 600;
                    color: rgb(17, 24, 39);
                }

                .fs-header p {
                    margin: 16px auto 0;
                    max-width: 720px;
                    font-size: clamp(1rem, 2vw, 1.125rem);
                    line-height: 1.75;
                    color: rgba(75, 85, 99, 0.92);
                }

                .fs-accordion {
                    display: flex;
                    flex-direction: row;
                    min-height: 420px;
                    height: 420px;
                    gap: 16px;
                    width: 100%;
                }

                .fs-card {
                    flex: 1;
                    background:
                        radial-gradient(circle at top right, color-mix(in srgb, var(--fs-accent) 14%, transparent), transparent 38%),
                        linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(245, 249, 247, 0.82) 100%);
                    border-radius: 20px;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    transition: flex 0.8s cubic-bezier(0.22, 1, 0.36, 1);
                    border: 1px solid rgba(255, 255, 255, 0.72);
                    box-shadow:
                        0 18px 45px rgba(15, 23, 42, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.65);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    outline: none;
                }

                .fs-card[data-active="true"] {
                    flex: 5;
                    box-shadow:
                        0 24px 55px rgba(15, 23, 42, 0.12),
                        0 0 0 1px color-mix(in srgb, var(--fs-accent) 22%, rgba(255, 255, 255, 0.82));
                }

                .fs-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .fs-icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition:
                        width 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                        height 0.7s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .fs-card[data-active="true"] .fs-icon-box {
                    width: 64px;
                    height: 64px;
                }

                .fs-icon {
                    width: 24px;
                    height: 24px;
                    color: rgb(255, 255, 255);
                    transition:
                        width 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                        height 0.7s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .fs-card[data-active="true"] .fs-icon {
                    width: 32px;
                    height: 32px;
                }

                .fs-title {
                    margin: 0;
                    font-weight: 500;
                    color: rgb(17, 24, 39);
                    white-space: normal;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: calc(100% - 8px);
                    font-size: 1.05rem;
                    line-height: 1.2;
                    transform-origin: bottom left;
                    transition:
                        font-size 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                        bottom 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                        width 0.7s cubic-bezier(0.22, 1, 0.36, 1);
                    z-index: 2;
                }

                .fs-card[data-active="true"] .fs-title {
                    font-size: 1.8rem;
                    bottom: 132px;
                    width: min(320px, 100%);
                }

                .fs-details {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 420px;
                    max-width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    opacity: 0;
                    transform: translateY(12px);
                    pointer-events: none;
                    transition:
                        opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                        transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .fs-card[data-active="true"] .fs-details {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                    transition:
                        opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.25s,
                        transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
                }

                .fs-details p {
                    color: rgba(75, 85, 99, 0.92);
                    font-size: 0.95rem;
                    line-height: 1.7;
                    margin: 0;
                }

                .fs-button {
                    background-color: rgb(17, 24, 39);
                    color: rgb(255, 255, 255);
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-weight: 500;
                    font-size: 0.95rem;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: max-content;
                    transition: background-color 0.25s, color 0.25s, transform 0.25s;
                }

                .fs-button:hover {
                    background-color: color-mix(in srgb, var(--fs-accent) 88%, black 12%);
                    color: rgb(255, 255, 255);
                    transform: translateY(-1px);
                }

                @media (max-width: 768px) {
                    .fluid-stack-section {
                        padding: 64px 0 80px;
                    }

                    .fs-container {
                        padding: 0 16px;
                    }

                    .fs-header {
                        margin-bottom: 24px;
                    }

                    .fs-accordion {
                        flex-direction: column;
                        height: auto;
                        min-height: 540px;
                    }

                    .fs-card {
                        min-height: 88px;
                        padding: 20px;
                    }

                    .fs-card[data-active="true"] {
                        min-height: 260px;
                    }

                    .fs-card[data-active="true"] .fs-title {
                        font-size: 1.6rem;
                        bottom: 144px;
                        width: 100%;
                    }

                    .fs-details {
                        width: 100%;
                    }

                    .fs-button {
                        width: 100%;
                    }
                }
            `}</style>
        </section>
    );
}
