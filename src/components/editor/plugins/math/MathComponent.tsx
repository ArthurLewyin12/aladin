import * as React from "react";
import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type MathComponentProps = {
  latex: string;
  inline: boolean;
  nodeKey: string;
};

export default function MathComponent({
  latex,
  inline,
  nodeKey,
}: MathComponentProps): React.ReactElement {
  const ref = useRef<HTMLSpanElement | HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          displayMode: !inline,
          throwOnError: false,
          errorColor: "#cc0000",
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        if (ref.current) {
          ref.current.textContent = `Error rendering math: ${latex}`;
        }
      }
    }
  }, [latex, inline]);

  return React.createElement(inline ? "span" : "div", {
    ref,
    className: "math-content",
    "data-node-key": nodeKey,
  });
}