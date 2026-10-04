"use client";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { c as _c } from "react-compiler-runtime";
import cn from "clsx";
import { Anchor } from "nextra/components";
import { useEffect, useRef } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import { useActiveAnchor, useConfig, useThemeConfig, useTOC } from "../stores";
import { getGitIssueUrl, gitUrlParse } from "../utils";
import { BackToTop } from "./back-to-top";
const linkClassName = cn("x:text-xs x:font-medium x:transition", "x:text-gray-600 x:dark:text-gray-400", "x:hover:text-gray-800 x:dark:hover:text-gray-200", "x:contrast-more:text-gray-700 x:contrast-more:dark:text-gray-100");
const TOC = (t0) => {
  const $ = _c(34);
  const {
    filePath,
    pageTitle
  } = t0;
  const activeSlug = useActiveAnchor();
  const tocRef = useRef(null);
  const themeConfig = useThemeConfig();
  const toc = useTOC();
  const hasMetaInfo = themeConfig.feedback.content || themeConfig.editLink || themeConfig.toc.extraContent || themeConfig.toc.backToTop;
  const {
    activeType
  } = useConfig().normalizePagesResult;
  let t1;
  if ($[0] !== activeType || $[1] !== themeConfig.toc.float || $[2] !== toc) {
    t1 = themeConfig.toc.float || activeType === "page" ? toc : [];
    $[0] = activeType;
    $[1] = themeConfig.toc.float;
    $[2] = toc;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  const anchors = t1;
  const hasHeadings = anchors.length > 0;
  let t2;
  if ($[4] !== activeSlug) {
    t2 = (t32) => {
      const {
        id
      } = t32;
      return id === activeSlug;
    };
    $[4] = activeSlug;
    $[5] = t2;
  } else {
    t2 = $[5];
  }
  const activeIndex = toc.findIndex(t2);
  let t3;
  let t4;
  if ($[6] !== activeSlug) {
    t3 = () => {
      if (!activeSlug) {
        return;
      }
      const anchor = tocRef.current?.querySelector(`a[href="#${activeSlug}"]`);
      if (!anchor) {
        return;
      }
      scrollIntoView(anchor, {
        behavior: "smooth",
        block: "center",
        inline: "center",
        scrollMode: "if-needed",
        boundary: tocRef.current
      });
    };
    t4 = [activeSlug];
    $[6] = activeSlug;
    $[7] = t3;
    $[8] = t4;
  } else {
    t3 = $[7];
    t4 = $[8];
  }
  useEffect(t3, t4);
  let t5;
  if ($[9] !== pageTitle || $[10] !== themeConfig.docsRepositoryBase || $[11] !== themeConfig.feedback.labels || $[12] !== themeConfig.feedback.link) {
    t5 = themeConfig.feedback.link ?? getGitIssueUrl({
      labels: themeConfig.feedback.labels,
      repository: themeConfig.docsRepositoryBase,
      title: `Feedback for \u201C${pageTitle}\u201D`
    });
    $[9] = pageTitle;
    $[10] = themeConfig.docsRepositoryBase;
    $[11] = themeConfig.feedback.labels;
    $[12] = themeConfig.feedback.link;
    $[13] = t5;
  } else {
    t5 = $[13];
  }
  const feedbackLink = t5;
  let t6;
  if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = cn("x:grid x:grid-rows-[min-content_1fr_min-content]", "x:sticky x:top-(--nextra-navbar-height) x:text-sm", "x:max-h-[calc(100vh-var(--nextra-navbar-height))]");
    $[14] = t6;
  } else {
    t6 = $[14];
  }
  let t7;
  if ($[15] !== activeSlug || $[16] !== anchors || $[17] !== hasHeadings || $[18] !== themeConfig.toc.title) {
    t7 = hasHeadings && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("p", { className: "x:pt-6 x:px-4 x:font-semibold x:tracking-tight", children: themeConfig.toc.title }),
      /* @__PURE__ */ jsx("ul", { ref: tocRef, className: cn("x:p-4 nextra-scrollbar x:overscroll-y-contain x:overflow-y-auto x:hyphens-auto", "nextra-mask"), children: anchors.map((t82) => {
        const {
          id: id_0,
          value,
          depth
        } = t82;
        return /* @__PURE__ */ jsx("li", { className: "x:my-2 x:scroll-my-6 x:scroll-py-6", children: /* @__PURE__ */ jsx("a", { href: `#${id_0}`, className: cn("x:focus-visible:nextra-focus", {
          2: "x:font-semibold",
          3: "x:ms-3",
          4: "x:ms-6",
          5: "x:ms-9",
          6: "x:ms-12"
        }[depth], "x:block x:transition-colors x:subpixel-antialiased", id_0 === activeSlug ? "x:text-primary-600 x:contrast-more:text-primary-600!" : "x:text-gray-600 x:hover:text-gray-900 x:dark:text-gray-400 x:dark:hover:text-gray-300", "x:contrast-more:text-gray-900 x:contrast-more:underline x:contrast-more:dark:text-gray-50 x:break-words"), children: value }) }, id_0);
      }) })
    ] });
    $[15] = activeSlug;
    $[16] = anchors;
    $[17] = hasHeadings;
    $[18] = themeConfig.toc.title;
    $[19] = t7;
  } else {
    t7 = $[19];
  }
  let t8;
  if ($[20] !== activeIndex || $[21] !== feedbackLink || $[22] !== filePath || $[23] !== hasHeadings || $[24] !== hasMetaInfo || $[25] !== themeConfig.docsRepositoryBase || $[26] !== themeConfig.editLink || $[27] !== themeConfig.feedback.content || $[28] !== themeConfig.toc.backToTop || $[29] !== themeConfig.toc.extraContent) {
    t8 = hasMetaInfo && /* @__PURE__ */ jsxs("div", { className: cn("x:grid x:gap-2 x:py-4 x:mx-4", hasHeadings && "x:border-t nextra-border"), children: [
      themeConfig.feedback.content && /* @__PURE__ */ jsx(Anchor, { className: linkClassName, href: feedbackLink, children: themeConfig.feedback.content }),
      filePath && themeConfig.editLink && /* @__PURE__ */ jsx(Anchor, { className: linkClassName, href: filePath.startsWith("http") ? filePath : `${gitUrlParse(themeConfig.docsRepositoryBase).href}/${filePath}`, children: themeConfig.editLink }),
      themeConfig.toc.extraContent,
      themeConfig.toc.backToTop && /* @__PURE__ */ jsx(BackToTop, { className: linkClassName, hidden: activeIndex < 2, children: themeConfig.toc.backToTop })
    ] });
    $[20] = activeIndex;
    $[21] = feedbackLink;
    $[22] = filePath;
    $[23] = hasHeadings;
    $[24] = hasMetaInfo;
    $[25] = themeConfig.docsRepositoryBase;
    $[26] = themeConfig.editLink;
    $[27] = themeConfig.feedback.content;
    $[28] = themeConfig.toc.backToTop;
    $[29] = themeConfig.toc.extraContent;
    $[30] = t8;
  } else {
    t8 = $[30];
  }
  let t9;
  if ($[31] !== t7 || $[32] !== t8) {
    t9 = /* @__PURE__ */ jsxs("div", { className: t6, children: [
      t7,
      t8
    ] });
    $[31] = t7;
    $[32] = t8;
    $[33] = t9;
  } else {
    t9 = $[33];
  }
  return t9;
};
export {
  TOC
};
