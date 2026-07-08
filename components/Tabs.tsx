import Octicon from "./Octicon";
import { ITEMS } from "@/content/items";

export default function Tabs() {
  return (
    <nav className="gh-tabs" aria-label="Profile">
      <a className="tab active" href="/" aria-current="page">
        <Octicon name="book" size={16} />
        Overview
      </a>
      <a className="tab" href="/#grid">
        <Octicon name="repo" size={16} />
        Repositories <span className="counter">{ITEMS.length}</span>
      </a>
      <a className="tab" href="/#grid">
        <Octicon name="project" size={16} />
        Projects
      </a>
      <a className="tab" href="/#grid">
        <Octicon name="package" size={16} />
        Packages
      </a>
      <a className="tab" href="/#grid">
        <Octicon name="star" size={16} />
        Stars
      </a>
    </nav>
  );
}
