import { Blockchain } from '@ton-community/sandbox';
import { Address, Cell, toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Counter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Counter');
    });

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const counter = blockchain.openContract(
            Counter.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
        });
    });

    it.only('should increase counter', async () => {
        const blockchain = await Blockchain.create();

        const counter = blockchain.openContract(
            Counter.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
        });

        const increaseTimes = 1;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await counter.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('increasing by', increaseBy);
            console.log('increaser: ', increaser.address);

            const increaseResult = await counter.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
                addr: increaser.address,
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: counter.address,
                success: true,
            });

            const counterAfter = await counter.getCounter();

            console.log('counter after increasing', counterAfter);

            const addr = await counter.getAddress();
            console.log('address: ', addr);


            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});
