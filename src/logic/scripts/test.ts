import { Cell, toNano } from 'ton-core'
import { keyPairFromSeed, KeyPair, sha256 } from 'ton-crypto'
import { ClaimFunctions } from '../wrappers/MultiCheque'
import { OneTimeCheque } from '../wrappers/OneTimeCheque'


const oneBoc = 'b5ee9c72410106010055000114ff00f4a413f4bcf2c80b010201200302004ef2d31ff00101821079b0b258ba8e158308d71820f901f8414130f910f2e2bcf800f842d89130e20202d10504001f3b513434ffc07e18750c343b47be18a0000120ed5bde98';

async function start () {
    const passwordString = 'qwerty'
    const seed: Buffer = await sha256(passwordString)
    const keypair: KeyPair = keyPairFromSeed(seed)

    const amount = toNano('0.1')

    // const oneTimeCheque = provider.open(
    const data = OneTimeCheque.createFromConfig(
        {
            publicKey: keypair.publicKey,
            claimCont: ClaimFunctions.toncoin
        },
        Cell.fromBoc(Buffer.from(oneBoc, 'hex'))[0]
    )
    // )

    // await oneTimeCheque.sendDeploy(provider.sender(), amount)
    // console.log(cell)
    console.log(data)
}

start()
