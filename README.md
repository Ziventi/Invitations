# Ziventi

The home for invitation projects developed under Ziventi.

## Generate files

```
npm run cli -- [project-name] generate --all --format pdf
```

### Push new custom image

To create a new version of `zzavidd/puppeteer`, use:

```
cd docker
docker build -f Dockerfile.puppeteer -t zzavidd/puppeteer .
docker push zzavidd/puppeteer:latest
```

