import TagStudioPlugin from 'main';
import { CanvasGroupNodeData } from 'src/@types/AdvancedJsonCanvas';
import { Canvas, Position, CanvasNode, BBox } from 'src/@types/Canvas';
import { CanvasEvents } from 'src/@types/CanvasEvents';
import CanvasHelper from 'src/utils/canvas-helper';

export default class TagStudioCanvasActions {
    plugin: TagStudioPlugin

    constructor(plugin: TagStudioPlugin) {
        this.plugin = plugin;

        this.init();
    }

    init() {
        this.plugin.addCommand({
            id: 'test-canvas-populate',
            name: 'Test Canvas-Populate',
            checkCallback: CanvasHelper.canvasCommand(
                this.plugin,
                (canvas: Canvas) => !canvas.readonly,
                (canvas: Canvas) => this.canvas_populate(canvas, ['20250411185539_1.jpg', '20250411213512_1.jpg', '56F27C86824FA8A4.mp4', '20250411234058_1.jpg', '20250413174247_1.jpg'], {x: 0, y: 0}, null, "test canvas_populate")
            )
        })
        this.plugin.addCommand({
            id: 'tag-studio-search-fill-group',
            name: 'Search with Group Name and Populate',
            checkCallback: CanvasHelper.canvasCommand(
                this.plugin,
                (canvas: Canvas) => !canvas.readonly && this.is_canvas_selection_only_group_node(canvas),
                (canvas: Canvas) => this.search_populate_on_group(canvas)
            )
        })
        this.plugin.registerEvent(
            this.plugin.app.workspace.on('canvas:node-menu', (menu, node) => {
                if (node.getData().type === 'group') {
                    menu.addItem((item) => {
                        item
                        .setTitle('TagStudio: Tag Search on Group Name and Populate')
                        .onClick(async () => {
                            this.search_populate_on_group(node.canvas)
                        })
                    })
                }
            })
        )
    }

    private is_canvas_selection_only_group_node(canvas: Canvas): boolean {
        return this.is_canvas_selection_single_node(canvas) && canvas.getSelectionData().nodes[0].type === 'group';
    }

    private is_canvas_selection_single_node(canvas: Canvas): boolean {
        return (canvas.getSelectionData().nodes.length === 1);
    }

    private search_populate_on_group(canvas: Canvas) {
        let group_label = (canvas.getSelectionData().nodes[0] as CanvasGroupNodeData).label;
        group_label = group_label ? group_label : "";
        let group_node = canvas.nodes.get(canvas.getSelectionData().nodes[0].id);
        if (!group_node) return;
        let group_bbox = group_node.getBBox()
        for (let grouped_node of canvas.getContainingNodes(group_bbox)) {
            if (grouped_node !== group_node) canvas.removeNode(grouped_node);
        }
        this.plugin.searchStatus.setText(`Searching TagStudio Library for ${group_label}...`)
        this.plugin.__searchActions.search_query(group_label).then((files) => {
                this.canvas_populate(canvas, files, {x: group_bbox.minX, y: group_bbox.minY}, group_node, null);
                this.plugin.searchStatus.setText("")
            }
        );
    }

    private canvas_populate(canvas: Canvas, files: string[], cursor_position: Position, group: CanvasNode | null, group_label: string | null) {
        let __col_one = true;
        let __cursor_x = cursor_position.x;
        let __cursor_y = cursor_position.y;
        let __last_height = cursor_position.y;
        
        let __group_BBox: BBox | null = null;

        for (let file of files) {
            const tFile = this.plugin.app.vault.getFileByPath(file)
            const node = canvas.createFileNode({
                pos: {
                    x: __cursor_x,
                    y: __cursor_y
                },
                position: 'center',
                file: tFile
            })

            if (!__group_BBox) {
                __group_BBox = node.getBBox()
            } else {
                __group_BBox.maxX = Math.max(__group_BBox.maxX, node.getBBox().maxX)
                __group_BBox.maxY = Math.max(__group_BBox.maxY, node.getBBox().maxY)
            }

            __cursor_x = __col_one ? (cursor_position.x + node.width + CanvasHelper.GRID_SIZE) : cursor_position.x;
            __cursor_y = __col_one ? __cursor_y : __cursor_y + Math.max(__last_height, node.height / 2) + (CanvasHelper.GRID_SIZE * 2) ;

            __col_one = !__col_one;
            __last_height = node.height / 2;
        }

        if (__group_BBox) {
            let group_pos = {
                x: __group_BBox.minX - CanvasHelper.GRID_SIZE, 
                y: __group_BBox.minY - CanvasHelper.GRID_SIZE
            }
            let group_size = {
                width: (__group_BBox.maxX - __group_BBox.minX) + (2 * CanvasHelper.GRID_SIZE),
                height: (__group_BBox.maxY - __group_BBox.minY) + (2 * CanvasHelper.GRID_SIZE)
            }

            if (! group) {
                canvas.createGroupNode({
                    pos: group_pos,
                    size: group_size,
                    label: group_label ? group_label : "",
                    focus: false
                });

            } else {
                let group_data = group.getData();
                group_data.x = group_pos.x
                group_data.y = group_pos.y
                group_data.width = group_size.width
                group_data.height = group_size.height
                group.setData(group_data)
            }
        }
    }
} 