const { assert } = require("chai");

const DeFaToken = artifacts.require('DeFaToken');

contract('DeFaToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.defa = await DeFaToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.defa.mint(alice, 1000, { from: minter });
        assert.equal((await this.defa.balanceOf(alice)).toString(), '1000');
    })
});
