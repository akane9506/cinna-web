import type { PixiReactElementProps } from "@pixi/react";
import type { Graphics } from "pixi.js";
import { NODE_SHADOW_FILTER } from "./shared";

export default function ShadowedPixiGraphics(
  props: PixiReactElementProps<typeof Graphics>,
) {
  const { filters, ...restProps } = props;
  const combinedFilter = filters
    ? Array.isArray(filters)
      ? [...filters]
      : [filters]
    : [];
  combinedFilter.push(NODE_SHADOW_FILTER);
  return <pixiGraphics filters={combinedFilter} {...restProps} />;
}
