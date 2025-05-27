// Source: https://github.com/Developer-Mike/obsidian-advanced-canvas/blob/9add09fbf2bafd4b7596d7417355da5741edb903/src/%40types/AdvancedJsonCanvas.d.ts
// Copyright Developer-Mike (c) GNU License
// See orginal license at https://github.com/Developer-Mike/obsidia-advanced-canvas/blob/9add09fbf2bafd4b7596d7417355da5741edb903/LICENSE
export * from "assets/formats/advanced-json-canvas/spec/1.0-1.0"

import { CanvasData as OriginalCanvasData, AnyCanvasNodeData as OriginalAnyCanvasNodeData, CanvasNodeData, CanvasGroupNodeData as OriginalCanvasGroupNodeData, CanvasFileNodeData as OriginalCanvasFileNodeData, CanvasEdgeData } from "assets/formats/advanced-json-canvas/spec/1.0-1.0"
import { CanvasElementsData } from "./Canvas"

export type AnyCanvasNodeData = CanvasNodeData | CanvasGroupNodeData | CanvasFileNodeData | OriginalAnyCanvasNodeData
export interface CanvasData extends OriginalCanvasData {
  nodes: AnyCanvasNodeData[]
  edges: CanvasEdgeData[]
}

export interface CanvasGroupNodeData extends OriginalCanvasGroupNodeData {
  // Intermediate values that are not saved in the canvas
  collapsedData?: CanvasElementsData
}

export interface CanvasFileNodeData extends OriginalCanvasFileNodeData {
  // Intermediate values that are not saved in the canvas
  isPortalLoaded?: boolean
}