function extractStringsFromReactNode(node) {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map((n) => extractStringsFromReactNode(n)).join("");
  const children = node?.props?.children;
  if (!children) return "";
  return extractStringsFromReactNode(children);
}
export {
  extractStringsFromReactNode
};
