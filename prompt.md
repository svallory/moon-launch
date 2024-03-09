# `moonlaunch` script

## Instructions

Let's build a node script in typescript that can be executed with `npx moonlaunch DEST` and that will create a new project at `DEST`.

The script will use the `proto` and `moon` commands. `proto` is a multilanguage version manager that will be used to install `moon` and other tools.

Before executing the main task check if both commands exist. If not, ask the user for permission to install them. If the user says no, exit the script.

To install `proto` we need to run `curl -fsSL https://moonrepo.dev/install/proto.sh | $SHELL`

After installation is done `proto` can be found at `$HOME/.proto/bin/proto`. We can finally use it to install moon by running

- `proto plugin add moon "source:https://raw.githubusercontent.com/moonrepo/moon/master/proto-plugin.toml"`
- `proto install moon`

## Script Arguments

- `DEST`  - The destination folder for the new project
- `--name` - The name of the project (Default: name of the project folder specified in DEST)
- `--packageManager --pm` - The package manager to be used. Options: npm, pnpm, yarn (default: npm)

## Script Flow

1. Reads the destination of the project from first positional argument (DEST) or prompts the user to inform it
2. Creates a folder into that path
3. Asks the user to choose a package manager among npm, pnpm, yarn, bun (PM)
4. Initializes a node package in the DEST folder using PM
5. Installs itself using PM
6. Copies all the files and folders from node_modules/moon-launch into DEST
7. Runs `moon generate create`
