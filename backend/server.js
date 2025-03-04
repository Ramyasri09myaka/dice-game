const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

let playerBalance = 1000; // Starting balance

// Generate SHA-256 Hash (Provably Fair)
const generateHash = (clientSeed, serverSeed) => {
  return crypto.createHash("sha256").update(clientSeed + serverSeed).digest("hex");
};

// Dice roll API
app.post("/roll-dice", (req, res) => {
  const { betAmount, clientSeed } = req.body;

  if (betAmount <= 0 || betAmount > playerBalance) {
    return res.status(400).json({ message: "Invalid bet amount" });
  }

  const serverSeed = crypto.randomBytes(16).toString("hex"); // Server seed
  const hash = generateHash(clientSeed, serverSeed);
  const diceRoll = (parseInt(hash.substring(0, 8), 16) % 6) + 1; // Convert hash to dice roll (1-6)

  let result;
  if (diceRoll >= 4) {
    playerBalance += betAmount; // Player wins
    result = { message: "You win!", payout: betAmount * 2 };
  } else {
    playerBalance -= betAmount; // Player loses
    result = { message: "You lose!", payout: 0 };
  }

  res.json({ diceRoll, ...result, playerBalance, serverSeed, clientSeed, hash });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

