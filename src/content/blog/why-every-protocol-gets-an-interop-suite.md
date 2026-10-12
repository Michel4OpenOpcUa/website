---
title: Why every protocol gets an interop suite
description: How OT Fabric tests its protocol libraries against independent implementations in Docker.
date: 2026-10-12
authors: [OT Fabric]
tags: [testing, interop]
---

A protocol library that only passes its own tests proves very little. Two implementations written by the same people tend to share the same misreading of the spec. So every OT Fabric protocol comes with an interoperability suite: independent, established stacks packaged as containers, with deterministic fixtures and a common contract.

| Suite | Reference implementations |
|---|---|
| [modbus-interop](https://github.com/otfabric/modbus-interop) | libmodbus (C), PyModbus, digitalpetri/modbus (Java), NModbus (C#), tokio-modbus (Rust) |
| [opcua-interop](https://github.com/otfabric/opcua-interop) | open62541 (C), Eclipse Milo (Java) |
| [bacnet-interop](https://github.com/otfabric/bacnet-interop) | BACnet Stack (C), BACpypes3, BACnet4J, System.IO.BACnet, Worldiety |
| [iec104-interop](https://github.com/otfabric/iec104-interop) | lib60870-C, OpenMUC j60870, wendy512/iec104 |
| [mms-interop](https://github.com/otfabric/mms-interop) | libiec61850, IEC61850bean |
| [snap7-interop](https://github.com/otfabric/snap7-interop) | Snap7 (native and pure Python) |

## Capabilities, not assumptions

Reference stacks do not all support the same things. Not every Modbus stack has FC22 or Read Device Identification, and only one IEC 104 stack serves file transfer. Each image declares what it supports:

```sh
docker run --rm ghcr.io/otfabric/modbus-interop-libmodbus:<tag> print-capabilities
```

The tests ask first and skip, rather than fail, what a reference does not offer. A green run means what it says.

## Usable by anyone

The suites are client-neutral. They live in their own repositories and do not depend on our libraries, so any implementation can use them. If you maintain a Modbus, OPC UA, BACnet or IEC 104 stack, try them.
