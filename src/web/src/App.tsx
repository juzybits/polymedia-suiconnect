import { ConnectModal, SuiClientProvider, useCurrentAccount, useDisconnectWallet, useSignAndExecuteTransaction, useSignPersonalMessage, useSignTransaction, WalletProvider } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "./App.css";

type WalletChangeDetail = {
    address: string | null;
    signPersonalMessage: unknown;
    signAndExecuteTransaction: unknown;
    signTransaction: unknown;
    SuiClient: typeof SuiClient;
    Transaction: typeof Transaction;
};

const emitWalletChangeEvent = (detail: WalletChangeDetail) => {
    const event = new CustomEvent("suiconnect-wallet-change", { detail });
    console.debug("[suiconnect] wallet change:", detail.address);
    window.dispatchEvent(event);
};

export const WalletConnector = () =>
{
    const queryClient = new QueryClient();

    const networkConfig = {
        mainnet: { url: "https://fullnode.mainnet.sui.io/" }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} network="mainnet">
                <WalletProvider autoConnect={true}>
                    <App />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};

const App = () =>
{

    const currAcct = useCurrentAccount();
	const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
	const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const { mutateAsync: signTransaction } = useSignTransaction();
    const { mutate: disconnect } = useDisconnectWallet();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        emitWalletChangeEvent({
            address: currAcct?.address ?? null,
            signPersonalMessage,
            signAndExecuteTransaction,
            signTransaction,
            SuiClient,
            Transaction,
        });
    }, [currAcct]);

    return <div id="suiconnect">
        <ConnectModal
            trigger={<></>}
            open={isOpen}
            onOpenChange={setIsOpen}
        />
        {!currAcct &&
            <button className="btn connect" onClick={() => setIsOpen(true)}>
                CONNECT WALLET
            </button>
        }
        {currAcct &&
            <button className="btn disconnect" onClick={() => disconnect()}>
                DISCONNECT
            </button>
        }
    </div>;
};
