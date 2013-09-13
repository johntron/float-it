npm-install:
    cmd.run:
        - name: npm install
        - user: {{ pillar['user'] }}
        - cwd: {{ pillar['home'] }}/project
        - require:
            - pkg: nodejs

install component.io:
    cmd.run:
        - name: npm install -g component
        - require:
            - pkg: nodejs

install components:
    cmd.run:
        - name: component install --dev
        - user: {{ pillar['user'] }}
        - cwd: {{ pillar['home'] }}/project
        - require:
            - cmd: install component.io
