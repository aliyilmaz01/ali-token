import { tokens, ether, ETHER_ADDRESS, EVM_REVERT, wait } from './helpers'

const aliToken = artifacts.require('./aliToken')
const DecentralizedBank = artifacts.require('./dBank')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('dBank', ([deployer, user]) => {
  let dbank, aToken
  const interestPerSecond = 31668017 //(10% APY) for min. deposit (0.01 ETH)

  beforeEach(async () => {
    aToken = await aliToken.new()
    dbank = await DecentralizedBank.new(aToken.address)
    await aToken.passMinterRole(dbank.address, {from: deployer})
  })

  describe('testing token contract...', () => {
    describe('success', () => {
      it('checking token name', async () => {
        expect(await aToken.name()).to.be.eq('Decentralized Bank Currency')
      })

      it('checking token symbol', async () => {
        expect(await aToken.symbol()).to.be.eq('DBC')
      })

      it('checking token initial total supply', async () => {
        expect(Number(await aToken.totalSupply())).to.eq(0)
      })

      it('dBank should have Token minter role', async () => {
        expect(await aToken.minter()).to.eq(dbank.address)
      })
    })

    describe('failure', () => {
      it('passing minter role should be rejected', async () => {
        await aToken.passMinterRole(user, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
      })

      it('tokens minting should be rejected', async () => {
        await aToken.mint(user, '1', {from: deployer}).should.be.rejectedWith(EVM_REVERT) //unauthorized minter
      })
    })
  })

  describe('testing deposit...', () => {
    let balance

    describe('success', () => {
      beforeEach(async () => {
        await dbank.deposit({value: 10**16, from: user}) //0.01 ETH
      })

      it('balance should increase', async () => {
        expect(Number(await dbank.etherBalanceOf(user))).to.eq(10**16)
      })

      it('deposit time should > 0', async () => {
        expect(Number(await dbank.depositStart(user))).to.be.above(0)
      })

      it('deposit status should eq true', async () => {
        expect(await dbank.isDeposited(user)).to.eq(true)
      })
    })

    describe('failure', () => {
      it('depositing should be rejected', async () => {
        await dbank.deposit({value: 10**15, from: user}).should.be.rejectedWith(EVM_REVERT) //to small amount
      })
    })
  })

  describe('testing withdraw...', () => {
    let balance

    describe('success', () => {

      beforeEach(async () => {
        await dbank.deposit({value: 10**16, from: user}) //0.01 ETH

        await wait(2) //accruing interest

        balance = await web3.eth.getBalance(user)
        await dbank.withdraw({from: user})
      })

      it('balances should decrease', async () => {
        expect(Number(await web3.eth.getBalance(dbank.address))).to.eq(0)
        expect(Number(await dbank.etherBalanceOf(user))).to.eq(0)
      })

      it('user should receive ether back', async () => {
        expect(Number(await web3.eth.getBalance(user))).to.be.above(Number(balance))
      })

      it('user should receive proper amount of interest', async () => {
        //time synchronization problem make us check the 1-3s range for 2s deposit time
        balance = Number(await aToken.balanceOf(user))
        expect(balance).to.be.above(0)
        expect(balance%interestPerSecond).to.eq(0)
        expect(balance).to.be.below(interestPerSecond*4)
      })

      it('depositer data should be reseted', async () => {
        expect(Number(await dbank.depositStart(user))).to.eq(0)
        expect(Number(await dbank.etherBalanceOf(user))).to.eq(0)
        expect(await dbank.isDeposited(user)).to.eq(false)
      })
    })

    describe('failure', () => {
      it('withdrawing should be rejected', async () =>{
        await dbank.deposit({value: 10**16, from: user}) //0.01 ETH
        await wait(2) //accruing interest
        await dbank.withdraw({from: deployer}).should.be.rejectedWith(EVM_REVERT) //wrong user
      })
    })
  })
})