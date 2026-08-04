---
order: 14
name: Conway's Law
slug: conways-law
quote: Organizations design systems that copy their own communication structure.
namesake: Melvin Conway
dates: born 1931
---

## Origin

Melvin Conway submitted the paper in 1967; the Harvard Business Review rejected it on the grounds that he had not proved his claim, and Datamation published it in April 1968 as How Do Committees Invent? Fred Brooks quoted it in The Mythical Man-Month and gave it Conway's name.

## Mechanism

Every interface between two parts of a system has to be negotiated by the people who own those parts, so the design follows the communication paths that exist. Where two engineers talk daily, they will build a fine-grained interface and revise it freely. Where two groups talk through a manager once a sprint, they will freeze a coarse boundary and defend it — the expensive channel becomes an architectural seam.

## Where it breaks

It is a description, and the reorganize-to-get-the-architecture move treats it as a lever it may not be. It weakens where the system is small enough for everyone to talk to everyone, and where an architect with real authority overrides the org chart. The arrow also runs backwards: an existing architecture constrains which team structures are workable, so an organization inherits the shape of the system it already has.

## Example

A 2012 study compared pairs of products that did the same job, one from a co-located commercial team and one from a distributed open-source community — Linux against a commercial Unix, Mozilla against a commercial browser. The open-source products were consistently the more modular, with the loosely coupled structure that a community of strangers can build and a co-located team has no reason to enforce.
