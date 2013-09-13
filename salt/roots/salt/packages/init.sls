build-essential:
    pkg:
        - installed
        - require_in:
            - cmd: npm-install

curl:
    pkg.installed

git:
    pkg.installed

zsh:
    pkg.installed