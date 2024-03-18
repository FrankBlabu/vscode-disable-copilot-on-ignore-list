# Disable Github Copilot based on ignore list

This extension disables Github Copilot if one the edited files matches a pattern in an ignore file.

## Description

GitHub Copilot is a powerful tool that helps developers write code faster and more efficiently. However, there are times when you may want to disable Copilot for a specific file, such as when you are working on a file that contains sensitive information or when you are working on a file that is not compatible with Copilot. This is possible in principle via the Github repository settings which is not always convinient depending on your setup. This extension provides another way to disable Github Copilot via adding ignore patterns to the `.copilotignore` file in the local repositories root directory.

> [!WARNING]
> This extension is distributed without warranty. Use at your own risk. The GitHub Copilot is disabled by modifying its configuration settings and in tests it worked as expected. However, there is no guarantee that it will work in all cases or that it will work in the future as intended. The copilot could still send data to the server even if it seems to be disabled.

## Usage

To disable Copilot for a specific file, add the file pattern to the `.copilotignore` file in the root directory of your repository. The file pattern should be a regular expression that matches the file name. For example, to disable Copilot for all files with the `.secret` extension, add the following line to the `.copilotignore` file:

```
.*\.secret
```

The format of the `.copilotignore` file is the same as the `.gitignore` file. You can add multiple file patterns to the `.copilotignore` file, one pattern per line.

## Configuration

There are no configuration options for this extension.

## License

This extension is licensed under the [MIT License](LICENSE).