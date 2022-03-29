/* eslint-disable @typescript-eslint/no-explicit-any */
import abiCoder from 'web3-eth-abi';
import { AbiInput, AbiItem, sha3, toBN } from 'web3-utils';

const typeToString = (input: AbiInput): string => {
  if (input.type === 'tuple') {
    if (!input.components) {
      throw new Error('Missing abi components for tuple type');
    }
    return `(${input.components.map(typeToString).join(',')})`;
  }
  return input.type;
};

export default class AbiDecoder {
  abi: AbiItem[];
  methodIDs: { [id: string]: AbiItem };

  constructor(abiArray: AbiItem[]) {
    const methodIDs = abiArray.reduce((res, abi) => {
      if (!abi.name || !abi.inputs) return res;
      const signature = sha3(
        `${abi.name}(${abi.inputs.map(typeToString).join(',')})`,
      );

      if (!signature) throw new Error('Invalid abi');

      const key =
        abi.type === 'event' ? signature.slice(2) : signature.slice(2, 10);

      // deep copy and freeze abi
      res[key] = Object.freeze(JSON.parse(JSON.stringify(abi)));

      return res;
    }, {} as { [id: string]: AbiItem });

    this.abi = Object.values(methodIDs);
    this.methodIDs = methodIDs;
  }

  decodeMethod(data: string) {
    const methodID = data.slice(2, 10);
    const abiItem = this.methodIDs[methodID];
    if (!abiItem) return undefined;
    const decoded = (abiCoder as any).decodeParameters(
      abiItem.inputs as any[],
      data.slice(10),
    );

    const retData: {
      name?: string;
      params: {
        name?: string;
        value: any;
        type?: string;
      }[];
    } = {
      name: abiItem.name,
      params: [],
    };

    for (let i = 0; i < decoded.__length__; i++) {
      const param = decoded[i];
      let parsedParam = param;
      const isUint = abiItem.inputs?.[i].type.startsWith('uint');
      const isInt = abiItem.inputs?.[i].type.startsWith('int');
      const isAddress = abiItem.inputs?.[i].type.startsWith('address');

      if (isUint || isInt) {
        const isArray = Array.isArray(param);

        if (isArray) {
          parsedParam = param.map((val) => toBN(val).toString());
        } else {
          parsedParam = toBN(param).toString();
        }
      }

      // Addresses returned by web3 are randomly cased so we need to standardize and lowercase all
      if (isAddress) {
        const isArray = Array.isArray(param);

        if (isArray) {
          parsedParam = param.map((_) => _.toLowerCase());
        } else {
          parsedParam = param.toLowerCase();
        }
      }

      retData.params.push({
        name: abiItem.inputs?.[i].name,
        value: parsedParam,
        type: abiItem.inputs?.[i].type,
      });
    }

    return retData;
  }

  decodeLogs(logs: { topics: string[]; data: string; address?: string }[]) {
    return logs
      .filter((log) => log.topics.length > 0)
      .map((logItem) => {
        const methodID = logItem.topics[0].slice(2);
        const method = this.methodIDs[methodID];
        if (!method || !method.inputs) return undefined;
        const dataTypes: any[] = method.inputs
          .map(function (input) {
            if (!input.indexed) {
              return input.type;
            }
          })
          .filter(Boolean);

        const decodedData = (abiCoder as any).decodeParameters(
          dataTypes,
          logItem.data.slice(2),
        );

        let dataIndex = 0;
        let topicsIndex = 1;

        // Loop topic and data to get the params
        const decodedParams = method.inputs.map(function (param) {
          const decodedP: { value?: any } & Pick<AbiInput, 'name' | 'type'> = {
            name: param.name,
            type: param.type,
          };

          if (param.indexed) {
            decodedP.value = logItem.topics[topicsIndex];
            topicsIndex++;
          } else {
            decodedP.value = decodedData[dataIndex];
            dataIndex++;
          }

          if (param.type === 'address') {
            decodedP.value = decodedP.value.toLowerCase();
            // 42 because len(0x) + 40
            if (decodedP.value.length > 42) {
              const toRemove = decodedP.value.length - 42;
              const temp = decodedP.value.split('');
              temp.splice(2, toRemove);
              decodedP.value = temp.join('');
            }
          }

          if (param.type.startsWith('uint') || param.type.startsWith('int')) {
            decodedP.value = toBN(decodedP.value).toString(10);
          }

          return decodedP;
        });

        return {
          name: method.name,
          events: decodedParams,
          address: logItem.address,
        };
      })
      .filter(Boolean);
  }
}
