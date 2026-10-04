import { jsx, jsxs } from "react/jsx-runtime";
import { c as _c } from "react-compiler-runtime";
import cn from "clsx";
import { H1 } from "../../mdx-components/heading";
import { NotFoundLink } from "./index.client";
const defaultChildren = /* @__PURE__ */ jsx(H1, { children: "404: Page Not Found" });
const NotFoundPage = (t0) => {
  const $ = _c(9);
  const {
    content: t1,
    labels: t2,
    children: t3,
    className
  } = t0;
  const content = t1 === void 0 ? "Submit an issue about broken link" : t1;
  const labels = t2 === void 0 ? "bug" : t2;
  const children = t3 === void 0 ? defaultChildren : t3;
  let t4;
  if ($[0] !== className) {
    t4 = cn("x:flex x:flex-col x:justify-center x:items-center x:h-[calc(100dvh-var(--nextra-navbar-height))]", className);
    $[0] = className;
    $[1] = t4;
  } else {
    t4 = $[1];
  }
  let t5;
  if ($[2] !== content || $[3] !== labels) {
    t5 = /* @__PURE__ */ jsx(NotFoundLink, { labels, children: content });
    $[2] = content;
    $[3] = labels;
    $[4] = t5;
  } else {
    t5 = $[4];
  }
  let t6;
  if ($[5] !== children || $[6] !== t4 || $[7] !== t5) {
    t6 = /* @__PURE__ */ jsxs("div", { className: t4, children: [
      children,
      t5
    ] });
    $[5] = children;
    $[6] = t4;
    $[7] = t5;
    $[8] = t6;
  } else {
    t6 = $[8];
  }
  return t6;
};
export {
  NotFoundPage
};
