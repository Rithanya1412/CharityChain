import { execSync } from "child_process";

try {
  execSync("npx hardhat run scripts/deploy.ts --network localhost", {
    stdio: "inherit",
  });
} catch (err) {
  console.error("❌ Hardhat deploy failed:", err.message);
}
