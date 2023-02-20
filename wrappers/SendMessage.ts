import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type SendMessageConfig = {};

export function sendMessageConfigToCell(config: SendMessageConfig): Cell {
    return beginCell().endCell();
}

export class SendMessage implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SendMessage(address);
    }

    static createFromConfig(config: SendMessageConfig, code: Cell, workchain = 0) {
        const data = sendMessageConfigToCell(config);
        const init = { code, data };
        return new SendMessage(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }
}
