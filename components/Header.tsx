import Octicon from "./Octicon";
import Avatar from "./Avatar";

export default function Header() {
  return (
    <header className="gh-header">
      <button className="hamburger" aria-label="Open menu">
        <Octicon name="bars" size={16} />
      </button>
      <Avatar size={32} />
      <span className="handle">mehek-builds</span>
      <div className="right">
        <div className="search">
          <Octicon name="search" size={14} />
          <span>
            Type <span className="key">/</span> to search
          </span>
        </div>
        <Octicon name="plus" className="icon" />
        <Octicon name="issue" className="icon" />
        <Octicon name="pr" className="icon" />
        <Octicon name="inbox" className="icon" />
        <Avatar size={28} />
      </div>
    </header>
  );
}
