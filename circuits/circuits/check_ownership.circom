pragma circom 2.1.9;

include "../node_modules/circomlib/circuits/comparators.circom";



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