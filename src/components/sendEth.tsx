import { BrowserProvider, Contract, parseEther } from "ethers";
import { useState } from "react";
import { TransactionResponse } from "ethers";
import { contractABI } from "../contracts/contractData";

const SendEth = ({
  paused,
  contractAddr,
  walletProvider,
  fetchContractData,
}: {
  paused: boolean;
  contractAddr: string;
  walletProvider: any;
  fetchContractData: () => Promise<void>;
}) => {
  const [payTuition, setPayTuition] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const handleTransfer = async () => {
    setIsLoading(true);
    try {
      if (payTuition === null || payTuition <= 0) {
        alert("No Value");
        setIsLoading(false);
        return;
      }

      const etherProvider = new BrowserProvider(walletProvider);
      const signer = await etherProvider.getSigner();
      const contract = new Contract(contractAddr, contractABI, signer);

      const tx: TransactionResponse = await contract.payTuition({
        value: parseEther(String(payTuition)),
      });
      await tx.wait();
      const getPaymentStatus = await contract.getPaymentStatus();
      setPaymentStatus(String(getPaymentStatus()));
      fetchContractData();
    } catch (error) {
      console.error("Error sending transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayTuition(Number(e.target.value));
  };

  return (
    <div>
      <div className="flex items-center">
        {!isLoading && !paused && paymentStatus === "0" && (
          <>
            <input
              type="number"
              onChange={onInput}
              placeholder="Enter amount in ETH"
              className="border border-gray-500 rounded-lg px-4 py-2 w-[60%] text-lg bg-gray-700 text-white mr-[20px]"
            />
            <button
              className="bg-blue-500 text-white py-[11px] w-[40%] px-8 rounded-lg shadow-md hover:bg-green-500 transition-transform transform hover:scale-105"
              onClick={handleTransfer}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : `Send ${payTuition !== null ? payTuition : "0"}`}
            </button>
          </>
        )}
        {paused && <span className="text-red-500">Contract Paused</span>}
      </div>
    </div>
  );
};

export default SendEth;
