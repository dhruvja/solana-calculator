// import * as anchor from "@project-serum/anchor";
// import { Program } from "@project-serum/anchor";
// import { Mycalculator } from "../target/types/mycalculator";
const assert = require("assert");

const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe("mycalculator", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Mycalculator;

  const calculator = anchor.web3.Keypair.generate();

  let _calculator;

  it("Creates a calculator", async () => {
    // Add your test here.
    await program.rpc.initialize("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator],
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.greeting == "Welcome to Solana");

    _calculator = calculator;
  });

  it("Adds two numbers", async () => {
    const calculator = _calculator;
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(5)));
    assert.ok(account.greeting === "Welcome to Solana");
  });

  it("Subtracts two numbers", async () => {
    const calculator = _calculator;
    await program.rpc.subtract(new anchor.BN(3), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(1)));
    assert.ok(account.greeting === "Welcome to Solana");
  });

  it("Multiplies two numbers", async () => {
    const calculator = _calculator;
    await program.rpc.multiply(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(6)));
    assert.ok(account.greeting === "Welcome to Solana");
  });

  it("Divides two numbers", async () => {
    const calculator = _calculator;
    await program.rpc.divide(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(0)));
    assert.ok(account.remainder.eq(new anchor.BN(2)));
    assert.ok(account.greeting === "Welcome to Solana");
  });
});
