import { FormatTypes, Interface } from 'ethers/lib/utils';

export default class SavedContract {
  readonly name: string;
  readonly lastUpdatedAt: number;
  readonly address: string;
  readonly abi: Interface;

  constructor({
    name,
    lastUpdatedAt,
    address,
    abi,
  }: {
    name?: string;
    lastUpdatedAt?: number;
    address: string;
    abi: Interface | ConstructorParameters<typeof Interface>[0];
  }) {
    this.name = name || address;
    this.lastUpdatedAt = lastUpdatedAt == null ? Date.now() : lastUpdatedAt;
    this.address = address;
    this.abi = abi instanceof Interface ? abi : new Interface(abi);
  }

  toJSON() {
    return {
      name: this.name,
      lastUpdatedAt: this.lastUpdatedAt,
      address: this.address,
      abi: this.abi.format(FormatTypes.full),
    };
  }

  toString() {
    return JSON.stringify(this);
  }

  update({
    name,
    address,
    abi,
  }: {
    name?: string;
    address: string;
    abi: Interface | ConstructorParameters<typeof Interface>[0];
  }) {
    if (name === this.name && address === this.address && abi === this.abi) {
      return this;
    }
    return new SavedContract({
      name: name || this.name || address,
      address,
      abi,
      lastUpdatedAt: Date.now(),
    });
  }

  getFormattedAbi(format = FormatTypes.full) {
    return this.abi.format(format);
  }
}
