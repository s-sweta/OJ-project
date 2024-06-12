import React, { useEffect } from 'react';
import '../CSS/home.css';
import banner from '../assets/coding2.jpg';

export default function Home() {
  useEffect(() => {
    const content = document.querySelector('.home-content');
    const textElements = [...content.querySelectorAll('h2, p')];

    textElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      const characters = text.split('');
      characters.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = 0;
        element.appendChild(span);
      });

      element.classList.add('typing');
    });

    let charIndex = 0;
    function revealNextCharacter() {
      const spans = content.querySelectorAll('span');
      if (charIndex < spans.length) {
        spans[charIndex].style.opacity = 1;
        charIndex++;
        setTimeout(revealNextCharacter, 50);
      }
    }
    revealNextCharacter();
  }, []);

  return (
    <div>
      <div class="rolling-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-ban-fill rolling-icon" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M2.71 12.584q.328.378.706.707l9.875-9.875a7 7 0 0 0-.707-.707l-9.875 9.875Z"/>
            </svg>
          </div>
      <div className="home-container">
      

      <div className="home-left">
      
        <header className="home-header">
          <h1 className="home-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
              <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/>
            </svg>
            CodeArena
          </h1>
        </header>
        
        <section className="home-content">
          <h2>Welcome to CodeArena !</h2>
          <p>
            CodeArena is a platform where you can test your coding skills with various challenges.
            Compete with others, improve your problem-solving abilities, and become a coding master.
          </p>
        </section>
      </div>
      <img src={banner} alt="Banner" className="home-banner" />
    </div>
    </div>
    
    
  );
}
