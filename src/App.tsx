import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { contractAddr, contractABI } from "./contracts/contractData";
import { BrowserProvider, formatEther, Contract, parseEther } from "ethers";
import { useEffect, useState } from "react";
import { TransactionResponse } from "ethers";
import Header from "./components/header";
import TransactionHistory from "./components/transactionHistory";
import PaymentDeadline from "./components/paymentDeadline";
import ContractInfo from "./components/contractInfor";
import { FundedEvent } from "./lib/type";

const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

const sepolia = {
  chainId: 11155111,
  name: "Ethereum Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: import.meta.env.VITE_ETH_SEPOLIA_RPC_URL,
};
const holesky = {
  chainId: 17000,
  name: "Ethereum Holesky",
  currency: "ETH",
  explorerUrl: "https://holesky.etherscan.io",
  rpcUrl: import.meta.env.VITE_ETH_HOLESKY_RPC_URL,
};

const metadata = {
  name: "ATC",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
});

createWeb3Modal({
  ethersConfig,
  chains: [sepolia, holesky],
  projectId,
  enableAnalytics: true,
});

function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [contractBalance, setcontractBalance] = useState<number | null>(null);
  const [courseName, setcourseName] = useState<string | null>(null);
  const [courseDescription, setcourseDescription] = useState<string | null>(
    null
  );
  const [paymentDeadline, setExtendPaymentDeadline] = useState<number | null>(
    null
  );
  const [payTuition, setpayTuition] = useState<number | null>(null);
  const [tuitionGoal, settuitionGoal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txHash, setHash] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paused, setpaused] = useState<boolean | null>(false);
  const [admin, setIsOwner] = useState<string | null>(null);
  const [isOwner, setIsUserOwner] = useState<boolean>(false);
  const [historyEvent, setHistoryEvent] = useState<FundedEvent[] | null>(null);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [balance, setbalance] = useState<string | null>(null);
  const fetchContractData = async () => {
    if (walletProvider && address) {
      const etherProvider = new BrowserProvider(walletProvider);
      const contract = new Contract(contractAddr, contractABI, etherProvider);
      const contractBalance = await etherProvider.getBalance(contractAddr);
      const courseDescription = await contract.courseDescription();
      const courseName = await contract.courseName();
      const paymentDeadline = await contract.paymentDeadline();
      const tuitionGoal = await contract.tuitionGoal();
      const getPaymentStatus = await contract.getPaymentStatus();
      const paused = await contract.paused();
      const admin = await contract.admin();
      const signer = await etherProvider.getSigner();
      const fundedFiter = contract.filters.PaymentMade;
      const fundevent = await contract.queryFilter(fundedFiter, 100);
      const eventFormart: FundedEvent[] = [];
      const balance = await etherProvider.getBalance(address);
      for (let i = fundevent.length - 1; i >= 0; i--) {
        const cevent = fundevent[i];
        const eventOj: FundedEvent = {
          blockNumber: cevent.blockNumber,
          txHash: cevent.transactionHash,
          funder: (cevent as any).args[0],
          value: formatEther((cevent as any).args[1]),
        };
        eventFormart.push(eventOj);
      }
      setcontractBalance(Number(formatEther(contractBalance)));
      setcourseName(String(courseName));
      setcourseDescription(String(courseDescription));
      setExtendPaymentDeadline(Number(paymentDeadline));
      settuitionGoal(Number(formatEther(tuitionGoal)));
      setPaymentStatus(String(getPaymentStatus));
      setpaused(Boolean(paused));
      setIsOwner(String(admin));
      setHistoryEvent(eventFormart);
      setbalance(formatEther(balance));

      const userAddress = await signer.getAddress();
      setIsUserOwner(userAddress.toLowerCase() === admin.toLowerCase());
    }
  };
  const handleTransfer = async () => {
    setIsLoading(true);
    try {
      if (payTuition == null || payTuition <= 0) {
        alert("No Value");
        return;
      }
      if (walletProvider) {
        const etherProvider = new BrowserProvider(walletProvider);
        const signer = await etherProvider.getSigner();
        const contract = new Contract(contractAddr, contractABI, signer);
        setIsLoading(true); // Bắt đầu loading
        const tx: TransactionResponse = await contract.payTuition({
          value: parseEther(String(payTuition)),
        });
        const getPaymentStatus = await contract.getPaymentStatus();
        setPaymentStatus(getPaymentStatus.toString());
        setHash(tx.hash);
        await tx.wait();
        fetchContractData();
        setSuccessMessage(true);
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
    } finally {
      setIsLoading(false); // Dừng loading
    }
  };
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setpayTuition(Number(e.target.value));
  };
  const contributionPercentage =
    tuitionGoal && contractBalance ? (contractBalance / tuitionGoal) * 100 : 0;
  const calculateTimeLeft = () => {
    if (paymentDeadline !== null) {
      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = paymentDeadline - currentTime;
      return remainingTime > 0 ? remainingTime : 0;
    }
    return null;
  };
  const handleTogglePause = async () => {
    if (walletProvider) {
      const etherProvider = new BrowserProvider(walletProvider);
      const signer = await etherProvider.getSigner();
      const contract = new Contract(contractAddr, contractABI, signer);
      const tx = await contract.togglePause();
      await tx.wait();
      fetchContractData();
    }
  };
  useEffect(() => {
    let timer: NodeJS.Timeout;
    fetchContractData();
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage(false);
      }, 2000);
    }
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [walletProvider, paymentDeadline, isConnected, successMessage]);
  return (
    <>
      <div className="min-h-screen py-6 bg-gray-900">
        <Header
          isConnected={isConnected}
          address={address}
          open={open}
          contractAddr={contractAddr}
          balance={balance}
        />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8 space-y-8">
            <h2 className="text-[40px] font-bold mb-4 text-white uppercase">
              {admin !== null && courseName !== null
                ? courseName
                : "Loading..."}
            </h2>
            <div className="flex">
              <div className="w-[50%] mr-[20px]">
                {/* Contract Info */}
                <ContractInfo
                  courseName={courseName}
                  tuitionGoal={tuitionGoal}
                  contractBalance={contractBalance}
                  contributionPercentage={contributionPercentage}
                  payTuition={payTuition}
                  isLoading={isLoading}
                  txHash={txHash}
                  paymentStatus={paymentStatus}
                  paused={paused}
                  handleTransfer={handleTransfer}
                  onInput={onInput}
                />
              </div>
              <PaymentDeadline
                paymentDeadline={paymentDeadline}
                timeLeft={timeLeft}
                courseDescription={courseDescription}
                paused={paused || false}
                isOwner={isOwner}
                paymentStatus={paymentStatus}
                handleTogglePause={handleTogglePause}
              />
            </div>
            {successMessage && (
              <h3 className="text-green-500 mt-4 text-lg">
                Transaction successful!
              </h3>
            )}
          </div>
          {/* Transaction History */}
          <TransactionHistory
            historyEvent={historyEvent}
            contractAddr={contractAddr}
          />
        </div>
      </div>
    </>
  );
}
export default App;
