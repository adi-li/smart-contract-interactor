import useWeb3 from '@/hooks/useWeb3';
import SavedContract from '@/models/SavedContract';
import bnReplacer from '@/utils/bnReplacer';
import toChecksumAddress from '@/utils/toChecksumAddress';
import { FormEventHandler, useState } from 'react';
import Input from './Input';
import Textarea from './Textarea';

export default function TransactionDecoder({
  savedContract,
  savedContracts,
}: {
  savedContract: SavedContract;
  savedContracts: SavedContract[];
}) {
  const { web3 } = useWeb3();
  const [txnId, setTxnId] = useState('');
  const [calldata, setCalldata] = useState('');
  const [events, setEvents] = useState('');

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!txnId) return;

    web3
      ?.getTransaction(txnId)
      .then((txn) => {
        if (txn.to && toChecksumAddress(txn.to) !== savedContract.address) {
          throw new Error('Contract is not the transaction recipient.');
        }

        const decoded = savedContract.abi.parseTransaction({
          data: txn.data,
          value: txn.value,
        });

        if (!decoded) {
          throw new Error('Cannot decode transaction logs.');
        }
        setCalldata(JSON.stringify(decoded, bnReplacer, 2));
      })
      .catch((err) =>
        setCalldata(err instanceof Error ? err.message : (err as string)),
      );

    web3
      ?.getTransactionReceipt(txnId)
      .then((txn) => {
        if (toChecksumAddress(txn.to) !== savedContract.address) {
          throw new Error('Contract is not the transaction recipient.');
        }

        const decoded = txn.logs.map((log) => {
          const logAddress = log.address && toChecksumAddress(log.address);
          if (!logAddress) return { log };
          const contract = savedContracts.find(
            ({ address }) => address === logAddress,
          );
          if (!contract) return { log };
          return {
            log: contract.abi.parseLog({ data: log.data, topics: log.topics }),
            contract: contract.name,
          };
        });
        setEvents(JSON.stringify(decoded, bnReplacer, 2));
      })
      .catch((err) => setEvents(err as string));
  };

  return (
    <>
      <form className="mb-4 w-full" onSubmit={onSubmit}>
        <div className="">
          <Input
            required
            title="Transaction Hash"
            helpText="Starts with 0x"
            type="text"
            name="address"
            pattern="^0x[a-fA-F0-9]+$"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
          />
          <div className="text-right">
            <button
              type="submit"
              className="py-2 px-3 hover:bg-indigo-100 rounded-md border"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <hr />
      <Textarea
        disabled
        title="Decoded calldata"
        wrapperClassName="w-full mt-4"
        className="min-h-[12rem]"
        value={calldata}
      />
      <Textarea
        disabled
        title="Decoded events"
        wrapperClassName="w-full mt-4"
        className="min-h-[12rem]"
        value={events}
      />
    </>
  );
}
