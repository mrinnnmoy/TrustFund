import { createFromRoot } from "codama";
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { renderVisitor } from "@codama/renderers-js";
import idl from "./program/target/idl/trustfund.json";

// JSON imports widen Anchor IDL literal types; Codama validates the IDL during conversion.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const codama = createFromRoot(rootNodeFromAnchor(idl as any));

codama.accept(renderVisitor("lib/generated"));
