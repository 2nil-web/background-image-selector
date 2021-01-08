#!/bin/bash

# RegExp to find Key words
re_inc_css='<link rel="stylesheet".*href="(.*)"'

re_inc_js='<script type="text/javascript" src="(.*)"></script>'
re_inc_js2='<script src="(.*)"></script>'

do_delnl=0
while read ln; do
  # Remove <cr>
  ln=${ln%$'\r'}
  
  if [[ $ln =~ $re_inc_css ]]; then
    echo "INCLUDING CSS  ${BASH_REMATCH[1]}" >/dev/tty
    echo '<style>'
    minCSS=${BASH_REMATCH[1]/.css/.min.css}
    test -f $minCSS && cat $minCSS || cat ${BASH_REMATCH[1]}
    echo '</style>'
    continue
  fi

  if [[ $ln =~ $re_inc_js ]] || [[ $ln =~ $re_inc_js2 ]]; then
    echo "INCLUDING JS  ${BASH_REMATCH[1]}" >/dev/tty
    echo '<script>'
    minJS=${BASH_REMATCH[1]/.js/.min.js}
    test -f $minJS && cat $minJS || cat ${BASH_REMATCH[1]}
    echo '</script>'
    continue
  fi

  echo $ln
done < $1


