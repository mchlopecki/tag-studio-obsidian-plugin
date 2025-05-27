//Source: https://github.com/Developer-Mike/obsidian-advanced-canvas/blob/1ef03c1284946034b9e9bf9067d2531d73932e8b/src/%40types/CustomWorkspaceEvents.d.ts#L14
// Copyright Developer-Mike (c) GNU License
// See orginal license at https://github.com/Developer-Mike/obsidian-advanced-canvas/blob/9add09fbf2bafd4b7596d7417355da5741edb903/LICENSE

import { Menu } from "obsidian"
import { Canvas, CanvasNode } from "./Canvas"

export interface EventRef {
  fn: (...args: any) => any
}

export interface CanvasEvents {
  // Built-in canvas events
  'canvas:selection-menu': (menu: Menu, canvas: Canvas) => void
  'canvas:node-menu': (menu: Menu, node: CanvasNode) => void
  'canvas:edge-menu': (menu: Menu, canvas: Canvas) => void
  'canvas:node-connection-drop-menu': (menu: Menu, canvas: Canvas) => void
}