import React from 'react';

interface NavbarProps {
  name: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
}

const Navbar: React.FC<NavbarProps> = ({ name, githubUrl, linkedinUrl, resumeUrl }) => {
  return (
    <nav className="bg-neutral-800/50 p-4 text-neutral-100 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">{name}</div>
        <div className="space-x-4">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
            GitHub
          </a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
            LinkedIn
          </a>
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
            Resume
          </a>
        </div>
      </div>
      {/* Glow effect: achieved with a pseudo-element or an extra div with a gradient/shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-sky-500/50 via-sky-500/20 to-transparent opacity-70 blur-sm"></div>
    </nav>
  );
};

export default Navbar; 