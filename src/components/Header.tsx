import Link from 'next/link';

export default function Header() {
  return (
    <div className="w-full max-w-3xl py-8 px-4">
      <h1 className="text-4xl font-bold">Ethereum Contract Read/Write</h1>
      <p className="mt-2 text-gray-600">
        A simple smart contract interactor using metamask, inspired by{' '}
        <Link href="etherscan.io">
          <a
            className="underline hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            etherscan.io
          </a>
        </Link>{' '}
        contract read/write section.
      </p>
    </div>
  );
}
