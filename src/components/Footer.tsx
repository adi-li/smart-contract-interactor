import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex items-center justify-center w-full h-24 border-t">
      Created by&nbsp;
      <Link href="https://github.com/adi-li">
        <a
          className="underline hover:no-underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          Adi Li
        </a>
      </Link>
    </footer>
  );
}
