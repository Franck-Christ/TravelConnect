import React from 'react';
import Layout from '../components/Layout/Layout';
import HeroSection from '../components/Home/HeroSection';
import PopularRoutes from '../components/Home/PopularRoutes';
import Features from '../components/Home/Features';
import Testimonials from '../components/Home/Testimonials';
import DownloadApp from '../components/Home/DownloadApp';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <PopularRoutes />
      <Features />
      <Testimonials />
      <DownloadApp />
    </Layout>
  );
};

export default HomePage;