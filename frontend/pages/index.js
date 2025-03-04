import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [diceRoll, setDiceRoll] = useState(null);
  const [message, setMessage] = useState("");
  const [serverSeed, setServerSeed] = useState("");
  const [clientSeed, setClientSeed] = useState("");

  // Generate a random client seed when the component mounts
  useEffect(() => {
    setClientSeed(Math.random().toString(36).substring(7));
  }, []);

  const rollDice = async () => {
    if (betAmount <= 0 || betAmount > balance) {
      alert("Invalid bet amount!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/roll-dice", {
        betAmount,
        clientSeed,
      });

      setDiceRoll(response.data.diceRoll);
      setMessage(response.data.message);
      setBalance(response.data.playerBalance);
      setServerSeed(response.data.serverSeed);
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Provably Fair Dice Game 🎲</h1>
      
      <p className="text-lg">Balance: ${balance}</p>

      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        className="mt-2 p-2 rounded bg-gray-800 text-white"
        placeholder="Enter bet amount"
      />

      <button
        onClick={rollDice}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
      >
        Roll Dice
      </button>

      {diceRoll !== null && (
        <div className="mt-4">
          <p className="text-xl">🎲 You rolled: {diceRoll}</p>
          <p className="text-lg font-bold">{message}</p>
          <p className="text-sm mt-2">Server Seed: {serverSeed}</p>
          <p className="text-sm">Client Seed: {clientSeed}</p>
        </div>
      )}
    </div>
  );
}

