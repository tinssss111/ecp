// ContractInfo.tsx

import React from "react";
import { ClipLoader } from "react-spinners";
import { shortAddress } from "../lib/utils";

interface ContractInfoProps {
  courseName: string | null;
  tuitionGoal: number | null;
  contractBalance: number | null;
  contributionPercentage: number;
  payTuition: number | null;
  isLoading: boolean;
  txHash: string | null;
  paymentStatus: string | null;
  paused: boolean | null;
  handleTransfer: () => void;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContractInfo: React.FC<ContractInfoProps> = ({
  tuitionGoal,
  contractBalance,
  contributionPercentage,
  payTuition,
  isLoading,
  txHash,
  paymentStatus,
  paused,
  handleTransfer,
  onInput,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-gray-300 text-2xl font-extrabold">
        <span className="text-2xl font-extrabold">Amount Payable: </span>
        {tuitionGoal !== null ? tuitionGoal : "Loading..."}
        <span className="text-2xl font-extrabold"> ETH</span>
      </h2>
      <div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-300">
              Pay: {Math.min(contributionPercentage, 100).toFixed(2)}%
            </span>
            <span className="text-sm font-semibold text-gray-300">
              {contractBalance !== null
                ? `${contractBalance.toFixed(2)} ETH/${tuitionGoal} ETH`
                : "Loading..."}
            </span>
          </div>
          <div className="relative w-full h-4 bg-gray-600 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300`}
              style={{
                width: `${Math.min(contributionPercentage, 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div>
        {!paused && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-300">SEND ETH</h2>
            <button
              className={`font-semibold text-white py-2 px-2 rounded-[20px] ${
                paymentStatus === "0"
                  ? "bg-blue-500"
                  : paymentStatus === "1"
                  ? "bg-green-500"
                  : paymentStatus === "2"
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
            >
              {paymentStatus === "0"
                ? "Pending..."
                : paymentStatus === "1"
                ? "Completed"
                : paymentStatus === "2"
                ? "Failed"
                : "Unknown status"}
            </button>
          </div>
        )}

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
                {isLoading ? "Processing..." : `Send ${payTuition}`}
              </button>
            </>
          )}
          {paused && <span className="text-red-500">Contract Paused</span>}
          {isLoading && (
            <>
              <div className="flex items-center">
                <ClipLoader color={"#123abc"} loading={isLoading} size={25} />
                <span className="ml-[15px] text-white"></span>
              </div>
              {txHash && (
                <div className="text-gray-300">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://holesky.etherscan.io/tx/${txHash}`}
                  >
                    Transaction: {shortAddress(txHash)}
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractInfo;
