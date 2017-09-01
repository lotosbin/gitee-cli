# oschina-cli
git oschina cli

# Install
```shell
git clone git@github.com:lotosbin/oschina-cli.git
cd oschina-cli
npm install && npm link
```

# Usage
`osc -h`

config default owner

```
osc config set --username xxxx
osc config get --username
```

clone repository
```
osc clone xxxxxxx
osc clone xxxxxxx --owner xxxx
osc clone xxowner/xxrespository
```

open repository home page
```
osc home
osc home --remote origin
osc home --choice
```