import React from "react";
import { convertUnixTimestamp } from "../lib/convertUnixTimestamp";

interface PaymentDeadlineProps {
  paymentDeadline: number | null;
  timeLeft: number | null;
  courseDescription: string | null;
  paused: boolean;
  isOwner: boolean;
  paymentStatus: string | null;
  handleTogglePause: () => void;
}

const PaymentDeadline: React.FC<PaymentDeadlineProps> = ({
  paymentDeadline,
  timeLeft,
  courseDescription,
  paused,
  isOwner,
  paymentStatus,
  handleTogglePause,
}) => {
  return (
    <div className="w-[50%]">
      <h2 className="text-2xl font-bold mb-4 text-gray-300">
        Payment Deadline
      </h2>
      {!paused && paymentDeadline !== null ? (
        <div className="bg-gray-700 p-4 rounded-lg flex space-x-8">
          {/* Left Block: Local Time */}
          <div className="w-4/10">
            <p className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              <strong>Local Time:</strong>{" "}
              {convertUnixTimestamp(paymentDeadline).localTime}
            </p>
          </div>

          {/* Right Block: UTC Time and Time Left */}
          <div className="w-3/10">
            <p className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              <strong>UTC Time:</strong>{" "}
              {convertUnixTimestamp(paymentDeadline).utcTime}
            </p>
          </div>
          {paymentStatus === "0" && (
            <>
              <p className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent w-3/10">
                <strong>
                  Time Left{" "}
                  {timeLeft !== null
                    ? `${Math.floor(timeLeft / 3600)}:${Math.floor(
                        (timeLeft % 3600) / 60
                      )}:${timeLeft % 60}`
                    : "Calculating..."}
                </strong>
              </p>
            </>
          )}
        </div>
      ) : (
        <p className="text-gray-400">Loading payment deadline...</p>
      )}
      <div className="flex items-center mt-[20px]">
        {!paused && (
          <p className="text-gray-300">
            <strong>Course Description:</strong>{" "}
            {courseDescription !== null ? courseDescription : "Loading..."}
          </p>
        )}
        {isOwner && (
          <div className="flex items-center ml-[20px]">
            <button
              className={`rounded-lg py-3 px-8 transition-transform transform hover:scale-105 ${
                paused
                  ? "bg-red-400 hover:bg-red-600"
                  : "bg-green-400 hover:bg-green-600"
              } text-white font-semibold`}
              onClick={handleTogglePause}
            >
              {paused ? "Resume" : "Pause"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDeadline;
