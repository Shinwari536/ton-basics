import { toNano } from 'ton-core';
import { SendMessage } from '../wrappers/SendMessage';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const sendMessage = SendMessage.createFromConfig({}, await compile('SendMessage'));

    await provider.deploy(sendMessage, toNano('0.05'));

    const openedContract = provider.open(sendMessage);

    // run methods on `openedContract`
}
