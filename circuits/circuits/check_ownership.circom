pragma circom 2.1.9;

include "../node_modules/circomlib/circuits/comparators.circom";

template Add(n) {
  signal input a[n];
  signal output out;

  signal temp[n];
  temp[0] <== a[0];

  for (var i = 1; i < n; i++) {
    temp[i] <== temp[i-1] + a[i];
  }

  out <== temp[n-1];
}

template CountPresence(maxOwnersCount) {
    signal input wallet_hash;
    signal input token_owners[maxOwnersCount];
    signal output count;

    component checks[maxOwnersCount];
    component add = Add(maxOwnersCount);

    for (var i = 0; i < maxOwnersCount; i++) {
        checks[i] = IsZero();
        checks[i].in <== wallet_hash - token_owners[i];
        add.a[i] <== checks[i].out;
    }

    count <== maxOwnersCount - add.out;
}

template CheckOwnership() {
    var maxOwnersCount = 10;

    // Public
    signal input token_owners[maxOwnersCount];   
    // Private
    signal input wallet_hash;        
    signal input num_roles;

    signal output proof_valid;

    component count_presence = CountPresence(maxOwnersCount); 
    count_presence.wallet_hash <== wallet_hash;

    for (var i = 0; i < maxOwnersCount; i++) {
        count_presence.token_owners[i] <== token_owners[i];
    }

    component iszero = IsZero();
    iszero.in <== count_presence.count - num_roles;
    proof_valid <== iszero.out;

    log(iszero.out);
}


component main { public [token_owners] } = CheckOwnership();