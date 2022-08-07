import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between py-8 px-4">
        <nav className="mt-4 flex space-x-4">
          <a
            className="text-lg underline hover:no-underline"
            href="https://github.com/adi-li/smart-contract-interactor"
          >
            GitHub
          </a>
        </nav>
        <div>
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
        </div>
      </div>
    </footer>
  );
}
