import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, useState, useEffect } from 'react'
import styles from '../styles/PingButton.module.css'
import { BalanceDisplay } from './BalanceDisplay';

const PROGRAM_ID = `ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa`
const DATA_ACCOUNT_PUBKEY = `Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod`

export const PingButton: FC = () => {
	const [balance, setBalance] = useState(0);
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();

	useEffect(() => {
        if (!connection || !publicKey) { return }

        connection.getAccountInfo(publicKey).then(info => {
            setBalance(info.lamports);
        })

    }, [connection, publicKey])
	
	console.log(publicKey);
	console.log(connection);
	const onClick = () => {
		if (!connection || !publicKey) { return }

		const programId = new web3.PublicKey(PROGRAM_ID)
		const programDataAccount = new web3.PublicKey(DATA_ACCOUNT_PUBKEY)
		const transaction = new web3.Transaction()

		const instruction = new web3.TransactionInstruction({
			keys: [
				{
					pubkey: programDataAccount,
					isSigner: false,
					isWritable: true
				},
			],
			programId
		});

		transaction.add(instruction)
		sendTransaction(transaction, connection).then(sig => {
			console.log(`Explorer URL: https://explorer.solana.com/tx/${sig}?cluster=devnet`)
		})

	}
	const price = 1;

	return (
		<div className={styles.buttonContainer} onClick={onClick}>
			<label htmlFor="boton">{price} Sol</label>
			{balance / LAMPORTS_PER_SOL >= price 
			? <button name="boton" className={styles.button}>Comprar!</button>
			: <button name="boton" className={styles.button} disabled>Lo siento</button>}
			<BalanceDisplay/>
		</div>
	)
}