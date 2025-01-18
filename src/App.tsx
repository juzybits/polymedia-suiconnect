import { ConnectModal, SuiClientProvider, useCurrentAccount, useDisconnectWallet, useSuiClient, WalletProvider } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClient } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "./App.less";

type WalletChangeDetail = {
    client: SuiClient;
    address: string | null;
};

const emitWalletChangeEvent = (client: SuiClient, address: string | null) => {
    const detail: WalletChangeDetail = { client, address };
    const event = new CustomEvent("suiconnect-wallet-change", { detail });
    console.debug("[suiconnect] wallet changed:", detail);
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
                <WalletProvider autoConnect={false}>
                    <App />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};

const App = () =>
{
    const currAcct = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
    const suiClient = useSuiClient();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        emitWalletChangeEvent(suiClient, currAcct?.address ?? null);
    }, [currAcct, suiClient]);

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
