import { FundedEvent } from "../lib/type";
import { shortAddress } from "../lib/utils";

const TransactionHistory = ({
  historyEvent,
  contractAddr,
}: {
  historyEvent: FundedEvent[] | null;
  contractAddr: string;
}) => {
  return (
    <div className="text-white mt-[50px] mb-[30px]">
      <h2 className="text-3xl font-bold mb-4">Transaction History</h2>
      {historyEvent && historyEvent.length > 0 ? (
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="p-3">Transaction Hash</th>
              <th className="p-3">Method</th>
              <th className="p-3">Block</th>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {historyEvent.map((event, index) => (
              <tr key={index} className="border-b border-gray-600">
                <td className="p-3 text-blue-400">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://holesky.etherscan.io/tx/${event.txHash}`}
                    className="hover:underline"
                  >
                    {shortAddress(event.txHash)}
                  </a>
                </td>
                <td className="p-3 text-gray-300">Pay Tuition</td>
                <td className="p-3 text-blue-400">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://holesky.etherscan.io/block/${event.blockNumber}`}
                    className="hover:underline"
                  >
                    {event.blockNumber}
                  </a>
                </td>
                <td className="p-3 text-blue-400">
                  <a
                    target="_blank"
                    href={`https://holesky.etherscan.io/address/${event.funder}`}
                    className="hover:underline"
                  >
                    {shortAddress(event.funder)}
                  </a>
                </td>
                <td className="p-3 text-blue-400">
                  <a
                    target="_blank"
                    href={`https://holesky.etherscan.io/address/${contractAddr}`}
                    className="hover:underline"
                  >
                    {shortAddress(contractAddr)}
                  </a>
                </td>
                <td className="p-3 text-gray-300">{event.value} ETH</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No transaction history available.</p>
      )}
    </div>
  );
};

export default TransactionHistory;
