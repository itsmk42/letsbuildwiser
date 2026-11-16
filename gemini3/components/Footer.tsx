import Link from "next/link";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <div>
          <Link className="logo" href="/">
            Letsbuild<span className="gold">wiser</span>
          </Link>
          <p className="foot__tag">Building the future, step by step.</p>
        </div>
        <nav className="foot__nav" aria-label="Footer">
          <Link className="lnk" href="/">
            Home
          </Link>
          <Link className="lnk" href="/contact">
            Contact
          </Link>
          <span>&copy; {new Date().getFullYear()} Letsbuildwiser.</span>
        </nav>
      </div>
    </footer>
  );
}
