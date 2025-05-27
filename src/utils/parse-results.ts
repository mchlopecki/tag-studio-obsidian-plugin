export default class TagStudioParseResults {
    private static readonly RESULTS_HEADER = "RESULTS OF QUICK SEARCH:";
    private static readonly NEWLINE_REGEX = /\r?\n/;

    static parseResults(results: string): string[] {
        let filestxt = results.split(this.RESULTS_HEADER)[1];
        let files = filestxt.split(this.NEWLINE_REGEX)
        return files.filter((value: string) => value.length)
    }
}