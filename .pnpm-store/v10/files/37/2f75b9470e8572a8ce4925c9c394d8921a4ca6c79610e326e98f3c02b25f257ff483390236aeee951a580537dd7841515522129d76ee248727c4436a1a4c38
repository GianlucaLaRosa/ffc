import { PageMapItem } from 'nextra';
import { normalizePages } from 'nextra/normalize-pages';
import { FC, ReactNode } from 'react';

type NormalizePagesResult = ReturnType<typeof normalizePages>;
/**
 * Provides normalized data for the current page from `ConfigContext`.
 *
 * This includes the full result of `normalizePages`, along with a derived value `hideSidebar`
 * that determines whether the sidebar should be hidden on the current page.
 *
 * @returns An object containing the `normalizePagesResult` and a `hideSidebar` value.
 * @throws If used outside of a `ConfigContext.Provider`.
 */
declare function useConfig(): {
    normalizePagesResult: NormalizePagesResult;
    /**
     * Whether the sidebar is shown. If `false`, the theme and locale switchers are displayed in the
     * `<Footer>`.
     */
    hideSidebar: boolean;
};
declare const ConfigProvider: FC<{
    children: ReactNode;
    pageMap: PageMapItem[];
    navbar: ReactNode;
    footer: ReactNode;
}>;

export { ConfigProvider, useConfig };
