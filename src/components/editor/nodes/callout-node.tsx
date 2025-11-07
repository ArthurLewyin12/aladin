import { $applyNodeReplacement, DecoratorNode, LexicalNode } from "lexical";
import * as React from "react";

export type CalloutType = "info" | "warning" | "success" | "note";

export type SerializedCalloutNode = {
  type: "callout";
  calloutType: CalloutType;
  version: number;
};

export class CalloutNode extends DecoratorNode<React.ReactNode> {
  __calloutType: CalloutType;

  static getType(): string {
    return "callout";
  }

  static clone(node: CalloutNode): CalloutNode {
    return new CalloutNode(node.__calloutType, node.__key);
  }

  constructor(calloutType: CalloutType = "info", key?: string) {
    super(key);
    this.__calloutType = calloutType;
  }

  static importJSON(serializedNode: SerializedCalloutNode): CalloutNode {
    const node = $createCalloutNode(serializedNode.calloutType);
    return node;
  }

  exportJSON(): SerializedCalloutNode {
    return {
      type: "callout",
      calloutType: this.__calloutType,
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const element = document.createElement("div");
    element.className = `callout callout-${this.__calloutType}`;
    element.style.borderLeft = "4px solid";
    element.style.padding = "1rem";
    element.style.margin = "1rem 0";
    element.style.borderRadius = "0.375rem";
    element.style.backgroundColor = this.getBackgroundColor();
    element.style.borderLeftColor = this.getBorderColor();
    return element;
  }

  updateDOM(): false {
    return false;
  }

  getCalloutType(): CalloutType {
    return this.__calloutType;
  }

  setCalloutType(calloutType: CalloutType): void {
    (this as any).__calloutType = calloutType;
  }

  private getBackgroundColor(): string {
    switch (this.__calloutType) {
      case "info": return "#eff6ff";
      case "warning": return "#fffbeb";
      case "success": return "#f0fdf4";
      case "note": return "#f8fafc";
      default: return "#f8fafc";
    }
  }

  private getBorderColor(): string {
    switch (this.__calloutType) {
      case "info": return "#3b82f6";
      case "warning": return "#f59e0b";
      case "success": return "#10b981";
      case "note": return "#64748b";
      default: return "#64748b";
    }
  }

  decorate(): React.ReactNode {
    return (
      <div
        className={`callout callout-${this.__calloutType} p-4 my-4 rounded-md border-l-4`}
        style={{
          backgroundColor: this.getBackgroundColor(),
          borderLeftColor: this.getBorderColor(),
        }}
      >
        <div className="text-sm font-medium mb-2 capitalize">
          {this.__calloutType === "note" ? "📝 Note" :
           this.__calloutType === "info" ? "ℹ️ Information" :
           this.__calloutType === "warning" ? "⚠️ Attention" :
           "✅ Important"}
        </div>
        <div className="text-sm">
          {/* Le contenu sera ajouté ici par l'utilisateur */}
        </div>
      </div>
    );
  }
}

export function $createCalloutNode(calloutType: CalloutType = "info"): CalloutNode {
  const node = new CalloutNode(calloutType);
  return $applyNodeReplacement(node);
}

export function $isCalloutNode(node: LexicalNode | null | undefined): node is CalloutNode {
  return node instanceof CalloutNode;
}