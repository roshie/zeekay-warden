import { NextResponse } from "next/server";
import { generateProof } from '@/lib/generateProof';

export async function POST(request) {
  try {
    // Parse the incoming request body as JSON
    const body = await request.json();

    // Check if the body exists and contains valid inputs
    const input0 = parseInt(body.input0);
    const input1 = parseInt(body.input1);

    if (Number.isNaN(input0) || Number.isNaN(input1)) {
      return NextResponse.json({ error: "Invalid inputs" }, { status: 403 });
    }

    // Generate proof using the inputs
    const proof = await generateProof(input0, input1);

    // Check if proof was generated successfully
    if (!proof || proof.proof === "") {
      return NextResponse.json({ error: "Proving failed" }, { status: 403 });
    }

    // Return the generated proof
    return NextResponse.json(proof, { status: 200 });
  } catch (error) {
    // Handle any other errors
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
