import { readFileSync } from "node:fs";
import { createFromRoot } from "codama";
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { renderVisitor } from "@codama/renderers-js";

const idl = JSON.parse(
  readFileSync(
    new URL("./program/target/idl/trustfund.json", import.meta.url),
    "utf8",
  ),
);

// The Anchor IDL is loaded at codegen runtime and validated by Codama.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const codama = createFromRoot(rootNodeFromAnchor(idl as any));

codama.accept(renderVisitor("lib/generated"));
