import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Navigation from '../components/Navigation';

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black">
      <Navigation />
      <Hero />
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto w-3/4" />
      <About />
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto w-3/4" />
      <Skills />
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto w-3/4" />
      <Projects />
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto w-3/4" />
      <Experience />
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto w-3/4" />
      <Contact />
    </main>
  );
}
