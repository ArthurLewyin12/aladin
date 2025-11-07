import { $applyNodeReplacement, DecoratorNode, LexicalNode } from "lexical";
import * as React from "react";
import { Suspense } from "react";

const MathComponent = React.lazy(() => import("../plugins/math/MathComponent"));

export type SerializedMathNode = {
  latex: string;
  inline: boolean;
  type: "math";
  version: number;
};

export class MathNode extends DecoratorNode<React.ReactNode> {
  __latex: string;
  __inline: boolean;

  static getType(): string {
    return "math";
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__latex, node.__inline, node.__key);
  }

  constructor(latex: string, inline: boolean = false, key?: string) {
    super(key);
    this.__latex = latex;
    this.__inline = inline;
  }

  static importJSON(serializedNode: SerializedMathNode): MathNode {
    const node = $createMathNode(serializedNode.latex, serializedNode.inline);
    return node;
  }

  exportJSON(): SerializedMathNode {
    return {
      latex: this.__latex,
      inline: this.__inline,
      type: "math",
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const element = document.createElement(this.__inline ? "span" : "div");
    element.style.display = this.__inline ? "inline-block" : "block";

    if (!this.__inline) {
      element.style.textAlign = "center";
      element.style.margin = "1em 0";
    }

    return element;
  }

  updateDOM(): false {
    return false;
  }

  getLatex(): string {
    return this.__latex;
  }

  setLatex(latex: string): void {
    (this as any).__latex = latex;
  }

  isInline(): boolean {
    return this.__inline;
  }

  setInline(inline: boolean): void {
    (this as any).__inline = inline;
  }

  decorate(): React.ReactNode {
    return (
      <Suspense fallback={null}>
        <MathComponent
          latex={this.__latex}
          inline={this.__inline}
          nodeKey={this.__key}
        />
      </Suspense>
    );
  }
}

export function $createMathNode(latex: string, inline: boolean = false): MathNode {
  const node = new MathNode(latex, inline);
  return $applyNodeReplacement(node);
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
  return node instanceof MathNode;
}