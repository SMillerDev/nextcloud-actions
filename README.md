# Nextcloud setup actions

Setup nextcloud using github actions

## Setup Nextcloud
To set up a nextcloud instance on the runner in `../server`, use the following configuration.
```yaml
      - name: Nextcloud test setup
        uses: SMillerDev/setup-nextcloud@main
        with:
          version: '19'
          database-type: 'sqlite'
```

The default configuration is:
```yaml
      - name: Nextcloud test setup
        uses: SMillerDev/setup-nextcloud@main
        with:
          version: '19'
          cron: true
          admin-user: 'admin'
          admin-password: 'admin'
          database-type: 'pgsql'
          database-user: 'postgres'
          database-password: ''
          database-name: 'oc_autotest'
```

## Setup Nextcloud app

To install the current repo as a nextcloud app, run the checkout action and then this one using the following configuration.
```yaml
      - name: Nextcloud app test setup
        uses: SMillerDev/setup-nextcloud-app@main
        with:
          app: 'appid'
          check: false
```

The default configuration is:
```yaml
      - name: Nextcloud app test setup
        uses: SMillerDev/setup-nextcloud-app@main
        with:
          app: 'appid'
          check: false
```