#!/bin/zsh

# Get the absolute path to the script itself
SCRIPT=$(readlink -f "$0")

# Then use that to get the project root
ROOT=$(realpath "$(dirname $(dirname "$SCRIPT"))")

alias gen="moon generate"
alias add-template="${ROOT}/scripts/add-template"

# Function to calculate and return the relative path from A to B
get_relative_path() {
  local absA="$(dirname "$1")"
  local absB=$(realpath -- "$2")

  python -c "import os; print(os.path.relpath('$absB', start='$absA'))"
}

# Function to execute moon generate with the right arguments
function execute_moon_generate() {
  local tpl_type="$1"
  shift

  local tpl_path="$1"
  shift

  # Build the initial part of the command
  local command=("moon" "generate" "${tpl_type}" "templates/${tpl_path}")

  # Check if the arguments include '--'
  if [[ " $* " != *' -- '* ]]; then
    # Append '--' if not already included
    set -- "$@" "--"
  fi

  # Add the remaining arguments to the command
  command+=("$@")

  # Execute the command
  "${command[@]}" --dummy-var-due-to-moon-bug
}

function link-partials() {
  local macros="${ROOT}/templates/__linked/macros.tera"
  local lnk="${ROOT}/templates/$1/_partials/macros.tera"
  local relativePath=$(get_relative_path "${lnk}" "${macros}")

  $(
    cd "${ROOT}/templates"
    mkdir "$1/_partials"
    ln -sf "${relativePath}" "$1/_partials/macros.tera"
  )
}

function template() {
  execute_moon_generate __template $1 --defaults -- \
    --title "$1" \
    --description "Creates a tag-$1 file with tasks for $1" \
    "${@:2}"

  link-partials "tags/$1"
}

function tag-template() {
  execute_moon_generate tags/__template tags/$1 --defaults -- \
    --title "Tag: $1" \
    --description "Creates a tag-$1 file with tasks for $1" \
    "${@:2}"

  link-partials "tags/$1"
}

function app-template() {
  execute_moon_generate __template apps/$1 --defaults -- \
    --title "App: $1" \
    --description "Creates a new $1 app project" \
    "${@:2}"

  link-partials "apps/$1"
}

function tool-template() {
  execute_moon_generate tools/__template tools/$1 --defaults -- \
    --title "Tool: $1" \
    --description "Configure the $1 development tool for your workspace or project" \
    "${@:2}"

  link-partials "tools/$1"
}

function marko-template() {
  execute_moon_generate marko/$1 --defaults -- \
    --title "Marko $1 Template" \
    --description "Create a Marko $1 project" \
    --id "marko-$1" \
    "${@:2}"

  link-partials "marko/$1"
}

function marko-tool() {
  execute_moon_generate tools/__template marko/tool:$1 --defaults -- \
    --title "Marko Tool: $1" \
    --description "Configure the $1 development tool for your Marko project" \
    --id "marko-tool:$1" \
    "${@:2}"

  link-partials "tools/$1"
}

function add-app() {
  gen generate apps/$1 "${@:2}"
}

function add-tool() {
  gen tools/$1 "${@:2}"
}
