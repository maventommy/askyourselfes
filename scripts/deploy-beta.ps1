# Repeatable beta deploy: export web build, ensure PWA assets + head tags, push to Cloudflare Pages.
# Requires a one-time `npx wrangler login` (or CLOUDFLARE_API_TOKEN set).
Set-Location C:\Users\Tripl\ask-yourselves
npx expo export -p web
# belt-and-suspenders: make sure public assets are at dist root
Copy-Item public\* dist\ -Force
node scripts/inject-pwa.mjs dist/index.html
npx wrangler pages deploy dist --project-name ask-yourselves --branch main --commit-dirty=true
