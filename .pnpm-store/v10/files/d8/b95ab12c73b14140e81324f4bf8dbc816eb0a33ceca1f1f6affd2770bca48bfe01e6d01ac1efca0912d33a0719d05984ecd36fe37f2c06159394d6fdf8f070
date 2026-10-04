import { jsx, jsxs } from "react/jsx-runtime";
import { c as _c } from "react-compiler-runtime";
import cn from "clsx";
import NextLink from "next/link";
import { Anchor } from "nextra/components";
import { DiscordIcon, GitHubIcon } from "nextra/icons";
import { ClientNavbar } from "./index.client";
const defaultGitHubIcon = /* @__PURE__ */ jsx(GitHubIcon, { height: "24", "aria-label": "Project repository" });
const defaultChatIcon = /* @__PURE__ */ jsx(DiscordIcon, { width: "24" });
const Navbar = (t0) => {
  const $ = _c(34);
  const {
    children,
    logoLink: t1,
    logo,
    projectLink,
    projectIcon: t2,
    chatLink,
    chatIcon: t3,
    className,
    align: t4
  } = t0;
  const logoLink = t1 === void 0 ? true : t1;
  const projectIcon = t2 === void 0 ? defaultGitHubIcon : t2;
  const chatIcon = t3 === void 0 ? defaultChatIcon : t3;
  const align = t4 === void 0 ? "right" : t4;
  const t5 = align === "left" ? "x:max-md:me-auto" : "x:me-auto";
  let t10;
  let t6;
  let t7;
  let t8;
  let t9;
  if ($[0] !== className || $[1] !== logo || $[2] !== logoLink || $[3] !== t5) {
    const logoClass = cn("x:flex x:items-center", t5);
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
      t9 = cn("nextra-navbar x:sticky x:top-0 x:z-30 x:w-full x:bg-transparent x:print:hidden", "x:max-md:[.nextra-banner:not([class$=hidden])~&]:top-(--nextra-banner-height)");
      t10 = /* @__PURE__ */ jsx("div", { className: cn("nextra-navbar-blur", "x:absolute x:-z-1 x:size-full", "nextra-border x:border-b", "x:backdrop-blur-md x:bg-nextra-bg/70") });
      t6 = {
        height: "var(--nextra-navbar-height)"
      };
      $[9] = t10;
      $[10] = t6;
      $[11] = t9;
    } else {
      t10 = $[9];
      t6 = $[10];
      t9 = $[11];
    }
    if ($[12] !== className) {
      t7 = cn("x:mx-auto x:flex x:max-w-(--nextra-content-width) x:items-center x:gap-4 x:pl-[max(env(safe-area-inset-left),1.5rem)] x:pr-[max(env(safe-area-inset-right),1.5rem)]", "x:justify-end", className);
      $[12] = className;
      $[13] = t7;
    } else {
      t7 = $[13];
    }
    t8 = logoLink ? /* @__PURE__ */ jsx(NextLink, { href: typeof logoLink === "string" ? logoLink : "/", className: cn(logoClass, "x:transition-opacity x:focus-visible:nextra-focus x:hover:opacity-75"), "aria-label": "Home page", children: logo }) : /* @__PURE__ */ jsx("div", { className: logoClass, children: logo });
    $[0] = className;
    $[1] = logo;
    $[2] = logoLink;
    $[3] = t5;
    $[4] = t10;
    $[5] = t6;
    $[6] = t7;
    $[7] = t8;
    $[8] = t9;
  } else {
    t10 = $[4];
    t6 = $[5];
    t7 = $[6];
    t8 = $[7];
    t9 = $[8];
  }
  const t11 = align === "left" ? "x:me-auto" : "";
  let t12;
  if ($[14] !== projectIcon || $[15] !== projectLink) {
    t12 = projectLink && /* @__PURE__ */ jsx(Anchor, { href: projectLink, children: projectIcon });
    $[14] = projectIcon;
    $[15] = projectLink;
    $[16] = t12;
  } else {
    t12 = $[16];
  }
  let t13;
  if ($[17] !== chatIcon || $[18] !== chatLink) {
    t13 = chatLink && /* @__PURE__ */ jsx(Anchor, { href: chatLink, children: chatIcon });
    $[17] = chatIcon;
    $[18] = chatLink;
    $[19] = t13;
  } else {
    t13 = $[19];
  }
  let t14;
  if ($[20] !== children || $[21] !== t11 || $[22] !== t12 || $[23] !== t13) {
    t14 = /* @__PURE__ */ jsxs(ClientNavbar, { className: t11, children: [
      t12,
      t13,
      children
    ] });
    $[20] = children;
    $[21] = t11;
    $[22] = t12;
    $[23] = t13;
    $[24] = t14;
  } else {
    t14 = $[24];
  }
  let t15;
  if ($[25] !== t14 || $[26] !== t6 || $[27] !== t7 || $[28] !== t8) {
    t15 = /* @__PURE__ */ jsxs("nav", { style: t6, className: t7, children: [
      t8,
      t14
    ] });
    $[25] = t14;
    $[26] = t6;
    $[27] = t7;
    $[28] = t8;
    $[29] = t15;
  } else {
    t15 = $[29];
  }
  let t16;
  if ($[30] !== t10 || $[31] !== t15 || $[32] !== t9) {
    t16 = /* @__PURE__ */ jsxs("header", { className: t9, children: [
      t10,
      t15
    ] });
    $[30] = t10;
    $[31] = t15;
    $[32] = t9;
    $[33] = t16;
  } else {
    t16 = $[33];
  }
  return t16;
};
export {
  Navbar
};
