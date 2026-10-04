import * as react from 'react';
import { PageMapItem } from 'nextra';
import { z } from 'zod';

declare const LayoutPropsSchema: z.ZodObject<{
    banner: z.ZodOptional<z.ZodCustom<react.ReactNode, react.ReactNode>>;
    children: z.ZodCustom<react.ReactNode, react.ReactNode>;
    copyPageButton: z.ZodDefault<z.ZodBoolean>;
    darkMode: z.ZodDefault<z.ZodBoolean>;
    docsRepositoryBase: z.ZodDefault<z.ZodString>;
    editLink: z.ZodDefault<z.ZodCustom<react.ReactNode, react.ReactNode>>;
    feedback: z.ZodDefault<z.ZodObject<{
        content: z.ZodDefault<z.ZodCustom<react.ReactNode, react.ReactNode>>;
        labels: z.ZodDefault<z.ZodString>;
        link: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    footer: z.ZodOptional<z.ZodCustom<react.ReactNode, react.ReactNode>>;
    i18n: z.ZodDefault<z.ZodArray<z.ZodObject<{
        locale: z.ZodString;
        name: z.ZodString;
    }, z.core.$strict>>>;
    lastUpdated: z.ZodDefault<z.ZodCustom<react.ReactElement<unknown, string | react.JSXElementConstructor<any>>, react.ReactElement<unknown, string | react.JSXElementConstructor<any>>>>;
    navbar: z.ZodOptional<z.ZodCustom<react.ReactNode, react.ReactNode>>;
    navigation: z.ZodDefault<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
        next: z.ZodBoolean;
        prev: z.ZodBoolean;
    }, z.core.$strict>]>>;
    nextThemes: z.ZodDefault<z.ZodObject<{
        attribute: z.ZodDefault<z.ZodUnion<readonly [z.ZodCustom<`data-${string}` | "class", `data-${string}` | "class">, z.ZodArray<z.ZodCustom<`data-${string}` | "class", `data-${string}` | "class">>]>>;
        defaultTheme: z.ZodDefault<z.ZodString>;
        disableTransitionOnChange: z.ZodDefault<z.ZodBoolean>;
        forcedTheme: z.ZodOptional<z.ZodString>;
        storageKey: z.ZodDefault<z.ZodString>;
    }, z.core.$strict>>;
    pageMap: z.ZodArray<z.ZodCustom<PageMapItem, PageMapItem>>;
    search: z.ZodDefault<z.ZodCustom<react.ReactNode, react.ReactNode>>;
    sidebar: z.ZodDefault<z.ZodObject<{
        autoCollapse: z.ZodOptional<z.ZodBoolean>;
        defaultMenuCollapseLevel: z.ZodDefault<z.ZodNumber>;
        defaultOpen: z.ZodDefault<z.ZodBoolean>;
        toggleButton: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strict>>;
    themeSwitch: z.ZodDefault<z.ZodObject<{
        dark: z.ZodDefault<z.ZodString>;
        light: z.ZodDefault<z.ZodString>;
        system: z.ZodDefault<z.ZodString>;
    }, z.core.$strict>>;
    toc: z.ZodDefault<z.ZodObject<{
        backToTop: z.ZodDefault<z.ZodCustom<react.ReactNode, react.ReactNode>>;
        extraContent: z.ZodOptional<z.ZodCustom<react.ReactNode, react.ReactNode>>;
        float: z.ZodDefault<z.ZodBoolean>;
        title: z.ZodDefault<z.ZodCustom<react.ReactNode, react.ReactNode>>;
    }, z.core.$strict>>;
}, z.core.$strict>;

export { LayoutPropsSchema };
