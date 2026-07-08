import Octicon from "./Octicon";
import Avatar from "./Avatar";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Avatar size={296} className="avatar" />
      <h1>Mehek Mandal</h1>
      <div className="handle">mehek-builds</div>
      <p className="bio">
        Founder. I ship a product a week and write about it. CS + Business @
        USC, Trustee Scholar. Dubai / Los Angeles.
      </p>
      <a className="cta" href="mailto:mehekman@usc.edu">
        Get in touch
      </a>
      <div className="meta">
        <span>
          <Octicon name="location" size={16} />
          Dubai / Los Angeles
        </span>
        <a href="https://github.com/mehek-builds">
          <Octicon name="link" size={16} />
          github.com/mehek-builds
        </a>
        <a href="https://x.com/MehekBuilds">
          <Octicon name="link" size={16} />
          x.com/MehekBuilds
        </a>
        <a href="https://linkedin.com/in/mehekmandal">
          <Octicon name="people" size={16} />
          linkedin.com/in/mehekmandal
        </a>
        <a href="mailto:mehekman@usc.edu">
          <Octicon name="mail" size={16} />
          mehekman@usc.edu
        </a>
      </div>
      <div className="section">
        <h2>Achievements</h2>
        <div className="badges">
          <div
            className="badge"
            style={{ background: "#2d1e6b" }}
            title="Trustee Scholar: full-tuition merit scholarship, top 1% of USC class"
          >
            <svg viewBox="0 0 16 16" width="28" height="28" fill="#a5a3ff" aria-hidden="true">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
          </div>
          <div
            className="badge"
            style={{ background: "#0b3a2e" }}
            title="57 countries visited"
          >
            <svg viewBox="0 0 16 16" width="28" height="28" fill="#56d4a0" aria-hidden="true">
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.24.365.353.552.714 1.192 1.436 2.874 1.58 4.948Z" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}
