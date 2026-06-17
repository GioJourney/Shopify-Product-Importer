# Build resources

electron-builder uses this directory (`build/`) by default for packaging
resources. Drop the app icon here using these exact filenames — they are
auto-detected, no `package.json` changes required:

| File             | Platform | Recommended size                         |
| ---------------- | -------- | ---------------------------------------- |
| `icon.ico`       | Windows  | 256×256 (multi-resolution .ico)          |
| `icon.icns`      | macOS    | 512×512 / 1024×1024                       |
| `icon.png`       | Linux    | 512×512 or 1024×1024                      |

## Simplest option

If you only have one image, place a single square **`icon.png`** at
**1024×1024** here. electron-builder will generate the Linux icons from it and
can derive the Windows `.ico` if `icon.ico` is absent. For the crispest Windows
result, still provide a real `icon.ico` (convert at e.g. https://icoconvert.com
or `icotool`).

The packaged executable/installer picks up these icons automatically. The icon
shown in the running window (taskbar) is set separately in `electron/main.js`.
