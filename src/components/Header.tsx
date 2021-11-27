export default function Header() {
  return (
    <div className="w-full max-w-3xl px-4 py-8">
      <h1 className="text-4xl font-bold">Smart Contract Interactor</h1>
      <p className="mt-2 text-lg text-gray-600">
        A simple smart contract interactor using metamask, inspired by
        etherscan.io contract interactor.
      </p>
      <nav className="flex mt-4 space-x-4">
        <a
          className="text-lg underline"
          href="https://github.com/adi-li/smart-contract-interactor"
        >
          GitHub
        </a>
      </nav>
    </div>
  );
}
