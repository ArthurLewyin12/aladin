import React, { useEffect, useRef } from "react";

// Types
interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Composant qui rend automatiquement les formules LaTeX dans un texte
 * Utilise KaTeX pour le rendu des mathématiques
 */
export function MathText({ text, className = "" }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMath = async () => {
      if (!containerRef.current) return;

      try {
        const katex = (await import("katex")).default;
        const container = containerRef.current;
        let processedHTML = text;

        // 1. Remplacer les blocs mathématiques \[ ... \] (affichage centré)
        processedHTML = processedHTML.replace(
          /\\\[([\s\S]*?)\\\]/g,
          (_, formula) => {
            try {
              return `<div class="math-block-display">${katex.renderToString(
                formula.trim(),
                {
                  displayMode: true,
                  throwOnError: false,
                },
              )}</div>`;
            } catch (e) {
              return `<div class="math-error">Erreur: ${formula}</div>`;
            }
          },
        );

        // 2. Remplacer \frac{a}{b} par des fractions inline plus grandes
        processedHTML = processedHTML.replace(
          /\\frac\{([^}]+)\}\{([^}]+)\}/g,
          (match, num, den) => {
            try {
              return `<span class="math-inline-fraction">${katex.renderToString(
                `\\dfrac{${num}}{${den}}`,
                {
                  displayMode: false,
                  throwOnError: false,
                },
              )}</span>`;
            } catch (e) {
              return match;
            }
          },
        );

        // 3. Remplacer les formules inline \( ... \)
        processedHTML = processedHTML.replace(
          /\\\(([^)]+)\\\)/g,
          (_, formula) => {
            try {
              return `<span class="math-inline">${katex.renderToString(
                formula,
                {
                  displayMode: false,
                  throwOnError: false,
                },
              )}</span>`;
            } catch (e) {
              return formula;
            }
          },
        );

        // Ne pas remplacer les \n par <br /> pour éviter les sauts de ligne non désirés
        container.innerHTML = processedHTML;
      } catch (error) {
        console.error("Erreur lors du rendu LaTeX:", error);
        if (containerRef.current) {
          containerRef.current.textContent = text;
        }
      }
    };

    renderMath();
  }, [text]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
        integrity="sha512-fHwaWebuwA7NSF5Qg/af4UeDx9XqUpYpOGgubo3yWu+b2IQR4UeQwbb42Ti7gVAjNtVoI/I9TEoYeu9omvcC6g=="
        crossOrigin="anonymous"
      />
      <div ref={containerRef} className={`math-text ${className}`} />
      <style jsx>{`
        .math-text {
          line-height: 2;
        }

        /* Blocs mathématiques centrés */
        .math-text :global(.math-block-display) {
          margin: 2rem 0;
          text-align: center;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border-left: 4px solid #f97316;
        }

        /* Fractions inline - PLUS GRANDES */
        .math-text :global(.math-inline-fraction) {
          display: inline-block;
          vertical-align: middle;
          margin: 0 0.2rem;
          font-size: 1.4em;
          line-height: 0;
        }

        /* Autres formules inline */
        .math-text :global(.math-inline) {
          display: inline-block;
          vertical-align: middle;
          margin: 0 0.1rem;
        }

        /* Styles généraux pour KaTeX */
        .math-text :global(.katex) {
          font-size: 1.15em;
        }

        .math-text :global(.katex-display) {
          margin: 0;
          font-size: 1.3em;
        }

        /* Améliorer l'espacement des fractions */
        .math-text :global(.katex .frac-line) {
          border-bottom-width: 0.08em;
        }

        .math-text :global(.katex .mfrac) {
          vertical-align: middle;
        }

        /* Gestion des erreurs */
        .math-text :global(.math-error) {
          color: #ef4444;
          background: #fee2e2;
          padding: 0.5rem;
          border-radius: 0.25rem;
          font-family: monospace;
          display: block;
          margin: 1rem 0;
        }
      `}</style>
    </>
  );
}
