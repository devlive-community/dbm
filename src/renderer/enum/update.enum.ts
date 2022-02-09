export enum UpdateEnum {
    error, // Failed to check the update
    checking, // Checking for updates
    hasversion, // A new version is detected and ready to download
    noversion, // No new version is detected
    downloading, // Downloading
    completed, // Download completed
    failed, // update failed
    cancel // Download cancel
}
