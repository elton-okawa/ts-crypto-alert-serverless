# Crypto Alert

## Takeaways

Authenticating Terraform Cloud on GCP needs a `GOOGLE_SERVICE_ACCOUNT` as environment variable configured there
https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference#using-terraform-cloud

## GitHub Actions config

Required secrets:

- `TF_API_TOKEN` - view `Terraform User Token`
- `WIF_PROVIDER` - view `Workload Identity Federation Provider`
- `WIF_SERVICE_ACCOUNT` - view `WIF Service Account`

### Terraform User Token

[Access Token Page](https://app.terraform.io/app/settings/tokens?product_intent=terraform)

### Workload Identity Federation Provider

[google-auth action tutorial](https://github.com/google-github-actions/auth)

Retrieve pool name:

```
gcloud iam workload-identity-pools providers describe "ts-crypto-alert" \
  --project="crypto-alert-421018" \
  --location="global" \
  --workload-identity-pool="github" \
  --format="value(name)"
```

### WIF Service Account

Go to your WIF Provider: https://console.cloud.google.com/iam-admin/workload-identity-pools/pool/github
On `Connected Service Accounts` click on `Download` to copy the full value, e.g. `<name>@<project>.iam.gserviceaccount.com`

## Gotchas

### Function "<name>" is not defined in the provided module

I was getting the following error:

> Function "<name>" is not defined in the provided module

Even if **it follows [naming rules](https://lust.dev/2022/08/04/upgrading-cloud-functions-gen2/)** and had logs telling me that it was being added to `functions framework`

The real problem was the missing `functions-framework` on `dependencies` (not `devDependencies`) as we see on [this issue](https://github.com/GoogleCloudPlatform/buildpacks/issues/310)

# References

Discord message colors and emoji

- https://rebane2001.com/discord-colored-text-generator/
- https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06
- https://gist.github.com/rxaviers/7360908
- https://gist.github.com/JBlond/2fea43a3049b38287e5e9cefc87b2124
- https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812
