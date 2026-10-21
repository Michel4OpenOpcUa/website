---
title: Why every protocol gets an interop suite
description: Every OT Fabric protocol is tested against independent implementations. Nine interop suites package 30 reference stacks as containers behind one contract, test them against each other first, and record what they find in our code and in theirs.
date: 2026-10-12
updated: 2026-10-21
authors: [OT Fabric]
tags: [testing, interop]
cover:
  alt: Nine OT Fabric interop suites and their 30 independent reference stacks. Modbus, OPC UA, BACnet/IP, Siemens S7, IEC 104, IEC 61850 / MMS, DNP3, OCPP and OpenADR, each with the open-source implementations its suite runs and their languages.
  image: ../../assets/blog/interop-suites.png
---

A protocol library that only passes its own tests proves very little. Two implementations written by the same people tend to share the same misreading of the spec, and a client tested against its own server will agree with itself forever. Industrial devices are less forgiving: a meter, a PLC or a charger was built by someone else, years ago, against their own reading of the standard.

So every OT Fabric protocol comes with an interoperability suite: independent, established stacks packaged as containers, with deterministic fixtures and a common contract. Our libraries and tools are tested against them in both directions before a release says it works.

## Nine suites, 30 reference stacks

| Protocol | Suite | Reference implementations |
|---|---|---|
| [Modbus](/protocols/modbus/) | [modbus-interop](/projects/modbus-interop/) | libmodbus (C), PyModbus (Python), digitalpetri/modbus (Java), NModbus (C#), tokio-modbus (Rust) |
| [OPC UA](/protocols/opc-ua/) | [opcua-interop](/projects/opcua-interop/) | open62541 (C), Eclipse Milo (Java) |
| [BACnet/IP](/protocols/bacnet/) | [bacnet-interop](/projects/bacnet-interop/) | BACnet Stack (C), BACpypes3 (Python), BACnet4J (Java), System.IO.BACnet (C#), worldiety/bacnet (Go) |
| [Siemens S7](/protocols/s7/) | [snap7-interop](/projects/snap7-interop/) | Snap7 (C++), python-snap7 (Python) |
| [IEC 60870-5-104](/protocols/iec-104/) | [iec104-interop](/projects/iec104-interop/) | lib60870 (C), OpenMUC j60870 (Java), wendy512/iec104 (Go) |
| [IEC 61850 / MMS](/protocols/iec-61850/) | [mms-interop](/projects/mms-interop/) | libiec61850 (C), IEC61850bean (Java) |
| [DNP3](/protocols/dnp3/) | [dnp3-interop](/projects/dnp3-interop/) | Step Function I/O dnp3 (Rust), opendnp3 (C++), DSC go-dnp3 (Go), dnp3py (Python) |
| [OCPP](/protocols/ocpp/) | [ocpp-interop](/projects/ocpp-interop/) | The Mobility House ocpp (Python), ChargeTimeEU Java-OCA-OCPP (Java), ocpp-go (Go), EVerest libocpp (C++), CitrineOS (TypeScript) |
| [OpenADR](/protocols/openadr/) | [openadr-interop](/projects/openadr-interop/) | OpenLEADR (Rust), ElaadNL openadr3-client (Python), plus a specification-driven conformance suite |

SunSpec is the exception: it is a register model on top of Modbus, so go-sunspec is tested through its own server, offline decoding and a weekly comparison with the SunSpec Alliance's model definitions, and its Modbus layer is covered by modbus-interop.

We pick references that are independent of each other and of us, widely used, and written in different languages, so that one shared misreading is unlikely to hide in all of them. The [ecosystem map](/ecosystem/) marks every stack a suite runs.

## How a suite is built

Each suite is its own repository with the same shape:

- **Adapters, not forks.** A thin adapter wraps each upstream stack, pinned to an exact release or commit with checksums of its dependencies, and built into a multi-arch image that runs as a non-root user.
- **One container contract.** Every image offers the same commands: `server` (serve a fixture), `client <operation>` (one operation, one JSON result), `print-capabilities` and `print-fixture`. A test can swap libmodbus for tokio-modbus, or CitrineOS for The Mobility House, without changing a line.
- **Deterministic fixtures.** A fixture describes a device: its registers, objects or points with their values, its controls and how they answer, its files. Every server adapter serves the same fixture, so every client must read the same answer.
- **A weekly upstream watch.** A scheduled workflow builds and self-tests the latest upstream release and keeps an issue open while a pin is behind.

## Capabilities, not assumptions

Reference stacks do not all support the same things. Not every Modbus stack has FC22 or Read Device Identification, only one IEC 104 stack serves file transfer, and EVerest libocpp is a charging station only. Each image declares what it supports:

```sh
docker run --rm ghcr.io/otfabric/modbus-interop-libmodbus:<tag> print-capabilities
```

The tests ask first and skip, rather than fail, what a reference does not offer, and every skip carries its reason. A capability is declared only when the suite's own tests exercise it. A green run means what it says.

## The references test each other first

Before a suite is used against our code, it tests its references against each other: every client against every server, every case, and each result checked against the fixture. In the OCPP suite that is every station against every CSMS, in every version, with requests from both ends, over TLS and with compression. Its v0.4.1 run has 2444 passing exchanges, 308 skipped as unsupported and no failures.

That run also had 31 known issues. A defect in a reference is not hidden and not counted as a pass: it is recorded with its reproduction, often with the line of upstream code that causes it, and reported as a known issue. When an entry no longer reproduces, the run fails, so the list cannot go stale and a pin can move.

## Then our code, in both directions

A library runs its own scenarios against the images, in both roles: our client against every reference server, and every reference client against our server. Some recent results:

- **go-ocpp**: 1458 scenarios pass against five stacks in both roles, none fail, with security profiles 1 to 3, compression and OCPP 2.1 against three independent implementations.
- **go-bacnet**: 206 scenarios pass and 11 skip for features a stack does not have.
- **go-openadr**: 24 of 24 scenarios of the openadr-interop conformance suite.
- **go-dnp3**: master against every reference outstation and every reference master against its outstation, over TCP, TLS, UDP and serial.

Each protocol's *Testing and interop* page in the [documentation](/docs/protocols/) has the full matrix, and what has not been validated yet.

## What it finds

The suites earn their keep by finding things nobody was looking for, on both sides.

In our own code: the go-modbus server closed the connection on a write whose byte count did not match its quantity, where the specification asks for exception 3. go-bacnet only broadcast to 255.255.255.255 and stopped `ReadRange` after one page. go-ocpp lost frames on close and refused `20000.0` for an integer field. Each was fixed in a release.

In the references: CitrineOS accepts TLS only from stations that send SNI. opendnp3's master synchronizes time only when the outstation asks. OpenLEADR answers a forged token with 403 instead of 401. The ElaadNL client names subscription operations as OpenADR 3.0.1 did. Each suite's `COMPATIBILITY.md` lists them, so anyone building on those stacks can see them too.

## What interop is not

Interoperability with several independent stacks is strong evidence, but it is not conformance testing and it is not certification by the OPC Foundation, BACnet International, the Open Charge Alliance or anyone else. Nor is it a field test: real devices, gateways and certified test equipment behave in ways no open-source stack reproduces. Every protocol page says plainly what has and has not been validated, and interop reports from real installations are very welcome.

## Usable by anyone

The suites are client-neutral. They live in their own repositories, contain no library under test, and do not depend on our code, so any implementation in any language can use them. If you maintain a Modbus, OPC UA, BACnet, S7, IEC 104, IEC 61850, DNP3, OCPP or OpenADR stack, try them, and if your stack belongs in one, open an issue.
