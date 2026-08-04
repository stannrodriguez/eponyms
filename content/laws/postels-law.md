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

## Where it breaks

Tolerance compounds. Once receivers accept malformed input, senders come to depend on it, and the working specification quietly becomes whatever the popular implementations happen to allow — at which point the ambiguity is permanent and the written spec is a fiction. It also creates a security class of its own: where two implementations in a chain disagree about what a malformed message means, the disagreement itself is the attack. The IETF walked the advice back in RFC 9413 in 2023 for these reasons.

## Example

Browsers spent a decade accepting unclosed tags, mismatched nesting and undeclared entities, each in its own way. By the time anyone wanted strictness, the tolerance was load-bearing: most pages on the web were invalid. XHTML 2 was abandoned, and HTML5 instead wrote down an exact algorithm for parsing broken markup — a specification whose largest section exists to standardize a decade of accumulated leniency.
