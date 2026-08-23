import React, { useState } from 'react';
import PageLoader from '@/components/ipro/PageLoader';
import Header from '@/components/ipro/Header';
import NavOverlay from '@/components/ipro/NavOverlay';
import HeroSection from '@/components/ipro/HeroSection';
import AboutSection from '@/components/ipro/AboutSection';
import ServicesSection from '@/components/ipro/ServicesSection';
import SaaSSection from '@/components/ipro/SaaSSection';
import PortfolioSection from '@/components/ipro/PortfolioSection';
import StatsCounterSection from '@/components/ipro/StatsCounterSection';
import MasonryGallery from '@/components/ipro/MasonryGallery';
import NewsSection from '@/components/ipro/NewsSection';
import AuditForm from '@/components/ipro/AuditForm';
import Footer from '@/components/ipro/Footer';
import FloatingWhatsApp from '@/components/ipro/FloatingWhatsApp';

export default function Home() {
  const [ready, setReady] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ background: '#ffffff', fontFamily: "'Onest', sans-serif" }}
    >
      {!ready && <PageLoader onComplete={() => setReady(true)} />}

      <Header visible={ready} onMenuOpen={() => setNavOpen(true)} />
      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} />

      <main>
        <HeroSection ready={ready} />
        <AboutSection />
        <ServicesSection />
        <SaaSSection />
        <PortfolioSection />
        <StatsCounterSection />
        <MasonryGallery />
        <NewsSection />
        <AuditForm />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}