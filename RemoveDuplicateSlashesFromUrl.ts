export function RemoveDuplicateSlashesFromUrl(url: string): string {
    return url.replace(/([^:]\/)\/+/g, '$1');
}
