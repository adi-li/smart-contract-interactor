import useChainName from '@/hooks/useChainName';
import useWeb3 from '@/hooks/useWeb3';
import SavedContract from '@/models/SavedContract';
import { Interface } from 'ethers/lib/utils';
import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Input from './Input';
import Textarea from './Textarea';

export interface NewContractFormProps {
  onSubmit: (address: string, abi: Interface) => void;
  defaultContract?: SavedContract | null;
}

export default function NewContractForm({
  onSubmit,
  defaultContract,
}: NewContractFormProps) {
  const { web3, chainId } = useWeb3();
  const chainName = useChainName(chainId);
  const [address, setAddress] = useState<string>('');
  const [abiString, setAbiString] = useState<string>('');

  const wrappedOnSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!web3) return;
      if (!address) {
        window.alert('Invalid address');
        return;
      }
      if (!abiString) {
        window.alert('Invalid ABI json');
        return;
      }
      let abi: Interface;
      try {
        abi = new Interface(abiString);
      } catch (error) {
        window.alert('Invalid ABI json');
        return;
      }
      onSubmit(address, abi);
    },
    [abiString, address, onSubmit, web3],
  );

  const handleAddress: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setAddress(e.target.value),
    [],
  );

  const handleAbi: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => setAbiString(e.target.value),
    [],
  );

  useEffect(() => {
    if (!defaultContract) return;
    const formattedAbi = defaultContract.getFormattedAbi();
    setAddress(defaultContract.address);
    setAbiString(
      JSON.stringify(
        typeof formattedAbi === 'string'
          ? JSON.parse(formattedAbi)
          : formattedAbi,
        null,
        2,
      ),
    );
  }, [defaultContract]);

  return (
    <form className="w-full" onSubmit={wrappedOnSubmit}>
      <h3 className="mb-2 text-xl font-bold">New Contract</h3>
      <div className="grid grid-cols-2 gap-6">
        <Input
          title="Current Chain Id"
          helpText="Change it via MetaMask plugin"
          type="text"
          disabled
          value={chainName}
        />
        <Input
          required
          title="Contract Address"
          helpText="Starts with 0x"
          type="text"
          name="address"
          pattern="^0x[a-fA-F0-9]{40}$"
          value={address}
          onChange={handleAddress}
        />
        <Textarea
          required
          title="ABI JSON"
          name="abi"
          helpText="Paste ABI JSON array above"
          wrapperClassName="col-span-full"
          value={abiString}
          onChange={handleAbi}
        />
        <div className="col-span-full text-right">
          <button className="py-2 px-3 hover:bg-indigo-100 rounded-md border">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
