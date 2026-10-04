import { jsx, jsxs } from "react/jsx-runtime";
import { c as _c } from "react-compiler-runtime";
import cn from "clsx";
import { Button, Select } from "nextra/components";
import { useCopy } from "nextra/hooks";
import { ArrowRightIcon, ChatGPTIcon, ClaudeIcon, CopyIcon, LinkArrowIcon } from "nextra/icons";
const Item = (t0) => {
  const $ = _c(15);
  const {
    icon: Icon,
    title,
    description,
    isExternal
  } = t0;
  let t1;
  if ($[0] !== Icon) {
    t1 = /* @__PURE__ */ jsx(Icon, { width: "16" });
    $[0] = Icon;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] !== isExternal) {
    t2 = isExternal && /* @__PURE__ */ jsx(LinkArrowIcon, { height: "1em" });
    $[2] = isExternal;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] !== t2 || $[5] !== title) {
    t3 = /* @__PURE__ */ jsxs("span", { className: "x:font-medium x:flex x:gap-1", children: [
      title,
      t2
    ] });
    $[4] = t2;
    $[5] = title;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  let t4;
  if ($[7] !== description) {
    t4 = /* @__PURE__ */ jsx("span", { className: "x:text-xs", children: description });
    $[7] = description;
    $[8] = t4;
  } else {
    t4 = $[8];
  }
  let t5;
  if ($[9] !== t3 || $[10] !== t4) {
    t5 = /* @__PURE__ */ jsxs("div", { className: "x:flex x:flex-col", children: [
      t3,
      t4
    ] });
    $[9] = t3;
    $[10] = t4;
    $[11] = t5;
  } else {
    t5 = $[11];
  }
  let t6;
  if ($[12] !== t1 || $[13] !== t5) {
    t6 = /* @__PURE__ */ jsxs("div", { className: "x:flex x:gap-3 x:items-center", children: [
      t1,
      t5
    ] });
    $[12] = t1;
    $[13] = t5;
    $[14] = t6;
  } else {
    t6 = $[14];
  }
  return t6;
};
const CopyPage = (t0) => {
  const $ = _c(20);
  const {
    sourceCode
  } = t0;
  const {
    copy,
    isCopied
  } = useCopy();
  let t1;
  if ($[0] !== copy || $[1] !== sourceCode) {
    t1 = function handleCopy2() {
      copy(sourceCode);
    };
    $[0] = copy;
    $[1] = sourceCode;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  const handleCopy = t1;
  let t2;
  if ($[3] !== isCopied) {
    t2 = (t32) => {
      const {
        hover
      } = t32;
      return cn("x:ps-2 x:pe-1 x:flex x:gap-2 x:text-sm x:font-medium x:items-center", isCopied && "x:opacity-70", hover && "x:bg-gray-200 x:text-gray-900 x:dark:bg-primary-100/5 x:dark:text-gray-50");
    };
    $[3] = isCopied;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  let t3;
  if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = /* @__PURE__ */ jsx(CopyIcon, { width: "16" });
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  const t4 = isCopied ? "Copied" : "Copy page";
  let t5;
  if ($[6] !== handleCopy || $[7] !== t2 || $[8] !== t4) {
    t5 = /* @__PURE__ */ jsxs(Button, { className: t2, onClick: handleCopy, children: [
      t3,
      t4
    ] });
    $[6] = handleCopy;
    $[7] = t2;
    $[8] = t4;
    $[9] = t5;
  } else {
    t5 = $[9];
  }
  let t6;
  if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = {
      to: "bottom end",
      gap: 10
    };
    $[10] = t6;
  } else {
    t6 = $[10];
  }
  let t7;
  if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = {
      id: "copy",
      name: /* @__PURE__ */ jsx(Item, { icon: CopyIcon, title: "Copy page", description: "Copy page as Markdown for LLMs" })
    };
    $[11] = t7;
  } else {
    t7 = $[11];
  }
  let t8;
  if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {
      id: "chatgpt",
      name: /* @__PURE__ */ jsx(Item, { icon: ChatGPTIcon, title: "Open in ChatGPT", description: "Ask questions about this page", isExternal: true })
    };
    $[12] = t8;
  } else {
    t8 = $[12];
  }
  let t9;
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = [t7, t8, {
      id: "claude",
      name: /* @__PURE__ */ jsx(Item, { icon: ClaudeIcon, title: "Open in Claude", description: "Ask questions about this page", isExternal: true })
    }];
    $[13] = t9;
  } else {
    t9 = $[13];
  }
  let t10;
  if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = /* @__PURE__ */ jsx(ArrowRightIcon, { width: "12", className: "x:rotate-90" });
    $[14] = t10;
  } else {
    t10 = $[14];
  }
  let t11;
  if ($[15] !== handleCopy) {
    t11 = /* @__PURE__ */ jsx(Select, { anchor: t6, className: "x:rounded-none", options: t9, value: "", selectedOption: t10, onChange: (value) => {
      if (value === "copy") {
        handleCopy();
        return;
      }
      const url = value === "chatgpt" ? "chatgpt.com/?hints=search&prompt" : "claude.ai/new?q";
      const query = `Read from ${location.href} so I can ask questions about it.`;
      window.open(`https://${url}=${encodeURIComponent(query)}`, "_blank");
    } });
    $[15] = handleCopy;
    $[16] = t11;
  } else {
    t11 = $[16];
  }
  let t12;
  if ($[17] !== t11 || $[18] !== t5) {
    t12 = /* @__PURE__ */ jsxs("div", { className: "x:border x:inline-flex x:rounded-md x:items-stretch nextra-border x:float-end x:overflow-hidden", children: [
      t5,
      t11
    ] });
    $[17] = t11;
    $[18] = t5;
    $[19] = t12;
  } else {
    t12 = $[19];
  }
  return t12;
};
export {
  CopyPage
};
