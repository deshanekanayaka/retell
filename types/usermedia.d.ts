// Chrome 151's declarative <usermedia> element (docs/04-voice-and-evaluation.md
// section 1.1). Not yet in TypeScript's DOM lib, so declared here.
// https://developer.chrome.com/blog/usermedia-html-element

declare global {
  interface HTMLUserMediaElement extends HTMLElement {
    readonly stream: MediaStream | null;
    readonly error: DOMException | null;
    setConstraints(constraints: MediaStreamConstraints): void;
  }

  interface Window {
    HTMLUserMediaElement: {
      prototype: HTMLUserMediaElement;
      new (): HTMLUserMediaElement;
    };
  }
}

// React 19's JSX namespace lives on the "react" module, not the ambient
// global JSX namespace, so the intrinsic element has to be declared here.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      usermedia: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLUserMediaElement>,
        HTMLUserMediaElement
      >;
    }
  }
}

export {};
