import { toNano } from 'ton-core';
import { Basics } from '../wrappers/Basics';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const basics = Basics.createFromConfig({}, await compile('Basics'));

    await provider.deploy(basics, toNano('0.05'));

    const openedContract = provider.open(basics);

    // run methods on `openedContract`
}
