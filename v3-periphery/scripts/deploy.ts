import { ethers } from 'hardhat'

const config = {
  uniswapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  WETH9: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  nativeCurrencyLabel: ethers.utils.formatBytes32String('ETH'),
}

async function main() {
  const multicall2Factory = await ethers.getContractFactory('Multicall2')
  const multicall2 = await multicall2Factory.deploy()
  await multicall2.deployed()
  console.log('Multicall2 deployed to:', multicall2.address)

  const swapRouterFactory = await ethers.getContractFactory('SwapRouter')
  const swapRouter = await swapRouterFactory.deploy(config.uniswapFactory, config.WETH9)
  await swapRouter.deployed()
  console.log('SwapRouter deployed to:', swapRouter.address)

  const nftDescriptorFactory = await ethers.getContractFactory('NFTDescriptor')
  const nftDescriptor = await nftDescriptorFactory.deploy()
  await nftDescriptor.deployed()
  console.log('NFTDescriptor deployed to:', nftDescriptor.address)

  const nonfungibleTokenPositionDescriptorFactory = await ethers.getContractFactory(
    'NonfungibleTokenPositionDescriptor',
    {
      libraries: {
        NFTDescriptor: nftDescriptor.address,
      },
    }
  )
  const nonfungibleTokenPositionDescriptor = await nonfungibleTokenPositionDescriptorFactory.deploy(
    config.WETH9,
    config.nativeCurrencyLabel
  )
  await nonfungibleTokenPositionDescriptor.deployed()
  console.log('NonfungibleTokenPositionDescriptor deployed to:', nonfungibleTokenPositionDescriptor.address)

  const nonfungiblePositonManagerFactory = await ethers.getContractFactory('NonfungiblePositionManager')
  const nonfungiblePositionManager = await nonfungiblePositonManagerFactory.deploy(
    config.uniswapFactory,
    config.WETH9,
    nonfungibleTokenPositionDescriptor.address
  )
  await nonfungiblePositionManager.deployed()
  console.log('NonfungiblePositionManager deployed to:', nonfungiblePositionManager.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})