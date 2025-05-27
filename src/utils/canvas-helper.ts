// Source: https://github.com/Developer-Mike/obsidian-advanced-canvas/blob/main/src/utils/canvas-helper.ts#L15
// Copyright Developer-Mike (c) GNU License
// See orginal license at https://github.com/Developer-Mike/obsidia-advanced-canvas/blob/9add09fbf2bafd4b7596d7417355da5741edb903/LICENSE

import TagStudioPlugin from "main"
import { Canvas } from "src/@types/Canvas"

export default class CanvasHelper {
  static readonly GRID_SIZE = 20

  static canvasCommand(plugin: TagStudioPlugin, check: (canvas: Canvas) => boolean, run: (canvas: Canvas) => void): (checking: boolean) => boolean {
    return (checking: boolean) => {
      const canvas = plugin.getCurrentCanvas()
      if (checking) return canvas !== null && check(canvas)

      if (canvas) run(canvas)

      return true
    }
  }
}