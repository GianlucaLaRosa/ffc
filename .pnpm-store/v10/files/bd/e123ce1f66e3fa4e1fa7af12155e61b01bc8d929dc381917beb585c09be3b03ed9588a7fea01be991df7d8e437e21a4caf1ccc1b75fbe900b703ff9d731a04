import { FC } from 'react';
import { z } from 'zod';
import { LayoutPropsSchema } from './schemas.mjs';
import { LayoutProps } from './types.generated.mjs';
import 'nextra';

type ThemeConfigProps = z.infer<typeof LayoutPropsSchema>;
declare const Layout: FC<LayoutProps>;

export { Layout, type ThemeConfigProps };
