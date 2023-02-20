import { Address, beginCell, BitReader, BitString, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Slice } from 'ton-core';

export type BasicsConfig = {};

export function basicsConfigToCell(config: BasicsConfig): Cell {
    return beginCell().endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef
}

export class Basics implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Basics(address);
    }

    static createFromConfig(config: BasicsConfig, code: Cell, workchain = 0) {
        const data = basicsConfigToCell(config);
        const init = { code, data };
        return new Basics(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            value: bigint;
            inscreasedBy: number;
            queryID?: number;
            addr: Address
        }
    ){
        provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell()
            .storeUint(Opcodes.increase, 32)
            .storeAddress(opts.addr)
            .endCell()
        });
    }
}
