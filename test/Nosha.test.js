const { advanceBlockTo } = require('@openzeppelin/test-helpers/src/time');
const { assert } = require('chai');
const DeFaToken = artifacts.require('DeFaToken');
const Nosha = artifacts.require('Nosha');

contract('Nosha', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.defa = await DeFaToken.new({ from: minter });
    this.nosha = await Nosha.new(this.defa.address, { from: minter });
  });

  it('mint', async () => {
    await this.nosha.mint(alice, 1000, { from: minter });
    assert.equal((await this.nosha.balanceOf(alice)).toString(), '1000');
  });

  it('burn', async () => {
    await advanceBlockTo('650');
    await this.nosha.mint(alice, 1000, { from: minter });
    await this.nosha.mint(bob, 1000, { from: minter });
    assert.equal((await this.nosha.totalSupply()).toString(), '2000');
    await this.nosha.burn(alice, 200, { from: minter });

    assert.equal((await this.nosha.balanceOf(alice)).toString(), '800');
    assert.equal((await this.nosha.totalSupply()).toString(), '1800');
  });

  it('safeDeFaTransfer', async () => {
    assert.equal(
      (await this.defa.balanceOf(this.nosha.address)).toString(),
      '0'
    );
    await this.defa.mint(this.nosha.address, 1000, { from: minter });
    await this.nosha.safeDeFaTransfer(bob, 200, { from: minter });
    assert.equal((await this.defa.balanceOf(bob)).toString(), '200');
    assert.equal(
      (await this.defa.balanceOf(this.nosha.address)).toString(),
      '800'
    );
    await this.nosha.safeDeFaTransfer(bob, 2000, { from: minter });
    assert.equal((await this.defa.balanceOf(bob)).toString(), '1000');
  });
});
