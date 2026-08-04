---
order: 15
name: Postel's Law
slug: postels-law
quote: Be conservative in what you send, liberal in what you accept.
namesake: Jon Postel
dates: 1943–1998
---

## Origin

Jon Postel wrote it into the TCP specification, RFC 760, in 1980: be conservative in what you do, be liberal in what you accept from others. Postel edited the RFC series for close to thirty years and ran the numbering authority that became IANA, so the sentence carried the weight of the person who assigned the internet's addresses.

## Mechanism

It is a rule for a network that has to work before its specification is finished. A tolerant receiver lets implementations with slightly different readings of the spec talk to each other, so adoption does not have to wait for agreement. Strict sending keeps the tolerance from being needed in the common case, which is what makes the pair work rather than just the second half.
