
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div className="container my-8 text-center">
          <Link to="/login">
            <Button size="lg" className="mx-2">Login to Your Account</Button>
          </Link>
        </div>
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
