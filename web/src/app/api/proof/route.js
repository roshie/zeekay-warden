import { NextResponse } from 'next/server';
import { generateProof } from '@/lib/generateProof';

export async function POST(req) {
  const body = await req.json();

  const input0 = body.token_owners;
  const input1 = parseInt(body.wallet_hash);
  const input2 = parseInt(body.num_roles);

  const proof = await generateProof(input0, input1, input2);
  
  return NextResponse.json({ success: true, proof: proof });
  
}



