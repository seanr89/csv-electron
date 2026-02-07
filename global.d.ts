declare module '*.css';

interface Window {
    csv: {
        parseFile: (path: string, delimiter: string) => Promise<{ totalRows: number; headers: string[] }>;
        getPage: (page: number, limit: number) => Promise<any[]>;
        search: (query: string, column: string) => Promise<{ results: any[]; totalCount: number }>;
        getPathForFile: (file: File) => string;
    };
}
