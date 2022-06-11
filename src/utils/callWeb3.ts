import { TransactionRequest, Web3Provider } from '@ethersproject/providers';
import { FunctionFragment } from 'ethers/lib/utils';

export default function callWeb3(
  web3: Web3Provider,
  abiItem: FunctionFragment,
  txn: TransactionRequest,
) {
  return abiItem.constant
    ? web3.call(txn)
    : web3
        .getSigner()
        .sendTransaction(txn)
        .then((resp) => resp.wait());
}
