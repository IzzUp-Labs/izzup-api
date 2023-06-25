export class FileExtensionChecker {
  private readonly allowedExtensions: string[] = [
    "jpeg",
    "jpg",
    "png",
    "svg",
    "webp"
  ];

  check(extensionName: string): boolean {
    return this.allowedExtensions.includes(extensionName);
  }
}