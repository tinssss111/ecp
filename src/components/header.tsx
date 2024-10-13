// Header.tsx
import { shortAddress } from "../lib/utils";
import { ExternalLink } from "lucide-react";
interface HeaderProps {
  isConnected: boolean;
  address?: string;
  open: () => void;
  contractAddr: string;
  balance: string | null;
}

const Header: React.FC<HeaderProps> = ({
  isConnected,
  address,
  open,
  contractAddr,
  balance,
}) => {
  const formattedBalance = balance
    ? parseFloat(balance).toString().split(".").length > 1
      ? parseFloat(balance).toString().split(".")[0] +
        "." +
        parseFloat(balance).toString().split(".")[1].padEnd(4, "0").slice(0, 4)
      : parseFloat(balance).toString() + ".0000"
    : "";

  return (
    <header className="container mx-auto px-4 py-6 bg-gray-800 rounded-[15px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-extrabold text-white">
            <a href="/" className="hover:text-gray-400 transition duration-300">
              EduPayChain
            </a>
          </h1>
          <a
            href={`https://holesky.etherscan.io/address/${contractAddr}`}
            className="flex items-center ml-4 bg-gray-400 hover:bg-gray-600 transition-colors duration-300 px-3 py-2 rounded-lg"
            target="_blank"
          >
            {shortAddress(contractAddr)}
            <ExternalLink className="w-5 h-5 ml-2 text-gray-100" />
          </a>
        </div>
        <button className="flex items-center" onClick={() => open()}>
          {!isConnected ? (
            <>
              {" "}
              <div className="flex items-center bg-gray-900 font-bold text-white py-4 px-6 rounded-[10px] shadow-lg">
                <span className="bg-gradient-to-r text-[20px] from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  ConnectWallet
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center bg-gray-900 text-white py-1 px-6 rounded-[10px] shadow-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full pl-[30px] mr-2"></div>
                <div className="">
                  <div className="text-white font-bold">
                    {shortAddress(address)}
                  </div>
                  <div className="ml-2 text-gray-300">
                    {formattedBalance} ETH
                  </div>
                </div>
              </div>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
