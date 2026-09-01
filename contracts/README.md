# PitStop

LetsCash fee box on Robinhood Chain (4663).

```
solc 0.8.24
optimizer 200
viaIR no
constructor none
```

`msg.sender` is `owner`. After `$PIT` exists, `setToken(token)`.

Then LetsCash fee recipient = this contract.

`stop(uint8 compound)` while the stint is green. `flag()` when the clock dies.
