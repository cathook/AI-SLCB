#! /usr/bin/env bash
#
# Fetches the newest js code from agar.io and beautifier it.

HOSTNAME='agar.io'

BRANCH="$1"


beautify() {
  src="$1"
  dst="$2"
  tmp="${dst}.$$"
  for fn in $src*; do
    cp -f "${fn}" "${tmp}"
    js-beautify --indent-size=2 --end-with-newline "${tmp}" > "${dst}"
    rm "${tmp}"
  done
}


main() {
  version="$(date '+%Y_%m_%d__%H_%M_%S')"
  git checkout api_init_point

  rm -rf "${HOSTNAME}"
  wget -r "${HOSTNAME}"

  beautify "${HOSTNAME}/main_out.js" main.js

  rm -rf "${HOSTNAME}"

  git add main.js
  git commit --allow-empty -m "update to ${version}"

  git checkout "${BRANCH}"
  git rebase api_init_point
}


main "$@"
