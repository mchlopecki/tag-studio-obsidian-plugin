import { execFile } from "child_process";
import TagStudioPlugin from "main";
import TagStudioParseResults from "src/utils/parse-results";
import { promisify } from "util";
const __execFile = promisify(execFile);

export default class TagStudioSearch {
    _plugin: TagStudioPlugin

    constructor(tag_studio_plugin: TagStudioPlugin) {
        this._plugin = tag_studio_plugin;
    }

    async search_query(query: string): Promise<string[]> { 
        try {
            const { stdout } = await __execFile(this._plugin.__toTagStudioExecutable, 
                ["--headless", "-o", this._plugin.settings.tagStudioLibraryLocation, "--search", query ])

            return TagStudioParseResults.parseResults(stdout)
        } catch (error) {
            console.error(error)
            return [];
        }
    }
}